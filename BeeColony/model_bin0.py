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



filepath = "base_full.csv"
dataframe = pd.read_csv(filepath)

# # Normalizar os dados
# scaler = StandardScaler()
# dataframe = scaler.fit_transform(dataframe)

kernels = ['linear', 'poly', 'rbf', 'sigmoid']
kernel = kernels[2]
super_iterations = 1
iterations = 10

counter_iterations = 0
X_iterations = []
r2_values = []


def convert_binary_array_to_variables(binary_array):

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

  return r2, mse

def evaluate_R2(binary_array):
  variables = convert_binary_array_to_variables(binary_array)
  return float(evaluate_variables(variables)[0])

def evaluate_MSE(binary_array):
  variables = convert_binary_array_to_variables(binary_array)
  return float(evaluate_variables(variables)[1])

def abc_model():

  print("Preparando o algoritmo ABC...")

  boundaries = [(0, 1) for i in range(len(dataframe.columns) - 1)]
  bits_count = len(dataframe.columns) - 1

  bin_abc_algorithm = bin_abc(
    evaluate_R2,
    bits_count,
    method='bin',

    # 15 Employed bees
    # 15 Onlooker bees
    colony_size=30,

    # Scout_limit = colony_size * bits_count * scouts
    scouts=0.5,
    iterations=iterations,
    min_max='max',
    nan_protection=True,
    transfer_function='sigmoid',
    result_format='best',
    best_model_iterations=iterations,
    log_agents=False
  )

  for _ in range(super_iterations):
    bin_abc_algorithm.fit()

  solution = bin_abc_algorithm.get_solution()
  status = bin_abc_algorithm.get_status()

  return solution, status

solution, status = abc_model()

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
plt.savefig(f'binabc_R2({r2:.2f})_i({iterations}*{super_iterations}).png')






# # Array tridimensional de exemplo
# data = food_sources

# # Convertendo para um array NumPy para facilitar o acesso aos dados
# data_array = np.array(data)

# # Criando a figura e o subplot 3D
# fig = plt.figure()
# ax = fig.add_subplot(111, projection='3d')

# # Iterando sobre os elementos do array e plotando-os como pontos no gráfico 3D
# for i in range(len(data)):
#     for j in range(len(data[i])):
#         for k in range(len(data[i][j])):
#             # Coordenadas x, y, z com a cor azul e marcador 'o'
#             ax.scatter(i, j, k, c='b', marker='o')  

# # Definindo os rótulos dos eixos
# ax.set_xlabel('X')
# ax.set_ylabel('Y')
# ax.set_zlabel('Z')

# # Exibindo o gráfico
# plt.savefig("Food_sources.png")
