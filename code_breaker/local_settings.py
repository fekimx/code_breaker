from code_breaker.settings import *

# This file is for local development

print('Setting local settings ...')

SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
SECURE_SSL_REDIRECT = False

SECRET_KEY = 'foo'

CORS_ORIGIN_WHITELIST = [
     'http://localhost:3000'
]

DEBUG = True

DATABASES = {
     'default': {
          'ENGINE': 'django.db.backends.sqlite3',
          'NAME':  os.path.join(BASE_DIR, 'db.sqlite3')
     }
}

