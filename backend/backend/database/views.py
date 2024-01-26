from io import StringIO
import pandas as pd
import json

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from .utils import getBoxPlotImage, getHistogramImage

from project_management.models import Project
from database.models import Database

import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg
import numpy as np

# Create your views here.
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
      if transposed:
        data_dataframe = data_dataframe.T
      
      # Transforma para o formato Json
      data_string = data_dataframe.to_json(orient='records')
      data_dictionary = json.loads(data_string)

      return JsonResponse({
        'database': data_dictionary,
        'fileSeparator': database.file_separator,
        'name': database.name,
        'lines': database.lines,
        'columns': database.columns
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

