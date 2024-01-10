from django.urls import path
from . import views

urlpatterns = [
  path('', views.getRoutes, name="get_routes"),

  path('new/', views.createProject_view, name="create_project"),
  path(
    'projects/', 
    views.projects_view, 
    name="projects"
  ),
  path(
    'shared_projects', 
    views.sharedProjects_view, 
    name="shared_projects"
  ),
  path(
    'deactivated_projects/', 
    views.deactivatedProjects_view, 
    name="deactivated_projects"
  ),
  path(
    'activate_project/<int:project_id>', 
    views.activateProject_view, 
    name="activate_project"
  ),
  path(
    'deactivate_project/<int:project_id>', 
    views.deactivateProject_view, 
    name="deactivate_project"
  ),
  path(
    'share_project/<int:project_id>', 
    views.shareProject_view, 
    name="share_project"
  ),
  path(
    'deshare_project/<int:project_id>', 
    views.deshareProject_view, 
    name="deshare_project"
  ),
  path(
    'delete_project/<int:project_id>', 
    views.deleteProject_view, 
    name="delete_project"
  )
]