from django.urls import path
from . import views

urlpatterns = [
  path('create_user', views.createUser_view, name="create_user"),
]