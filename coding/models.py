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
    is_student = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        return f"{self.email}"

# open questions
# should we add a model for unit test?
# sure.  Unit test - has dynamically created id, input, expected output and visible field
class UnitTest(models.Model):
    input = models.CharField(max_length=100, null=True)
    expectedOutput = models.CharField(max_length=250)
    visible = models.BooleanField(default=True)

# should we add a model for solution?
class Solution(models.Model):
    code = models.TextField(null=True)

# Question - starting with just codeQuestion.  
# Cosider adding base question type if/when we get to multiple choice and long form 
# note: I'm still considering what it will mean for us to have the "public repo" version of questions.
# maybe just a seperate model?

class CodeQuestion(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    code = models.TextField(null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    practice = models.BooleanField(default=False)
    version = models.IntegerField(default=1)
    solutions = models.ManyToManyField(Solution)
    unitTests = models.ManyToManyField(UnitTest)
    
# This is how we're going to add weights to a given question
class QuestionWeightPair(models.Model):
    question = models.ForeignKey(CodeQuestion, on_delete=models.CASCADE)
    weight = models.IntegerField(default=1)

class CommonAssignmentCompetitionInfo(models.Model):
    name = models.CharField(max_length=100)
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    questions = models.ManyToManyField(QuestionWeightPair)
    active = models.BooleanField(default=False)

    class Meta:
        abstract = True

class Assignment(CommonAssignmentCompetitionInfo):

    def serialize(self):
        return {
            "name": self.name,
            "author": self.author,
            "active": self.active
        }

class Competition(CommonAssignmentCompetitionInfo):
    COMPETITION_TYPE = (
        ('R', 'Race'),
    )
    type = models.CharField(max_length=1, choices=COMPETITION_TYPE)

    def serialize(self):
        return {
            "name": self.name,
            "author": self.author,
            "active": self.active,
            "type": self.type
        }

# Class - data object to organize students
class Class(models.Model):
    name = models.CharField(max_length=100)
    secretKey = models.CharField(max_length=25, unique=True)
    active = models.BooleanField(default=True, blank=True, null=True)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    TAs = models.ManyToManyField(User, related_name="TAs", blank=True)
    students = models.ManyToManyField(User, related_name="students", blank=True)
    assignments = models.ManyToManyField(Assignment, blank=True)
    competitions = models.ManyToManyField(Competition, blank=True)

# we need a way to individually determine "done" from a learner to a question
# and we need a way to individually determine percentage completion from a learner to an assignment
# thus, we have status.  Status can be applied to a question and represents the learner's progress.
class Status(models.Model):
    learner = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    question = models.ForeignKey(CodeQuestion, on_delete=models.CASCADE, null=True)
    complete = models.BooleanField(default=False)
    solution = models.TextField(default = "", null=True)
    grade = models.FloatField(default=0)

    def serialize(self):
        return {
            "learner": self.learner.username,
            "question": self.question.name,
            "complete": self.complete,
            "solution": self.solution,
            "grade": self.grade
        }

# Progress is the same thing but for an assignment
class Progress(models.Model):
    learner = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, null=True, related_name="progress")
    percent = models.IntegerField(default=0)
    grade = models.FloatField(default=0)

    def serialize(self):
        return {
            "learner": self.learner,
            "assignment": self.assignment,
            "percent": self.percent,
            "grade": self.grade
        }

# CompetitionProgress is the same thing but for an assignment
class CompetitionProgress(models.Model):
    learner = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, null=True, related_name="competitionprogress")
    percent = models.IntegerField(default=0)
    grade = models.FloatField(default=0)

    def serialize(self):
        return {
            "learner": self.learner,
            "competition": self.competition,
            "percent": self.percent,
            "grade": self.grade
        }
