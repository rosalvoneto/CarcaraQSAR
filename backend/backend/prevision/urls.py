from django.urls import path
from . import views

urlpatterns = [
  path('make_prevision', views.makePrevision_view, name="make_prevision"),
  path('create_model', views.createModel_view, name="create_model"),
  path('has_model', views.hasModel_view, name="has_model"),
  path('delete_model', views.deleteModel_view, name="delete_model"),
  path('download_model', views.donwloadModel_view, name="download_model"),
  path('download_scaler', views.donwloadScaler_view, name="download_scaler"),
  path('calculate_all', views.calculateAll_view, name="calculate_all"),
  path(
    'download_estimation', 
    views.downloadEstimation_view, 
    name="download_estimation"
  ),
]