# Generated by Django 3.2.18 on 2024-03-24 15:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0016_auto_20240324_1533'),
    ]

    operations = [
        migrations.AlterField(
            model_name='season',
            name='active',
            field=models.BooleanField(default=False),
        ),
    ]