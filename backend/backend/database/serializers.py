from rest_framework import serializers
from .models import Database

class DatabaseSerializer(serializers.ModelSerializer):

  created_at = serializers.DateTimeField(format='%d-%m-%Y %H:%M:%S')

  class Meta:
    model = Database
    fields = '__all__'
