from code_breaker.settings import *

print('Setting local settings ...')

SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
SECURE_SSL_REDIRECT = False

SECRET_KEY = 'foo'