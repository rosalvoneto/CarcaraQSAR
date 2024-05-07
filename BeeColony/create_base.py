
from utils import convert_binary_array_to_variables, get_variables
import pandas as pd


filepath = "base_compressed.csv"
dataframe = pd.read_csv(filepath)

file = "Valores R2.csv"
R2_dataframe = pd.read_csv(file)

index = R2_dataframe.iloc[:, 1].idxmax()

new_R2_dataframe = R2_dataframe
new_R2_dataframe = R2_dataframe.drop(R2_dataframe.columns[:2], axis=1)
new_R2_dataframe.to_csv("temporary.csv", sep=',', index=False)

variables_dataframe = pd.read_csv("temporary.csv", sep=';')

choosen_variables = variables_dataframe.iloc[index, 0]



binary_array = eval(choosen_variables)

print(binary_array)

full_variables = get_variables(dataframe)
variables = convert_binary_array_to_variables(binary_array, full_variables)

print(f"Quantidade de variáveis: {len(variables)}")

new_dataframe = dataframe[variables]
# Adicionando a última coluna
last_column_name = list(dataframe.columns)[-1]
new_dataframe[last_column_name] = dataframe[last_column_name].tolist()
print("Quantidade de colunas do novo Dataframe:", len(list(new_dataframe.columns)))

new_dataframe.to_csv("base_best.csv", index=False)
