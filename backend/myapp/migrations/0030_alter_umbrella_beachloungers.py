# Generated by Django 3.2 on 2021-06-17 20:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0029_auto_20210617_2009'),
    ]

    operations = [
        migrations.AlterField(
            model_name='umbrella',
            name='beachLoungers',
            field=models.PositiveSmallIntegerField(),
        ),
    ]
