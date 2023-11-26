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
    return JsonResponse({
      'message': 'Projeto criado!'
    })
  
  else:
    return JsonResponse({
      'message': 'Projeto não criado!'
    })

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