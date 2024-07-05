from django.db import models
from django.core.files import File

from user.models import User
from prevision.models import PrevisionModel

from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor

from joblib import dump, load
import pandas as pd
from io import StringIO
import os

# Create your models here.
class Project(models.Model):
  # Atributos básicos
  name = models.CharField(max_length=100)
  description = models.CharField(max_length=500)
  status = models.CharField(max_length=50, default='Database')
  modification_date = models.DateTimeField(auto_now=True)
  shared = models.BooleanField(default=False)
  isActive = models.BooleanField(default=True)

  prevision_model = models.OneToOneField(
    PrevisionModel, 
    on_delete=models.SET_NULL, 
    null=True, 
    blank=True, 
    related_name='project'
  )
  
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

  def create_model(self, dataframe):
  
    X = dataframe.iloc[:, :-1]
    y = dataframe.iloc[:, -1]

    # Normalizar os dados
    scaler = MinMaxScaler()
    X_subset = scaler.fit_transform(X)

    # Recupera Database
    database = self.get_database()

    # Salvar o scaler em arquivo
    file_path = 'scaler.pkl'
    dump(scaler, file_path)

    # Tranformar o arquivo em um tipo File
    with open(file_path, 'rb') as new_file:
      scaler_file = File(new_file)

      # Cria um PrevisionModel
      self.prevision_model = PrevisionModel.objects.create(
        project_id=database.project.id
      )
      # Vincula scaler ao projeto
      self.prevision_model.add_scaler(scaler_file)
      self.save()
    
    # Exclui o modelo da localização temporária
    os.remove(file_path)

    # Criar o modelo
    # (Deve ser utilizado o tipo de modelo correto)
    model = RandomForestRegressor(
      n_estimators=50,
      max_features='log2'
    )

    # Treinar o modelo
    model.fit(X_subset, y)

    return model
  
  def create_prevision_model(self):
    database = self.get_database()

    if(database):
      if(database.file):

        # Cria um DataFrame do Pandas com o conteúdo do arquivo
        file_content = database.file.read().decode('utf-8')
        dataframe = pd.read_csv(
          StringIO(file_content), 
          sep=database.file_separator
        )
        variables = list(dataframe.columns)[:-1]

        # Criar o modelo
        model = self.create_model(dataframe)

        # Salvar o modelo em um arquivo
        file_path = 'model.pkl'
        dump(model, file_path)

        # Tranformar o arquivo em um tipo File
        with open(file_path, 'rb') as new_file:
          model_file = File(new_file)

          # Vincula modelo ao projeto
          self.prevision_model.add_model(model_file)
          # Vincula variáveis usadas ao projeto
          self.prevision_model.add_variables(variables)
          self.save()

        # Exclui o modelo da localização temporária
        os.remove(file_path)

        return True
    return False

  def update_status(self, new_status=None):
    if(new_status):
      self.status = new_status
      self.save()
    else:
      status_types = [
        'Database', 'Pré-processamento', 'Seleção de variáveis', 
        'Treinamento', 'Resultados', 'Previsão'
      ]

      index = 0
      for i in range(len(status_types) - 1):
        if(self.status == status_types[i]):
          self.status = status_types[i + 1]
          index = i + 1
          break
      
      print(f"Status escolhido: {status_types[index]}")
      self.save()

  def __str__(self):
    return f"{self.name}: {self.description}"

