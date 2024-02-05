from email.policy import default
from django.db import models

from database.models import Database
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

  # Atributos avançados
  database = models.ForeignKey(Database, on_delete=models.CASCADE, null=True, blank=True)

  def __str__(self):
    return f"{self.name}: {self.description}"

