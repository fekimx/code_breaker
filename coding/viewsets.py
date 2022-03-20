from coding.serializers import UserSerializer
from coding.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken
import logging
import requests
import time

from coding.serializers import LoginSerializer, RegisterSerializer

# From https://dev.to/koladev/django-rest-authentication-cmh
logger = logging.getLogger(__name__)

class RunViewSet(viewsets.ViewSet):
    http_method_names = ['post']
    permission_classes = (AllowAny,)

    def create(self, request):
        logger.warn("Create from RunViewSet")

        unit_test_1 = "print(divisbleByTwo(4))\n"
        unit_test_2 = "print(divisbleByTwo(9))\n"

        unit_tests = [unit_test_1, unit_test_2]

        source_code = request.data['code']

        for unit_test in unit_tests:
            source_code += "\n" + unit_test

        post_data = {
            'source_code': source_code,
            'language_id': 71,
            'stdin': ''
        }
        response = requests.post("http://159.89.85.94:2358/submissions", data = post_data)
        token = response.json()['token']
        logger.warn(token)

        evaluation = {}

        while True:
            time.sleep(1)
            evaluation = requests.get("http://159.89.85.94:2358/submissions/" + token)
            logger.warn("Polling ...")
            logger.warn(evaluation.json())
            if (evaluation.json()['status']['description'] == 'In Queue'):
                continue
            else:
                break

        stdout = evaluation.json()['stdout']
        stderr = evaluation.json()['stderr']

        if stderr:
            return Response({
                "stderr": stderr
            }, status=status.HTTP_201_CREATED)

        unit_test_output = stdout.split('\n')

        unit_test_results = []

        if unit_test_output[0] == "True":
            unit_test_results.append(True)
        else:
            unit_test_results.append(False)

        if unit_test_output[1] == "False":
            unit_test_results.append(True)
        else:
            unit_test_results.append(False)

        return Response({
            "unit_test_results": unit_test_results
        }, status=status.HTTP_201_CREATED)

class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['updated']
    ordering = ['-updated']

    def get_queryset(self):
        if self.request.user.is_superuser:
            return User.objects.all()

    def get_object(self):
        lookup_field_value = self.kwargs[self.lookup_field]

        obj = User.objects.get(id=lookup_field_value)
        self.check_object_permissions(self.request, obj)

        return obj

class LoginViewSet(viewsets.ModelViewSet, TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class RegistrationViewSet(viewsets.ModelViewSet, TokenObtainPairView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        res = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        return Response({
            "user": serializer.data,
            "refresh": res["refresh"],
            "token": res["access"]
        }, status=status.HTTP_201_CREATED)


class RefreshViewSet(viewsets.ViewSet, TokenRefreshView):
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
