from coding.serializers import *
from coding.models import User, Class
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
import logging
import requests
import time
import random, string


from coding.serializers import LoginSerializer, RegisterSerializer, ClassSerializer, UserSerializer, AssignmentSerializer, QuestionSerializer, SolutionSerializer, UnitTestSerializer

# From https://dev.to/koladev/django-rest-authentication-cmh
logger = logging.getLogger(__name__)

class RunViewSet(viewsets.ViewSet):
    http_method_names = ['post']
    permission_classes = (AllowAny,)

    def create(self, request):
        logger.warn("Create from RunViewSet")

        question = CodeQuestion(id=request.data['questionId'])
        unitTests = question.unitTests.all()
        logger.warn(question)
        
        unit_tests = []
        for unit_test in unitTests:
          unit_tests.append("print(" + unit_test.input + ")\n")

        logger.warn(unit_tests)
        
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

        logger.warn(stdout)
        unit_test_output = stdout.split('\n')
        del unit_test_output[-1]
        logger.warn(unit_test_output)
        unit_test_results = []

        for idx, result in enumerate(unit_test_output):
          logger.warn(idx)
          logger.warn(unitTests)
          if (result == unitTests[idx].expectedOutput):
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

class AssignmentViewSet(viewsets.ModelViewSet, TokenObtainPairView):

    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    http_method_names = ['get', 'post']
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        logger.warn("Inside AssignmentViewSet create")
        logger.warn(request.data)

        serializer = self.get_serializer(data=request.data)
        print(serializer)
        try:
            serializer.is_valid(raise_exception=True)
            assignment = serializer.save()
            logger.warn("Valid Serializer")
            
        except TokenError as e:
            logger.warn("Token Error")
            raise InvalidToken(e.args[0])

        assignmentForClass = Class.objects.get(id=request.data['class'])
        assignmentForClass.assignments.add(assignment)

        return Response({}, status=status.HTTP_201_CREATED)  

    def list(self, request):
        logger.warn("list from Assignment")
        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        assignmentObj = get_object_or_404(self.queryset, pk=pk)
        serializer = self.get_serializer(assignmentObj)
        return Response(serializer.data)

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

class JoinClassViewSet(viewsets.ModelViewSet, TokenObtainPairView):

    http_method_names = ['post']
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        user = User.objects.get(id=request.data['userId'])
        studentClass = Class.objects.get(secretKey=request.data['secretKey'])
        logger.warn(user)
        logger.warn(studentClass)
        studentClass.students.add(user)
        
        return Response({}, status=status.HTTP_201_CREATED) 
        
class StudentClassViewset(viewsets.ModelViewSet, TokenObtainPairView):

    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['get', 'post', 'delete']

    
    def list(self, request):
        logger.warn("list from StudentClassviewset")
        studentId = self.request.query_params.get('studentId')
        logger.warn(studentId)
        student = User(id=studentId)
        self.queryset = Class.objects.filter(students=student)
        serializer = self.get_serializer(self.queryset, many=True)
        
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        #note from BW2: this isn't in use, may need update
        classObj = Class.objects.filter(students = pk)
        serializer = self.get_serializer(classObj, many=True)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        item = self.get_object()

        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class QuestionViewSet(viewsets.ModelViewSet, TokenObtainPairView):

    queryset = CodeQuestion.objects.all()
    serializer_class = QuestionSerializer
    http_method_names = ['get', 'post']
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
            logger.warn("Create from QuestionViewSet")
            solution_fks = []
            unittest_fks = []
            #print("R1", request.data)
            for solution in request.data['solutions']:
                data = {}
                data['code'] = solution
                #codequestion.solution.add()
                solution_serializer = SolutionSerializer(data = data)
                
                try:
                    solution_serializer.is_valid()
                    solution_serializer.save()
                    solution_fks.append(solution_serializer['id'].value)
                    logger.warn("Valid Serializer- Solution")
                
                except TokenError as e:
                    raise InvalidToken(e.args[0])

            for unitTest in request.data['unitTests']:
                data = {}
                data['input'] = unitTest['input']
                data['expectedOutput'] = unitTest['output']
                data['visible'] = unitTest.get('visible', False)
                #print(data)
                unittest_serializer = UnitTestSerializer(data = data)
                try:
                    unittest_serializer.is_valid()
                    unittest_serializer.save()
                    unittest_fks.append(unittest_serializer['id'].value)
                    logger.warn("Valid Serializer-Unit Test")
                
                except TokenError as e:
                    raise InvalidToken(e.args[0])

            request.data['solutions'] = solution_fks
            request.data['unitTests'] = unittest_fks

            questionData = {}
            questionData['name'] = request.data['name']
            questionData['solutions'] = request.data['solutions']
            questionData['unitTests'] = request.data['unitTests']
            questionData['code'] = request.data['code']
            questionData['description'] = request.data['description']
            questionData['author'] = request.data['userId']

            print(questionData)
            serializer = self.get_serializer(data=questionData)

            # #print("REQ", request.data)
            try:
                 serializer.is_valid(raise_exception=True)
                 print(serializer.validated_data)
                 serializer.save()
                 logger.warn("Valid Serializer- Question")
                
            except TokenError as e:
                 #logger.warn("Token Error")
                 raise InvalidToken(e.args[0])
            #return Response({}, status=status.HTTP_201_CREATED)

            return Response(questionData, status=status.HTTP_201_CREATED)

    def list(self, request):
        queryset = CodeQuestion.objects.all()

        logger.warn("list from QuestionViewSet")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        logger.warn("retrieve from QuestionViewSet")
        classObj = get_object_or_404(self.queryset, pk=pk)
        unitTests = classObj.unitTests.all()
        solutions = classObj.solutions.all()
        serializer = self.get_serializer(classObj)
        unitTestSerializer = UnitTestSerializer(unitTests, many=True)
        solutionSerializer = SolutionSerializer(solutions, many=True)
        response_obj = serializer.data
        response_obj["unitTests"] = unitTestSerializer.data
        response_obj["solutions"] = solutionSerializer.data
        return Response(response_obj)


class ClassViewSet(viewsets.ModelViewSet, TokenObtainPairView):

    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['get', 'post', 'delete']

    def create(self, request, *args, **kwargs):
        logger.warn("Create from Classviewset")
        request.data['secretKey'] = ''.join(random.choices(string.ascii_letters + string.digits, k=5))
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            logger.warn("Valid Serializer")
            
        except TokenError as e:
            logger.warn("Token Error")
            raise InvalidToken(e.args[0])
        
        return Response({}, status=status.HTTP_201_CREATED)
    
    def list(self, request):
        logger.warn("list from Classviewset")
        teacherId = self.request.query_params.get('teacherId')
        logger.warn(teacherId)
        teacher = User(id=teacherId)
        self.queryset = Class.objects.filter(teacher=teacher)
        serializer = self.get_serializer(self.queryset, many=True)
        
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        logger.warn("Inside retrieve for Class")
        classObj = get_object_or_404(self.queryset, pk=pk)
        serializer = self.get_serializer(classObj)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        item = self.get_object()

        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class SolutionViewSet(viewsets.ModelViewSet, TokenObtainPairView):

    queryset = Solution.objects.all()
    serializer_class = SolutionSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['get', 'post', 'delete']

    def list(self, request):
        logger.warn("list from SolutionViewset")
        serializer = self.get_serializer(self.queryset, many=True)
        
        return Response(serializer.data)

class StudentViewSet(viewsets.ModelViewSet, TokenObtainPairView):

    queryset = User.objects.filter(is_student=True)
    serializer_class = StudentSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['get', 'post', 'delete']

    def list(self, request):
        logger.warn("list from StudentViewSet")
        serializer = self.get_serializer(self.queryset, many=True)
        
        return Response(serializer.data)