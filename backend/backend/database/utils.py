import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg
from io import StringIO, BytesIO
import base64

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
  list_descriptors = ''
  for key in akeys:
    if len(list_descriptors) == 0:
      list_descriptors = adescriptors[key]
    else:
      list_descriptors = list_descriptors + ',' + adescriptors[key]
  return list_descriptors
