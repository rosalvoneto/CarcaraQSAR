import numpy as np
import pandas as pd
import random

from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.svm import SVR

from sklearn.feature_selection import mutual_info_regression

max_no_improvement = 15
no_improvement_count = 0

# Função para calcular R²
def evaluate_subset(X, y, subset, model):
    X_subset = X.iloc[:, subset]
    X_train, X_test, y_train, y_test = train_test_split(X_subset, y, test_size=0.2, random_state=42)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    return r2_score(y_test, y_pred)

def create_bee(base_bee, n_features, max_mutations=5):
    """
    Cria uma nova "abelha" que é levemente diferente da base_bee.
    """
    new_bee = base_bee.copy()
    
    # Determinar o número de mutações
    n_mutations = random.randint(1, max_mutations)
    
    for _ in range(n_mutations):
        # Remover um índice
        if random.choice([True, False]) and len(new_bee) > 1:
            new_bee.remove(random.choice(new_bee))
        # Adicionar um novo índice
        else:
            possible_indices = list(set(range(n_features)) - set(new_bee))
            if possible_indices:
                new_bee.append(random.choice(possible_indices))
    
    return new_bee

# Calcular as melhores variáveis para começar a população
def calculateBestIndexes(
    dataframe: pd.DataFrame, info_gain_quantity: int
):

    # Suponha que dataframe seja o seu DataFrame
    # Separar as variáveis preditoras da variável alvo
    X = dataframe.drop(columns=['alvo'])
    y = dataframe['alvo']

    length_variables = len(dataframe.columns) - 1
    
    # Calcular a Information Gain para cada variável
    infogain = mutual_info_regression(X, y)

    # Criar um DataFrame com os resultados do Information Gain
    infogain_df = pd.DataFrame({'variavel': X.columns, 'infogain': infogain})

    # Ordenar o DataFrame pelo valor de Information Gain em ordem decrescente
    infogain_df = infogain_df.sort_values(by='infogain', ascending=False)

    # Selecionar os nomes das melhores variáveis com maior Information Gain
    top_variaveis = infogain_df.head(info_gain_quantity)['variavel']

    # Obter os índices dessas variáveis no DataFrame original
    top_indices = [
      dataframe.columns.get_loc(var) for var in top_variaveis
    ]

    return top_indices

# Algoritmo ABC
def abc_algorithm(df, model, n_bees=20, n_iterations=100):
    n_features = df.shape[1] - 1
    X = df.iloc[:, :-1]
    y = df.iloc[:, -1]

    base_bee = calculateBestIndexes(df, 50)
    # Inicializa abelhas
    if(True):
        bees = [create_bee(base_bee, n_features, max_mutations=50) for _ in range(n_bees)]
    else:
        bees = [random.sample(range(n_features), random.randint(1, n_features)) for _ in range(n_bees)]
    print(bees)

    fitness = [evaluate_subset(X, y, bee, model) for bee in bees]

    best_bee = bees[np.argmax(fitness)]
    best_fitness = max(fitness)
    
    global no_improvement_count

    iteration = 0
    while True:
        iteration += 1
        for i in range(n_bees):

            # Gera nova posição para a abelha
            new_bee = bees[i][:]
            if random.random() < 0.5:
                if len(new_bee) > 1:
                    new_bee.remove(random.choice(new_bee))
            else:
                new_bee.append(random.choice(list(set(range(n_features)) - set(new_bee))))
            
            new_fitness = evaluate_subset(X, y, new_bee, model)
            print(new_fitness)
            
            # Atualiza se nova posição for melhor
            if new_fitness > fitness[i]:
                no_improvement_count = 0

                bees[i] = new_bee
                fitness[i] = new_fitness
                
                # Atualiza melhor global
                if new_fitness > best_fitness:
                    best_bee = new_bee
                    best_fitness = new_fitness
            else:
                no_improvement_count += 1
        
        if no_improvement_count >= max_no_improvement:
            print(f"Stopping early at iteration {iteration} due to no improvement in the last {max_no_improvement} iterations.")
            break
            
        print(f"Iteration {iteration + 1}/{n_iterations}, Best R²: {best_fitness}")
    
    return best_bee, best_fitness

# Exemplo de uso
df = pd.read_csv('base_full.csv')
print("Dataframe criado!")

model = RandomForestRegressor(n_estimators=100, random_state=42)
print("Modelo criado!")
print("Começando a busca...")
best_subset, best_r2 = abc_algorithm(df, model)

print(f"Melhor subconjunto de variáveis: {best_subset}")
print(f"Melhor valor de R²: {best_r2}")

selected_columns = df.columns[best_subset]
new_dataframe = df[selected_columns]

# Adicionando a última coluna
last_column_name = list(df.columns)[-1]
new_dataframe[last_column_name] = df[last_column_name].tolist()
print("Quantidade de colunas do novo Dataframe:", len(list(new_dataframe.columns)))

new_dataframe.to_csv(f"base_compressed.csv", index=False)
