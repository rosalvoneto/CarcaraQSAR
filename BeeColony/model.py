import pandas as pd
import random

from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR

from sklearn.discriminant_analysis import StandardScaler

from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error

import matplotlib.pyplot as plt

from beecolpy import abc



filepath = "base.csv"
dataframe = pd.read_csv(filepath)

# # Normalizar os dados
# scaler = StandardScaler()
# dataframe = scaler.fit_transform(dataframe)

variables_quantity = 5
kernels = ['linear', 'poly', 'rbf', 'sigmoid']
kernel = kernels[2]


def get_variables(variables_quantity):

  variables = list(dataframe.columns)
  print("Quantidade de variáveis:", len(variables))

  # Cria sublista com poucas variáveis
  sample_numbers = random.sample(range(0, len(variables) - 1), variables_quantity)
  sample_variables = [variables[i] for i in sample_numbers]
  print("Variáveis:", sample_variables)

  return sample_variables

def convert_binary_array_to_variables(binary_array):

  binary_array = [round(x) for x in binary_array]
  print(binary_array)

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
  model = SVR(kernel=kernel)

  # Treinar o modelo
  model.fit(X_train, y_train)

  # Fazer previsões
  y_pred = model.predict(X_test)

  # Avaliar o modelo usando o coeficiente R²
  r2 = r2_score(y_test, y_pred)
  print("Coeficiente R² do modelo:", r2)
  # Avaliar o modelo usando o coeficiente Mean Square Error
  mse = mean_squared_error(y_test, y_pred)
  print("Coeficiente MSE do modelo:", mse)

  return mse

def evaluate_binary_array(binary_array):
  variables = convert_binary_array_to_variables(binary_array)
  return evaluate_variables(variables)

def abc_model():

  boundaries = [(0, 1) for i in range(len(dataframe.columns) - 1)]

  abc_algorithm = abc(
    evaluate_binary_array,
    boundaries,
    colony_size=40,
    scouts=0.5,
    iterations=50,
    min_max='min',
    nan_protection=True,
    log_agents=True
  )

  abc_algorithm.fit()
  solution = abc_algorithm.get_solution()

  return solution

solution = abc_model()
solution = [round(x) for x in solution]

print("")
print("Solução:")
mse = evaluate_binary_array(solution)

# Plotar resultados
plt.figure()
plt.plot(X, y, color='black', label='Data')
plt.plot(X_test, y_pred, color='red', label='Predictions')
plt.title(f'SVM with {kernel} kernel (MSE: {mse:.2f})')
plt.savefig(f'Plot_{kernel}.png')