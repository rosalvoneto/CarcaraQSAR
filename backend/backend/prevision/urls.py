from django.urls import path
from . import views

urlpatterns = [
  path('make_prevision', views.makePrevision_view, name="make_prevision"),
  path('create_model', views.createModel_view, name="create_model"),
]