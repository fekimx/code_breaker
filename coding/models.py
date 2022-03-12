from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# From https://dev.to/koladev/django-rest-authentication-cmh

class UserManager(BaseUserManager):

    def create_user(self, username, email, password=None, **kwargs):
        """Create and return a `User` with an email, phone number, username and password."""
        if username is None:
            raise TypeError('Users must have a username.')
        if email is None:
            raise TypeError('Users must have an email.')

        user = self.model(username=username, email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username, email, password):
        """
        Create and return a `User` with superuser (admin) permissions.
        """
        if password is None:
            raise TypeError('Superusers must have a password.')
        if email is None:
            raise TypeError('Superusers must have an email.')
        if username is None:
            raise TypeError('Superusers must have an username.')

        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(db_index=True, max_length=255, unique=True)
    email = models.EmailField(db_index=True, unique=True, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        return f"{self.email}"

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
    author = models.ForeignKey(Teacher, on_delete=models.CASCADE, null=True)
    practice = models.BooleanField(default=False)
    version = models.IntegerField(default=1)
    solutions = models.ForeignKey(Solution, on_delete=models.CASCADE, null=True)
    unitTests = models.ForeignKey(UnitTest, on_delete=models.CASCADE, null=True)
    
    def serialize(self):
        return {
            "name": self.name,
            "author": self.author,
            "practice": self.practice,
            "version": self.version
        }

class Assignment(models.Model):
    name = models.CharField(max_length=100)
    author = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    questions = models.ManyToManyField(CodeQuestion)

    def serialize(self):
        return {
            "name": self.name,
            "author": self.author
        }

# we need a way to individually determine "done" from a learner to a question
# and we need a way to individually determine percentage completion from a learner to an assignment
# thus, we have status.  Status can be applied to a question and represents the learner's progress.
class Status(models.Model):
    learner = models.ManyToManyField(Learner)
    question = models.ManyToManyField(CodeQuestion)
    complete = models.BooleanField(default=False)

    def serialize(self):
        return {
            "learner": self.learner.name,
            "question": self.question.name,
            "complete": self.complete
        }

# Progress is the same thing but for an assignment
class Progress(models.Model):
    learner = models.ManyToManyField(Learner)
    assignment = models.ManyToManyField(Assignment)
    percent = models.IntegerField(default=0)

    def serialize(self):
        return {
            "learner": self.learner.name,
            "assignment": self.assignment.name,
            "percent": self.percent
        }
