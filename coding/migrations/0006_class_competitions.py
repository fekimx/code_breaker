# Generated by Django 4.0.3 on 2022-04-17 20:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coding', '0005_remove_competitionprogress_percent_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='class',
            name='competitions',
            field=models.ManyToManyField(blank=True, to='coding.competition'),
        ),
    ]
