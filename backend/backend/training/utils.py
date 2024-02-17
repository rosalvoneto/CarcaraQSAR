import pandas as pd
import numpy as np

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import LeaveOneOut
from sklearn.model_selection import KFold

from sklearn.preprocessing import MinMaxScaler

import joblib

import matplotlib.pyplot as plt
from scipy import stats
from sklearn.metrics import r2_score

from matplotlib.backends.backend_agg import FigureCanvasAgg
from io import BytesIO
import base64


def leave_one_out(csv_path):

  data = pd.read_csv(csv_path)
  # data = pd.read_csv('Ant_KNN_BestFirst_28_65.csv')
  print(data)
  
  loo = LeaveOneOut()

  # Normalizando
  X = data.iloc[:,:-1]
  Y = data.iloc[:,-1]

  scaler = MinMaxScaler()
  X_norm = scaler.fit_transform(X)

  # Salvar o MinMaxScaler em um arquivo
  # Escolha um nome de arquivo
  scaler_filename = 'min_max_scaler.pkl'
  with open(scaler_filename, 'wb') as scaler_file:
    joblib.dump(scaler, scaler_file)

  data = pd.DataFrame(X_norm, columns = X.columns)
  data['alvo'] = Y

  L_Y = []
  L_Y_pred = []

  for i, (train_index, test_index) in enumerate(loo.split(data)):
    X_train = data.iloc[train_index,:-1]
    Y_train = data.iloc[train_index,-1]    
    X_teste = data.iloc[test_index,:-1]
    Y_teste = data.iloc[test_index,-1]

    rf = RandomForestRegressor(n_estimators=50, max_features=4)    
    rf = rf.fit(X_train, Y_train)
    y_pred = rf.predict(X_teste)
    L_Y.append(list(Y_teste)[0])
    L_Y_pred.append(y_pred)

  L = [x[0] for x in L_Y_pred]

  r = stats.pearsonr(L_Y, L)[0]
  r2 = r2_score(L_Y, L)

  y = [0 if y <=5 else 1 for y in L_Y]

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



def run_exp(data):
  L_Y = []
  L_Y_pred = []
  kf = KFold(n_splits=2, shuffle=True)
  kf.get_n_splits(data)

  for i, (train_index, test_index) in enumerate(kf.split(data)):
    X_train = data.iloc[train_index,:-1]
    Y_train = data.iloc[train_index,-1]
    X_teste = data.iloc[test_index,:-1]
    Y_teste = data.iloc[test_index,-1]        
    rf = RandomForestRegressor(n_estimators=50, max_features=4)        
    rf = rf.fit(X_train, Y_train)
    y_pred = rf.predict(X_teste)
    L_Y.extend(Y_teste)
    L_Y_pred.extend(y_pred)

  L = L_Y_pred
  r2 = r2_score(L_Y, L)
  return r2

def cross_validation(csv_path):

  data = pd.read_csv(csv_path)
  # data = pd.read_csv('Ant_KNN_BestFirst_28_65.csv')
  print(data)

  # Normalizando
  X = data.iloc[:,:-1]
  Y = data.iloc[:,-1]

  scaler = MinMaxScaler()
  X_norm = scaler.fit_transform(X)

  data = pd.DataFrame(X_norm, columns = X.columns)
  data['alvo'] = Y

  L = []
  for _ in range(50):    
    r2 = run_exp(data)
    L.append(r2)
    print(r2)

  df = pd.DataFrame(list(enumerate(L, start=1)), columns=['Reptirion', 'r2'])
  Y = df['r2'].to_numpy()
  X = [x+1 for x in range(50)]

  fig, ax = plt.subplots()

  ax.scatter(X, Y)
  ax.set_ylabel("$Q^2$ $_{KFOLD}$")
  ax.set_xlabel("Repetition")

  # Salva a imagem Cross_validation temporariamente
  file_path = 'cross_validation_temporary.png'
  fig.savefig(file_path)

  # Limpeza da exibição
  plt.clf()
