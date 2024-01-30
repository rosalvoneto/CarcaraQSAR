from django.db import models

# Create your models here.
class Database(models.Model):
  name = models.CharField(max_length=100)
  file =  models.FileField(upload_to='databases/', null=True, blank=True)
  file_separator = models.CharField(max_length=1, default=',')
  lines = models.IntegerField()
  columns = models.IntegerField()

  def create(self, name, file, file_separator, lines, columns):
    database = Database()
    database.name = name
    database.file = file
    database.file_separator = file_separator
    database.lines = lines
    database.columns = columns
    database.save()

    return database

  def __str__(self):
    return f"{self.name}"

