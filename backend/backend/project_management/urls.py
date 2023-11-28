from django.urls import path
from . import views

urlpatterns = [
  path('', views.getRoutes, name="get_routes"),

  path('new/', views.createProject_view, name="create_project"),
  path('database/', views.database_view, name="database"),
  path('all_projects/', views.allProjects_view, name="all_projects"),
]