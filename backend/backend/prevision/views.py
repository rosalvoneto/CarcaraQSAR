import os
import json
import pandas as pd
import numpy as np
from io import StringIO

from sklearn.metrics import mean_squared_error

from django.shortcuts import get_object_or_404
from django.core.files import File
from django.http import HttpResponse

from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.model_selection import train_test_split

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from project_management.models import Project

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createModel_view(request):

  project_id = request.POST.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  result = project.create_prevision_model()
  if(result):
    return Response({
      'message': 'Modelo criado com sucesso!'
    }, status=200)
  return Response({
    'message': 'Modelo não criado!'
  }, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def makePrevision_view(request):

  project_id = request.POST.get('project_id')
  project = get_object_or_404(Project, id=project_id)
  variables_values = request.POST.get('variables_values')
  variables_values = json.loads(variables_values)

  if(project.prevision_model):

    # Redimensione os dados para uma matriz 2D
    dataframe = pd.DataFrame(
      [variables_values],
      columns=project.prevision_model.variables
    )
    print(dataframe)

    # Recuperar scaler do banco de dados
    scaler = project.prevision_model.retrieve_scaler()
    print("Scaler:")
    print(scaler)
    # Recuperar modelo do banco de dados
    model = project.prevision_model.retrieve_model()
    print("Model:")
    print(model)

    # Faz a normalização dos valores das variáveis
    X_subset = scaler.transform(dataframe)

    # Realiza a previsão
    prevision = model.predict(X_subset)

    # Retorna valor da previsão
    return Response({
      'prevision': prevision
    }, status=200)
  return Response({
    'message': 'Não há modelo de previsão no banco de dados!'
  }, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def hasModel_view(request):
  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  if(project.prevision_model):
    return Response({
      'hasModel': True,
      'message': 'O projeto tem um modelo associado'
    }, status=200)
  
  return Response({
    'hasModel': False,
    'message': 'O projeto não tem um modelo associado'
  }, status=200)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteModel_view(request):
  project_id = request.POST.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  prevision_model = project.prevision_model
  prevision_model.delete()
  project.prevision_model = None
  project.save()

  return Response({
    'message': 'Modelo apagado com sucesso!'
  }, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def donwloadModel_view(request):
  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  prevision_model = project.prevision_model
  model_file = prevision_model.model_file

  # Abra o arquivo e retorne como uma resposta de arquivo
  with open(f"media/{model_file}", 'rb') as file:
    response = HttpResponse(file.read(), content_type='application/force-download')
    response['Content-Disposition'] = f'attachment; filename="{model_file.name}"'
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def donwloadScaler_view(request):
  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  prevision_model = project.prevision_model
  scaler_file = prevision_model.scaler_file

  # Abra o arquivo e retorne como uma resposta de arquivo
  with open(f"media/{scaler_file}", 'rb') as file:
    response = HttpResponse(file.read(), content_type='application/force-download')
    response['Content-Disposition'] = f'attachment; filename="{scaler_file.name}"'
    return response

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def calculateAll_view(request):

  project_id = request.POST.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  if(project.prevision_model):

    database = project.get_database()

    # Cria um DataFrame do Pandas com o conteúdo do arquivo
    file_content = database.file.read().decode('utf-8')
    dataframe = pd.read_csv(
      StringIO(file_content), 
      sep=database.file_separator
    )
    real_values = dataframe.iloc[:, -1].tolist()

    dataframe = dataframe.drop(dataframe.columns[-1], axis=1)
    print(dataframe)

    # Recuperar scaler do banco de dados
    scaler = project.prevision_model.retrieve_scaler()
    # Recuperar modelo do banco de dados
    model = project.prevision_model.retrieve_model()

    # Faz a normalização dos valores das variáveis
    X_subset = scaler.transform(dataframe)

    # Realiza a previsão
    prevision_values = model.predict(X_subset)

    # Calcular o MSE usando scikit-learn
    mse = mean_squared_error(real_values, prevision_values)
    # Calcular o RMSE
    rmse = np.sqrt(mse)

    # Retorna valor da previsão
    return Response({
      'prevision': prevision_values,
      'rmse': rmse
    }, status=200)
  return Response({
    'message': 'Não há modelo de previsão no banco de dados!'
  }, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def downloadEstimation_view(request):

  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  real_values = []
  prevision_values = []

  if(project.prevision_model):

    database = project.get_database()
    # Cria um DataFrame do Pandas com o conteúdo do arquivo
    file_content = database.file.read().decode('utf-8')
    dataframe = pd.read_csv(
      StringIO(file_content), 
      sep=database.file_separator
    )
    real_values = dataframe.iloc[:, -1].tolist()

    dataframe = dataframe.drop(dataframe.columns[-1], axis=1)

    # Recuperar scaler do banco de dados
    scaler = project.prevision_model.retrieve_scaler()
    # Recuperar modelo do banco de dados
    model = project.prevision_model.retrieve_model()

    # Faz a normalização dos valores das variáveis
    X_subset = scaler.transform(dataframe)

    # Realiza a previsão
    prevision_values = model.predict(X_subset)


  file_path = "prevision.csv"
  dataframe = pd.DataFrame(
    {'Previsões': prevision_values, 'Valores reais': real_values}
  )
  print(dataframe)
  dataframe.to_csv(file_path, index=False)

  # Abra o arquivo e retorne como uma resposta de arquivo
  with open(file_path, 'rb') as file:
    response = HttpResponse(
      file.read(), content_type='application/force-download'
    )
    response['Content-Disposition'] = f'attachment; filename="{file_path}"'
    return response