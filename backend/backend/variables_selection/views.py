from io import StringIO
from django.shortcuts import get_object_or_404

from io import StringIO
import pandas as pd
import json

from sklearn.ensemble import RandomForestRegressor

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from database.models import CSVDatabase
from project_management.models import Project
from variables_selection.models import VariablesSelection
from variables_selection.utils import get_variables_settings, update_database, generate_new_database
from variables_selection.algorithms.abc import ABC_execution

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getVariablesSettings_view(request):

  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  response = get_variables_settings(project)
  return Response(response, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def setVariablesSettings_view(request):

  project_id = request.POST.get('project_id')
  algorithm = request.POST.get('algorithm')
  algorithm_parameters = request.POST.get('algorithm_parameters')
  algorithm_parameters = json.loads(algorithm_parameters)
  print(algorithm_parameters)

  list_of_variables = request.POST.get('list_of_variables')
  list_of_variables = json.loads(list_of_variables)
  remove_constant_variables = request.POST.get('remove_constant_variables')
  if(remove_constant_variables == "true"):
    remove_constant_variables = True
  else:
    remove_constant_variables = False

  project = get_object_or_404(Project, id=project_id)
  try:
    variables_selection = project.variablesselection_set.get()
    variables_selection.update(
      algorithm=algorithm,
      algorithm_parameters=algorithm_parameters,
      remove_constant_variables=remove_constant_variables,
      variables_to_remove=list_of_variables
    )

    return Response({
      'message': 'Seleção de variáveis alterada!'
    }, status=200)

  except VariablesSelection.DoesNotExist:
    variables_selection = VariablesSelection.objects.create(
      algorithm=algorithm,
      algorithm_parameters=algorithm_parameters,
      remove_constant_variables=remove_constant_variables,
      variables_to_remove=list_of_variables,
      project=project,
    )

    return Response({
      'message': 'Seleção de variáveis criada!'
    }, status=200)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def removeRows_view(request):

  project_id = request.POST.get('project_id')
  indexes = request.POST.get('rows')
  rows_to_remove = indexes.split(',')
  rows_to_remove = [int(value) for value in rows_to_remove]

  project = get_object_or_404(Project, id=project_id)
  database = project.database

  if(database):
    if(database.file):

      # Cria um DataFrame do Pandas com o conteúdo do arquivo
      file_content = database.file.read().decode('utf-8')
      dataframe = pd.read_csv(
        StringIO(file_content), 
        sep=database.file_separator
      )

      # Vincular Database atual ao histórico
      message = "Database antes da remoção de linhas!"
      CSVDatabase.objects.create(
        file=database.file,
        change_description=message,
        actual_database=database
      )

      # Remoção de linhas
      dataframe = dataframe.drop(rows_to_remove).reset_index(drop=True)

      # Atualizar Database principal com o novo arquivo
      database = update_database(database, dataframe)

      # Salvar mudanças no backend
      project.database = database
      project.save()

      return Response({
        'message': 'Remoção bem sucedida de linhas do Database!',
      }, status=200)

  return Response({
    'message': 'Database principal não encontrado!',
  }, status=200)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def removeConstantVariables_view(request):

  project_id = request.POST.get('project_id')

  project = get_object_or_404(Project, id=project_id)
  database = project.database

  if(database):
    if(database.file):
      # Cria um DataFrame do Pandas com o conteúdo do arquivo
      file_content = database.file.read().decode('utf-8')
      dataframe = pd.read_csv(
        StringIO(file_content), 
        sep=database.file_separator
      )

      # Remoção de colunas constantes
      response = get_variables_settings(project)
      to_delete = response["removeConstantVariables"]

      if(to_delete):

        # Vincular Database atual ao histórico
        message = "Database antes da remoção de variáveis constantes!"
        CSVDatabase.objects.create(
          file=database.file,
          change_description=message,
          actual_database=database
        )

        # Identificar colunas onde todos os valores são iguais
        columns_to_drop = [column for column in dataframe.columns if dataframe[column].nunique() == 1]
        # Remover essas colunas do DataFrame
        dataframe = dataframe.drop(columns=columns_to_drop)

        # Atualizar Database principal com o novo arquivo
        database = update_database(database, dataframe)

        # Salvar mudanças no backend
        project.database = database
        project.save()

        return Response({
          'message': 'Remoção de colunas constantes do Database!',
        }, status=200)
      else:
        return Response({
          'message': 'Colunas constantes não removidas!',
        }, status=200)

  return Response({
    'message': 'Database principal não encontrado!',
  }, status=200)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def removeVariables_view(request):

  project_id = request.POST.get('project_id')
  project = get_object_or_404(Project, id=project_id)
  database = project.database

  if(database):
    if(database.file):
      # Cria um DataFrame do Pandas com o conteúdo do arquivo
      file_content = database.file.read().decode('utf-8')
      dataframe = pd.read_csv(
        StringIO(file_content), 
        sep=database.file_separator
      )

      # Remoção de variáveis do usuário
      response = get_variables_settings(project)
      variables_to_remove = response["variablesToRemove"]

      if(len(variables_to_remove)):

        # Vincular Database atual ao histórico
        message = "Database antes da remoção de variáveis pelo usuário!"
        CSVDatabase.objects.create(
          file=database.file,
          change_description=message,
          actual_database=database
        )

        # Verificar quais colunas de 'variables_to_remove'
        # estão realmente no DataFrame
        columns_to_remove = [
          column for column in variables_to_remove if column in dataframe.columns
        ]
        # Remover as colunas confirmadas
        if columns_to_remove:
          dataframe = dataframe.drop(columns=columns_to_remove)

        # Atualizar Database principal com o novo arquivo
        database = update_database(database, dataframe)

        # Salvar mudanças no backend
        project.database = database
        project.save()

        return Response({
          'message': 'Remoção de variáveis escolhidas pelo usuário!',
        }, status=200)
      else:
        return Response({
          'message': 'Nenhuma variável para remover pelo usuário!',
        }, status=200)
    
  return Response({
    'message': 'Database principal não encontrado!',
  }, status=200)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def makeSelection_view(request):

  project_id = request.POST.get('project_id')
  project = get_object_or_404(Project, id=project_id)
  database = project.database

  if(database):
    if(database.file):

      # Cria um DataFrame do Pandas com o conteúdo do arquivo
      file_content = database.file.read().decode('utf-8')
      dataframe = pd.read_csv(
        StringIO(file_content), 
        sep=database.file_separator
      )

      # Cria um modelo
      model = RandomForestRegressor(n_estimators=100, random_state=42)

      # Faz a seleção de variáveis
      best_subset, best_r2 = ABC_execution(dataframe, model)
      generate_new_database("base_compressed.csv",dataframe, best_subset)

      return Response({
        'message': 'Seleção de variáveis aplicada!',
      }, status=200)

  return Response({
    'message': 'Database principal não encontrado!',
  }, status=200)