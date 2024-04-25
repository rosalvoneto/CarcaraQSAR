
# Sugestão de parâmetros para ABC:
# - Empregadas (Employed) 15
# - Observadoras (onlooker) 15
# - Scout 1

# Algoritmo para avaliar: random forest regressor (não SVM)
# - Número de arvores: 50
# - Features: LOG2 do número de variáveis

# Critério de parada:
# - Quando chegar perto de 1000 variáveis ativas
# - O r2 do conjunto de teste não melhora depois de N iterações

# Usar o uma busca pela melhor escolha (em árvore) para avaliar as variáveis que são solução do algoritmo de colônia de abelhas
# Pode ser feita uma implementação em Python mesmo

# Busca gulosa com teste para encontrar as melhores das melhores variáveis
# Imagem no cronograma
# Deve retornar de 3 a 30 variáveis
# Modelos univariáveis. Para cada variável das 1025
# Pegar aquele com maior R2



import pandas as pd
import numpy as np
import random

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

counter_iterations = 0
X_iterations = []
r2_values = []

iterations = 300


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

  global r2_values, X_iterations, counter_iterations
  counter_iterations += 1
  X_iterations.append(counter_iterations)
  r2_values.append(r2)

  return r2

def evaluate_binary_array(binary_array):
  variables = convert_binary_array_to_variables(binary_array)
  return evaluate_variables(variables)

def abc_model():

  boundaries = [(0, 1) for i in range(len(dataframe.columns) - 1)]

  abc_algorithm = abc(
    evaluate_binary_array,
    boundaries,
    colony_size=100,
    scouts=0.5,
    iterations=iterations,
    min_max='max',
    nan_protection=True,
    log_agents=True
  )

  abc_algorithm.fit()
  solution = abc_algorithm.get_solution()
  status = abc_algorithm.get_status()

  return solution, status

solution, status = abc_model()
solution = [round(x) for x in solution]

print("")
print("Solução:")
r2 = evaluate_binary_array(solution)
print("Status:")
print(status)

# Plotar resultados
fig, (ax1, ax2) = plt.subplots(2, 1)

ax1.plot(X, y, color='black', label='Data')
ax1.plot(X_test, y_pred, color='red', label='Predictions')
ax1.set_title(f'SVM with {kernel} kernel (R2: {r2:.2f})')

ax2.plot(X_iterations, r2_values, color='red', label='R2 values')
ax2.set_title(f'R2 values using {kernel} kernel')

plt.tight_layout()
plt.savefig(f'abc_R2({r2:.2f})_i({iterations}).png')
