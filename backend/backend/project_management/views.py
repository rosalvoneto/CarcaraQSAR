
from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from user.models import User
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
    email = data.get('project_user_email')

    print(name)
    print(description)
    print(email)

    user = User.objects.filter(email=email)[0]

    # Realize as operações desejadas com os dados
    project = Project()
    project.name = name
    project.description = description
    project.user = user
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
def getRoutes(request):

  routes = [
    '/project/new',
    '/project/database'
  ]

  return JsonResponse(routes)

@api_view(['GET', 'POST'])
def projects_view(request):

  search_value = request.GET.get('query', '')
  email_value = request.GET.get('email', '')
  print(search_value)
  print(email_value)

  user = User.objects.filter(email=email_value)[0]

  projects = Project.objects.filter(isActive=True, user=user)
  projects = projects.filter(name__icontains=search_value)

  dictionary_results = []
  for index, project in enumerate(projects):
    item = {
      'id': project.id,
      'nome': project.name, 
      'status': project.status,
      'isActive': project.isActive,
      'shared': project.shared,
      'selecionado': False,
      'date': project.modification_date.strftime("%d-%m-%Y %H:%M:%S")
    }
    dictionary_results.append(item)

  return Response(dictionary_results, status=200)

@api_view(['GET', 'POST'])
def sharedProjects_view(request):
  
  search_value = request.GET.get('query', '')
  print(search_value)

  projects = Project.objects.filter(
    isActive=True, 
    name__icontains=search_value,
    shared=True
  )

  dictionary_results = []
  for index, project in enumerate(projects):
    item = {
      'id': project.id,
      'nome': project.name,
      'status': project.status,
      'isActive': project.isActive,
      'shared': project.shared,
      'selecionado': False,
      'date': project.modification_date.strftime("%d-%m-%Y %H:%M:%S")
    }
    dictionary_results.append(item)

  return Response(dictionary_results, status=200)

@api_view(['GET', 'POST'])
def deactivatedProjects_view(request):

  search_value = request.GET.get('query', '')
  print(search_value)

  projects = Project.objects.filter(isActive=False, name__icontains=search_value)

  dictionary_results = []
  for index, project in enumerate(projects):
    item = {
      'id': project.id,
      'nome': project.name,
      'status': project.status,
      'isActive': project.isActive,
      'shared': project.shared,
      'selecionado': False,
      'date': project.modification_date.strftime("%d-%m-%Y %H:%M:%S")
    }
    dictionary_results.append(item)

  return Response(dictionary_results, status=200)

@api_view(['PUT'])
def activateProject_view(request, project_id):

  project = get_object_or_404(Project, pk=project_id)
  project.isActive = True
  project.save()

  return JsonResponse({'message': 'Projeto restaurado!'})

@api_view(['PUT'])
def deactivateProject_view(request, project_id):

  project = get_object_or_404(Project, pk=project_id)
  project.isActive = False
  project.save()

  return JsonResponse({'message': 'Projeto movido para a lixeira!'})

@api_view(['PUT'])
def shareProject_view(request, project_id):

  project = get_object_or_404(Project, pk=project_id)
  project.shared = True
  project.save()

  return JsonResponse({'message': 'Projeto compartilhado!'})

@api_view(['PUT'])
def deshareProject_view(request, project_id):

  project = get_object_or_404(Project, pk=project_id)
  project.shared = False
  project.save()

  return JsonResponse({'message': 'Projeto privado!'})

@api_view(['DELETE'])
def deleteProject_view(request, project_id):

  object = get_object_or_404(Project, pk=project_id)
  object.delete()

  return JsonResponse({'message': 'Projeto excluído com sucesso!'})