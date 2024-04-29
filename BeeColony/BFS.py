
import pandas as pd

from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.discriminant_analysis import StandardScaler

from sklearn.svm import SVC, SVR

class Graph:
    def __init__(self):
        self.graph = {}

    def add_edge(self, node1, node2, weight):
        if node1 not in self.graph:
            self.graph[node1] = []
        self.graph[node1].append((node2, weight))

    def best_first_search(self, start, goal):
        visited = set()
        # (heuristic_value, node)
        queue = [(0, start)]
        
        while queue:
            # Sort by heuristic value
            queue.sort()
            # Get node with lowest heuristic value
            heuristic_value, current_node = queue.pop(0)
            visited.add(current_node)

            print(current_node)

            if current_node == goal:
                print("Goal found!")
                return

            for neighbor, weight in self.graph.get(current_node, []):
                if neighbor not in visited:
                    queue.append((weight, neighbor))

        print("Goal not reachable!")

def convert_variables_to_binary_array(full_variables, choosen_variables):
    array = []
    for variable in full_variables:
        if(variable in choosen_variables):
            array.append(1)
        else:
            array.append(0)
    
    return array

def convert_binary_array_to_variables(binary_array, full_variables):

  choosen_variables = []
  for i in range(len(full_variables)):
    if(binary_array[i] == 1):
      choosen_variables.append(full_variables[i])

  return choosen_variables

def create_model(dataframe, variables):
  
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
  model = SVR(kernel='rbf', C=1.0, gamma='scale')

  # Treinar o modelo
  model.fit(X_train, y_train)

  # Fazer previsões
  y_pred = model.predict(X_test)
  
  print("")
  # Avaliar o modelo usando o coeficiente R²
  r2 = r2_score(y_test, y_pred)
  print("Coeficiente R² do modelo:", r2)

  return r2

def get_variables(dataframe):
  return list(dataframe.columns)

def evaluate_best_variable(dataframe):

  variables = get_variables(dataframe)

  metric_values = []
  for i, variable in enumerate(variables):
    if(i == len(variables) - 1):
      break
    print(f"Testando variável {i}:{variable}")
    metric = create_model(dataframe, [variable])
    metric_values.append(metric)
  
  maximum_value = max(metric_values)
  maximum_index = metric_values.index(maximum_value)

  return variables[maximum_index], maximum_value

def calculate_R2(binary_array, full_variables):
    choosen_variables = convert_binary_array_to_variables(binary_array, full_variables)
    return create_model(dataframe, choosen_variables)

def explore_graph(node, current_R2, max_R2, visited, max_consecutive_worse_R2):

    # Prune the branch if current R2 is worse than max R2
    if current_R2 <= max_R2:
        return max_R2, max_consecutive_worse_R2

    # Avoid revisiting nodes to prevent infinite loops
    if node in visited:
        return max_R2, max_consecutive_worse_R2

    visited.add(node)

    if current_R2 > max_R2:
        max_R2 = current_R2
        max_consecutive_worse_R2 = 0
    else:
        max_consecutive_worse_R2 += 1

    # Prune the branch if consecutive worse R2 values exceed threshold
    if max_consecutive_worse_R2 >= 2:
        return max_R2, max_consecutive_worse_R2

    # Explore 5 children for each node
    for i in range(len(node)):
        # Add 1 to one position of the array
        if node[i] == 0:
            child = node[:i] + [1] + node[i+1:]
            child_R2 = calculate_R2(child, full_variables)
            max_R2, max_consecutive_worse_R2 = explore_graph(child, child_R2, max_R2, visited, max_consecutive_worse_R2)

    # Backtrack
    visited.remove(node)

    return max_R2, max_consecutive_worse_R2


# Criação do Dataframe
filepath = "base_full.csv"
dataframe = pd.read_csv(filepath)

print("BUSCA PELA MELHOR VARIÁVEL")

# # Escolha da melhor variável inicial
# variable, value = evaluate_best_variable(dataframe)
# print("Melhor variável:", variable)
# print("Melhor R2:", value)
# print("\n")

variable = "Eta_beta_A"

print('BUSCA PELA MELHOR ESCOLHA:')
# Definindo valores iniciais para a Busca pela melhor escolha
full_variables = get_variables(dataframe)
start_node = convert_variables_to_binary_array(full_variables, [variable])
initial_R2 = calculate_R2(start_node, full_variables)
visited = set()

max_R2, max_consecutive_worse_R2 = explore_graph(start_node, initial_R2, initial_R2, visited, 0)

