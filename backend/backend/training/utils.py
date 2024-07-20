from django.shortcuts import get_object_or_404
import pandas as pd
import numpy as np

from sklearn.utils import shuffle

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import LeaveOneOut
from sklearn.model_selection import KFold

from sklearn.preprocessing import MinMaxScaler, StandardScaler, RobustScaler, Normalizer

import matplotlib.pyplot as plt
from scipy import stats
from sklearn.metrics import r2_score

from training.models import BootstrapValues
from project_management.models import Project

import time
from sklearn.inspection import permutation_importance

from sklearn.model_selection import train_test_split
from sklearn.utils import resample

def verify_Nan(df):

  # Verificar se o DataFrame possui NaNs
  if df.isna().any().any():
    print("O DataFrame possui valores NaN.")
    # Identificar posições dos NaNs
    nan_positions = np.where(df.isna())
  else:
    pass


def leave_one_out(project_id, data, scaler_name, algorithm, parameters):

  project = get_object_or_404(Project, id=project_id)
  training = project.training_set.get()
  
  loo = LeaveOneOut()

  # Normalização
  X = data.iloc[:,:-1]
  Y = data.iloc[:,-1]

  X_norm = X
  if(scaler_name != "NÃO APLICAR"):

    # scaler padrão
    scaler = MinMaxScaler()

    if(scaler_name == "MinMaxScaler"):
      print(f"Usando o MinMaxScaler")
    elif(scaler_name == "StandardScaler"):
      print(f"Usando o StandardScaler")
      scaler = StandardScaler()
    elif(scaler_name == "RobustScaler"):
      print(f"Usando o RobustScaler")
      scaler = RobustScaler()
    elif(scaler_name == "Normalizer"):
      print(f"Usando o Normalizer")
      scaler = Normalizer()
  
    X_norm = scaler.fit_transform(X)

  data = pd.DataFrame(X_norm, columns = X.columns)
  data['alvo'] = Y

  L_Y = []
  L_Y_pred = []

  if(algorithm == "Random Forest"):
    print(f"Usando algoritmo Random Forest")
  else:
    print("Não foi usado nenhum algoritmo!")

  length_progress = len(list(enumerate(loo.split(data))))

  for i, (train_index, test_index) in enumerate(loo.split(data)):
    
    X_train = data.iloc[train_index,:-1]
    Y_train = data.iloc[train_index,-1]
    X_teste = data.iloc[test_index,:-1]
    Y_teste = data.iloc[test_index,-1]

    verify_Nan(Y_train)

    if(algorithm == "Random Forest"):

      rf = RandomForestRegressor(
        n_estimators=parameters["n_estimators"], 
        max_features=parameters["max_features"]
      )


      rf = rf.fit(X_train, Y_train)
      y_pred = rf.predict(X_teste)

      L_Y.append(list(Y_teste)[0])
      L_Y_pred.append(y_pred)
      

      training.set_progress(i + 1, length_progress)


  L = [x[0] for x in L_Y_pred]

  r = stats.pearsonr(L_Y, L)[0]
  r2 = r2_score(L_Y, L)

  y = [0 if y<=5 else 1 for y in L_Y]

  Z = np.arange(3.35, 4.38, 0.1)

  # Crie o Random Forest
  fig, ax = plt.subplots()

  ax.scatter(L_Y, L, c=y)
  ax.set_title(f'Leave One Out - NORMAL \n r={r:.3f} and r2={r2:.3f}')
  ax.set_xlabel('Y Real')
  ax.set_ylabel('Y Pred')

  # Salva a imagem Leave_one_out temporariamente
  file_path = 'loo_temporary.png'
  fig.savefig(file_path)

  # Limpeza da exibição
  plt.clf()

  return True



def run_exp_for_KFold(data, algorithm, parameters):

  kf = KFold(n_splits=2, shuffle=True)
  kf.get_n_splits(data)

  L_Y = []
  L_Y_pred = []
  for i, (train_index, test_index) in enumerate(kf.split(data)):
    X_train = data.iloc[train_index,:-1]
    Y_train = data.iloc[train_index,-1]
    X_teste = data.iloc[test_index,:-1]
    Y_teste = data.iloc[test_index,-1]

    if(algorithm == "Random Forest"):
      rf = RandomForestRegressor(
        n_estimators=parameters["n_estimators"], 
        max_features=parameters["max_features"]
      )        

      rf = rf.fit(X_train, Y_train)
      y_pred = rf.predict(X_teste)

      L_Y.extend(Y_teste)
      L_Y_pred.extend(y_pred)

  L = L_Y_pred
  r2 = r2_score(L_Y, L)

  return r2

def cross_validation(project_id, data, scaler_name, algorithm, parameters):

  project = get_object_or_404(Project, id=project_id)
  training = project.training_set.get()

  # Normalização
  X = data.iloc[:,:-1]
  Y = data.iloc[:,-1]

  X_norm = X
  if(scaler_name != "NÃO APLICAR"):

    # scaler padrão
    scaler = MinMaxScaler()

    if(scaler_name == "MinMaxScaler"):
      print(f"Usando o MinMaxScaler")
    elif(scaler_name == "StandardScaler"):
      print(f"Usando o StandardScaler")
      scaler = StandardScaler()
    elif(scaler_name == "RobustScaler"):
      print(f"Usando o RobustScaler")
      scaler = RobustScaler()
    elif(scaler_name == "Normalizer"):
      print(f"Usando o Normalizer")
      scaler = Normalizer()
  
    X_norm = scaler.fit_transform(X)

  data = pd.DataFrame(X_norm, columns = X.columns)
  data['alvo'] = Y

  
  if(algorithm == "Random Forest"):
    print(f"Usando algoritmo Random Forest")
  else:
    print("Não foi usado nenhum algoritmo!")

  length_progress = 50

  L = []
  for i in range(length_progress):    
    r2 = run_exp_for_KFold(data, algorithm, parameters)
    L.append(r2)

    training.set_progress(i + 1, length_progress)

  df = pd.DataFrame(list(enumerate(L, start=1)), columns=['Reptirion', 'r2'])
  Y = df['r2'].to_numpy()
  X = [x+1 for x in range(50)]

  fig, ax = plt.subplots()

  ax.scatter(X, Y)
  ax.set_title(f'K-Fold Cross Validation - Repeated {length_progress} times')
  ax.set_ylabel("$Q^2$ $_{KFOLD}$")
  ax.set_xlabel("Repetition")

  # Salva a imagem Cross_validation temporariamente
  file_path = 'cross_validation_temporary.png'
  fig.savefig(file_path)

  # Limpeza da exibição
  plt.clf()

  return True

def run_exp_for_YScrambling(data, algorithm, parameters, suffle_Y):

  loo = LeaveOneOut()
      
  L_Y = []
  L_Y_pred = []
  for i, (train_index, test_index) in enumerate(loo.split(data)):

    X_train = data.iloc[train_index,:-1]
    Y_train = data.iloc[train_index,-1]    
    X_teste = data.iloc[test_index,:-1]
    Y_teste = data.iloc[test_index,-1]

    # Embaralha os valores de Y_train
    if(suffle_Y):
      Y_train = shuffle(Y_train)

    if(algorithm == "Random Forest"):
      rf = RandomForestRegressor(
        n_estimators=parameters["n_estimators"], 
        max_features=parameters["max_features"]
      )
      rf = rf.fit(X_train, Y_train)
      y_pred = rf.predict(X_teste)

      L_Y.append(list(Y_teste)[0])
      L_Y_pred.append(y_pred)
      
  L = [x[0] for x in L_Y_pred]
  r2 = r2_score(L_Y, L)
  
  return r2

def y_scrambling(project_id, data, algorithm, parameters):

  project = get_object_or_404(Project, id=project_id)
  training = project.training_set.get()

  # Salva o dados separados
  X_data = data.iloc[:,:-1]
  y_data = data.iloc[:,-1].to_numpy()

  times = 2
  length_progress = 50

  L = []
  L_shuffled = []
  for j in range(times):
    for i in range(length_progress):
      r2 = 0
      if(j == 0):
        r2 = run_exp_for_YScrambling(data, algorithm, parameters, False)
        L.append(r2)
      else:
        r2 = run_exp_for_YScrambling(data, algorithm, parameters, True)
        L_shuffled.append(r2)
      training.set_progress(length_progress * j + (i + 1), length_progress * times)

  X = [x+1 for x in range(length_progress)]

  df = pd.DataFrame(list(enumerate(L, start=1)), columns=['Reptirion', 'r2'])
  Y = df['r2'].to_numpy()

  df_shuffled = pd.DataFrame(list(enumerate(L_shuffled, start=1)), columns=['Reptirion', 'r2'])
  Y_shuffled = df_shuffled['r2'].to_numpy()

  fig, ax = plt.subplots()

  ax.scatter(X, Y, label = 'Y = Normal')
  ax.scatter(X, Y_shuffled, label = 'Y = Scrambling')

  ax.set_title(f'Y-Scrambling - Repeated {length_progress} times')

  ax.set_ylabel("$Q^2$ $_{LOO}$")
  ax.set_xlabel("Repetition")

  ax.legend()

  # Salva a imagem Y-Scrambling temporariamente
  file_path = 'y_scrambling_temporary.png'
  fig.savefig(file_path)

  # Limpeza da exibição
  plt.clf()

  return True

def bootstrap(project_id, data, algorithm, parameters, index):

  project = get_object_or_404(Project, id=project_id)
  training = project.training_set.get()

  N = range(data.shape[0])
  lista = [x for x in N]

  train_index = resample(lista, n_samples=len(lista), replace=True)
  test_index = [x for x in lista if x not in train_index]

  L_Y = []
  L_Y_pred = []

  X_train = data.iloc[train_index,:-1]
  Y_train = data.iloc[train_index,-1]    
  X_teste = data.iloc[test_index,:-1]
  Y_teste = data.iloc[test_index,-1]

  if(algorithm == "Random Forest"):
    rf = RandomForestRegressor(
      n_estimators=parameters["n_estimators"], 
      max_features=parameters["max_features"]
    )
    rf = rf.fit(X_train, Y_train)
    y_pred = rf.predict(X_teste)

  L = [x[0] for x in L_Y_pred]

  r = stats.pearsonr(Y_teste, y_pred)[0]
  r2 = r2_score(Y_teste, y_pred)

  bootstrap_instances = training.bootstrapvalues_set.all()
  bootstrap_length = len(bootstrap_instances)

  if(index < bootstrap_length):
    bootstrap_instances[index].update(
      molecules=test_index,
      R_value=r,
      R2_value=r2
    )
  else:
    bootstrap_value = BootstrapValues.objects.create(
      training=training,
      molecules=test_index,
      R_value=r,
      R2_value=r2
    )

  plt.title(f'Bootstrap \n r={r:.3f} and r2={r2:.3f}')
  plt.scatter(Y_teste, y_pred)

  # Salva a imagem Bootstrap temporariamente
  file_path = 'bootstrap_temporary.png'
  plt.savefig(file_path)

  # Limpeza da exibição
  plt.clf()

  return True

def importance(project_id, data, algorithm, parameters):

  project = get_object_or_404(Project, id=project_id)
  training = project.training_set.get()

  # Separa o Dataset em dois diferentes Dataframes
  X_data = data.iloc[:,:-1]
  y_data = data.iloc[:,-1]

  X_train, X_test, y_train, y_test = train_test_split(
    X_data, 
    y_data, 
    train_size=0.8, 
    random_state=0
  )

  if(algorithm == "Random Forest"):
    rf = RandomForestRegressor(
      n_estimators=parameters["n_estimators"], 
      max_features=parameters["max_features"]
    )
    rf = rf.fit(X_train, y_train)
    y_pred = rf.predict(X_test)

  start_time = time.time()
  importances = rf.feature_importances_
  std = np.std(
    [tree.feature_importances_ for tree in rf.estimators_],
    axis=0
  )
  elapsed_time = time.time() - start_time

  print(f"Elapsed time to compute the importances: {elapsed_time:.3f} seconds")
  feature_names = list(X_train.columns)

  start_time = time.time()
  result = permutation_importance(
    rf, X_test, y_test, n_repeats=10, random_state=42, n_jobs=2
  )
  elapsed_time = time.time() - start_time
  print(f"Elapsed time to compute the importances: {elapsed_time:.3f} seconds")

  forest_importances = pd.Series(
    result.importances_mean, index=feature_names
  )

  most_important = forest_importances.sort_values(ascending=False)[:8]
  l_X  = [x for x, y in most_important.items()]
  l_Y  = [y for x, y in most_important.items()]

  # Criar a figura e os eixos
  fig, ax = plt.subplots(figsize=(16, 9))
  # Plotar o gráfico de barras
  ax.bar(l_X, l_Y, align='edge', width=0.4)

  # Aumentar o tamanho da fonte das informações
  # Ajuste o tamanho da fonte do rótulo do eixo x
  ax.set_xlabel('Variables', fontsize=16)
  # Ajuste o tamanho da fonte do rótulo do eixo y
  ax.set_ylabel('Importance', fontsize=16)
  # Ajuste o tamanho da fonte dos números da escala dos eixos
  ax.tick_params(axis='both', which='major', labelsize=14)
  
  # Salva a imagem Importance temporariamente
  file_path = 'importance_temporary.png'
  fig.savefig(file_path)

  r2_score(y_test, y_pred)

  # Limpeza da exibição
  plt.clf()

  return True