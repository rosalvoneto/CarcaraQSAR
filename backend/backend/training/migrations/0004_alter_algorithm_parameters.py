# Generated by Django 4.2.7 on 2024-02-05 13:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('training', '0003_algorithm_parameters'),
    ]

    operations = [
        migrations.AlterField(
            model_name='algorithm',
            name='parameters',
            field=models.JSONField(default=dict),
        ),
    ]
