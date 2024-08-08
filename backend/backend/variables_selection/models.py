from django.db import models

from project_management.models import Project

class VariablesSelection(models.Model):
  remove_constant_variables = models.BooleanField(default=False)
  variables_to_remove = models.JSONField(default=list)

  algorithm = models.CharField(max_length=200)
  algorithm_parameters = models.JSONField(default=dict)
  model = models.CharField(
    max_length=100,
    null=True,
    blank=True,
    default=None
  )
  algorithm_progress = models.CharField(
    max_length=10,
    null=True,
    blank=True,
    default=None
  )
  algorithm_execution_type = models.CharField(
    max_length=100,
    null=True,
    blank=True,
    default=None
  )
  algorithm_task_id = models.CharField(
    max_length=100,
    null=True,
    blank=True,
    default=None
  )

  rows_to_remove = models.JSONField(default=list)



  project = models.ForeignKey(Project, on_delete=models.CASCADE)

  def set_progress(self, actual, total, actual_step, total_steps):
    self.algorithm_progress = f"{actual}/{total}/{actual_step}/{total_steps}"
    self.save()

  def set_execution_type(self, execution_type):
    self.algorithm_execution_type = execution_type
    self.save()
    
  def set_progress_none(self):
    self.algorithm_progress = None
    self.algorithm_execution_type = None
    self.save()

  def set_algorithm_task_id(self, algorithm_task_id):
    self.algorithm_task_id = algorithm_task_id
    self.save()

  def set_algorithm_task_id_none(self):
    self.algorithm_task_id = None
    self.save()

  def update(
      self, 
      remove_constant_variables, 
      variables_to_remove,
      algorithm,
      algorithm_parameters,
      model,
      rows_to_remove
    ):
    self.remove_constant_variables = remove_constant_variables
    self.variables_to_remove = variables_to_remove
    self.algorithm = algorithm
    self.algorithm_parameters = algorithm_parameters
    self.model = model
    self.rows_to_remove = rows_to_remove
    self.save()

  def __str__(self):
    return f"Seleção de variáveis com o algoritmo '{self.algorithm}'"