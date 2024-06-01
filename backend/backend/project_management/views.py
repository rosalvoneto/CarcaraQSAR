
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from database.models import Database
from .serializers import ProjectSerializer

from user.models import User
from .models import Project

# Create your views here.

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProject_view(request):

  user = request.user
  data = request.data
  name = data.get('project_name')
  description = data.get('project_description')

  # Crie um projeto
  Project.objects.create(
    name=name,
    description = description,
    user=user
  )

  # Retorne uma resposta, por exemplo, um JSON
  resposta = {
    'message': 'Projeto criado com sucesso',
    'name': name,
    'description': description
  }
  return Response(resposta, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def projects_view(request):

  user = request.user
  search_value = request.GET.get('query', '')

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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sharedProjects_view(request):

  user = request.user
  search_value = request.GET.get('query', '')

  projects = Project.objects.filter(isActive=True, shared=True, user=user)
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def deactivatedProjects_view(request):

  user = request.user
  search_value = request.GET.get('query', '')

  projects = Project.objects.filter(isActive=False, user=user)
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

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def activateProject_view(request, project_id):

  project = get_object_or_404(Project, pk=project_id)
  project.isActive = True
  project.save()

  return JsonResponse({'message': 'Projeto restaurado!'})

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def deactivateProject_view(request, project_id):

  project = get_object_or_404(Project, pk=project_id)
  project.isActive = False
  project.save()

  return JsonResponse({'message': 'Projeto movido para a lixeira!'})

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def shareProject_view(request, project_id):

  project = get_object_or_404(Project, pk=project_id)
  project.shared = True
  project.save()

  return JsonResponse({'message': 'Projeto compartilhado!'})

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def deshareProject_view(request, project_id):

  project = get_object_or_404(Project, pk=project_id)
  project.shared = False
  project.save()

  return JsonResponse({'message': 'Projeto privado!'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteProject_view(request, project_id):

  object = get_object_or_404(Project, pk=project_id)
  object.delete()

  return JsonResponse({'message': 'Projeto excluído com sucesso!'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProject_view(request):

  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)
  serializer = ProjectSerializer(project)

  return Response({ 
    'projectData': serializer.data
  }, status=200)