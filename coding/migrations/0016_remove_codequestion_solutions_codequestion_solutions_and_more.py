# Generated by Django 4.0.3 on 2022-03-28 23:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coding', '0015_alter_assignment_id_alter_codequestion_id_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='codequestion',
            name='solutions',
        ),
        migrations.AddField(
            model_name='codequestion',
            name='solutions',
            field=models.ManyToManyField(to='coding.solution'),
        ),
        migrations.RemoveField(
            model_name='codequestion',
            name='unitTests',
        ),
        migrations.AddField(
            model_name='codequestion',
            name='unitTests',
            field=models.ManyToManyField(to='coding.unittest'),
        ),
    ]
