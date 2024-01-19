import pandas as pd
from io import StringIO

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from project_management.models import Project

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
  print(f"ID DO PROJETO: {project_id}")
  project = get_object_or_404(Project, id=project_id)

  databaseFile = project.database

  # Recuperar nome original do arquivo
  # Divide a string usando o caractere '_'
  name = databaseFile.name.split('/')[1]
  partes = name.split('_')
  # Combina a primeira parte (antes do '_') com a extensão
  novo_nome_do_arquivo = f"{partes[0]}.{partes[-1].split('.')[-1]}"
  print(novo_nome_do_arquivo)

  # Abre o arquivo para leitura binária
  with databaseFile.open(mode='rb') as file:
    content = file.read()
    return JsonResponse({
      'content': content.decode('utf-8'),
      'fileName': novo_nome_do_arquivo
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProjectName_view(request):

  project_id = request.GET.get('project_id')
  print(f"ID DO PROJETO: {project_id}")
  project = get_object_or_404(Project, id=project_id)

  name = project.name

  return Response({ 'projectName': name })