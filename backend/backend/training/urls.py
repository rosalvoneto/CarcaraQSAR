from django.urls import path
from . import views

urlpatterns = [
  path('set_settings', views.setTrainingSettings_view, name='set_training_settings'),
  path('get_settings', views.getTrainingSettings_view, name='get_training_settings'),
]