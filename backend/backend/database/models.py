from django.db import models

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
  file =  models.FileField(upload_to='databases/', null=True, blank=True)
  file_separator = models.CharField(max_length=1, default=',')
  lines = models.IntegerField()
  columns = models.IntegerField()
  
  normalization = models.OneToOneField(
    Normalization, 
    on_delete=models.SET_NULL, 
    null=True, blank=True
  )

  def create(self, name, file, file_separator, lines, columns):
    database = Database()
    database.name = name
    database.file = file
    database.file_separator = file_separator
    database.lines = lines
    database.columns = columns
    database.normalization = None
    database.save()

    return database

  def __str__(self):
    return f"{self.name}"
