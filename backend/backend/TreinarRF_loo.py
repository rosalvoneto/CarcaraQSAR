import pandas as pd
import numpy as np

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import LeaveOneOut

import joblib

data = pd.read_csv('Ant_KNN_BestFirst_28_65.csv')

loo = LeaveOneOut()

# Normalizando
from sklearn.preprocessing import MinMaxScaler

X = data.iloc[:,:-1]
Y = data.iloc[:,-1]


scaler = MinMaxScaler()
X_norm = scaler.fit_transform(X)

L_Y = []
L_Y_pred = []

for i, (train_index, test_index) in enumerate(loo.split(data)):
    X_train = data.iloc[train_index,:-1]
    Y_train = data.iloc[train_index,-1]    
    X_teste = data.iloc[test_index,:-1]
    Y_teste = data.iloc[test_index,-1]    
    rf = RandomForestRegressor(n_estimators=50, max_features=4) # r2 = 0.524    
    rf = rf.fit(X_train, Y_train)
    y_pred = rf.predict(X_teste)
    L_Y.append(list(Y_teste)[0])
    L_Y_pred.append(y_pred)
    
import matplotlib.pyplot as plt
from scipy import stats
from sklearn.metrics import r2_score

L = [x[0] for x in L_Y_pred]

r = stats.pearsonr(L_Y, L)[0]
r2 = r2_score(L_Y, L)

y = [0 if y <=5 else 1 for y in L_Y]

fig, ax = plt.subplots()

ax.scatter(L_Y, L, c=y)

Z = np.arange(3.35, 4.38, 0.1)

#ax.scatter(Z, Z)

plt.xlabel("Y Real")
plt.ylabel("Y Pred")

plt.title(f'Leave One Out - NORMAL \n r={r:.3f} and r2={r2:.3f}')    
