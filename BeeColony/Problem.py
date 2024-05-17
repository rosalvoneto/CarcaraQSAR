from bitstring import BitArray 
from random import randint

import pandas as pd
from sklearn.feature_selection import mutual_info_regression

class Problem:

  def __init__(self):
    self.initial_binary_array = []
    self.initial_indexes = []

  def convertBinaryArrayToInt(self, binary_array):
    # Converter a lista de inteiros em uma string binária
    binary_string = ''.join(map(str, binary_array))
    # Converter a string binária em um número inteiro
    return int(binary_string, 2)

  def calculateBestIndexes(self, dataframe: pd.DataFrame):

    # Suponha que dataframe seja o seu DataFrame
    # Separar as variáveis preditoras da variável alvo
    X = dataframe.drop(columns=['alvo'])
    y = dataframe['alvo']

    length_variables = len(dataframe.columns) - 1
    
    # Calcular a Information Gain para cada variável
    infogain = mutual_info_regression(X, y)

    # Criar um DataFrame com os resultados do Information Gain
    infogain_df = pd.DataFrame({'variavel': X.columns, 'infogain': infogain})

    # Ordenar o DataFrame pelo valor de Information Gain em ordem decrescente
    infogain_df = infogain_df.sort_values(by='infogain', ascending=False)

    # Selecionar os nomes das 30 variáveis com maior Information Gain
    top_30_variaveis = infogain_df.head(30)['variavel']

    # Obter os índices dessas variáveis no DataFrame original
    top_30_indices = [
      dataframe.columns.get_loc(var) for var in top_30_variaveis
    ]
    print("Melhores 30 variáveis:")
    print(top_30_indices)

    # Inicializar uma lista de 0s
    binarry_array = [0] * length_variables

    # Atualizar os índices presentes em top_30_indices para 1
    for index in top_30_indices:
      if(type(index) == int):
        binarry_array[index] = 1

    self.initial_binary_array = binarry_array
    self.initial_indexes = top_30_indices

  def generateInitPopulation(
      self, 
      limit_inferior: int, 
      limit_superior: int, 
      bitstring_length: int, 
      quantity: int
    ):
    population = []
    values = []

    for _ in range(quantity):
      value = int(randint(limit_inferior, limit_superior))
      values.append(value)

    for value in values:
      value_bitstring = BitArray(int = value, length = int(bitstring_length))
      population.append(value_bitstring)
    
    return population

  def generateBestPopulation(
      self, 
      dataframe: pd.DataFrame,
      bitstring_length: int, 
      quantity: int
    ):

    self.calculateBestIndexes(dataframe)

    population = []

    for i in range(quantity):
      value = self.convertBinaryArrayToInt(self.initial_binary_array)
      value_bitstring = BitArray(
        int = value + i, length = int(bitstring_length)
      )
      print(f'Quantidade de variáveis no cromossomo {i}:')
      print(value_bitstring.count(1))

      population.append(value_bitstring)
    
    return population