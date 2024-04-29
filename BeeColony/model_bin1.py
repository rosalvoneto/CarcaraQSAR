import pandas as pd
import math
# import random

from sklearn.ensemble import RandomForestRegressor
# from sklearn.svm import SVR

from sklearn.discriminant_analysis import StandardScaler

from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error

import matplotlib.pyplot as plt
# from mpl_toolkits.mplot3d import Axes3D

from ecabc import ABC



filepath = "base_full.csv"
dataframe = pd.read_csv(filepath)

# # Normalizar os dados
# scaler = StandardScaler()
# dataframe = scaler.fit_transform(dataframe)

kernels = ['linear', 'poly', 'rbf', 'sigmoid']
kernel = kernels[2]
super_iterations = 1
iterations = 100

X_iterations = []
metric_values = []

metric_for_cost_function = "mse"
metric_statistic = "r2"


def convert_values_to_variables(binary_array):

  variables = list(dataframe.columns)
  sample_variables = []
  for i in range(len(variables) - 1):
    if(binary_array[i] == 1):
      sample_variables.append(variables[i])

  return sample_variables

def evaluate_variables(variables):

  # Separar as características (X) e a variável de destino (y)
  global X, y, X_test, y_pred, X_train, y_train
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
  max_features = int(math.ceil(math.log2(len(variables))))

  model = RandomForestRegressor(
    n_estimators=50,
    max_features=max_features
  )

  # Treinar o modelo
  model.fit(X_train, y_train)

  # Fazer previsões
  y_pred = model.predict(X_train)

  print("")
  # Avaliar o modelo usando o coeficiente Mean Square Error
  mse = mean_squared_error(y_train, y_pred)
  print("Coeficiente MSE do modelo:", mse)
  # Avaliar o modelo usando o coeficiente R²
  r2 = r2_score(y_train, y_pred)
  print("Coeficiente R² do modelo:", r2)
  # Avaliar o modelo usando o coeficiente Erro Médio Absoluto (MAE)
  mae = mean_absolute_error(y_train, y_pred)
  print("Erro Médio Absoluto (MAE):", mae)

  return r2, mse, mae

def evaluate_R2(values):
  variables = convert_values_to_variables(values)
  return float(evaluate_variables(variables)[0])

def evaluate_MSE(values):
  variables = convert_values_to_variables(values)
  return float(evaluate_variables(variables)[1])

def evaluate_MAE(values):
  variables = convert_values_to_variables(values)
  return float(evaluate_variables(variables)[2])

def abc_model():

  print("Preparando o algoritmo ABC...")

  abc = ABC(15, evaluate_MSE)

  for i in range(len(dataframe.columns) - 1):
    abc.add_param(0, 2, name=f'Variable{i}')
  abc.initialize()

  for i in range(iterations * super_iterations):
    abc.search()

    solution = list(abc.best_params.values())
    variables_quantity = solution.count(1)

    print("="*50)
    print('Iteration:', i + 1)
    print(f'Variables quantity: {variables_quantity}')
    print('Average fitness: {}'.format(abc.average_fitness))
    print('Average obj. fn. return value: {}'.format(abc.average_ret_val))
    print('Best fitness score: {}'.format(abc.best_fitness))
    print('Best obj. fn. return value: {}'.format(abc.best_ret_val))
    print("="*50)
    print("")

    global metric_statistic, metric_values, X_iterations
    
    metric = 0
    if(metric_statistic == "r2"):
      metric = evaluate_R2(solution)
    elif(metric_statistic == "mse"):
      metric = evaluate_MSE(solution)
    elif(metric_statistic == "mae"):
      metric = evaluate_MAE(solution)
      
    metric_values.append(metric)
    X_iterations.append(i + 1)

  solution = list(abc.best_params.values())
  return solution

solution = abc_model()

print("")
print("Solução:")

evaluated_metric = 0
if(metric_statistic == "r2"):
  evaluated_metric = evaluate_R2(solution)
if(metric_statistic == "mse"):
  evaluated_metric = evaluate_MSE(solution)
if(metric_statistic == "mae"):
  evaluated_metric = evaluate_MAE(solution)

variables_quantity = solution.count(1)
print(f"Quantidade de variáveis: {variables_quantity}")

# Plotar resultados
fig, (ax1, ax2) = plt.subplots(2, 1)

ax1.plot(
  X_train, y_train, 
  marker='o', linestyle='', markersize=4, color='black', label='Data'
)
ax1.plot(
  X_train, y_pred, 
  marker='o', linestyle='', markersize=4, color='red', label='Predictions'
)
ax1.set_title(f'Random Forest ({metric_statistic}: {evaluated_metric:.2f})')

ax2.plot(
  X_iterations, metric_values, 
  marker='o', linestyle='', markersize=4, color='red', label='R2 values'
)
ax2.set_title(f'{metric_statistic} values sequency')

plt.tight_layout()
plt.savefig(f'ecabc_m({metric_for_cost_function})_{metric_statistic}({evaluated_metric:.2f})_i({iterations}*{super_iterations})_v({variables_quantity}).png')
