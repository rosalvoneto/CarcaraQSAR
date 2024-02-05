from django.contrib import admin
from .models import VariablesSelection, Algorithm, Training

# Register your models here.
admin.site.register(VariablesSelection)
admin.site.register(Algorithm)
admin.site.register(Training)