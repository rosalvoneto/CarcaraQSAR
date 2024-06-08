from django.db import models

from project_management.models import Project

class VariablesSelection(models.Model):
  remove_constant_variables = models.BooleanField(default=False)
  variables_to_remove = models.JSONField(default=list)

  algorithm = models.CharField(max_length=200)
  algorithm_parameters = models.JSONField(default=dict)
  algorithm_progress = models.CharField(
    max_length=10,
    null=True,
    blank=True,
    default=None
  )

  rows_to_remove = models.JSONField(default=list)



  project = models.ForeignKey(Project, on_delete=models.CASCADE)

  def set_algorithm_progress(self, actual, total):
    self.algorithm_progress = f"{actual}/{total}"
    self.save()
    
  def set_progress_none(self):
    self.algorithm_progress = None
    self.save()

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