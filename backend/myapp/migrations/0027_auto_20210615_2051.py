# Generated by Django 3.2 on 2021-06-15 20:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0026_auto_20210615_2040'),
    ]

    operations = [
        migrations.AddField(
            model_name='umbrella',
            name='code',
            field=models.CharField(default=0, max_length=3),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='umbrella',
            name='col',
            field=models.SmallIntegerField(default=0),
        ),
    ]
