from django.urls import path
from . import views

urlpatterns = [
  path('set_settings', views.setVariablesSettings_view, name='set_variables_settings'),
  path('get_settings', views.getVariablesSettings_view, name='get_variables_settings'),
  path('set_training_settings', views.setTrainingSettings_view, name='set_training_settings'),
  path('get_training_settings', views.getTrainingSettings_view, name='get_training_settings'),
  path('train', views.train_view, name='train'),
]