# Generated by Django 4.2.7 on 2024-02-05 13:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('training', '0002_algorithm_remove_training_remove_constant_variables_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='algorithm',
            name='parameters',
            field=models.JSONField(default={}),
        ),
    ]