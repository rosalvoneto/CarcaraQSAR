from django.db import models

from project_management.models import Project





class Algorithm(models.Model):
  # Campo de escolha para o algoritmo
  ALGORITHM_CHOICES = [
    ('random_forest', 'Random Forest'),
    ('linear_regression', 'Regressão linear'),
    ('logistic_regression', 'Regressão logística'),
    ('svm', 'Support Vector Machines (SVM)'),
  ]
  name = models.CharField(max_length=200, choices=ALGORITHM_CHOICES)
  parameters = models.JSONField(default=dict)

  def create(self, name, parameters):
    # Cria uma instância de Algorithm com base no nome fornecido e parâmetros
    algorithm = Algorithm.objects.create(
      name=name,
      parameters=parameters
    )
    return algorithm
  
  def update(self, name, parameters):
    self.name = name
    self.parameters = parameters
    self.save()

  def __str__(self):
    return self.name




class RandomForest(Algorithm):
  num_trees = models.IntegerField()
  max_depth = models.IntegerField()

class SVM(Algorithm):
  kernel = models.CharField(max_length=50)
  C_parameter = models.FloatField()

class LinearRegression(Algorithm):
  regularization = models.FloatField()




class Training(models.Model):
  # Para o treinamento
  algorithm = models.ForeignKey(Algorithm, on_delete=models.CASCADE)

  project = models.ForeignKey(Project, on_delete=models.CASCADE)

  def __str__(self):
    return self.algorithm

class VariablesSelection(models.Model):
  # Para seleção de variáveis
  algorithm = models.CharField(max_length=200)
  remove_constant_variables = models.BooleanField(default=False)

  project = models.ForeignKey(Project, on_delete=models.CASCADE)

  def __str__(self):
    return self.algorithm