from django.urls import path
from . import views

urlpatterns = [
  path(
    'set_settings', 
    views.setVariablesSettings_view, 
    name='set_variables_settings'
  ),
  path(
    'get_settings', 
    views.getVariablesSettings_view, 
    name='get_variables_settings'
  ),
  path('remove_rows',views.removeRows_view, name='remove_rows' ),
  path(
    'remove_constant_variables',
    views.removeConstantVariables_view, 
    name='remove_constant_variables' 
  ),
  path('remove_variables',views.removeVariables_view, name='remove_variables' ),
  path('make_selection', views.makeSelection_view, name='make_selection'),
  path('cancel_selection', views.cancelSelection_view, name='cancel_selection'),
  path('status_selection', views.checkSelectionStatus_view, name='status_selection'),
  path(
    'get_selection_progress', 
    views.getSelectionProgress_view, 
    name='get_selection_progress'
  ),
  path(
    'set_selection_progress', 
    views.setSelectionProgress_view, 
    name='set_selection_progress'
  ),
]
