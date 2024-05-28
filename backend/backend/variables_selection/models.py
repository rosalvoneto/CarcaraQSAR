from django.db import models

from project_management.models import Project

class VariablesSelection(models.Model):
  remove_constant_variables = models.BooleanField(default=False)
  variables_to_remove = models.JSONField(default=list)

  algorithm = models.CharField(max_length=200)
  algorithm_parameters = models.JSONField(default=dict)

  rows_to_remove = models.JSONField(default=list)


  project = models.ForeignKey(Project, on_delete=models.CASCADE)

  def update(
      self, 
      remove_constant_variables, 
      variables_to_remove,
      algorithm,
      algorithm_parameters,
      rows_to_remove
    ):
    self.remove_constant_variables = remove_constant_variables
    self.variables_to_remove = variables_to_remove
    self.algorithm = algorithm
    self.algorithm_parameters = algorithm_parameters
    self.rows_to_remove = rows_to_remove
    self.save()

  def __str__(self):
    return f"Seleção de variáveis com o algoritmo '{self.algorithm}'"