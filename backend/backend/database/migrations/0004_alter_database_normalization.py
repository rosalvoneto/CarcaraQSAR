# Generated by Django 4.2.7 on 2024-02-02 18:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('database', '0003_remove_normalization_database_database_normalization'),
    ]

    operations = [
        migrations.AlterField(
            model_name='database',
            name='normalization',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='database.normalization'),
        ),
    ]
