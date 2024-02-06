from io import StringIO
import pandas as pd
import json
import csv

from django.http import FileResponse
import os
from collections import OrderedDict

from django.utils.encoding import smart_str
from django.core.files.base import ContentFile

from padelpy import from_smiles

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404

from .utils import get_line_descriptors, getBoxPlotImage, getHistogramImage

from project_management.models import Project
from database.models import Database, Normalization

import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg
import numpy as np

# Create your views here.

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def convertAndSendDatabase_view(request):
  print("Convertendo o arquivo SMILES")

  if 'file' in request.FILES:
    uploaded_file = request.FILES.get('file')
    project_id = request.POST.get('project_id')

    project = get_object_or_404(Project, id=project_id)

    # Cria uma lista das linhas do arquivo
    file_content = uploaded_file.read().decode('utf-8')
    list_file_content = file_content.split('\n')
    list_file_content.remove('')

    # Retorna uma lista das características em comum de todas as moléculas
    keys = set()
    for i in range(len(list_file_content)):
      print("Analisando características:", list_file_content[i])
      descriptors = from_smiles(list_file_content[i].split(',')[0])

      if(i == 0):
        keys = set(descriptors.keys())
      else:
        new_keys = set(descriptors.keys())
        keys = keys & new_keys

    keys = list(keys)
    keys.append('alvo')
    print("Quantidade de chaves em comum:", len(keys))

    file_name = 'output.csv'

    # Cria arquivo CSV
    with open(file_name, 'w', newline='') as csv_file:
      csv_writer = csv.writer(csv_file)
      
      # Escreve o cabeçalho
      csv_writer.writerow(keys)
      
      # Escreve os dados do CSV
      for line_smiles in list_file_content:
        print("Analisando valores:", line_smiles)

        line_smiles_split = line_smiles.split(',')

        descriptors = from_smiles(line_smiles_split[0])
        descriptors['alvo'] = line_smiles_split[1]

        line_descriptors = get_line_descriptors(keys, descriptors)

        line_descriptors_split =line_descriptors.split(',')
        print("Quantidade de descritores:", len(line_descriptors_split))

        csv_writer.writerow(line_descriptors_split)
    
      # Cria um DataFrame do Pandas com o conteúdo do arquivo
      data_dataframe = pd.read_csv(file_name)
      rows, columns = data_dataframe.shape
      # Ler o arquivo.csv e o atribui a uma variável (para salvar no Database)
      with open(file_name, 'rb') as arquivo:
        file_content = arquivo.read()
      # Salvar database com as informações
      database = Database().create(
        name=file_name,
        file=None,
        file_separator=',',
        lines=rows,
        columns=columns
      )
      database.file.save(file_name, ContentFile(file_content))
      project.database = database
      # Salvar modificações no backend
      project.save()

      # Abra o arquivo e retorne como uma resposta de arquivo
      with open(file_name, 'rb') as file:
        response = HttpResponse(file.read(), content_type='application/force-download')
        response['Content-Disposition'] = 'attachment; filename="output.csv"'
        return response

  return JsonResponse({ "message": "Nenhum arquivo encontrado!" })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sendDatabase_view(request):

  if 'file' in request.FILES:
    uploaded_file = request.FILES.get('file')
    project_id = request.POST.get('project_id')
    separator = request.POST.get('separator')
    isSmiles = request.POST.get('separator')
    if(isSmiles == 'true'):
      isSmiles = True
    else:
      isSmiles = False

    project = get_object_or_404(Project, id=project_id)

    # Cria um DataFrame do Pandas com o conteúdo do arquivo
    file_content = uploaded_file.read().decode('utf-8')
    data_dataframe = pd.read_csv(
      StringIO(file_content), 
      sep=separator
    )
    rows, columns = data_dataframe.shape

    database = Database().create(
      name=uploaded_file.name,
      file=uploaded_file,
      file_separator=separator,
      lines=rows,
      columns=columns
    )
    project.database = database
    
    # Salvar no backend
    project.save()

    return JsonResponse({ "message": f"{uploaded_file.name} enviado!"})
  return JsonResponse({ "message": "Arquivo não enviado!" })

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
  database = project.database

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

      # Transforma para o formato Json
      data_dictionary = data_dataframe.to_dict(orient='records')

      return JsonResponse({
        'database': data_dictionary,
        'fileSeparator': database.file_separator,
        'name': database.name,
        'lines': database.lines,
        'columns': database.columns,
      })
  
  return JsonResponse({
    'message': 'Nenhum arquivo no projeto!',
    'database': None,
  })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getVariables_view(request):
  project_id = request.GET.get('project_id')

  project = get_object_or_404(Project, id=project_id)
  database = project.database

  if(database):
    if(database.file):

      # Cria um DataFrame do Pandas com o conteúdo do arquivo
      file_content = database.file.read().decode('utf-8')
      data_dataframe = pd.read_csv(
        StringIO(file_content), 
        sep=database.file_separator
      )

      variables = data_dataframe.columns.tolist()

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
  database = project.database

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

      histogram_image = getHistogramImage(variable_array, num_bins)

      return Response({ 'imageInBase64': histogram_image }, status=200)
  return Response({ 
    'message': 'Database não encontrado!',
  })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getBoxPlot_view(request):
  
  project_id = request.GET.get('project_id')
  variable = request.GET.get('variable')

  project = get_object_or_404(Project, id=project_id)
  database = project.database

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

      boxPlot_image = getBoxPlotImage(variable_array)

      return Response({ 'imageInBase64': boxPlot_image }, status=200)

  return Response({ 
    'message': 'Database não encontrado!',
  }, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def setNormalizationSettings_view(request):

  project_id = request.POST.get('project_id')
  normalization = request.POST.get('normalization')

  project = get_object_or_404(Project, id=project_id)

  if(project.database):
    if(project.database.normalization):
      project.database.normalization.update(normalization, False)
    else:
      normalization_instance = Normalization.objects.create(name=normalization)
      project.database.normalization = normalization_instance
      project.database.save()

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

  if(project.database):
    if(project.database.normalization):

      data = {
        'normalization': project.database.normalization.name,
        'applied': project.database.normalization.applied
      }
      return Response(data, status=200)

    else:
      
      normalization = Normalization.objects.create(name="NÃO APLICAR")
      project.database.normalization = normalization
      project.database.save()

      data = {
        'normalization': project.database.normalization.name,
        'applied': project.database.normalization.applied
      }
      return Response(data, status=200)

  return Response({
    'message': 'Não existe Database associado ao projeto!'
  }, status=200)