
import os
from django.core.files import File

from variables_selection.models import VariablesSelection

def get_variables_settings(project):
  try:
    variables_selection = project.variablesselection_set.get()

    print("ROWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW")
    print(variables_selection.rows_to_remove)

    return {
      'removeConstantVariables': variables_selection.remove_constant_variables,
      'variablesToRemove': variables_selection.variables_to_remove,
      'algorithm': variables_selection.algorithm,
      'algorithmParameters': variables_selection.algorithm_parameters,
      'rowsToRemove': variables_selection.rows_to_remove,
    }

  except VariablesSelection.DoesNotExist:
    variables_selection = VariablesSelection.objects.create(
      remove_constant_variables=False,
      variables_to_remove=[],
      algorithm="NÃO APLICAR",
      algorithm_parameters={},
      rows_to_remove=[],
      project=project,
    )

    return {
      'removeConstantVariables': variables_selection.remove_constant_variables,
      'variablesToRemove': variables_selection.variables_to_remove,
      'algorithm': variables_selection.algorithm,
      'algorithmParameters': variables_selection.algorithm_parameters,
      'rowsToRemove': variables_selection.rows_to_remove,
    }

def update_database(database, dataframe):
  # Atualizar Database principal com o novo arquivo
  # Pegar dados de linhas e colunas
  rows, columns = dataframe.shape

  # Transformar o dataframe em um arquivo
  file_path = "new_database.csv"
  dataframe.to_csv(file_path, index=False)

  with open(file_path, 'rb') as new_file:
    django_file = File(new_file)

    database.update_file(
      file=django_file,
      lines=rows,
      columns=columns
    )

  os.remove(file_path)

  return database
  
def is_convertible_to_int_list(string):
  # Remove espaços em branco desnecessários
  string = string.strip()
  # Tentar dividir a string e converter cada parte em um inteiro
  try:
    # Dividir a string por vírgulas
    parts = string.split(',')
    # Converter cada parte em um inteiro
    int_list = [int(part.strip()) for part in parts]
    
    return True, int_list
  except ValueError:
    # Se ocorrer um ValueError, a conversão falhou
    return False, []