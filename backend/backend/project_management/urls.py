from django.urls import path
from . import views

urlpatterns = [
  path('', views.getRoutes, name="get_routes"),

  path('new/', views.createProject_view, name="create_project"),
  path('database/', views.database_view, name="database"),
  path('projects/', views.allProjects_view, name="projects"),
  path(
    'deactivated_projects/', 
    views.deactivatedProjects_view, 
    name="deactivated_projects"
  ),
  path(
    'deactivate_project/<int:project_id>', 
    views.deactivateProject_view, 
    name="deactivate_project"
  ),
  path(
    'delete_project/<int:project_id>', 
    views.deleteProject_view, 
    name="delete_project"
  )
]