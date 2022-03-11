# Generated by Django 4.0.2 on 2022-03-09 02:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('coding', '0004_solution_unittest_teacher_authorized_codequestion'),
    ]

    operations = [
        migrations.CreateModel(
            name='Assignment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='coding.teacher')),
                ('questions', models.ManyToManyField(to='coding.CodeQuestion')),
            ],
        ),
    ]
