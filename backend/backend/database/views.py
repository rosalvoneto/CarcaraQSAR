from io import StringIO
import pandas as pd
import csv

import warnings

from django.core.exceptions import ObjectDoesNotExist

from django.core.files.base import ContentFile

from padelpy import from_smiles

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect

from .utils import get_line_descriptors, getBoxPlotImage, getHistogramImage

from project_management.models import Project
from database.models import Database, Normalization
from database.serializers import DatabaseSerializer

import numpy as np

# Função para verificar se um valor é numérico e não é NaN
def is_numeric(val):
  try:
    # Verificar se o valor é NaN
    if pd.isnull(val):
      return False
    # Tentar converter o valor para float
    float(val)
    return True
  except (ValueError, TypeError):
    return False
  
# Verifica se o CSV está no formato desejado
def is_valid_csv(reader, file_io):
  try:
    # Verifica se todas as linhas possuem exatamente 2 colunas
    for row in reader:
      if len(row) != 2:
        return False

      # Verifica se a segunda coluna é numérica
      try:
        float(row[1])
      except ValueError:
        return False

    # Volta ao início do arquivo e conta o número de linhas
    file_io.seek(0)
    num_rows = sum(1 for row in reader)

    # Verifica se há pelo menos uma linha
    return num_rows >= 1

  except Exception as e:
    print(f"Erro ao processar o arquivo: {e}")
    return False

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def convertAndSendDatabase_view(request):
  print("Convertendo o arquivo SMILES")

  if 'file' in request.FILES:
    uploaded_file = request.FILES.get('file')
    project_id = request.POST.get('project_id')

    project = get_object_or_404(Project, id=project_id)

    # Lê o conteúdo do arquivo
    file_content = uploaded_file.read().decode('utf-8')

    # Usa StringIO para tratar o conteúdo como um arquivo
    file_io = StringIO(file_content)
    reader = csv.reader(file_io)
    valid_csv = is_valid_csv(reader, file_io)
    if(not valid_csv):
      print('ARQUIVO NÃO VÁLIDO')
      response = Response({
        'message': 'Invalid SMILES file format!'
      }, status=401)
      return response
    print('ARQUIVO VÁLIDO')

    list_file_content = file_content.split('\n')
    try:
      list_file_content.remove('')
    except:
      pass

    # Variáveis auxiliares
    keys = set()
    list_descriptors = []

    # Salva uma lista das características em comum de todas as moléculas
    def analisingFeatures():
      nonlocal keys
      nonlocal list_descriptors
      nonlocal list_file_content
      nonlocal project

      keys = set()
      list_descriptors = []
      length = len(list_file_content)

      for i in range(length):
        print("Analisando características:", list_file_content[i])
        
        project_database = project.get_database()
        if(project_database == None):
          project_database = Database.objects.create(
            name="Empty Database",
            description="Automatically generated database",
            file=None,
            normalization=None,
            project=project,
          )

        if(project_database):
          print(f"Progresso: {i + 1}/{length}")
          project_database.set_conversion_progress(i + 1, length)
          
        descriptors = from_smiles(list_file_content[i].split(',')[0])

        # Envia a mensagem de progresso para o cliente
        # yield f"data: {i}/{length} moléculas analisadas\n\n"

        list_descriptors.append(descriptors)

        if(i == 0):
          keys = set(descriptors.keys())
        else:
          new_keys = set(descriptors.keys())
          keys = keys.intersection(new_keys)
      
      keys = list(keys)
      keys.append('alvo')

    # Cria o arquivo com as características, o salva e o retorna
    def createFileAndSave():
      nonlocal keys
      nonlocal list_descriptors
      nonlocal file_content
      nonlocal list_file_content
      nonlocal project
      nonlocal project_id
      nonlocal uploaded_file

      file_name = uploaded_file.name
      # Cria arquivo CSV
      with open(file_name, 'w', newline='') as csv_file:
        csv_writer = csv.writer(csv_file)
        
        # Escreve o cabeçalho
        csv_writer.writerow(keys)
        
        # Escreve os dados do CSV
        for i, line_smiles in enumerate(list_file_content):

          line_smiles_split = line_smiles.split(',')
          list_descriptors[i]['alvo'] = line_smiles_split[1]
          line_descriptors = get_line_descriptors(keys, list_descriptors[i])

          line_descriptors_split =line_descriptors.split(',')

          csv_writer.writerow(line_descriptors_split)
      
      # Cria um DataFrame do Pandas com o conteúdo do arquivo
      data_dataframe = pd.read_csv(file_name)

      status_code = 200
      only_valid_cells_on_dataframe = True
      status_message = 'Arquivo convertido com sucesso!'
      with warnings.catch_warnings():
        warnings.simplefilter(action='ignore', category=FutureWarning)
        # Aplicar a função ao DataFrame e identificar as células não numéricas
        non_numeric_mask = data_dataframe.applymap(lambda x: not is_numeric(x))
        non_numeric_cells = np.where(non_numeric_mask)

      for row, column in zip(non_numeric_cells[0], non_numeric_cells[1]):
        print(f"({row}, {column}) with value '{data_dataframe.iat[row, column]}'")
        only_valid_cells_on_dataframe = False
        status_code = 400
        status_message = f'Some cells have non-numeric values! Resubmit corrected. Cell with non-numeric: column {data_dataframe.columns[column]} and row {row}.'
        break

      # Database atual
      project_database = project.get_database()

      if(only_valid_cells_on_dataframe):
        # Ler o arquivo.csv e o atribui a uma variável (para salvar no Database)
        with open(file_name, 'rb') as arquivo:
          file_content = arquivo.read()

        lines, columns = data_dataframe.shape

        project_database.name = file_name
        project_database.description = "Original database"
        project_database.file.save(file_name, ContentFile(file_content))
        project_database.file_separator = ','
        project_database.lines = lines
        project_database.columns = columns
        project_database.project = project

      else:
        project_database.file_message = status_message

      # Salvar modificações no backend
      project_database.save()
      project.save()


      # Abra o arquivo e retorne como uma resposta de arquivo
      with open(f"{file_name}", 'rb') as file:
        # Criar a resposta HTTP com o conteúdo do arquivo
        response = HttpResponse(
          file.read(), 
          content_type='application/force-download', 
          status=status_code
        )
        # Definir cabeçalhos para o download do arquivo
        response['Content-Disposition'] = f'attachment; filename="{file_name}"'
        
        # Adicionar mensagens personalizadas nos cabeçalhos
        response['X-Message'] = status_message
        response['X-Status-Code'] = str(status_code)

        return response

    analisingFeatures()
    response = createFileAndSave()
    return response

  return Response({ 
    "message": "Nenhum arquivo encontrado!" 
  })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getFileMessageDatabase_view(request):
  project_id = request.GET.get('project_id')

  project = get_object_or_404(Project, id=project_id)
  database = project.get_database()

  if(database):
    return Response({
      'message': database.file_message,
    }, status=200)
  return Response({
    'message': 'Não há Database!',
  }, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sendDatabase_view(request):

  if 'file' in request.FILES:

    uploaded_file = request.FILES.get('file')
    project_id = request.POST.get('project_id')
    separator = request.POST.get('separator')

    project = get_object_or_404(Project, id=project_id)

    # Cria um DataFrame do Pandas com o conteúdo do arquivo
    file_content = uploaded_file.read().decode('utf-8')
    data_dataframe = pd.read_csv(
      StringIO(file_content), 
      sep=separator
    )
    lines, columns = data_dataframe.shape

    with warnings.catch_warnings():
      warnings.simplefilter(action='ignore', category=FutureWarning)
      # Aplicar a função ao DataFrame e identificar as células não numéricas
      non_numeric_mask = data_dataframe.applymap(lambda x: not is_numeric(x))
      non_numeric_cells = np.where(non_numeric_mask)

    for row, column in zip(non_numeric_cells[0], non_numeric_cells[1]):
      print(f"({row}, {column}) with value '{data_dataframe.iat[row, column]}'")

      return Response({
        'message': 'O database possui valores não numéricos!',
        'error': f'Some cells have non-numeric values! Resubmit corrected. Cell with non-numeric: column {data_dataframe.columns[column]} and row {row}.'
      }, status=500) 
    

    # Salvar database com as informações
    project_database = project.get_database()
    if(project_database == None):
      project_database = Database.objects.create(
        name=uploaded_file.name,
        description="Original database",
        file=uploaded_file,
        file_separator=separator,
        lines=lines,
        columns=columns,
        normalization=None,
        project=project,
      )
    else:
      project_database.name = uploaded_file.name
      project_database.description = "Original database"
      project_database.file = uploaded_file
      project_database.file_separator = separator
      project_database.lines = lines
      project_database.columns = columns
      project_database.project = project
    
    # Salvar no backend
    project_database.save()
    project.save()

    return JsonResponse({ "message": f"{uploaded_file.name} enviado!"})
  return JsonResponse({ "message": "Arquivo não enviado!" })

def substituir_valores(lista_dicionarios, valor_antigo, valor_novo):
    for dicionario in lista_dicionarios:
        for chave, valor in dicionario.items():
            if valor == valor_antigo:
                dicionario[chave] = valor_novo
    return lista_dicionarios

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getDatabase_view(request):
  project_id = request.GET.get('project_id')
  transposed = request.GET.get('transposed')
  if transposed == "true":
    transposed = True
  else:
    transposed = False

  project = get_object_or_404(Project, id=project_id)
  database = project.get_database()

  if(database):
    if(database.file):

      # Cria um DataFrame do Pandas com o conteúdo do arquivo
      file_content = database.file.read().decode('utf-8')
      data_dataframe = pd.read_csv(
        StringIO(file_content), 
        sep=database.file_separator
      )

      # Pega somente as primeiras linhas do database
      data_dataframe = data_dataframe.head()
      print("Dataframe")
      print(data_dataframe)

      # Faz a transposição se necessário
      columns = data_dataframe.columns
      if transposed:
        data_dataframe = data_dataframe.T
        data_dataframe.insert(0, 'columns', columns)

        # Gerar nomes de coluna com a lógica 'a1', 'a2', 'a3', ...
        columns_names = [
          'a' + str(i) for i in range(1, len(data_dataframe.columns) + 1)
        ]
        data_dataframe.columns = columns_names

      # # Substituir NaN por None
      # data_dataframe = data_dataframe.fillna(value='None')

      # Transforma o DataFrame para uma lista de dicionários
      data_dictionary = data_dataframe.to_dict(orient='records')
      
      # # Substituir 'None' por None
      # data_dictionary = substituir_valores(data_dictionary, 'None', None)

      return Response({
        'database': data_dictionary,
        'fileSeparator': database.file_separator,
        'name': database.name,
        'lines': database.lines,
        'columns': database.columns,
      }, status=200)
  
  return Response({
    'message': 'Nenhum arquivo no projeto!',
    'database': None,
  }, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getVariables_view(request):
  project_id = request.GET.get('project_id')

  project = get_object_or_404(Project, id=project_id)
  database = project.get_database()

  if(database):
    if(database.file):

      # Cria um DataFrame do Pandas com o conteúdo do arquivo
      file_content = database.file.read().decode('utf-8')
      data_dataframe = pd.read_csv(
        StringIO(file_content), 
        sep=database.file_separator
      )

      variables = data_dataframe.columns.tolist()
      variables.pop()

      return JsonResponse({
        'variables': variables
      })
  
  return JsonResponse({
    'message': 'Database não encontrado!',
  })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getHistogram_view(request):

  project_id = request.GET.get('project_id')
  variable = request.GET.get('variable')
  divisions_bins = request.GET.get('divisions')
  num_bins = int(divisions_bins)

  project = get_object_or_404(Project, id=project_id)
  database = project.get_database()

  if(database):
    if(database.file):

      # Cria um DataFrame do Pandas com o conteúdo do arquivo
      file_content = database.file.read().decode('utf-8')
      data_dataframe = pd.read_csv(
        StringIO(file_content), 
        sep=database.file_separator
      )

      # Faz o filtro de acordo com a variável
      variable_data = data_dataframe[variable].values
      variable_array = np.array(variable_data)

      # Crie uma máscara booleana indicando quais elementos do array são NaN
      mask_nan = np.isnan(variable_array)

      # Conte a quantidade de valores NaN usando np.sum() na máscara
      number_of_Nan_values = np.sum(mask_nan)

      # Remova os valores NaN do array
      variable_array = variable_array[~np.isnan(variable_array)]

      histogram_image = getHistogramImage(variable_array, num_bins)

      return Response({ 
        'imageInBase64': histogram_image,
        'numberOfNaNValues': number_of_Nan_values
      }, status=200)
  return Response({ 
    'message': 'Database não encontrado!',
  })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getBoxPlot_view(request):
  
  project_id = request.GET.get('project_id')
  variable = request.GET.get('variable')

  project = get_object_or_404(Project, id=project_id)
  database = project.get_database()

  if(database):
    if(database.file):

      # Cria um DataFrame do Pandas com o conteúdo do arquivo
      file_content = database.file.read().decode('utf-8')
      data_dataframe = pd.read_csv(
        StringIO(file_content), 
        sep=database.file_separator
      )

      # Faz o filtro de acordo com a variável
      variable_data = data_dataframe[variable].values
      variable_array = np.array(variable_data)

      # Crie uma máscara booleana indicando quais elementos do array são NaN
      mask_nan = np.isnan(variable_array)

      # Conte a quantidade de valores NaN usando np.sum() na máscara
      number_of_Nan_values = np.sum(mask_nan)

      # Remova os valores NaN do array
      variable_array = variable_array[~np.isnan(variable_array)]

      boxPlot_image = getBoxPlotImage(variable_array)

      return Response({ 
        'imageInBase64': boxPlot_image,
        'numberOfNaNValues': number_of_Nan_values,
      }, status=200)

  return Response({ 
    'message': 'Database não encontrado!',
  }, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def setNormalizationSettings_view(request):

  project_id = request.POST.get('project_id')
  normalization = request.POST.get('normalization')

  project = get_object_or_404(Project, id=project_id)
  database = project.get_database()

  if(database):
    if(database.normalization):
      database.normalization.update(normalization, False)
    else:
      normalization_instance = Normalization.objects.create(name=normalization)
      database.normalization = normalization_instance
      database.save()

    return Response({
      'message': f'Normalização {normalization} salva!'
    }, status=200)
  return Response({
    'message': 'Não existe Database associado ao projeto!'
  }, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getNormalizationSettings_view(request):

  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)
  database = project.get_database()

  if(database):
    if(database.normalization):

      data = {
        'normalization': database.normalization.name,
        'applied': database.normalization.applied
      }
      return Response(data, status=200)

    else:
      
      normalization = Normalization.objects.create(name="Do not apply")
      database.normalization = normalization
      database.save()

      data = {
        'normalization': database.normalization.name,
        'applied': database.normalization.applied
      }
      return Response(data, status=200)

  return Response({
    'message': 'Não existe Database associado ao projeto!'
  }, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getConversionProgress_view(request):
  try:
    project_id = request.GET.get('project_id')
    project = get_object_or_404(Project, id=project_id)

    database = project.get_database()

    if(database):    
      return Response({
        'progress': database.conversion_progress,
      }, status=200)
    else:
      return Response({
        'message': "Database não encontrado!",
      }, status=500)
  except ObjectDoesNotExist:
    return HttpResponse("Project or training not found", status=404)
  
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getDatabases_view(request):

  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  databases = project.get_databases()

  data = []
  for db in databases:
    serializer = DatabaseSerializer(db)
    data.append(serializer.data)

  return Response({ 
    'databases': data
  }, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def downloadDatabase_view(request):

  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)
  
  index = request.GET.get('database_index')
  index = int(index)

  databases = project.get_databases()

  # Abra o arquivo e retorne como uma resposta de arquivo
  with open(f"media/{databases[index].file}", 'rb') as file:
    response = HttpResponse(file.read(), content_type='application/force-download')
    response['Content-Disposition'] = f'attachment; filename="{databases[index].name}"'
    return response
  
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def deleteDatabase_view(request):

  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)
  
  index = request.GET.get('database_index')
  index = int(index)

  databases = project.get_databases()
  databases[index].delete()

  return Response({
    'message': 'Database específico apagado com sucesso!'
  }, status=200)