# core/routers.py
from rest_framework.routers import SimpleRouter
from coding.viewsets import *
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
routes.register(r'studentClass', StudentClassViewset, basename='studentClass')

# QUESTION

routes.register(r'teacher/question', TeacherQuestionViewSet, basename='teacherQuestion')
routes.register(r'student/question', StudentQuestionViewSet, basename='studentQuestion')

# ASSIGNMENT

routes.register(r'assignmentStudents', AssignmentStudentViewSet, basename='assignmentStudents')
routes.register(r'assignmentQuestions', AssignmentQuestionViewSet, basename='assignmentQuestions')

routes.register(r'teacher/assignment', TeacherAssignmentViewSet, basename='teacherAssignment')
routes.register(r'student/assignment', StudentAssignmentViewSet, basename='studentAssignment')

# Competition

routes.register(r'teacher/competition', TeacherCompetitionViewSet, basename='teacherompetition')
routes.register(r'teacher/competitionStatus', TeacherCompetitionStatusViewSet, basename='competitionStatus')
routes.register(r'student/competition', StudentCompetitionViewSet, basename='studentcompetition')
routes.register(r'competition/score', TeacherScoreViewSet, basename='competitionscore')

# STUDENTS

routes.register(r'students', StudentViewSet, basename='students')


urlpatterns = [
    *routes.urls
]