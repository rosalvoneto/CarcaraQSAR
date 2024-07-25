
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
    
    # Obter o número de variáveis preditoras
    length_variables = len(self.dataframe.columns) - 1

    # Garantir que info_gain_quantity não seja maior que o número de variáveis preditoras
    if info_gain_quantity > length_variables:
      print(f"info_gain_quantity ({info_gain_quantity}) é maior que o número de preditores ({length_variables}). Ajustando para {length_variables}.")
      info_gain_quantity = length_variables

    # Suponha que dataframe seja o seu DataFrame
    # Separar as variáveis preditoras da variável alvo
    X = self.dataframe.iloc[:, :-1]
    y = self.dataframe.iloc[:, -1]


    
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

    for i in range(quantity):
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

    self.ultima_aptidao = []
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
  
  # Função de avaliação
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
    """
    Seleciona os dois cromossomos mais promissores da população atual com base na aptidão.

    Este método utiliza a seleção dos melhores, onde os dois cromossomos com
    as maiores aptidões são escolhidos. A aptidão é calculada previamente pelo
    método 'fitness'.

    Returns:
      List[int]: Uma lista contendo os índices dos dois cromossomos mais promissores.
    """
    # Copia a lista de aptidões para não modificar a original
    aptidao_list = self.aptidao.copy()
    
    # Lista para armazenar os índices dos cromossomos promissores
    promising = []

    # Seleciona os cromossomos com as maiores aptidões
    for i in range(0, 2):
      # Encontra o valor máximo de aptidão na lista copiada
      maximum = max(aptidao_list)
      
      # Encontra o índice do cromossomo com essa aptidão
      max_index = aptidao_list.index(maximum)
      
      # Adiciona o índice à lista de promissores
      promising.append(max_index)
      
      # Remove a aptidão máxima da lista copiada para encontrar o próximo máximo
      aptidao_list.pop(max_index)

    return promising
  

  def crossover(self, population: List[BitArray], max_attempts: int = 10) -> List[BitArray]:
    """
    Realiza o crossover entre os cromossomos mais promissores da população
    com uma determinada probabilidade.

    Args:
      population (List[BitArray]): A população atual de cromossomos.
      max_attempts (int): O número máximo de tentativas para gerar cromossomos válidos dentro dos limites.

    Returns:
      List[BitArray]: A nova população de cromossomos após o crossover.
    """
    promising_indexes = self.selection()
    
    # Calcular a probabilidade de crossover
    if random.random() <= self.probability_crossover:
      ponto_de_corte = randint(1, self.length - 1)
      crossoved_cromossomos = []

      # Fazer o fatiamento e realizar o crossover
      for i in range(2):
        attempts = 0
        while attempts < max_attempts:
          new = (population[promising_indexes[i]][:ponto_de_corte] + 
                  population[promising_indexes[(i + 1) % 2]][ponto_de_corte:])

          if not self.use_limit or (self.limit_inferior <= new.int <= self.limit_superior):
            crossoved_cromossomos.append(new)
            break

          attempts += 1
        
        # Se não conseguir um cromossomo válido após as tentativas, usa o cromossomo original
        if attempts == max_attempts:
          crossoved_cromossomos.append(population[promising_indexes[i]])
      
      return crossoved_cromossomos
    else:
      # Retorna os próprios cromossomos da população
      return [population[promising_indexes[0]], population[promising_indexes[1]]]


  def mutation(self, population: List[BitArray], max_attempts: int = 10):
    """
    Faz a mutação dos cromossomos na população com uma determinada probabilidade.
    
    Args:
      population (List[BitArray]): A população atual de cromossomos.
      max_attempts (int): O número máximo de tentativas para garantir que um cromossomo mutado
                          esteja dentro dos limites, se os limites forem usados.
    
    Returns:
      List[BitArray]: A nova população de cromossomos após a mutação.
    """
    mutated_cromossomos = []

    # Todos os cromossomos passam por a etapa de mutação
    for cromossomo in population:
      attempts = 0
      while attempts < max_attempts:
        bit_string = cromossomo.bin
        
        # Calcular a probabilidade de mutação para cada bit
        for position in range(self.length):
          if random.random() <= self.probability_mutation:
            # Realiza a mutação invertendo o bit
            list_bits = list(bit_string)
            list_bits[position] = '1' if list_bits[position] == '0' else '0'
            bit_string = "".join(list_bits)
        
        new_cromossomo = BitArray(bin=bit_string)

        if not self.use_limit or (self.limit_inferior <= new_cromossomo.int <= self.limit_superior):
          mutated_cromossomos.append(new_cromossomo)
          break
        
        attempts += 1

      # Se não encontrar um valor dentro dos limites após as tentativas, mantém o cromossomo original
      if attempts == max_attempts:
          mutated_cromossomos.append(cromossomo)

    return mutated_cromossomos
  
  # ======================================================================

  def generate_new_generation(self):
    """
    Gera uma nova geração de cromossomos aplicando crossover e mutação,
    garantindo que a melhor aptidão seja mantida (elitismo).
    """
    # Encontrar o melhor cromossomo atual
    best_aptidao = max(self.aptidao)
    best_index = self.aptidao.index(best_aptidao)
    best_chromosome = self.population[best_index]

    print("")
    print(f"Melhor aptidão até o momento: {max(self.aptidao)}")
    print(f"Índice da melhor aptidão até o momento: {best_index}")

    news = []
    for _ in range(len(self.population) // 2):
      # Realiza o crossover nos cromossomos da população atual
      crossoved_population = self.crossover(self.population)
      
      # Realiza a mutação nos cromossomos cruzados
      mutated_population = self.mutation(crossoved_population)

      # Adiciona os cromossomos mutados à nova geração
      news.extend(mutated_population)

    # Atualiza a população com a nova geração
    self.population = news

    # Atualiza a aptidao da geração anterior
    self.ultima_aptidao = self.aptidao
    # Atualiza número de gerações
    self.generations += 1

    # Recalcula a aptidão para a nova geração
    self.fitness()

    # Substituir o pior cromossomo da nova geração pelo melhor da geração anterior
    worst_index = self.aptidao.index(min(self.aptidao))

    self.population[worst_index] = best_chromosome
    self.aptidao[worst_index] = best_aptidao

    print(f"Geração: {self.generations}")
    print(f"Aptidão {self.aptidao[worst_index]} continuará na geração atual...")
    print(f"Aptidão: {self.aptidao}")


  def evaluate(self):
    """
    Verifica se houve melhora na aptidão.
    """
    maximum_ultima_aptidao = max(self.ultima_aptidao)
    maximum_current_aptidao = max(self.aptidao)

    if maximum_ultima_aptidao < maximum_current_aptidao:
      self.improvement = True
      self.not_improvement_count = 0
      print(f"Melhoria detectada: {maximum_ultima_aptidao} -> {maximum_current_aptidao}")
    else:
      self.improvement = False
      self.not_improvement_count += 1
      print(f"Sem melhoria: {maximum_ultima_aptidao} >= {maximum_current_aptidao}")
    
    print(f"Contagem de gerações sem melhoria: {self.not_improvement_count}")


  def execution(self):
    while (
      self.generations <= self.limit_generations and
      self.not_improvement_count <= self.limit_not_improvement
    ):
      # Função de interação
      self.interation_function(self.generations, self.limit_generations)

      self.generate_new_generation()
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