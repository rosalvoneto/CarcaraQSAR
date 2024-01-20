import pandas as pd
from io import StringIO, BytesIO
import base64

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from project_management.serializers import ProjectSerializer
from project_management.models import Project

import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg
import numpy as np

# Create your views here.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sendDatabase_view(request):

  if 'file' in request.FILES:
    uploaded_file = request.FILES.get('file')
    print(uploaded_file.name)
    # Lê o conteúdo do arquivo
    file_content = uploaded_file.read().decode('utf-8')

    # Fazer o vinculo do arquivo ao projeto do usuário
    project_id = request.POST.get('project_id')

    project = get_object_or_404(Project, id=project_id)
    project.database = uploaded_file
    
    # Salvar arquivo no backend
    project.save()

    # Cria um DataFrame do Pandas com o conteúdo do arquivo
    df = pd.read_csv(StringIO(file_content))

    # Faça o que desejar com o DataFrame aqui
    # Exemplo: Imprime as primeiras linhas do DataFrame no console
    print(df.head())

    return JsonResponse({ "message": f"{uploaded_file.name} enviado!"})
  return JsonResponse({ "message": "Arquivo não enviado!" })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getDatabase_view(request):

  project_id = request.GET.get('project_id')

  project = get_object_or_404(Project, id=project_id)

  databaseFile = project.database

  if(databaseFile):
    # Recuperar nome original do arquivo
    # Divide a string usando o caractere '_'
    name = databaseFile.name.split('/')[1]
    partes = name.split('_')
    # Combina a primeira parte (antes do '_') com a extensão
    novo_nome_do_arquivo = f"{partes[0]}.{partes[-1].split('.')[-1]}"

    # Abre o arquivo para leitura binária
    with databaseFile.open(mode='rb') as file:
      content = file.read()
      return JsonResponse({
        'content': content.decode('utf-8'),
        'fileName': novo_nome_do_arquivo
      })
  return JsonResponse({
    'message': 'Nenhum arquivo foi Upload',
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
  print(f"ID DO PROJETO: {project_id}")

  project = get_object_or_404(Project, id=project_id)
  serializer = ProjectSerializer(project)

  # Abre o arquivo para leitura binária
  with project.database.open(mode='rb') as file:
    content = file.read()
    database = content.decode('utf-8')


  return Response({ 
    'projectData': serializer.data,
    'databaseFile': database
  }, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getHistogram_view(request):

  project_id = request.GET.get('project_id')
  values = request.GET.get('values').split(',')

  int_values = [int(value) for value in values]
  print(int_values)

  # Fazer cálculo de Histograma
  array = np.array(int_values)
  # Escolha o número de intervalos (bins)
  num_bins = 10
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

  int_values = [int(value) for value in values]
  print(int_values)

  # Fazer cálculo de BoxPlot e retornar a imagem
  # Dados de exemplo (substitua isso pelos seus dados)
  array = np.array(int_values)

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
