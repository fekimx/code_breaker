
from rest_framework import serializers
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login
from django.core.exceptions import ObjectDoesNotExist

from coding.models import User, Class, Assignment, CodeQuestion, Solution, UnitTest

# From https://dev.to/koladev/django-rest-authentication-cmh

class UnitTestSerializer(serializers.ModelSerializer):

    class Meta:
        model = UnitTest
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'

class SolutionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Solution
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = CodeQuestion
        fields = '__all__'


class AssignmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Assignment
        fields = '__all__'


class ClassSerializer(serializers.ModelSerializer):

    class Meta:
        model = Class
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_active', 'is_staff', 'is_superuser', 'is_student']
        read_only_field = ['is_active', 'is_staff', 'is_superuser', 'is_student']

class LoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['user'] = UserSerializer(self.user).data
        data['is_staff'] = UserSerializer(self.user).data
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data


class RegisterSerializer(UserSerializer):
    password = serializers.CharField(max_length=128, min_length=8, write_only=True, required=True)
    email = serializers.EmailField(required=True, write_only=True, max_length=128)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_active', 'is_staff', 'is_superuser', 'is_student']

    def create(self, validated_data):
        try:
            user = User.objects.get(email=validated_data['email'])
        except ObjectDoesNotExist:
            user = User.objects.create_user(**validated_data)
        return user

