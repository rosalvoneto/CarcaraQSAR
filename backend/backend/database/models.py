import os
from django.db import models
from django.core.files import File

from project_management.models import Project

# Create your models here.
class Normalization(models.Model):
  name = models.CharField(max_length=100)
  applied = models.BooleanField(default=False)
  
  def update(self, name, applied):
    self.name = name
    self.applied = applied
    self.save()
    
  def __str__(self):
    return f"{self.name}"
  
class Database(models.Model):
  name = models.CharField(max_length=100)
  description = models.CharField(max_length=300 ,default="")
  file =  models.FileField(upload_to='databases/', null=True, blank=True)
  file_message = models.CharField(
    max_length=100,
    null=True,
    blank=True,
    default=None
  )

  file_separator = models.CharField(max_length=1, default=',')
  lines = models.IntegerField(default=0)
  columns = models.IntegerField(default=0)

  created_at = models.DateTimeField(auto_now_add=True)

  normalization = models.OneToOneField(
    Normalization, 
    on_delete=models.CASCADE, 
    null=True, blank=True
  )

  project = models.ForeignKey(
    Project,
    on_delete=models.CASCADE, 
    null=True, blank=True,
    related_name='databases'
  )

  conversion_progress = models.CharField(
    max_length=10,
    null=True,
    blank=True,
    default=None
  )

  def create_empty_database(self):
    database = Database.objects.create(
      name="Database vazio",
      description="Database gerado automaticamente",
      file=None,
      normalization=None,
      project=None,
    )
    return database

  def create_database(self, path, description, dataframe):

    # Transformar o dataframe em um arquivo
    file_path = path
    dataframe.to_csv(file_path, index=False)
    # Tranformar o arquivo em um tipo File
    with open(file_path, 'rb') as new_file:
      django_file = File(new_file)
      # Criar um novo Database associado ao projeto
      normalization = Normalization.objects.create(
        name=self.normalization.name,
        applied=self.normalization.applied
      )

      Database.objects.create(
        name=self.name,
        description=description,
        file=django_file,
        file_separator=",",
        lines=dataframe.shape[0],
        columns=dataframe.shape[1],
        normalization=normalization,
        project=self.project,
      )

    # Remove arquivo temporário
    os.remove(file_path)
  
  def update_file(self, file, lines, columns):
    self.file = file
    self.lines = lines
    self.columns = columns
    self.save()
  
  def set_conversion_progress(self, actual, total):
    self.conversion_progress = f"{actual}/{total}"
    self.save()

  def __str__(self):
    return f"{self.name}: {self.description}"
