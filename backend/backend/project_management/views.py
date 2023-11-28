import datetime

from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.http import JsonResponse
from django.shortcuts import redirect, render

from .models import Project

# Create your views here.

@api_view(['GET', 'POST'])
def createProject_view(request):
  if request.method == 'POST':

    # Recupere os dados do corpo da requisição
    data = request.data

    # Faça algo com os dados
    name = data.get('project_name')
    description = data.get('project_description')

    print(name)
    print(description)

    # Realize as operações desejadas com os dados
    project = Project()
    project.name = name
    project.description = description
    project.save()

    # Retorne uma resposta, por exemplo, um JSON
    resposta = {
      'message': 'Projeto criado com sucesso',
      'name': name,
      'description': description
    }
    return Response(resposta, status=200)
  
  else:
    return Response({'mensagem': 'Método não permitido'}, status=405)

@api_view(['GET'])
def database_view(request):
  return JsonResponse({ 'message': 'database_view' })

@api_view(['GET'])
def getRoutes(request):

  routes = [
    '/project/new',
    '/project/database'
  ]

  return JsonResponse(routes)