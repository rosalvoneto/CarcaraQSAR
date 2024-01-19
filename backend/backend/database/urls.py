from django.urls import path
from . import views

urlpatterns = [
  path('send', views.sendDatabase_view, name="send_database"),
  path('receive', views.getDatabase_view, name="get_database"),
  path('project_name', views.getProjectName_view, name="get_database"),
]