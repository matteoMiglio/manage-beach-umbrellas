# Generated by Django 4.1.7 on 2023-04-05 19:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_audit_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='audit',
            name='type',
            field=models.CharField(choices=[('A', 'add'), ('D', 'delete'), ('U', 'update')], default='A', max_length=1),
        ),
    ]
