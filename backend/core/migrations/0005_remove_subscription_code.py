# Generated by Django 4.1.7 on 2023-04-13 20:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_alter_audit_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subscription',
            name='code',
        ),
    ]