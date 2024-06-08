from django.db import models

from joblib import dump, load

class PrevisionModel(models.Model):
  model_file = models.FileField(
    upload_to='models/', null=True, blank=True
  )
  scaler_file = models.FileField(
    upload_to='scalers/', null=True, blank=True
  )
  variables = models.JSONField(
    default=list
  )

  # Obrigatório na criação
  project_id = models.IntegerField()

  def create(self, project_id):
    return self.objects.create(
      project_id=project_id
    )

  def retrieve_model(self):
    # Carregar o modelo de volta
    model = load(self.model_file.path)
    return model
  
  def retrieve_scaler(self):
    # Carregar o scaler de volta
    scaler = load(self.scaler_file.path)
    return scaler
  
  def add_scaler(self, scaler):
    self.scaler_file = scaler
    self.save()

  def add_model(self, model):
    self.model_file = model
    self.save()

  def add_variables(self, variables):
    self.variables = variables
    self.save()

  def __str__(self):
    try:
      return f"Modelo de previsão {self.project_id}"
    except:
      return "Modelo de previsão sem projeto associado"