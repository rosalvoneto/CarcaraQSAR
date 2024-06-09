import numpy as np
import pandas as pd
pd.options.mode.chained_assignment = None
import random

from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
from sklearn.feature_selection import mutual_info_regression

class ABCAlgorithm():

    def __init__(
            self,
            bees,
            maximum_iterations,
            limit_not_improvement,
            info_gain_quantity,
            interation_function
        ):
        self.n_bees = bees
        self.n_iterations = maximum_iterations
        self.limit_not_improvement = limit_not_improvement
        self.info_gain_quantity = info_gain_quantity

        self.interation_function = interation_function

        self.not_improvement_count = 0
        self.iteration = 0

    # Avalia variáveis específicas em relação ao dataframe
    def evaluate_variables(self, X, y, subset, model):
        # Separar as características (X)
        X_subset = X.iloc[:, subset]

        # Normalizar os dados
        scaler = MinMaxScaler()
        X_subset = scaler.fit_transform(X_subset)

        # Dividir o conjunto de dados em treino e teste
        X_train, X_test, y_train, y_test = train_test_split(
            X_subset, y, test_size=0.2, random_state=42
        )

        # Treinar o modelo
        model.fit(X_train, y_train)

        # Fazer previsões
        y_pred = model.predict(X_test)

        # Avaliar o modelo usando o coeficiente R²
        r2 = r2_score(y_test, y_pred)

        return r2

    def create_bee(self, base_bee, n_features, max_mutations):
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

    # Execução do Algoritmo ABC
    def execution(self, df, model):

        n_features = df.shape[1] - 1

        X = df.iloc[:, :-1]
        y = df.iloc[:, -1]

        # Inicializa abelhas
        base_bee = self.calculateBestIndexes(df, self.info_gain_quantity)
        if(True):
            bees = [self.create_bee(base_bee, n_features, max_mutations=50) for _ in range(self.n_bees)]
        else:
            bees = [random.sample(range(n_features), random.randint(1, n_features)) for _ in range(n_bees)]

        fitness = [self.evaluate_variables(X, y, bee, model) for bee in bees]

        # Seleciona melhor abelha e melhor fitness
        best_bee = bees[np.argmax(fitness)]
        best_fitness = max(fitness)
        
        self.iteration = 0
        while self.iteration < self.n_iterations:

            # Função de interação
            self.interation_function(self.iteration, self.n_iterations)
            self.iteration += 1

            # Geração de abelhas melhores
            for i in range(self.n_bees):

                # Gera nova posição para a abelha
                new_bee = bees[i][:]
                if random.random() < 0.5:
                    if len(new_bee) > 1:
                        new_bee.remove(random.choice(new_bee))
                else:
                    new_bee.append(random.choice(list(set(range(n_features)) - set(new_bee))))
                
                new_fitness = self.evaluate_variables(X, y, new_bee, model)
                print(new_fitness)
                
                # Atualiza abelha antiga pela nova se tiver melhor fitness
                if new_fitness > fitness[i]:

                    bees[i] = new_bee
                    fitness[i] = new_fitness

            # Analisar bee e fitness atual
            actual_bee = bees[np.argmax(fitness)]
            actual_fitness = max(fitness)
                    
            # Atualiza melhor abelha globalmente
            if actual_fitness > best_fitness:
                print("=" * 30)
                print("MELHORANDO")
                print("=" * 30)
                self.not_improvement_count = 0

                best_bee = actual_bee
                best_fitness = actual_fitness
            else:
                print("=" * 30)
                print("PIORANDO")
                print("=" * 30)
                self.not_improvement_count += 1
            
            if self.not_improvement_count >= self.limit_not_improvement:
                print(f"Parando na iteração {self.iteration}")
                print(f"Não houve melhoria nas últimas {self.limit_not_improvement} iterações")
                break
                
            print(f"Iteração {self.iteration}/{self.n_iterations}, Melhor R²: {best_fitness}")
        
        self.best_bee = best_bee
        self.best_fitness = best_fitness
        return best_bee, best_fitness
    
    def generate_new_database(
        self,
        database_name,
        dataframe: pd.DataFrame, 
        variables_indexes
    ):
        selected_columns = dataframe.columns[variables_indexes]
        new_dataframe = dataframe[selected_columns]

        # Adicionando a última coluna do Database original
        last_column_name = list(dataframe.columns)[-1]
        new_dataframe[last_column_name] = dataframe[last_column_name].tolist()
        new_dataframe.to_csv(database_name, index=False)
