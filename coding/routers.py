# core/routers.py
from rest_framework.routers import SimpleRouter
from coding.viewsets import RunViewSet, UserViewSet
from coding.viewsets import LoginViewSet, RegistrationViewSet, RefreshViewSet, ClassViewSet, JoinClassViewSet

# From https://dev.to/koladev/django-rest-authentication-cmh

routes = SimpleRouter()

# AUTHENTICATION
routes.register(r'auth/login', LoginViewSet, basename='auth-login')
routes.register(r'auth/register', RegistrationViewSet, basename='auth-register')
routes.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')

# USER
routes.register(r'user', UserViewSet, basename='user')

routes.register(r'run', RunViewSet, basename='run')

# CLASS

routes.register(r'class', ClassViewSet, basename='class')
routes.register(r'joinClass', JoinClassViewSet, basename='joinClass')

urlpatterns = [
    *routes.urls
]