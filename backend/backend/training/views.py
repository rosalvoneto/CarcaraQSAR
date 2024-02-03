from io import StringIO
import pandas as pd
import json
import csv

from django.http import FileResponse
import os
from collections import OrderedDict

from django.utils.encoding import smart_str
from django.core.files.base import ContentFile

from padelpy import from_smiles

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404

from project_management.models import Project
from database.models import Database, Normalization
from .models import Training

import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg
import numpy as np

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTrainingSettings_view(request):

  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  try:
    # Agora 'training' contém a instância de Training associada a este Project
    training = project.training_set.get()

    return Response({
      'algorithm': training.algorithm,
      'removeConstantsVariables': training.remove_constant_variables,
    }, status=200)

  except Training.DoesNotExist:
    # Se não houver uma instância de Training associada, será lançada a exceção DoesNotExist
    training = Training.objects.create(
      algorithm="NÃO APLICAR",
      remove_constant_variables=False,
      project=project
    )
    training.save()

    return Response({
      'algorithm': training.algorithm,
      'removeConstantsVariables': training.remove_constant_variables,
    }, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def setTrainingSettings_view(request):

  project_id = request.POST.get('project_id')
  algorithm = request.POST.get('algorithm')
  remove_variables_constants = request.POST.get('remove_variables_constants')
  if(remove_variables_constants == "true"):
    remove_variables_constants = True
  else:
    remove_variables_constants = False

  project = get_object_or_404(Project, id=project_id)
  try:
    # Agora 'training' contém a instância de Training associada a este Project
    training = project.training_set.get()
    training.algorithm = algorithm
    training.remove_constant_variables = remove_variables_constants
    training.save()

    return Response({
      'message': 'Treinamento alterado!'
    }, status=200)

  except Training.DoesNotExist:
    # Se não houver uma instância de Training associada, será lançada a exceção DoesNotExist
    training = Training.objects.create(
      algorithm=algorithm,
      remove_constant_variables=remove_variables_constants,
      project=project
    )
    training.save()

    return Response({
      'message': 'Treinamento criado!'
    }, status=200)