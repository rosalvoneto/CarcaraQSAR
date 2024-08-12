import pandas as pd
import json

import os
import ast

from django.core.exceptions import ObjectDoesNotExist

from django.core.files import File

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404

from .utils import bootstrap, cross_validation, importance, leave_one_out, y_scrambling

from project_management.models import Project
from .models import Algorithm, Training

from celery import shared_task
from celery.result import AsyncResult
from celery.signals import task_success, task_failure

from backend.celery import app

  
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
      'withFullSet': training.with_full_set,
      'algorithmProgress': training.progress,
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
      progress=None
    )

    return Response({
      'algorithm': training.algorithm.name,
      'parameters': training.algorithm.parameters,
      'trained': training.trained,
      'withFullSet': training.with_full_set,
      'algorithmProgress': training.progress,
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
  
@shared_task(bind=True)
def make_training(self, project_id):

  print("Treinando...")
  project = get_object_or_404(Project, id=project_id)

  training = project.training_set.get()
  database = project.get_database()

  try:
    if(database):

      print("FILE:", database.file)
      data = pd.read_csv(f"media/{database.file}", sep=database.file_separator)
      rows, columns = data.shape
      print(f"{rows} linhas e {columns} colunas")
      
      print("Retirando valores NaN do Dataset...")
      data = data.dropna().reset_index(drop=True)

      rows, columns = data.shape
      print(f"{rows} linhas e {columns} colunas")

      training = project.training_set.get()

      if(database.normalization):
        print("Normalização:", database.normalization)

        # Execuções dos algoritmos e salvamento dos gráficos
        
        print("Calculando leave one out:")
        leave_one_out(
          project_id,
          data,
          database.normalization.name,
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
          database.normalization.name,
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
          training.algorithm.name,
          training.algorithm.parameters
        )
        file_name = 'y_scrambling_temporary.png'
        with open(file_name, 'rb') as image:
          training.y_scrambling.save('y_scrambling.png', File(image), save=True)
        os.remove(file_name)

        # A partir daqui surge problema com o Dataset do CSV (com duas linhas)
        print("Calculando Bootstrap:")
        for index in range(0, 10):
          bootstrap(
            project_id,
            data,
            training.algorithm.name,
            training.algorithm.parameters,
            index
          )

        file_name = 'bootstrap_temporary.png'
        with open(file_name, 'rb') as image:
          training.bootstrap.save('bootstrap.png', File(image), save=True)
        os.remove(file_name)

        print("Calculando Importance:")
        importance(
          project_id,
          data,
          training.algorithm.name,
          training.algorithm.parameters
        )
        file_name = 'importance_temporary.png'
        with open(file_name, 'rb') as image:
          training.importance.save('importance.png', File(image), save=True)
        os.remove(file_name)

        # Atualizando progresso
        training.set_progress(
          100, 
          100,
          5,
          5
        )
        training.set_execution_type("Finished")
        # Atualiza treinamento para concluído
        training.trained = True
        # Zerar o progresso
        training.set_progress_none()
        project.save()

        return {
          'message': 'Treinamento aplicado!',
        }
      
      else:

        # Zerar o progresso
        training.set_progress_none()
        project.save()

        return {
          'message': 'Não foi encontrada Normalização!',
          'error': 'Não foi encontrada Normalização!',
        }
    
    # Zerar o progresso
    training.set_progress_none()
    project.save()

    return {
      'message': 'Não foi encontrado Database!',
      'error': 'Não foi encontrado Database!'
    }

  except Training.DoesNotExist:

    # Zerar o progresso
    training.set_progress_none()
    project.save()

    return {
      'message': 'Configurações de treinamento não foram encontradas!',
      'error': 'Configurações de treinamento não encontradas!'
    }
  
  except Exception as error:
    
    print(error)

    # Zerar o progresso
    training.set_progress_none()
    project.save()
    
    return {
      'message': 'Erro no treinamento',
      'error': str(error)
    }


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def makeTraining_view(request):

  project_id = request.POST.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  training = project.training_set.get()

  if not project_id:
    return Response({
      'error': 'O ID do projeto é requerido!'
    }, status=400)

  task = make_training.apply_async(args=[project_id])

  training.set_task_id(task.id)
  project.save()

  return Response({
    'message': 'Treinamento em andamento!',
    'taskId': task.id,
  }, status=202)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cancelTraining_view(request):

  project_id = request.POST.get('project_id')
  project = get_object_or_404(Project, id=project_id)
  
  training = project.training_set.get()

  task_id = training.task_id

  task = AsyncResult(task_id)
  task.revoke(terminate=True)

  # Atualizar progresso
  training.set_progress_none()
  project.save()

  return Response({
    'status': 'Cancelamento do treinamento!'
  })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def checkTrainingStatus_view(request):

  project_id = request.POST.get('project_id')
  project = get_object_or_404(Project, id=project_id)
  
  training = project.training_set.get()

  task_id = training.task_id
  task = AsyncResult(task_id)
  response = {
    'state': task.state,
    'status': 'Unknown',
    'result': None
  }
  
  try:
    resultDictionary = ast.literal_eval(str(task.result))
  except:
    resultDictionary = {}

  if task.state != 'PENDING':
    if 'error' in task.result:
      response['state'] = 'ERROR'
      response['status'] = 'Houve um erro na execução da tarefa!'
      response['result'] = resultDictionary
  elif task.state == 'PENDING':
    response['status'] = 'A tarefa está em execução!'
  elif task.state == 'SUCCESS':
    response['result'] = resultDictionary
    response['status'] = 'A tarefa foi completada com sucesso!'
  elif task.state == 'FAILURE':
    response['status'] = 'Houve uma falha na execução da tarefa!'
    response['result'] = resultDictionary
  else:
    response['status'] = 'A tarefa está em estado desconhecido!'
  
  return Response(response)



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
  
def getBootstrapDetails_view(request):

  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  training = project.training_set.get()
  bootstrap_instances = training.bootstrapvalues_set.all()
  length = len(bootstrap_instances)

  response = {
    "molecules": [],
    "R_values": [],
    "R2_values": [],
  }

  for i in range(length):
    response['molecules'].append(bootstrap_instances[i].molecules)
    response['R_values'].append(bootstrap_instances[i].R_value)
    response['R2_values'].append(bootstrap_instances[i].R2_value)
  
  return JsonResponse(response, status=200, safe=False)
  
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTrainingProgress_view(request):
  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  training = project.training_set.get()
  
  return Response({
    'progress': training.progress,
    'executionType': training.execution_type,
  }, status=200)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def setTrainingProgress_view(request):

  project_id = request.POST.get('project_id')
  progress_value = request.POST.get('progress_value')
  maximum_value = request.POST.get('maximum_value')

  project = get_object_or_404(Project, id=project_id)
  training = project.training_set.get()

  training.set_progress(progress_value, maximum_value)
  project.save()
  
  return Response({
    'progress': training.progress,
  }, status=200)
