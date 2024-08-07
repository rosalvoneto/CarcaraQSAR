from django.urls import path
from . import views

urlpatterns = [
  path(
    'set_training_settings', 
    views.setTrainingSettings_view, 
    name='set_training_settings'
  ),
  path(
    'get_training_settings', 
    views.getTrainingSettings_view, 
    name='get_training_settings'
  ),
  path('make_training', views.makeTraining_view, name='make_training'),
  path('cancel_training', views.cancelTraining_view, name='cancel_training'),
  path('status_training', views.checkTrainingStatus_view, name='status_training'),
  path(
    'get_leave_one_out', 
    views.getLeaveOneOut_view, 
    name='get_leave_one_out'
  ),
  path(
    'get_importance', 
    views.getImportance_view, 
    name='get_importance'
  ),
  path(
    'get_k_fold_cross_validation', 
    views.getKFoldCrossValidation_view, 
    name='get_k_fold_cross_validation'
  ),
  path(
    'get_y_scrambling', 
    views.getYScrambling_view, 
    name='get_y_scrambling'
  ),
  path(
    'get_bootstrap', 
    views.getBootstrap_view, 
    name='get_bootstrap'
  ),
  path(
    'get_bootstrap_details',
    views.getBootstrapDetails_view,
    name='get_bootstrap_details'
  ),
  path(
    'set_training_progress', 
    views.setTrainingProgress_view, 
    name='set_training_progress'
  ),
  path(
    'get_training_progress', 
    views.getTrainingProgress_view, 
    name='get_training_progress'
  ),
]