from django.urls import path
from . import views

urlpatterns = [
  path('send', views.sendDatabase_view, name="send_database"),
  path('receive', views.getDatabase_view, name="get_database"),
  path('variables', views.getVariables_view, name="get_variables"),
  path('histogram', views.getHistogram_view, name="histogram"),
  path('box_plot', views.getBoxPlot_view, name="box_plot"),
  path(
    'convert_and_send', 
    views.convertAndSendDatabase_view, 
    name="convert_and_send_database"
  ),
  path(
    'set_normalization_settings', 
    views.setNormalizationSettings_view, 
    name="set_normalization_settings"
  ),
  path(
    'get_normalization_settings', 
    views.getNormalizationSettings_view, 
    name="get_normalization_settings"
  ),
  path(
    'get_conversion_progress', 
    views.getConversionProgress_view, 
    name='get_conversion_progress'
  ),
  path(
    'get_databases', 
    views.getDatabases_view, 
    name='get_databases'
  ),
  path(
    'download_database',
    views.downloadDatabase_view,
    name='download_database'
  ),
  path(
    'delete_database',
    views.deleteDatabase_view,
    name='delete_database'
  ),
  path(
    'file_message_database',
    views.getFileMessageDatabase_view,
    name='file_message_database'
  )
]