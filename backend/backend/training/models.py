from django.db import models

from project_management.models import Project

# Create your models here.
class Training(models.Model):
  algorithm = models.CharField(max_length=200)
  remove_constant_variables = models.BooleanField(default=False)

  project = models.ForeignKey(Project, on_delete=models.CASCADE)