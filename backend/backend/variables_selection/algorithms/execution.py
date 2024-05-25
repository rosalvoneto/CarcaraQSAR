import math
import pandas as pd

from sklearn.discriminant_analysis import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

from bitstring import BitArray
from variables_selection.algorithms.ga import Problem, Algorithm

from variables_selection.algorithms.utils.utils import convert_binary_array_to_variables, get_variables

class AGExecution():

  def __init__(
    self, 
    dataframe,
    population_quantity,
    info_gain_quantity,
    probability_crossover,
    probability_mutation,
    use_limit,
    limit_inferior,
    limit_superior,
    limit_generations,
    limit_not_improvement
  ):
    self.dataframe = dataframe

    full_variables = get_variables(dataframe)
    self.full_variables_length = len(full_variables)

    self.population_quantity = population_quantity
    self.info_gain_quantity = info_gain_quantity
    self.probability_crossover = probability_crossover
    self.probability_mutation = probability_mutation
    self.use_limit = use_limit
    self.limit_inferior = limit_inferior
    self.limit_superior = limit_superior
    self.limit_generations = limit_generations
    self.limit_not_improvement = limit_not_improvement

  def evaluate_variables(self, dataframe, variables):

    # Separar as características (X) e a variável de destino (y)
    X = dataframe[variables]
    y = dataframe.iloc[:, -1]

    # Normalizar os dados
    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    # Dividir o conjunto de dados em treino e teste
    X_train, X_test, y_train, y_test = train_test_split(
      X, y, test_size=0.2, random_state=42
    )

    # Criar o modelo
    max_features = math.ceil(math.log2(len(variables)))
    if(max_features == 0):
      max_features = 1

    model = RandomForestRegressor(
      n_estimators=50,
      max_features=max_features
    )

    # Treinar o modelo
    model.fit(X_train, y_train)

    # Fazer previsões
    y_pred = model.predict(X_test)

    # Avaliar o modelo usando o coeficiente R²
    r2 = r2_score(y_test, y_pred)
    # Avaliar o modelo usando o coeficiente Mean Square Error
    mse = mean_squared_error(y_test, y_pred)
    # Avaliar o modelo usando o coeficiente Erro Médio Absoluto (MAE)
    mae = mean_absolute_error(y_test, y_pred)

    return r2, mse, mae

  def evaluate_R2(self, parameters: BitArray):
    binary_array = parameters.tobitarray().tolist()

    full_variables = get_variables(self.dataframe)
    variables = convert_binary_array_to_variables(binary_array, full_variables)
    return float(self.evaluate_variables(self.dataframe, variables)[0])

  def AG_execution(self):
    # Definindo o problema
    problem = Problem()
    # Definindo a população
    population = problem.generateBestPopulation(
      self.dataframe,
      self.full_variables_length,
      self.population_quantity,
      self.info_gain_quantity
    )
    # Definindo o algoritmo
    algorithm = Algorithm(
      self.evaluate_R2,
      self.probability_crossover, 
      self.probability_mutation, 
      population,
      self.use_limit,
      self.limit_inferior,
      self.limit_superior,
    )
    algorithm.execution(
      limit_generations = self.limit_generations, 
      limit_not_improvement = self.limit_not_improvement
    )
    
    maximum_aptidao_value = max(algorithm.aptidao)
    maximum_aptidao_index = algorithm.aptidao.index(maximum_aptidao_value)

    solution = algorithm.population[maximum_aptidao_index]

    print(f"Melhor subconjunto de variáveis: {solution}")
    print(f"Melhor valor de R²: {maximum_aptidao_value}")

    return solution, maximum_aptidao_value

  def generate_base_compressed(
    self,
    database_name,
    dataframe,
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
