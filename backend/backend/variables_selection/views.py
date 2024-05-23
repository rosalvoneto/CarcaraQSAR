from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes

# Create your views here.
@api_view(['POST'])
def setAlgorithm_view(request):
  pass