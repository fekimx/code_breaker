from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass

# User related models, teacher, learner, admin.
# We could in theory also use a boolean or enum to differentiate but I'm using models here
# For better clarity

# Admin - Superuser who can authorize/create Teachers
class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def serialize(self):
        return {
            "username": self.username,
            "name": self.get_full_name,
            "email": self.email,
            "type": "Admin"
        }

# Teacher - extends user
class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def serialize(self):
        return {
            "username": self.username,
            "name": self.get_full_name,
            "email": self.email,
            "type": "Teacher"
        }

# Learner - extends user
class Learner(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def serialize(self):
        return {
            "username": self.username,
            "name": self.get_full_name,
            "email": self.email,
            "type": "Learner"
        }

# Class - data object to organize students
class Class(models.Model):
    name = models.CharField(max_length=100)
    secretKey = models.CharField(max_length=25)
    active = models.BooleanField(default=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    TAs = models.ManyToManyField(Teacher, related_name="TAs")
    students = models.ManyToManyField(Learner)

    def serialize(self):
        return {
            "name": self.name,
            "key": self.secretKey,
            "teacher": self.teacher,
        }