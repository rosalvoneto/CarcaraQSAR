import pandas as pd
import random

from sklearn.svm import SVR

from sklearn.discriminant_analysis import StandardScaler

from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error

import matplotlib.pyplot as plt

from beecolpy import bin_abc



filepath = "base.csv"
dataframe = pd.read_csv(filepath)

# # Normalizar os dados
# scaler = StandardScaler()
# dataframe = scaler.fit_transform(dataframe)

variables_quantity = 5
kernels = ['linear', 'poly', 'rbf', 'sigmoid']
kernel = kernels[2]
iterations = 200

counter_iterations = 0
X_iterations = []
r2_values = []


def get_variables(variables_quantity):

  variables = list(dataframe.columns)
  print("Quantidade de variáveis:", len(variables))

  # Cria sublista com poucas variáveis
  sample_numbers = random.sample(range(0, len(variables) - 1), variables_quantity)
  sample_variables = [variables[i] for i in sample_numbers]
  print("Variáveis:", sample_variables)

  return sample_variables

def convert_binary_array_to_variables(binary_array):

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
  bits_count = len(dataframe.columns) - 1

  bin_abc_algorithm = bin_abc(
    evaluate_binary_array,
    bits_count,
    method='bin',

    # 15 Employed bees
    # 15 Onlooker bees
    colony_size=30, 
    scouts=0.5,
    iterations=iterations,
    min_max='max',
    nan_protection=3,
    transfer_function='sigmoid',
    result_format='best',
    best_model_iterations=0,
    log_agents=True
  )

  bin_abc_algorithm.fit()
  solution = bin_abc_algorithm.get_solution()
  status = bin_abc_algorithm.get_status()

  return solution, status

solution, status = abc_model()

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
plt.savefig(f'binabc_R2({r2:.2f})_i({iterations}).png')
