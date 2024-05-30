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

  def get_database(self):
    # Recuperar todos os bancos de dados associados ao projeto
    databases = self.databases.all()

    # # Verificar se a queryset está vazia
    # if not databases.exists():
    #   # Se não existir nenhum banco de dados associado, criar um novo
    #   new_database = Database.objects.create(
    #     name="Database",
    #     description="Database gerado automaticamente na função get_database()", 
    #     project=self
    #   )
    #   # Atualizar a queryset para incluir o novo banco de dados
    #   databases = self.databases.all()

    databases = list(reversed(databases))
    print(databases)

    return databases[0]

  def __str__(self):
    return f"{self.name}: {self.description}"

