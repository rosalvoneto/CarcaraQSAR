
import pandas as pd

def convert_variables_to_binary_array(full_variables, choosen_variables):
  array = []
  for variable in full_variables:
    if(variable in choosen_variables):
      array.append(1)
    else:
      array.append(0)
  
  return array

def convert_binary_array_to_variables(binary_array, full_variables):

  choosen_variables = []
  for i in range(len(full_variables)):
    if(binary_array[i] == 1):
      choosen_variables.append(full_variables[i])

  return choosen_variables

def get_variables(dataframe):
  variables = list(dataframe.columns)
  variables.pop()
  return variables

def generate_new_database(
    database_name,
    df: pd.DataFrame, 
    variables_indexes
  ):
  selected_columns = df.columns[variables_indexes]
  new_dataframe = df[selected_columns]

  # Adicionando a última coluna do Database original
  last_column_name = list(df.columns)[-1]
  new_dataframe[last_column_name] = df[last_column_name].tolist()
  print("Quantidade de colunas do novo Dataframe:", new_dataframe.shape[1])

  new_dataframe.to_csv(database_name, index=False)
