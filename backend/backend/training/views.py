from io import StringIO
import pandas as pd
import json
import csv

from django.http import FileResponse
import os
from collections import OrderedDict

from django.core.exceptions import ObjectDoesNotExist

from django.utils.encoding import smart_str
from django.core.files.base import ContentFile

from padelpy import from_smiles
from django.core.files import File

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from .utils import cross_validation, leave_one_out, y_scrambling

from project_management.models import Project
from database.models import Database, Normalization
from .models import Algorithm, Training, VariablesSelection

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
      'variablesToRemove': variables_selection.variables_to_remove,
    }, status=200)

  except VariablesSelection.DoesNotExist:

    variables_selection = VariablesSelection.objects.create(
      algorithm="NÃO APLICAR",
      remove_constant_variables=False,
      variables_to_remove=[],
      project=project
    )

    return Response({
      'algorithm': variables_selection.algorithm,
      'removeConstantVariables': variables_selection.remove_constant_variables,
      'variablesToRemove': variables_selection.variables_to_remove,
    }, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def setVariablesSettings_view(request):

  project_id = request.POST.get('project_id')
  algorithm = request.POST.get('algorithm')
  list_of_variables = request.POST.get('list_of_variables')
  list_of_variables = json.loads(list_of_variables)
  remove_constant_variables = request.POST.get('remove_constant_variables')
  if(remove_constant_variables == "true"):
    remove_constant_variables = True
  else:
    remove_constant_variables = False

  project = get_object_or_404(Project, id=project_id)
  try:
    variables_selection = project.variablesselection_set.get()
    variables_selection.update(
      algorithm=algorithm,
      remove_constant_variables=remove_constant_variables,
      variables_to_remove=list_of_variables
    )

    return Response({
      'message': 'Seleção de variáveis alterada!'
    }, status=200)

  except VariablesSelection.DoesNotExist:
    variables_selection = VariablesSelection.objects.create(
      algorithm=algorithm,
      remove_constant_variables=remove_constant_variables,
      variables_to_remove=list_of_variables,
      project=project,
    )

    return Response({
      'message': 'Seleção de variáveis criada!'
    }, status=200)
  
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTrainingSettings_view(request):

  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  try:
    training = project.training_set.get()

    return Response({
      'algorithm': training.algorithm.name,
      'parameters': training.algorithm.parameters,
      'trained': training.trained,
      'withFullSet': training.with_full_set
    }, status=200)

  except Training.DoesNotExist:
    algorithm = Algorithm.objects.create(
      name="Random Forest",
      parameters={}
    )

    training = Training.objects.create(
      algorithm=algorithm,
      project=project,
      trained=False,
      with_full_set=False,
    )

    return Response({
      'algorithm': training.algorithm.name,
      'parameters': training.algorithm.parameters,
      'trained': training.trained,
      'withFullSet': training.with_full_set
    }, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def setTrainingSettings_view(request):

  project_id = request.POST.get('project_id')
  algorithm = request.POST.get('algorithm')
  parameters = request.POST.get('parameters')
  parameters = json.loads(parameters)
  with_full_set = request.POST.get('with_full_set')
  if with_full_set == "true":
    with_full_set = True
  else:
    with_full_set = False

  print("PARAMETROS:", parameters)

  project = get_object_or_404(Project, id=project_id)
  try:
    training = project.training_set.get()
    training.algorithm.update(
      name=algorithm,
      parameters=parameters
    )

    training.trained = False
    training.with_full_set = with_full_set
    training.save()

    return Response({
      'message': 'Treinamento alterado!'
    }, status=200)

  except Training.DoesNotExist:
    algorithm = Algorithm.objects.create(
      name=algorithm,
      parameters=parameters
    )

    training = Training.objects.create(
      algorithm=algorithm,
      project=project,
      trained=False,
      with_full_set=with_full_set,
    )

    return Response({
      'message': 'Treinamento criado!'
    }, status=200)
  
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def train_view(request):

  print("Treinando...")

  project_id = request.POST.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  try:
    if(project.database):

      print("FILE:", project.database.file)
      data = pd.read_csv(f"media/{project.database.file}")
      rows, columns = data.shape
      print(f"{rows} linhas e {columns} colunas")
      
      print("Retirando valores NaN do Dataset...")
      data = data.dropna().reset_index(drop=True)
      rows, columns = data.shape
      print(f"{rows} linhas e {columns} colunas")

      print(data)

      training = project.training_set.get()

      if(project.database.normalization):
        print("Normalização:", project.database.normalization)

        # Execuções dos algoritmos e salvamento dos gráficos

        print("Calculando leave one out:")
        leave_one_out(
          project_id,
          data,
          project.database.normalization.name,
          training.algorithm.name,
          training.algorithm.parameters
        )
        file_name = 'loo_temporary.png'
        with open(file_name, 'rb') as image:
          training.leave_one_out.save('loo.png', File(image), save=True)
        os.remove(file_name)

        print("Calculando cross validation:")
        cross_validation(
          project_id,
          data,
          project.database.normalization.name,
          training.algorithm.name,
          training.algorithm.parameters
        )
        file_name = 'cross_validation_temporary.png'
        with open(file_name, 'rb') as image:
          training.k_fold_cross_validation.save('cross_validation.png', File(image), save=True)
        os.remove(file_name)

        print("Calculando y-scrambling:")
        y_scrambling(
          project_id,
          data,
          project.database.normalization.name,
          training.algorithm.name,
          training.algorithm.parameters
        )
        file_name = 'y_scrambling_temporary.png'
        with open(file_name, 'rb') as image:
          training.y_scrambling.save('y_scrambling.png', File(image), save=True)
        os.remove(file_name)

        # Atualiza treinamento para concluído
        training.trained = True
        training.save()

        return Response({
          'message': 'O treinamento está finalizado!',
          'trained': training.trained,
        }, status=200)
      
      else:
        return Response({
          'message': 'Não foi encontrada Normalização!',
        }, status=500)
    
    return Response({
      'message': 'Não foi encontrado Database!',
    }, status=500)

  except Training.DoesNotExist:
    return Response({
      'message': 'Configurações de treinamento não foram encontradas!'
    }, status=200)
  
  except Exception as error:
    print("\nO treinamento retornou o seguinte erro:")
    print(error, "\n")
  
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getLeaveOneOut_view(request):

  try:
    project_id = request.GET.get('project_id')
    project = get_object_or_404(Project, id=project_id)

    training = project.training_set.get()
    leave_one_out_image = training.leave_one_out

    # Verificar se o campo leave_one_out tem um arquivo associado
    if leave_one_out_image:
      return HttpResponse(leave_one_out_image, content_type="image/png")
    else:
      return HttpResponse("No image found for leave_one_out field", status=404)
  except ObjectDoesNotExist:
    return HttpResponse("Project or training not found", status=404)
  except ValueError:
    return HttpResponse("No file associated with leave_one_out attribute", status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getImportance_view(request):

  try:
    project_id = request.GET.get('project_id')
    project = get_object_or_404(Project, id=project_id)

    training = project.training_set.get()
    importance_image = training.importance

    # Verificar se o campo importance tem um arquivo associado
    if importance_image:
      return HttpResponse(importance_image, content_type="image/png")
    else:
      return HttpResponse("No image found for importance field", status=404)
  except ObjectDoesNotExist:
    return HttpResponse("Project or training not found", status=404)
  except ValueError:
    return HttpResponse("No file associated with importance attribute", status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getKFoldCrossValidation_view(request):

  try:
    project_id = request.GET.get('project_id')
    project = get_object_or_404(Project, id=project_id)

    training = project.training_set.get()
    k_fold_cross_validation_image = training.k_fold_cross_validation

    # Verificar se o campo k_fold_cross_validation tem um arquivo associado
    if k_fold_cross_validation_image:
      return HttpResponse(k_fold_cross_validation_image, content_type="image/png")
    else:
      return HttpResponse("No image found for k_fold_cross_validation field", status=404)
  except ObjectDoesNotExist:
    return HttpResponse("Project or training not found", status=404)
  except ValueError:
    return HttpResponse("No file associated with k_fold_cross_validation attribute", status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getYScrambling_view(request):

  try:
    project_id = request.GET.get('project_id')
    project = get_object_or_404(Project, id=project_id)

    training = project.training_set.get()
    y_scrambling_image = training.y_scrambling

    # Verificar se o campo y_scrambling tem um arquivo associado
    if y_scrambling_image:
      return HttpResponse(y_scrambling_image, content_type="image/png")
    else:
      return HttpResponse("No image found for y_scrambling field", status=404)
  except ObjectDoesNotExist:
    return HttpResponse("Project or training not found", status=404)
  except ValueError:
    return HttpResponse("No file associated with y_scrambling attribute", status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getBootstrap_view(request):

  try:
    project_id = request.GET.get('project_id')
    project = get_object_or_404(Project, id=project_id)

    training = project.training_set.get()
    bootstrap_image = training.bootstrap

    # Verificar se o campo bootstrap tem um arquivo associado
    if bootstrap_image:
      return HttpResponse(bootstrap_image, content_type="image/png")
    else:
      return HttpResponse("No image found for bootstrap field", status=404)
  except ObjectDoesNotExist:
    return HttpResponse("Project or training not found", status=404)
  except ValueError:
    return HttpResponse("No file associated with bootstrap attribute", status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTrainingProgress_view(request):
  try:
    project_id = request.GET.get('project_id')
    project = get_object_or_404(Project, id=project_id)

    training = project.training_set.get()
    
    return Response({
      'progress': training.progress,
    }, status=200)

  except ObjectDoesNotExist:
    return HttpResponse("Project or training not found", status=404)