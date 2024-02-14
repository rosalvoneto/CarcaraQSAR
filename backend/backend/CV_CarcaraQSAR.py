import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import KFold

import matplotlib.pyplot as plt
import numpy as np
from scipy import stats
from sklearn.metrics import r2_score


data = pd.read_csv('Ant_KNN_BestFirst_28_65.csv')

data.shape



# Normalizando
from sklearn.preprocessing import MinMaxScaler

X = data.iloc[:,:-1]
Y = data.iloc[:,-1]


scaler = MinMaxScaler()
X_norm = scaler.fit_transform(X)

data = pd.DataFrame(X_norm, columns = X.columns)
data['alvo'] = Y


def run_exp():
    L_Y = []
    L_Y_pred = []
    kf = KFold(n_splits=5, shuffle=True)
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


L = []
for _ in range(50):    
    r2 = run_exp()
    L.append(r2)
    print(r2)


df = pd.DataFrame(list(enumerate(L, start=1)), columns=['Reptirion', 'r2'])
Y = df['r2'].to_numpy()
X = [x+1 for x in range(50)]


fig, ax = plt.subplots()

ax.scatter(X, Y)

plt.ylabel("$Q^2$ $_{KFOLD}$")
plt.xlabel("Repetition")
