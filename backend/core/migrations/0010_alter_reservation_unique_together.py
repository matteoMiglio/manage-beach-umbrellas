# Generated by Django 3.2.4 on 2023-04-20 20:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_alter_subscription_code'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='reservation',
            unique_together={('umbrella', 'date')},
        ),
    ]