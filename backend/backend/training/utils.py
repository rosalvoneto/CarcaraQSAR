import pandas as pd
import numpy as np

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import LeaveOneOut

from sklearn.preprocessing import MinMaxScaler

import joblib

import matplotlib.pyplot as plt
from scipy import stats
from sklearn.metrics import r2_score

from matplotlib.backends.backend_agg import FigureCanvasAgg
from io import BytesIO
import base64

def random_forest(csv_path):

  data = pd.read_csv(csv_path)
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
  ax.set_title('Random Forest')
  ax.set_xlabel('Y Real')
  ax.set_ylabel('Y Pred')

  # Renderize a figura usando FigureCanvasAgg
  canvas = FigureCanvasAgg(fig)
  canvas.draw()

  # Obtenha os bytes da imagem
  buffer = BytesIO()
  canvas.print_png(buffer)
  buffer.seek(0)

  # Leia os bytes da imagem
  bytes = buffer.read()
  base64_image = base64.b64encode(bytes).decode('utf-8')

  # Limpeza da exibição
  plt.clf()

  return base64_image
