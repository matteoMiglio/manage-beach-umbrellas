# Generated by Django 3.2 on 2021-06-03 20:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0011_remove_subscription_tmp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reservation',
            name='umbrella',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='umbrella', to='myapp.umbrella'),
        ),
    ]
