from django.db import models
from django.core.files import File

from user.models import User

# Create your models here.
class Project(models.Model):
  # Atributos básicos
  name = models.CharField(max_length=100)
  description = models.CharField(max_length=500)
  status = models.CharField(max_length=50, default='Database')
  modification_date = models.DateTimeField(auto_now=True)
  shared = models.BooleanField(default=False)
  isActive = models.BooleanField(default=True)
  
  user = models.ForeignKey(User, on_delete=models.CASCADE)

  def get_databases(self):
    databases = self.databases.all()
    databases = list(reversed(databases))
    return databases

  def get_database(self):
    databases = self.get_databases()
    if(len(databases)):
      return databases[0]
    else:
      return None

  def __str__(self):
    return f"{self.name}: {self.description}"

