# Generated by Django 3.2 on 2021-06-03 19:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0009_auto_20210531_1944'),
    ]

    operations = [
        migrations.AddField(
            model_name='subscription',
            name='tmp',
            field=models.BooleanField(null=True),
        ),
    ]
