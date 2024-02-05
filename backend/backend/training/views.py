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
from .models import Training, VariablesSelection

import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg
import numpy as np

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getVariablesSettings_view(request):

  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  try:
    variables_selection = project.variablesselection_set.get()

    return Response({
      'algorithm': variables_selection.algorithm,
      'removeConstantVariables': variables_selection.remove_constant_variables,
    }, status=200)

  except VariablesSelection.DoesNotExist:

    variables_selection = VariablesSelection.objects.create(
      algorithm="NÃO APLICAR",
      remove_constant_variables=False,
      project=project
    )
    variables_selection.save()

    return Response({
      'algorithm': variables_selection.algorithm,
      'removeConstantVariables': variables_selection.remove_constant_variables,
    }, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def setVariablesSettings_view(request):

  project_id = request.POST.get('project_id')
  algorithm = request.POST.get('algorithm')
  remove_constant_variables = request.POST.get('remove_constant_variables')
  if(remove_constant_variables == "true"):
    remove_constant_variables = True
  else:
    remove_constant_variables = False

  project = get_object_or_404(Project, id=project_id)
  try:
    variables_selection = project.variablesselection_set.get()
    variables_selection.algorithm = algorithm
    variables_selection.remove_constant_variables = remove_constant_variables
    variables_selection.save()

    return Response({
      'message': 'Seleção de variáveis alterada!'
    }, status=200)

  except VariablesSelection.DoesNotExist:
    variables_selection = VariablesSelection.objects.create(
      algorithm=algorithm,
      remove_constant_variables=remove_constant_variables,
      project=project
    )
    variables_selection.save()

    return Response({
      'message': 'Seleção de variáveis criada!'
    }, status=200)