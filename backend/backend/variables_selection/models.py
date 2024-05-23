from django.db import models

from project_management.models import Project

# Create your models here.
class VariablesSelection(models.Model):
  # Para seleção de variáveis
  algorithm = models.CharField(max_length=200)
  algorithm_parameters = models.JSONField(default=dict)

  remove_constant_variables = models.BooleanField(default=False)
  variables_to_remove = models.JSONField(default=list)

  project = models.ForeignKey(Project, on_delete=models.CASCADE)

  def update(
      self, 
      algorithm,
      algorithm_parameters = {},
      remove_constant_variables = False, 
      variables_to_remove = []
    ):
    self.algorithm = algorithm
    self.algorithm_parameters = algorithm_parameters
    self.remove_constant_variables = remove_constant_variables
    self.variables_to_remove = variables_to_remove
    self.save()

  def __str__(self):
    return f"Seleção de variáveis com o algoritmo '{self.algorithm}'"