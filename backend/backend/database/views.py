import pandas as pd
from io import StringIO, BytesIO
import base64
import json

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from project_management.serializers import ProjectSerializer

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
def getProjectName_view(request):

  project_id = request.GET.get('project_id')
  print(f"ID DO PROJETO: {project_id}")
  project = get_object_or_404(Project, id=project_id)

  name = project.name

  return Response({ 'projectName': name })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProject_view(request):

  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)
  serializer = ProjectSerializer(project)

  return Response({ 
    'projectData': serializer.data
  }, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getHistogram_view(request):

  project_id = request.GET.get('project_id')
  values = request.GET.get('values').split(',')
  divisions_bins = request.GET.get('divisions')

  float_values = [float(value) for value in values]
  print(float_values)

  # Fazer cálculo de Histograma
  array = np.array(float_values)
  # Escolha o número de intervalos (bins)
  num_bins = int(divisions_bins)
  # Calcule o histograma
  hist, bins = np.histogram(array, bins=num_bins)
  # Calcule a amplitude dos intervalos
  amplitude_intervals = bins[1] - bins[0]

  # Crie o histograma usando Matplotlib
  fig, ax = plt.subplots()
  ax.bar(bins[:-1], hist, width=amplitude_intervals, edgecolor='black')

  ax.set_title('Histograma')
  ax.set_xlabel('Valores')
  ax.set_ylabel('Frequência')

  # Renderize a figura
  canvas = FigureCanvasAgg(fig)
  canvas.draw()

  # Obtenha os bytes da imagem
  buffer = BytesIO()
  canvas.print_png(buffer)
  buffer.seek(0)

  # Leia os bytes da imagem
  image_bytes = buffer.read()
  image_base64 = base64.b64encode(image_bytes).decode('utf-8')

  # Limpeza da exibição
  plt.clf()

  return Response({ 'imageInBase64': image_base64}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getBoxPlot_view(request):
  
  project_id = request.GET.get('project_id')
  values = request.GET.get('values').split(',')

  float_values = [float(value) for value in values]
  print(float_values)

  # Fazer cálculo de BoxPlot e retornar a imagem
  # Dados de exemplo (substitua isso pelos seus dados)
  array = np.array(float_values)

  # Crie o box plot
  fig, ax = plt.subplots()
  ax.boxplot(array)
  ax.set_title('Box Plot')
  ax.set_xlabel('Valores')

  # Renderize a figura usando FigureCanvasAgg
  canvas = FigureCanvasAgg(fig)
  canvas.draw()

  # Obtenha os bytes da imagem
  buffer = BytesIO()
  canvas.print_png(buffer)
  buffer.seek(0)

  # Converta a imagem para base64
  image_base64 = base64.b64encode(buffer.read()).decode('utf-8')

  # Limpeza da figura
  plt.clf()

  # Retorne a resposta como JSON
  return Response({'imageInBase64': image_base64})
