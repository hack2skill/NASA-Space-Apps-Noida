# Generated by Django 3.1.2 on 2023-10-07 17:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('flight', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='place',
            old_name='airport',
            new_name='landingSite',
        ),
        migrations.RenameField(
            model_name='place',
            old_name='country',
            new_name='planet',
        ),
    ]
