from django.contrib import admin
from .models import Database, Normalization, CSVDatabase

# Register your models here.
admin.site.register(Database)
admin.site.register(Normalization)
admin.site.register(CSVDatabase)