from email.policy import default
from django.db import models

from user.models import User

# Create your models here.
class Project(models.Model):
  name = models.CharField(max_length=100)
  description = models.CharField(max_length=500)
  status = models.CharField(max_length=50, default='Database')
  modification_date = models.DateTimeField(auto_now=True)
  shared = models.BooleanField(default=False)

  # Quando estiver na lixeira é preciso alterar o valor
  isActive = models.BooleanField(default=True)

  user = models.ForeignKey(User, on_delete=models.CASCADE)

  def __str__(self):
    return f"{self.id}: {self.name}: {self.description}"

