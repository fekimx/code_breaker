from django.contrib import admin
from django.urls import include, path, re_path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(('coding.routers', 'coding'), namespace='coding-api')),
    re_path(r'^$', views.index, name="index"),
    # match all other pages
    re_path(r'^(?:.*)/?$', views.index, name="index"),
]

# path('auth/', include('rest_auth.urls')),    
# path('auth/register/', include('rest_auth.registration.urls')),
# path('api/v1/users/', include('users.urls'))
