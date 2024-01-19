import pandas as pd
from io import StringIO

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from backend.backend.project_management.models import Project

# Create your views here.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sendDatabase_view(request):

  if 'file' in request.FILES:
    uploaded_file = request.FILES['file']

    # Fazer o vinculo do arquivo ao projeto do usuário
    user = request.user
    # Salvar arquivo no backend

    # Lê o conteúdo do arquivo
    file_content = uploaded_file.read().decode('utf-8')

    # Exemplo: Imprime o conteúdo do arquivo no console do Django
    print('Conteúdo do arquivo:', file_content)

    # Cria um DataFrame do Pandas com o conteúdo do arquivo
    df = pd.read_csv(StringIO(file_content))

    # Faça o que desejar com o DataFrame aqui
    # Exemplo: Imprime as primeiras linhas do DataFrame no console
    print(df.head())

    return JsonResponse({ "message": f"{uploaded_file.name} enviado!"})
  return JsonResponse({ "message": "Arquivo não enviado!" })