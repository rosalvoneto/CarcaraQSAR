import pandas as pd

# Função para ler um CSV e remover colunas com valores vazios
def remove_empty_columns(input_csv, output_csv):
    # Ler o CSV
    df = pd.read_csv(input_csv)
    
    # Remover colunas com valores NaN
    df_cleaned = df.dropna(axis=1)
    
    # Gravar o novo CSV
    df_cleaned.to_csv(output_csv, index=False)
    print(f"Arquivo salvo como {output_csv}")

# Exemplo de uso
input_csv = '31chalcSMILES.csv'  # Substitua pelo caminho do seu arquivo CSV de entrada
output_csv = 'output.csv'  # Substitua pelo caminho do seu arquivo CSV de saída

remove_empty_columns(input_csv, output_csv)
