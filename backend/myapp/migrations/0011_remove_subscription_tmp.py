# Generated by Django 3.2 on 2021-06-03 19:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0010_subscription_tmp'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subscription',
            name='tmp',
        ),
    ]