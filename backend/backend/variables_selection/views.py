
import os
import json
import pandas as pd
from io import StringIO

from django.shortcuts import get_object_or_404
from django.core.files import File

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from sklearn.ensemble import RandomForestRegressor
from sklearn.svm import SVR

from database.models import Database
from project_management.models import Project
from variables_selection.models import VariablesSelection
from variables_selection.utils import get_variables_settings, is_convertible_to_int_list
from variables_selection.algorithms.abc import ABCAlgorithm
from variables_selection.algorithms.ga import GAAlgorithm, Problem
from variables_selection.algorithms.BFS import Graph
from variables_selection.tasks import tarefa_com_delay, callback_sucesso, callback_falha

from celery import shared_task
from celery.signals import task_success, task_failure

from backend.celery import app


# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getVariablesSettings_view(request):

  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  response = get_variables_settings(project)
  return Response(response, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def setVariablesSettings_view(request):

  project_id = request.POST.get('project_id')
  algorithm = request.POST.get('algorithm')
  algorithm_parameters = request.POST.get('algorithm_parameters')
  algorithm_parameters = json.loads(algorithm_parameters)
  print(algorithm_parameters)

  list_of_variables = request.POST.get('list_of_variables')
  list_of_variables = json.loads(list_of_variables)
  remove_constant_variables = request.POST.get('remove_constant_variables')
  if(remove_constant_variables == "true"):
    remove_constant_variables = True
  else:
    remove_constant_variables = False

  indexes = request.POST.get('rows_to_remove')
  is_convertible, rows_to_remove = is_convertible_to_int_list(indexes)

  project = get_object_or_404(Project, id=project_id)
  try:
    variables_selection = project.variablesselection_set.get()
    variables_selection.update(
      remove_constant_variables=remove_constant_variables,
      variables_to_remove=list_of_variables,
      algorithm=algorithm,
      algorithm_parameters=algorithm_parameters,
      rows_to_remove=rows_to_remove,
    )

    return Response({
      'message': 'Seleção de variáveis alterada!'
    }, status=200)

  except VariablesSelection.DoesNotExist:
    variables_selection = VariablesSelection.objects.create(
      remove_constant_variables=remove_constant_variables,
      variables_to_remove=list_of_variables,
      algorithm=algorithm,
      algorithm_parameters=algorithm_parameters,
      rows_to_remove=rows_to_remove,
      project=project,
    )

    return Response({
      'message': 'Seleção de variáveis criada!'
    }, status=200)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def removeRows_view(request):

  project_id = request.POST.get('project_id')
  project = get_object_or_404(Project, id=project_id)

  database = project.get_database()

  variables_selection = project.variablesselection_set.get()
  rows_to_remove = variables_selection.rows_to_remove

  if(len(rows_to_remove) == 0):
    return Response({
      'message': 'Usuário não quis remover linhas do Database!',
    }, status=200)
  
  if(database):
    if(database.file):

      # Cria um DataFrame do Pandas com o conteúdo do arquivo
      file_content = database.file.read().decode('utf-8')
      dataframe = pd.read_csv(
        StringIO(file_content), 
        sep=database.file_separator
      )

      # Remoção de linhas
      dataframe = dataframe.drop(rows_to_remove).reset_index(drop=True)

      database.create_database(
        path="Database_with_dropped_lines.csv",
        description="Database após a remoção de linhas",
        dataframe=dataframe
      )

      return Response({
        'message': 'Remoção bem sucedida de linhas do Database!',
      }, status=200)

  return Response({
    'message': 'Database principal não encontrado!',
  }, status=200)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def removeConstantVariables_view(request):

  project_id = request.POST.get('project_id')

  project = get_object_or_404(Project, id=project_id)
  database = project.get_database()

  if(database):
    if(database.file):
      # Cria um DataFrame do Pandas com o conteúdo do arquivo
      file_content = database.file.read().decode('utf-8')
      dataframe = pd.read_csv(
        StringIO(file_content), 
        sep=database.file_separator
      )

      # Remoção de colunas constantes
      response = get_variables_settings(project)
      to_delete = response["removeConstantVariables"]

      if(to_delete):

        # Identificar colunas onde todos os valores são iguais
        columns_to_drop = [column for column in dataframe.columns if dataframe[column].nunique() == 1]
        # Remover essas colunas do DataFrame
        dataframe = dataframe.drop(columns=columns_to_drop)

        # Criar novo Database
        database.create_database(
          path="Database_without_constant_variables.csv",
          description="Database após a remoção de variáveis constantes",
          dataframe=dataframe
        )

        return Response({
          'message': 'Remoção de colunas constantes do Database!',
        }, status=200)
      else:
        return Response({
          'message': 'Colunas constantes não removidas!',
        }, status=200)

  return Response({
    'message': 'Database principal não encontrado!',
  }, status=200)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def removeVariables_view(request):

  project_id = request.POST.get('project_id')
  project = get_object_or_404(Project, id=project_id)
  database = project.get_database()

  if(database):
    if(database.file):
      # Cria um DataFrame do Pandas com o conteúdo do arquivo
      file_content = database.file.read().decode('utf-8')
      dataframe = pd.read_csv(
        StringIO(file_content), 
        sep=database.file_separator
      )

      # Remoção de variáveis do usuário
      response = get_variables_settings(project)
      variables_to_remove = response["variablesToRemove"]

      if(len(variables_to_remove)):

        # Verificar quais colunas de 'variables_to_remove'
        # estão realmente no DataFrame
        columns_to_remove = [
          column for column in variables_to_remove if column in dataframe.columns
        ]
        # Remover as colunas confirmadas
        if columns_to_remove:
          dataframe = dataframe.drop(columns=columns_to_remove)

        # Criar novo Database
        database.create_database(
          path="Database_without_choosen_variables.csv",
          description="Database após a remoção de variáveis pelo usuário",
          dataframe=dataframe
        )

        return Response({
          'message': 'Remoção de variáveis escolhidas pelo usuário!',
        }, status=200)
      else:
        return Response({
          'message': 'Nenhuma variável para remover pelo usuário!',
        }, status=200)
    
  return Response({
    'message': 'Database principal não encontrado!',
  }, status=200)

@app.task
def execute_after_make_selection(response):
  print("Tarefa finalizada!")
  print(response)

@app.task
def make_selection(project_id):

  project = get_object_or_404(Project, id=project_id)
  database = project.get_database()
  variables_selection = project.variablesselection_set.get()

  def update_selection_progress(actual, maximum):
    nonlocal variables_selection
    variables_selection.set_algorithm_progress(
      actual,
      maximum
    )

  # Índices para remover
  # indexes = [77, 81, 84, 92, 98]

  try:
    if(database):
      if(database.file):
        response = get_variables_settings(project)
        parameters = response["algorithmParameters"]
        algorithm = response["algorithm"]

        if(algorithm == "NÃO APLICAR"):
          return Response({
            'message': 'Seleção de variáveis não aplicada!',
          }, status=200)

        file_content = database.file.read().decode('utf-8')

        # Leitura da base completa
        base = pd.read_csv(
          StringIO(file_content), 
          sep=database.file_separator
        )
        print(base)

        # Parâmetros ABC
        # model: RandomForestRegressor(n_estimators=100, random_state=42)
        # Interações: 100
        # Abelhas: 20
        # Limite sem melhoria: 100
        # Ganho de informação: 50
        # max_mutations = 50

        # Parâmetros GA
        # Quantidade da população: 5
        # Ganho de informação: 50
        # Probabilidade de crossover: 0.25
        # Probabilidade de mutação: 0.005
        # Limite de gerações: 300
        # Limite sem melhoria: 30
        # model:
        # max_features = math.ceil(math.log2(len(variables)))
        # if(max_features == 0):
        #   max_features = 1
        # model = RandomForestRegressor(
        #   n_estimators=50,
        #   max_features=max_features
        # )

        # Parâmetros BFS
        # R2: 0.99
        # Limite sem melhoria: 5
        # model:
        # max_features = int(math.ceil(math.log2(len(variables))))
        # if(max_features == 0):
        #     max_features = 1
        # model = RandomForestRegressor(
        #     n_estimators=50,
        #     max_features=max_features
        # )



        # Variação dos testes:
        # 1-Ganho de informação = 30
        # 2-Ajustar modelos para usar especificações anteriores

        # Cria um modelo
        model = RandomForestRegressor(
          n_estimators=200,
          random_state=42,
          max_features="log2",
        )

        # Faz a seleção de variáveis
        print("SELEÇÃO COM O ALGORITMO")
        if(algorithm == "Colônia de abelhas"):
          abc = ABCAlgorithm(
            bees=parameters["bees"],
            maximum_iterations=parameters["maximum_iterations"],
            limit_not_improvement=parameters["limit_not_improvement"],
            info_gain_quantity=parameters["info_gain_quantity"],
            interation_function=update_selection_progress
          )
          best_subset, best_r2 = abc.execution(
            base, 
            model
          )
          print("Melhor R2:", best_r2)

          abc.generate_new_database(
            "base_best.csv",
            base, 
            best_subset
          )

        elif(algorithm == "Algoritmo genético"):
          problem = Problem(base)
          population = problem.generateBestPopulation(
            quantity=parameters['population_quantity'],
            info_gain_quantity=parameters['info_gain_quantity']
          )

          ga = GAAlgorithm(
            probability_crossover=parameters['probability_crossover'],
            probability_mutation=parameters['probability_mutation'],
            use_limit=False,
            limit_inferior=0,
            limit_superior=10,
            limit_generations=parameters['limit_generations'],
            limit_not_improvement=parameters['limit_not_improvement'],
            population=population,
            model=model,
            dataframe=base,
            interation_function=update_selection_progress
          )

          best_subset, best_R2 = ga.execution()
          print("Melhor R2:", best_R2)

          ga.generate_new_database(
            "base_compressed.csv",
            base,
            best_subset
          )
        
        if(algorithm != "Colônia de abelhas"):

          # Leitura da base comprimida
          base_compressed = pd.read_csv("base_compressed.csv")
          
          # Criar um modelo
          model = RandomForestRegressor(
            n_estimators=50,
            random_state=42,
            max_features="log2"
          )
          graph = Graph(
            dataframe=base_compressed,
            r2_condition=parameters['r2_condition_BFS'],
            limit_not_improvement=parameters['limit_not_improvement_BFS'],
            interation_function=update_selection_progress
          )

          # Busca pela melhor variável
          print("BUSCA PELA MELHOR VARIÁVEL")
          best_variable, best_R2 = graph.evaluate_best_variable()
          print("Melhor R2:", best_R2)

          # Busca gulosa
          print('BUSCA GULOSA')
          best_node, best_R2 = graph.execution(best_variable)
          print("Melhor R2:", best_R2)

        # Ler CSV do melhor conjunto de variáveis
        dataframe = pd.read_csv("base_best.csv")

        # Criar novo Database
        database.create_database(
          path="Database_with_algorithm_execution.csv",
          description="Database após a execução do algoritmo",
          dataframe=dataframe
        )

        # Deletar os arquivos temporários
        try:
          os.remove("base_compressed.csv")
          os.remove("best_variable.csv")
          os.remove("Valores R2.csv")
          os.remove("base_best.csv")
        except Exception as error:
          print(error)

        # Zerar o progresso
        variables_selection.selection_progress = None
        variables_selection.save()

        return {
          'message': 'Seleção de variáveis aplicada!',
        }
    
  except Exception as error:
    print("A seleção retornou o seguinte erro:")
    print(error, "\n")

    return {
      'message': 'Erro na seleção',
      'error': str(error),
    }

  return {
    'message': 'Database principal não encontrado!',
  }


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def makeSelection_view(request):

  project_id = request.POST.get('project_id')

  """
  resultado = make_selection.apply_async(
    args=[project_id], 
    link=execute_after_make_selection.s()
  )
  resposta = {"message": "Tarefa iniciada com sucesso."}
  return Response(resposta, status=200)

  """

  response = make_selection(project_id)
  return Response(response, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getSelectionProgress_view(request):

  project_id = request.GET.get('project_id')
  project = get_object_or_404(Project, id=project_id)
  variables_selection = project.variablesselection_set.get()

  algorithm_progress = variables_selection.algorithm_progress

  return Response({
    'progress': algorithm_progress,
  }, status=200)