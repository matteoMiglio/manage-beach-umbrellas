# Generated by Django 3.2 on 2021-06-14 20:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0018_alter_subscription_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subscription',
            name='type',
            field=models.CharField(blank=True, default='', max_length=11),
        ),
    ]