# Generated by Django 4.0.3 on 2022-04-17 15:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coding', '0006_merge_20220417_1348'),
    ]

    operations = [
        migrations.AddField(
            model_name='class',
            name='competitions',
            field=models.ManyToManyField(blank=True, to='coding.competition'),
        ),
    ]
