# Generated by Django 4.0.3 on 2022-04-12 02:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('coding', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='assignment',
            name='active',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='class',
            name='assignments',
            field=models.ManyToManyField(blank=True, to='coding.assignment'),
        ),
        migrations.CreateModel(
            name='Competition',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('active', models.BooleanField(default=False)),
                ('type', models.CharField(choices=[('R', 'Race')], max_length=1)),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('questions', models.ManyToManyField(to='coding.codequestion')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]