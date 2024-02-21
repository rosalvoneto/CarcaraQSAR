# Generated by Django 4.2.7 on 2024-02-10 12:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('training', '0010_training_with_full_set'),
    ]

    operations = [
        migrations.AddField(
            model_name='training',
            name='bootstrap',
            field=models.ImageField(blank=True, default=None, null=True, upload_to='graphics_results/bootstrap/'),
        ),
        migrations.AddField(
            model_name='training',
            name='importance',
            field=models.ImageField(blank=True, default=None, null=True, upload_to='graphics_results/importance/'),
        ),
        migrations.AddField(
            model_name='training',
            name='k_fold_cross_validation',
            field=models.ImageField(blank=True, default=None, null=True, upload_to='graphics_results/k-fold_cross_validation/'),
        ),
        migrations.AddField(
            model_name='training',
            name='leave_one_out',
            field=models.ImageField(blank=True, default=None, null=True, upload_to='graphics_results/leave_one_out/'),
        ),
        migrations.AddField(
            model_name='training',
            name='y_scrambling',
            field=models.ImageField(blank=True, default=None, null=True, upload_to='graphics_results/y-scrambling/'),
        ),
    ]