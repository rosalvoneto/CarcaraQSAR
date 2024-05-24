from django.urls import path
from . import views

urlpatterns = [
  path('set_algorithm', views.setAlgorithm_view, name='set_algorithm'),
  path('remove_rows',views.removeRows_view, name='remove_rows' ),
]
