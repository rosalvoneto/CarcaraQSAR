from io import StringIO
from django.shortcuts import get_object_or_404, render
from django.core.files import File

from io import StringIO
import pandas as pd
import json

import pandas as pd
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from database.models import CSVDatabase
from project_management.models import Project
from variables_selection.models import VariablesSelection

import os

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getVariablesSettings_view(request):

  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  try:
    variables_selection = project.variablesselection_set.get()

    return Response({
      'algorithm': variables_selection.algorithm,
      'algorithmParameters': variables_selection.algorithm_parameters,
      'removeConstantVariables': variables_selection.remove_constant_variables,
      'variablesToRemove': variables_selection.variables_to_remove,
    }, status=200)

  except VariablesSelection.DoesNotExist:

    variables_selection = VariablesSelection.objects.create(
      algorithm="NÃO APLICAR",
      algorithm_parameters={},
      remove_constant_variables=False,
      variables_to_remove=[],
      project=project
    )

    return Response({
      'algorithm': variables_selection.algorithm,
      'algorithmParameters': variables_selection.algorithm_parameters,
      'removeConstantVariables': variables_selection.remove_constant_variables,
      'variablesToRemove': variables_selection.variables_to_remove,
    }, status=200)

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

      previous_database = CSVDatabase.objects.create(
        file=database.file,
        change_description=message,
        actual_database=database
      )

      # Remoção de linhas
      dataframe = dataframe.drop(rows_to_remove).reset_index(drop=True)

      # Atualizar Database principal com o novo arquivo
      # Pegar dados de linhas e colunas
      rows, columns = dataframe.shape

      # Transformar o dataframe em um arquivo
      file_path = "new_database.csv"
      dataframe.to_csv(file_path, index=False)

      with open(file_path, 'rb') as new_file:
        django_file = File(new_file)

        database.update_file(
          file=django_file,
          lines=rows,
          columns=columns
        )
        project.database = database
      
      # Salvar mudanças no backend
      project.save()

      os.remove(file_path)

      return Response({
        'message': 'Remoção bem sucedida de linhas do Database principal',
      }, status=200)

  return Response({
    'message': 'Database principal não encontrado!',
  }, status=200)