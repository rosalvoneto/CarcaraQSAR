from django.urls import path
from . import views

urlpatterns = [
  path('set_algorithm', views.setAlgorithm_view, name='set_algorithm'),
]
