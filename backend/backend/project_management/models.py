from django.db import models

# Create your models here.
class Project(models.Model):
  name = models.CharField(max_length=100)
  description = models.CharField(max_length=500)
  status = models.CharField(max_length=50)
  modification_date = models.DateField(auto_created=True)

  # Quando estiver na lixeira é preciso alterar o valor
  isActive = models.BooleanField(default=True)
