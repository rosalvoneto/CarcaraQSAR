from typing import Callable, List
from bitstring import BitArray 
from random import randint
import random

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

  def calculateBestIndexes(
    self, dataframe: pd.DataFrame, info_gain_quantity: int
  ):

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

    # Selecionar os nomes das melhores variáveis com maior Information Gain
    top_variaveis = infogain_df.head(info_gain_quantity)['variavel']

    # Obter os índices dessas variáveis no DataFrame original
    top_indices = [
      dataframe.columns.get_loc(var) for var in top_variaveis
    ]
    print("Melhores variáveis:")
    print(top_indices)

    # Inicializar uma lista de 0s
    binarry_array = [0] * length_variables

    # Atualizar os índices presentes em top_indices para 1
    for index in top_indices:
      if(type(index) == int):
        binarry_array[index] = 1

    self.initial_binary_array = binarry_array
    self.initial_indexes = top_indices

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
      quantity: int,
      info_gain_quantity: int
    ):

    self.calculateBestIndexes(dataframe, info_gain_quantity)

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
  

class Algorithm:
  def __init__(
      self,
      function: Callable[[BitArray], float],
      probability_crossover: float, 
      probability_mutation: float, 
      population: List[BitArray],
      use_limit: bool,
      limit_inferior: int,  
      limit_superior: int
    ):
    self.function = function

    self.probability_crossover = probability_crossover
    self.probability_mutation = probability_mutation
    self.population = population
    self.generations = 0

    self.fitness()

    self.last_aptidao = []
    self.improvement = False
    self.last_maximum_aptidao = 0
    self.count_not_improvement = 0

    self.limit_inferior = limit_inferior
    self.limit_superior = limit_superior
    self.use_limit = use_limit

    self.length = len(population[0].bin)
    
  # Os menores valores de f(x) devem ter maiores aptidões
  def fitness(self):
    self.aptidao = []
    for item in self.population:
      self.aptidao.append(self.function(item))

  """
  # Divisão da probabilidade de seleção (equação do slide 32)
  def probabilitySelection(self):
    soma = 0
    for value in self.aptidao:
      soma += value
    
    self.probabilities = []
    for value in self.aptidao:
      self.probabilities.append(value / soma)
  """

  def selection(self):
    aptidao_list = self.aptidao.copy()
    promising = []

    for index in range(0, 2):
      maximus = max(aptidao_list)
      promising.append(aptidao_list.index(maximus))
      aptidao_list.pop(aptidao_list.index(maximus))

    return promising

  # Faz o crossover com a probabilidade X de haver algum crossover
  # O ponto de corte do crossover pode ser aleatório
  def crossover(self, population: List[BitArray]):
    # Pegar os dois cromossomos mais promissores
    promising_indexes = self.selection()

    # Calcular a probabilidade
    value = random.random()

    if value <= self.probability_crossover:
      # 0|0|1|0|0
      ponto_de_corte = randint(1, self.length - 1)
      crossoved_cromossomos = []

      # Fazer o fatiamento
      for i in range(0, 2):
        new = population[promising_indexes[i]][:ponto_de_corte] + population[promising_indexes[(i + 1) % 2]][ponto_de_corte:]

        if(self.use_limit):
          while(self.limit_inferior > new.int > self.limit_superior):
            new = population[promising_indexes[i]][:ponto_de_corte] + population[promising_indexes[(i + 1) % 2]][ponto_de_corte:]

        crossoved_cromossomos.append(new)

      return crossoved_cromossomos
      
    return [population[promising_indexes[0]], population[promising_indexes[1]]]

  # Faz a mutação com a probabilidade X de algum dos bits terem mutação
  def mutation(self, population: List[BitArray]):
    mutated_cromossomos = []
    for cromossomo in population:
      while True:
        bit_string = cromossomo.bin
        
        # Calcular a probabilidade
        for position in range(0, self.length):
          value = random.random()

          if value <= self.probability_mutation:
            # Mutação
            list_bits = list(bit_string)
            if list_bits[position] == '0':
              list_bits[position] = '1'
            else:
              list_bits[position] = '0'
            bit_string = "".join(list_bits)
        
        new = BitArray(bin = bit_string)

        if(self.use_limit):
          if(self.limit_inferior <= new.int <= self.limit_superior):
            break
        else:
          break
        
      mutated_cromossomos.append(new)

    return mutated_cromossomos
  
  def generateNewGeneration(self):
    news = []
    for i in range(0, 2):
      crossoved_population = self.crossover(self.population)
      mutated_population = self.mutation(crossoved_population)

      news.append(mutated_population)
    newPopulation = (news[0] + news[1])

    self.last_aptidao = self.aptidao

    self.population = newPopulation
    self.generations += 1

    self.fitness()

    print("")
    print("Generation", self.generations)
    print(self.aptidao)

  def evaluate(self):
    last = max(self.last_aptidao)
    current = max(self.aptidao)
    if(last < current):
      self.improvement = True
      self.count_not_improvement = 0
    else:
      self.improvement = False
      self.count_not_improvement += 1
    

  def execution(self, limit_generations: int, limit_not_improvement: int):
    while (
      self.generations <= limit_generations and
      self.count_not_improvement <= limit_not_improvement
    ):
      self.generateNewGeneration()
      self.evaluate()
