# Generated by Django 4.0.3 on 2022-04-18 01:49

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('coding', '0006_class_competitions'),
    ]

    operations = [
        migrations.AddField(
            model_name='competition',
            name='created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
