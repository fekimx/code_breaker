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
            "active": self.is_active,
            "type": "Admin"
        }

# Teacher - extends user
class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    authorized = models.BooleanField(default=False)

    def serialize(self):
        return {
            "username": self.username,
            "name": self.get_full_name,
            "email": self.email,
            "authorized": self.authorized,
            "active": self.is_active,
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
            "active": self.is_active,
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

# open questions
# should we add a model for unit test?
# sure.  Unit test - has dynamically created id, input, expected output and visible field
class UnitTest(models.Model):
    id = models.IntegerField
    input = models.CharField(max_length=100)
    expectedOutput = models.CharField(max_length=250)
    visible = models.BooleanField

    def serialize(self):
        return {
            "id": self.id,
            "input": self.input,
            "expectedOutput": self.expectedOutput,
            "visible": self.visible,
        }

# should we add a model for solution?
class Solution(models.Model):
    id = models.IntegerField
    code = models.TextField

    def serialize(self):
        return {
            "id": self.id,
            "code": self.code
        }

# Question - starting with just codeQuestion.  
# Cosider adding base question type if/when we get to multiple choice and long form 
# note: I'm still considering what it will mean for us to have the "public repo" version of questions.
# maybe just a seperate model?

class CodeQuestion(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    author = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    practice = models.BooleanField(default=False)
    version = models.IntegerField(default=1)
    solutions = models.ForeignKey(Solution, on_delete=models.CASCADE)
    unitTests = models.ForeignKey(UnitTest, on_delete=models.CASCADE)
    
    def serialize(self):
        return {
            "name": self.name,
            "author": self.author,
            "practice": self.practice,
            "version": self.version
        }


