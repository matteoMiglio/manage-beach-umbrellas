# Generated by Django 3.2.4 on 2023-04-20 20:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0010_alter_reservation_unique_together'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subscription',
            name='custom_period',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
    ]
