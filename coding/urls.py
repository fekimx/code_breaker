from django.contrib import admin
from django.urls import include, path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('admin/', admin.site.urls),
    path('api/', include(('coding.routers', 'coding'), namespace='coding-api')),
]

# path('auth/', include('rest_auth.urls')),    
# path('auth/register/', include('rest_auth.registration.urls')),
# path('api/v1/users/', include('users.urls'))
