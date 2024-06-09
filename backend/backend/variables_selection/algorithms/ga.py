
import random
import pandas as pd
pd.options.mode.chained_assignment = None
from random import randint

from typing import List
from bitstring import BitArray

from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.feature_selection import mutual_info_regression
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from sklearn.model_selection import train_test_split 

from variables_selection.algorithms.utils.utils import convert_binary_array_to_variables, get_variables


class Problem:

  def __init__(
    self,
    dataframe,
  ):
    self.initial_binary_array = []
    self.initial_indexes = []

    self.dataframe = dataframe

    full_variables = get_variables(dataframe)
    self.full_variables_length = len(full_variables)



  def convertBinaryArrayToInt(self, binary_array):
    # Converter a lista de inteiros em uma string binária
    binary_string = ''.join(map(str, binary_array))
    # Converter a string binária em um número inteiro
    return int(binary_string, 2)

  def calculateBestIndexes(
    self, info_gain_quantity: int
  ):

    # Suponha que dataframe seja o seu DataFrame
    # Separar as variáveis preditoras da variável alvo
    X = self.dataframe.drop(columns=['alvo'])
    y = self.dataframe['alvo']

    length_variables = len(self.dataframe.columns) - 1
    
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
      self.dataframe.columns.get_loc(var) for var in top_variaveis
    ]

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
      quantity: int
    ):
    population = []
    values = []

    for _ in range(quantity):
      value = int(randint(limit_inferior, limit_superior))
      values.append(value)

    for value in values:
      value_bitstring = BitArray(
        int = value, length = int(self.full_variables_length)
      )
      population.append(value_bitstring)
    
    return population

  def generateBestPopulation(
      self, 
      quantity: int,
      info_gain_quantity: int
    ):

    self.calculateBestIndexes(info_gain_quantity)

    population = []

    for i in range(quantity):
      value = self.convertBinaryArrayToInt(self.initial_binary_array)
      value_bitstring = BitArray(
        int = value + i, length = int(self.full_variables_length)
      )

      population.append(value_bitstring)
    
    return population
  




class GAAlgorithm:

  def __init__(
    self,
    probability_crossover: float, 
    probability_mutation: float, 
    use_limit: bool,
    limit_inferior: int,  
    limit_superior: int,
    limit_generations: int,
    limit_not_improvement: int,
    population: List[BitArray],
    model,
    dataframe: pd.DataFrame,
    interation_function
  ):

    self.probability_crossover = probability_crossover
    self.probability_mutation = probability_mutation
    self.use_limit = use_limit
    self.limit_inferior = limit_inferior
    self.limit_superior = limit_superior
    self.limit_generations = limit_generations
    self.limit_not_improvement = limit_not_improvement
    self.generations = 0

    self.population = population
    self.model = model
    self.dataframe = dataframe
    self.interation_function = interation_function

    self.last_aptidao = []
    self.improvement = False
    self.last_maximum_aptidao = 0
    self.not_improvement_count = 0
    
    self.length = len(population[0].bin)

    self.fitness()

  # Avalia variáveis específicas em relação ao dataframe
  def evaluate_variables(self, dataframe, variables):
    # Separar as características (X) e a variável de destino (y)
    X = dataframe[variables]
    y = dataframe.iloc[:, -1]

    # Normalizar os dados
    scaler = MinMaxScaler()
    X = scaler.fit_transform(X)

    # Dividir o conjunto de dados em treino e teste
    X_train, X_test, y_train, y_test = train_test_split(
      X, y, test_size=0.2, random_state=42
    )

    # Treinar o modelo
    self.model.fit(X_train, y_train)

    # Fazer previsões
    y_pred = self.model.predict(X_test)

    # Avaliar o modelo usando o coeficiente R²
    r2 = r2_score(y_test, y_pred)

    return r2
  
  # Função de avaliação com R2
  def evaluate_function(self, parameters: BitArray):
    
    binary_array = parameters.tobitarray().tolist()

    full_variables = get_variables(self.dataframe)
    variables = convert_binary_array_to_variables(binary_array, full_variables)
    return float(self.evaluate_variables(self.dataframe, variables))

  def fitness(self):
    self.aptidao = []
    for item in self.population:
      self.aptidao.append(self.evaluate_function(item))

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
  
  # ======================================================================

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
    print("Generation:", self.generations)
    print("Aptidão:", self.aptidao)

  def evaluate(self):
    last = max(self.last_aptidao)
    current = max(self.aptidao)
    if(last < current):
      self.improvement = True
      self.not_improvement_count = 0
    else:
      self.improvement = False
      self.not_improvement_count += 1

  def execution(self):
    while (
      self.generations <= self.limit_generations and
      self.not_improvement_count <= self.limit_not_improvement
    ):
      # Função de interação
      self.interation_function(self.generations, self.limit_generations)

      self.generateNewGeneration()
      self.evaluate()

    maximum_aptidao_value = max(self.aptidao)
    maximum_aptidao_index = self.aptidao.index(maximum_aptidao_value)

    solution = self.population[maximum_aptidao_index]

    return solution, maximum_aptidao_value


  def generate_new_database(
    self,
    database_name,
    dataframe: pd.DataFrame,
    solution: BitArray
  ):
    full_variables = get_variables(dataframe)
    binary_array = solution.tobitarray().tolist()
    variables = convert_binary_array_to_variables(binary_array, full_variables)
    new_dataframe = dataframe[variables]

    # Adicionando a última coluna
    last_column_name = list(dataframe.columns)[-1]
    new_dataframe[last_column_name] = dataframe[last_column_name].tolist()
    new_dataframe.to_csv(database_name, index=False)