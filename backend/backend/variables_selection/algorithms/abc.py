import numpy as np
import pandas as pd
import random

from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
from sklearn.ensemble import RandomForestRegressor

from sklearn.feature_selection import mutual_info_regression

from variables_selection.utils import generate_new_database

class ABCAlgorithm():

    def __init__(
            self,
            bees,
            maximum_iterations,
            max_no_improvement
        ):
        self.n_bees = bees
        self.n_iterations = maximum_iterations
        self.max_no_improvement = max_no_improvement

        self.no_improvement_count = 0
        self.iteration = 0

    # Função para calcular R²
    def evaluate_subset(self, X, y, subset, model):
        X_subset = X.iloc[:, subset]
        X_train, X_test, y_train, y_test = train_test_split(X_subset, y, test_size=0.2, random_state=42)
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        return r2_score(y_test, y_pred)

    def create_bee(self, base_bee, n_features, max_mutations=5):
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
        self, dataframe: pd.DataFrame, info_gain_quantity: int
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
    def execution(self, df, model):
        n_features = df.shape[1] - 1
        X = df.iloc[:, :-1]
        y = df.iloc[:, -1]

        base_bee = self.calculateBestIndexes(df, 50)
        # Inicializa abelhas
        if(True):
            bees = [self.create_bee(base_bee, n_features, max_mutations=50) for _ in range(self.n_bees)]
        else:
            bees = [random.sample(range(n_features), random.randint(1, n_features)) for _ in range(n_bees)]

        fitness = [self.evaluate_subset(X, y, bee, model) for bee in bees]

        best_bee = bees[np.argmax(fitness)]
        best_fitness = max(fitness)
        
        global no_improvement_count

        self.iteration = 0
        while self.iteration < self.n_iterations:
            self.iteration += 1
            for i in range(self.n_bees):

                # Gera nova posição para a abelha
                new_bee = bees[i][:]
                if random.random() < 0.5:
                    if len(new_bee) > 1:
                        new_bee.remove(random.choice(new_bee))
                else:
                    new_bee.append(random.choice(list(set(range(n_features)) - set(new_bee))))
                
                new_fitness = self.evaluate_subset(X, y, new_bee, model)
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
            
            if no_improvement_count >= self.max_no_improvement:
                print(f"Parando na iteração {self.iteration}")
                print(f"Não houve melhoria nas últimas {self.max_no_improvement} iterações")
                break
                
            print(f"Iteração {self.iteration + 1}/{self.n_iterations}, Melhor R²: {best_fitness}")
        
        self.best_bee = best_bee
        self.best_fitness = best_fitness
        return best_bee, best_fitness

def ABC_execution(df: pd.DataFrame, model):
    abc = ABCAlgorithm(
        bees=20,
        maximum_iterations=5,
        max_no_improvement=10
    )

    best_subset, best_r2 = abc.execution(df, model)
    print(f"Melhor subconjunto de variáveis: {best_subset}")
    print(f"Melhor valor de R²: {best_r2}")

    return best_subset, best_r2

