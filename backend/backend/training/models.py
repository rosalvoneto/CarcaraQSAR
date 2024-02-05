from django.db import models

from project_management.models import Project

class Algorithm(models.Model):
  # Campo de escolha para o algoritmo
  ALGORITHM_CHOICES = [
    ('random_forest', 'Random Forest'),
    ('svm', 'Support Vector Machine (SVM)'),
    ('linear_regression', 'Linear Regression'),
  ]
  name = models.CharField(max_length=200, unique=True, choices=ALGORITHM_CHOICES)

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

class VariablesSelection(models.Model):
  # Para seleção de variáveis
  algorithm = models.CharField(max_length=200)
  remove_constant_variables = models.BooleanField(default=False)

  project = models.ForeignKey(Project, on_delete=models.CASCADE)