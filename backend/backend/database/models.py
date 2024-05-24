from email.policy import default
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
  lines = models.IntegerField(default=0)
  columns = models.IntegerField(default=0)

  conversion_progress = models.CharField(
    max_length=10,
    null=True,
    blank=True,
    default=None
  )
  
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
  
  def update_file(self, file, lines, columns):
    self.file = file
    self.lines = lines
    self.columns = columns
    self.save()
  
  def set_conversion_progress(self, actual, total):
    self.conversion_progress = f"{actual}/{total}"
    self.save()

  def __str__(self):
    return f"{self.name}"

class CSVDatabase(models.Model):
  file =  models.FileField(upload_to='databases/', null=True, blank=True)
  uploaded_at = models.DateTimeField(auto_now_add=True)
  change_description = models.CharField(max_length=300)

  actual_database = models.ForeignKey(
    Database, 
    related_name='CSVDatabase', 
    on_delete=models.CASCADE
  )

  def __str__(self):
    return f"{self.file.name} uploaded at {self.uploaded_at}"
  
