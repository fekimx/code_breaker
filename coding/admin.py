from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(User)
admin.site.register(Class)
admin.site.register(UnitTest)
admin.site.register(Solution)
admin.site.register(CodeQuestion)
admin.site.register(Assignment)
admin.site.register(Status)
admin.site.register(Progress)