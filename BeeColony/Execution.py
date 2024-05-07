import math
import numpy as np 
from bitstring import BitArray
from sklearn.discriminant_analysis import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from Problem import Problem
from Algorithm import Algorithm

import matplotlib.pyplot as plt

import pandas as pd

from utils import convert_binary_array_to_variables
from utils import convert_variables_to_binary_array, get_variables

metric_values = []
X_iterations = []
counter_iterations = 0

metric_statistic = "r2"
metric_for_cost_function = "r2"

# Leitura do Dataframe
filepath = "base_full.csv"
dataframe = pd.read_csv(filepath)

full_variables = get_variables(dataframe)

# Variáveis
interval = (0, 10)
use_limit = False
full_variables_length = len(full_variables)

probability_crossover = 0.5
probability_mutation = 0.001
limit_generations = 100
limit_not_improvement = 10
population_quantity = 5


# Definindo o problema
problem = Problem()
population = problem.generateInitPopulation(
  interval[0], interval[1],
  full_variables_length,
  population_quantity
)


# Algoritmo

def evaluate_variables(variables):

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

  # print("")
  # print("Coeficiente R² do modelo:", r2)
  # print("Coeficiente MSE do modelo:", mse)
  # print("Erro Médio Absoluto (MAE):", mae)

  global metric_values, X_iterations, counter_iterations
  counter_iterations += 1
  X_iterations.append(counter_iterations)
  metric_values.append(r2)

  return r2, mse, mae




def fitness(parameters: BitArray):
  binary_array = parameters.tobitarray().tolist()

  full_variables = get_variables(dataframe)
  variables = convert_binary_array_to_variables(binary_array, full_variables)
  return float(evaluate_variables(variables)[0])

# O valor máximo de retorno é 25 para entrada 5
def function(parameters: BitArray):
  x = parameters.int
  return -x**2 +10*x

algorithm = Algorithm(
  fitness,
  probability_crossover, 
  probability_mutation, 
  population,
  use_limit,
  interval[0],
  interval[1],
)
algorithm.execution(
  limit_generations = limit_generations, 
  limit_not_improvement = limit_not_improvement
)
maximum_aptidao_value = max(algorithm.aptidao)
maximum_aptidao_index = algorithm.aptidao.index(maximum_aptidao_value)
solution = algorithm.population[maximum_aptidao_index]

print(f"")
print(f"RESULTADO:")
print(f"Quantidade de variáveis:", solution.count(True))

best_aptidao = algorithm.function(solution)
print(f"")
print(f"Maior valor de aptidão:", best_aptidao)

# ==============================================================

full_variables = get_variables(dataframe)
binary_array = solution.tobitarray().tolist()
variables = convert_binary_array_to_variables(binary_array, full_variables)
print(f"Quantidade de variáveis: {len(variables)}")

new_dataframe = dataframe[variables]

# Adicionando a última coluna
last_column_name = list(dataframe.columns)[-1]
new_dataframe[last_column_name] = dataframe[last_column_name].tolist()
print("Quantidade de colunas do novo Dataframe:", len(list(new_dataframe.columns)))

new_dataframe.to_csv("base_compressed.csv", index=False)


# Plotar resultados
evaluated_metric = best_aptidao
fig, (ax1, ax2) = plt.subplots(2, 1)

# ax1.plot(
#   X_train, y_train, 
#   marker='o', linestyle='', markersize=4, color='black', label='Data'
# )
# ax1.plot(
#   X_train, y_pred,
#   marker='o', linestyle='', markersize=4, color='red', label='Predictions'
# )
# ax1.set_title(f'Random Forest ({metric_statistic}: {evaluated_metric:.2f})')

ax2.plot(
  X_iterations, metric_values, 
  marker='o', linestyle='', markersize=4, color='red', label='R2 values'
)
ax2.set_title(f'{metric_statistic} values sequency')

plt.tight_layout()
plt.savefig(f'AG_m({metric_for_cost_function})_{metric_statistic}({evaluated_metric:.2f})_i({limit_generations}*{1})_v({len(variables)}).png')