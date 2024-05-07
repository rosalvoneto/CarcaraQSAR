
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