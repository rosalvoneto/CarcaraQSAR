import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg
from io import StringIO, BytesIO
import base64

from padelpy import from_smiles

def getHistogramImage(array, num_bins):
  # Fazer cálculo de Histograma
  # Calcule o histograma
  hist, bins = np.histogram(array, bins=num_bins)
  # Calcule a amplitude dos intervalos
  amplitude_intervals = bins[1] - bins[0]

  # Crie o histograma usando Matplotlib
  fig, ax = plt.subplots()
  ax.bar(bins[:-1], hist, width=amplitude_intervals, edgecolor='black')

  ax.set_title('Histograma')
  ax.set_xlabel('Valores')
  ax.set_ylabel('Frequência')

  # Renderize a figura
  canvas = FigureCanvasAgg(fig)
  canvas.draw()

  # Obtenha os bytes da imagem
  buffer = BytesIO()
  canvas.print_png(buffer)
  buffer.seek(0)

  # Leia os bytes da imagem
  histogram_bytes = buffer.read()
  histogram_base64 = base64.b64encode(histogram_bytes).decode('utf-8')

  # Limpeza da exibição
  plt.clf()

  return histogram_base64

def getBoxPlotImage(array):
  # Fazer cálculo de BoxPlot
  # Crie o box plot
  fig, ax = plt.subplots()
  ax.boxplot(array)
  ax.set_title('Box Plot')
  ax.set_xlabel('Valores')

  # Renderize a figura usando FigureCanvasAgg
  canvas = FigureCanvasAgg(fig)
  canvas.draw()

  # Obtenha os bytes da imagem
  buffer = BytesIO()
  canvas.print_png(buffer)
  buffer.seek(0)

  # Converta a imagem para base64
  boxPlot_base64 = base64.b64encode(buffer.read()).decode('utf-8')

  # Limpeza da figura
  plt.clf()

  return boxPlot_base64

def get_line_descriptors(akeys, adescriptors):
  l = ''
  for k in akeys:
    if len(l) == 0:
      l = adescriptors[k]
    else:
      l = l + ';' + adescriptors[k]
  return l

def convertSmilesToCSV():
  smiles = "N1(C(=O)c2c(C1=O)cccc2)CC1N(C(=O)N(CC)CC)CCc2c1cccc2"
  descriptors = from_smiles(smiles, 'output.csv', True)
  print(descriptors)

# convertSmilesToCSV()





# from padelpy import padeldescriptor
# import pandas as pd
# import tempfile
# import os

# # Função para gerar descritores usando padelpy
# def gerar_descritores_smiles(smiles, output_file):
#     # Configurações do padelpy
#       # Substitua pelo caminho real para o executável padel-descriptor
#     padel_exe = '/caminho/para/padel-descriptor'
#     padel_options = '-k -descriptortypes fingerprint -retainorder -fingerprints ' + output_file

#     # Criar um arquivo temporário com a string SMILES
#     with tempfile.NamedTemporaryFile(mode='w', delete=False) as temp_file:
#       temp_file.write(smiles)
#       temp_smiles_file = temp_file.name

#     try:
#       # Executar padeldescriptor
#       padeldescriptor(
#         mol_dir=temp_smiles_file, d_file=output_file, 
#         threads=1, log=True,
#         # descriptors=True, detectar_3D=False,
#         # standardizer=False,
#         # padel_path=padel_exe, padel_options=padel_options
#       )

#     except Exception as e:
#       # Capturar e imprimir a exceção
#       print(f"Erro ao gerar descritores: {e}")

#     finally:
#         # Remover o arquivo temporário
#         os.remove(temp_smiles_file)

# # String SMILES fornecida
# smiles_string = "N1(C(=O)c2c(C1=O)cccc2)CC1N(C(=O)N(CC)CC)CCc2c1cccc2"

# # Gerar descritores e salvar em um arquivo CSV
# output_csv = 'output.csv'
# gerar_descritores_smiles(smiles_string, output_csv)

# # Ler o arquivo CSV gerado
# try:
#     df = pd.read_csv(output_csv)
#     # Visualizar o DataFrame
#     print(df)
# except pd.errors.EmptyDataError:
#     print("O arquivo CSV está vazio.")
# except pd.errors.ParserError:
#     print("Erro ao analisar o arquivo CSV.")
