from django.urls import path
from . import views

urlpatterns = [
  path('send', views.sendDatabase_view, name="send_database"),
]