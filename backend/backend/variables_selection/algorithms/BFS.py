
import math
import pandas as pd

from variables_selection.algorithms.utils.utils import convert_binary_array_to_variables, convert_variables_to_binary_array, get_variables

from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.svm import SVR
from sklearn.ensemble import RandomForestRegressor

class Graph:
    def __init__(
        self, 
        dataframe, 
        r2_condition, 
        limit_not_improvement,
        interation_function,
        n_child_positions
    ):
        self.dataframe = dataframe
        self.graph = {}
        self.not_improvement_count = 0

        self.r2_condition = r2_condition
        self.limit_not_improvement = limit_not_improvement

        self.interation_function = interation_function
        self.n_child_positions = n_child_positions

    def add_node(self, node):
        self.graph[tuple(node)] = []

    def add_child(self, parent, child):
        self.graph[tuple(parent)].append(child)

    def calculate_R2(self, binary_array, full_variables):
        choosen_variables = convert_binary_array_to_variables(
           binary_array, full_variables
        )
        return self.evaluate_variables(choosen_variables)

    def greedy_search(self, start, full_variables):
        visited = set()
        best_node = None
        best_R2 = 0
        i = 0

        frontier = []
        frontier.append((self.calculate_R2(start, full_variables), start))

        while len(frontier) > 0:
            i += 1
            # Ordena a fronteira pelo valor de R2 decrescente
            frontier = sorted(frontier, key=lambda x: x[0], reverse=True)
            for item in frontier:
                print(item[0])

            # Obtém o nó com o maior valor de R2
            current_R2, current_node = frontier.pop(0)

            if tuple(current_node) in visited:
                continue
            visited.add(tuple(current_node))

            print(f"Quantidade de variáveis atual: {current_node.count(1)}")
            print(f"Valor R2 = {current_R2} para o nó atual")

            # Abre o arquivo em modo de escrita ('w')
            with open("Valores R2.csv", "a") as arquivo:
                # Escreve os dados no arquivo
                arquivo.write(f"{i}, {current_R2}, {current_node}\n")
            
            # Verificação de melhoria no R2
            if current_R2 > best_R2:
                best_node = current_node
                best_R2 = current_R2

                self.not_improvement_count = 0
            else:
                self.not_improvement_count += 1
            
            # Condição de parada: R2
            if current_R2 >= self.r2_condition:
                print(f"R2 >= {self.r2_condition}. Parando a busca.")
                best_node = current_node
                best_R2 = current_R2
                break

            # Condição de parada: No improvement
            if(self.not_improvement_count >= self.limit_not_improvement):
                print(f"Sem melhoria nas {self.limit_not_improvement} últimas interações. Parando a busca.")
                break
            
            # Função da interação
            self.interation_function(
                self.not_improvement_count,
                self.limit_not_improvement
            )
            
            childrens = self.generate_children(
                current_node, self.n_child_positions
            )
            bests_R2 = []
            for child in childrens:
                bests_R2.append(self.calculate_R2(child, full_variables))
            
            # Obtém os índices dos maiores elementos de bests_R2
            child_quantity = 5

            bests_indexes = sorted(
                range(len(bests_R2)), 
                key=lambda i: bests_R2[i], 
                reverse=True
            )[:child_quantity]

            print(f"Melhores índices: {bests_indexes}")

            for index in bests_indexes:

                if (
                    tuple(childrens[index]) not in visited 
                    and bests_R2[index] >= current_R2
                ):
                    frontier.append(
                       (self.calculate_R2(childrens[index], full_variables), childrens[index])
                    )
            
            print(f"Quantidade na barreira: {len(frontier)}")
        return best_node, best_R2

    # def generate_children(self, node):
    #     children = []
    #     # Adiciona 1 em uma posição diferente do array para gerar os filhos
    #     for i in range(len(node)):
    #         if node[i] == 0:
    #             child = node[:i] + [1] + node[i+1:]
    #             children.append(child)

    #     return children

    # def generate_children(self, node):
    #     children = []
    #     # Adiciona 1 em duas posições diferentes do array para gerar os filhos
    #     for i in range(len(node)):
    #         for j in range(i + 1, len(node)):
    #             if node[i] == 0 and node[j] == 0:
    #                 # Cria uma cópia do nó original
    #                 child = node[:]
    #                 # Substitui as posições i e j por 1
    #                 child[i] = 1
    #                 child[j] = 1
    #                 children.append(child)

    #     return children
    
    # def generate_children(self, node):
    #     children = []
    #     # Adiciona 1 em duas posições adjacentes 
    #     # diferentes do array para gerar os filhos
    #     for i in range(len(node) - 1):
    #         if node[i] == 0 and node[i + 1] == 0:
    #             # Cria uma cópia do nó original
    #             child = node[:]
    #             # Substitui as posições adjacentes i e i+1 por 1
    #             child[i] = 1
    #             child[i + 1] = 1
    #             children.append(child)

    #     return children
    
    def generate_children(self, node, n_positions):
        children = []
        # Adiciona 1 em N posições adjacentes diferentes
        # do array para gerar os filhos
        for i in range(len(node) - n_positions + 1):
            if all(node[i + j] == 0 for j in range(n_positions)):
                # Cria uma cópia do nó original
                child = node[:]
                # Substitui as posições adjacentes por 1
                for j in range(n_positions):
                    child[i + j] = 1
                children.append(child)
        return children


    # Avalia variáveis específicas em relação ao dataframe
    def evaluate_variables(self, variables):
        # Separar as características (X) e a variável de destino (y)
        X = self.dataframe[variables]
        y = self.dataframe.iloc[:, -1]

        # Normalizar os dados
        scaler = MinMaxScaler()
        X = scaler.fit_transform(X)

        # Dividir o conjunto de dados em treino e teste
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        # Cria um modelo
        if(False):
            model = SVR(kernel='rbf', C=1.0, gamma='scale')
        else:
            model = RandomForestRegressor(
                n_estimators=50,
                random_state=42,
                max_features="log2"
            )

        # Treinar o modelo
        model.fit(X_train, y_train)

        # Fazer previsões
        y_pred = model.predict(X_test)
        
        # Avaliar o modelo usando o coeficiente R²
        r2 = r2_score(y_test, y_pred)

        return r2
    
    def evaluate_best_variable(self):

        variables = get_variables(self.dataframe)

        metric_values = []
        for i, variable in enumerate(variables):
            print(f"Testando variável {i}:{variable}")
            metric = self.evaluate_variables([variable])
            metric_values.append(metric)

            # Função da interação
            self.interation_function(i + 1, len(variables))
        
        best_R2 = max(metric_values)
        maximum_index = metric_values.index(best_R2)
        best_variable = variables[maximum_index]

        with open("best_variable.csv", 'a') as arquivo:
            arquivo.write(f"Variable, R2_value\n")
            arquivo.write(f"{best_variable}, {best_R2}\n")

        return best_variable, best_R2
    
    def execution(self, variable: str):

        # Definindo valores iniciais para a Busca pela melhor escolha
        full_variables = get_variables(self.dataframe)
        start_node = convert_variables_to_binary_array(full_variables, [variable])

        # Realizando a busca
        self.add_node(start_node)
        best_node, best_R2 = self.greedy_search(start_node, full_variables)
        print("Melhor R2:", best_R2)

        # Criando novo dataframe
        variables = convert_binary_array_to_variables(best_node, full_variables)
        new_dataframe = self.dataframe[variables]

        # Adicionando a última coluna do novo Dataframe
        last_column_name = list(self.dataframe.columns)[-1]
        new_dataframe[last_column_name] = self.dataframe[last_column_name].tolist()
        new_dataframe.to_csv("base_best.csv", index=False)

        return best_node, best_R2
