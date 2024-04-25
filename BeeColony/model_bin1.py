import pandas as pd
import math
# import random

from sklearn.ensemble import RandomForestRegressor
# from sklearn.svm import SVR

from sklearn.discriminant_analysis import StandardScaler

from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error

import matplotlib.pyplot as plt
# from mpl_toolkits.mplot3d import Axes3D

from beecolpy import bin_abc
from ecabc import ABC



filepath = "base.csv"
dataframe = pd.read_csv(filepath)

# # Normalizar os dados
# scaler = StandardScaler()
# dataframe = scaler.fit_transform(dataframe)

kernels = ['linear', 'poly', 'rbf', 'sigmoid']
kernel = kernels[2]
super_iterations = 1
iterations = 10

X_iterations = []
r2_values = []


def convert_values_to_variables(binary_array):

  variables = list(dataframe.columns)
  sample_variables = []
  for i in range(len(variables) - 1):
    if(binary_array[i] == 1):
      sample_variables.append(variables[i])

  return sample_variables

def evaluate_variables(variables):

  # Separar as características (X) e a variável de destino (y)
  global X, y, X_test, y_pred
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
  y_pred = model.predict(X_test)

  # Avaliar o modelo usando o coeficiente Mean Square Error
  mse = mean_squared_error(y_test, y_pred)
  print("Coeficiente MSE do modelo:", mse)
  # Avaliar o modelo usando o coeficiente R²
  r2 = r2_score(y_test, y_pred)
  print("Coeficiente R² do modelo:", r2)  

  return r2, mse

def evaluate_MSE(values):
  variables = convert_values_to_variables(values)
  return float(evaluate_variables(variables)[1])

def evaluate_R2(values):
  variables = convert_values_to_variables(values)
  return float(evaluate_variables(variables)[0])

def abc_model():

  print("Preparando o algoritmo ABC...")

  abc = ABC(15, evaluate_MSE)
  for i in range(len(dataframe.columns) - 1):
    abc.add_param(0, 2, name=f'Variable{i}')
  abc.initialize()

  for i in range(iterations * super_iterations):
    abc.search()
    print("="*50)
    print('Iteration:', i + 1)
    print('Average fitness: {}'.format(abc.average_fitness))
    print('Average obj. fn. return value: {}'.format(abc.average_ret_val))
    print('Best fitness score: {}'.format(abc.best_fitness))
    print('Best obj. fn. return value: {}'.format(abc.best_ret_val))
    print("="*50)
    print("")

    global r2_values, X_iterations
    solution = list(abc.best_params.values())
    r2 = evaluate_R2(solution)
    r2_values.append(r2)
    X_iterations.append(i + 1)


  mse = abc.best_fitness
  solution = list(abc.best_params.values())

  return solution, mse

solution, mse = abc_model()

print("")
print("Solução:")
r2 = evaluate_R2(solution)

# Plotar resultados
fig, (ax1, ax2) = plt.subplots(2, 1)

ax1.plot(
  X, y, 
  marker='o', linestyle='', markersize=4, color='black', label='Data'
)
ax1.plot(
  X_test, y_pred, 
  marker='o', linestyle='', markersize=4, color='red', label='Predictions'
)
ax1.set_title(f'Random Forest (R2: {r2:.2f})')

ax2.plot(
  X_iterations, r2_values, 
  marker='o', linestyle='', markersize=4, color='red', label='R2 values'
)
ax2.set_title(f'R2 values sequency')

plt.tight_layout()
plt.savefig(f'ecabc_R2({r2:.2f})_i({iterations}*{super_iterations}).png')
