from cmath import log
from code_breaker.settings import JUDGE_ZERO_ENDPOINT
from coding.serializers import *
from coding.models import Submission, User, Class
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, BasePermission, IsAdminUser
from rest_framework import filters
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
import logging
import requests
import time
import random, string


from coding.serializers import LoginSerializer, RegisterSerializer, ClassSerializer, UserSerializer, AssignmentSerializer, QuestionSerializer, SolutionSerializer, UnitTestSerializer, QuestionWeightPairSerializer

# From https://dev.to/koladev/django-rest-authentication-cmh
logger = logging.getLogger(__name__)

class IsTeacherUser(BasePermission):
    """
    Allows access only to teacher users.
    """

    def has_permission(self, request, view):
        logger.warn("permissions")
        logger.warn(request.user)
        logger.warn(request.user.is_staff)
        return bool(request.user and request.user.is_staff)

class IsStudentUser(BasePermission):
    """
    Allows access only to student users.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_student)

class RunViewSet(viewsets.ViewSet):
    http_method_names = ['post']
    permission_classes = (IsStudentUser,)

    # Executes code against the Judge0 server - student's only
    def create(self, request):
        logger.warn("Create from RunViewSet")

        assignment = request.data['assignmentId']
        competition = request.data['competitionId']
        question = CodeQuestion(id=request.data['questionId'])

        if assignment:
            assignmentDetails = Assignment.objects.get(pk=assignment)
            if assignmentDetails.active == False:
                return Response({
                    "stderr": "inactive"
                }, status=status.HTTP_201_CREATED)
        
        if competition is not None:
            competitionDetails = Competition.objects.get(pk=competition)
            if competitionDetails.active == False:
                return Response({
                    "stderr": "inactive"
                }, status=status.HTTP_201_CREATED)


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
        response = requests.post(JUDGE_ZERO_ENDPOINT, data = post_data)
        token = response.json()['token']
        logger.warn(token)

        evaluation = {}

        while True:
            time.sleep(1)
            evaluation = requests.get(JUDGE_ZERO_ENDPOINT + token)
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

        submission = Submission()
        submission.learner = User(request.user.id)
        if assignment:
            submission.assignment = Assignment(id=assignment)
        else:
            submission.competition = Competition(id=competition)
        submission.question = question

        submission.save()

        for idx, result in enumerate(unit_test_results):
            if result:
                submission.successfulUnitTests.add(question.unitTests.all()[idx])

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

    # An Admin can list all users
    def get_queryset(self):
        if self.request.user.is_superuser:
            return User.objects.all()

    # You can only query user information about yourself
    def get_object(self):
        lookup_field_value = self.kwargs[self.lookup_field]
        if str(self.request.user.id) == lookup_field_value:
            logger.warn("check")
            obj = User.objects.get(id=lookup_field_value)
            self.check_object_permissions(self.request, obj)

            return obj
        else:
            raise PermissionDenied()

class TeacherAssignmentViewSet(viewsets.ModelViewSet):

    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    http_method_names = ['get', 'post']
    permission_classes = (IsTeacherUser,)

    # Teachers can create assignments
    def create(self, request, *args, **kwargs):
        request.data['author'] = request.user.id
        questionweightpair_fks = []

        for questionWeightPair in request.data['questions']:
            data = {}
            data['question'] = questionWeightPair['question']
            data['weight'] = questionWeightPair['weight']
            questionweightpair_serializer = QuestionWeightPairSerializer(data = data)
                
            try:
                questionweightpair_serializer.is_valid()
                questionweightpair_serializer.save()
                questionweightpair_fks.append(questionweightpair_serializer['id'].value)
                logger.warn("Valid Serializer- Question Weight Pair")
                
            except TokenError as e:
                raise InvalidToken(e.args[0]) 
            
        
        # done making question weight pairs    
        request.data['questions'] = questionweightpair_fks

        assignmentData = {}
        assignmentData['name'] = request.data['name']
        assignmentData['author'] = request.data['author']
        assignmentData['questions'] = request.data['questions']

        serializer = self.get_serializer(data=request.data)
        
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

    # Teachers can list assignments they created
    def list(self, request):
        logger.warn("list from Assignment")

        serializer = self.get_serializer(Assignment.objects.filter(author=request.user.id), many=True)
        return Response(serializer.data)

    # Teachers can retrieve an assignment they created
    def retrieve(self, request, pk=None):
        qs = Assignment.objects.filter(author=request.user.id)
        assignmentObj = get_object_or_404(qs, pk=pk)
        serializer = self.get_serializer(assignmentObj)

        questionweightpair_fks = []

        for questionWeightPair in assignmentObj.questions.all():
            localQuestionWeightPair = {}
            localQuestionWeightPair['name'] = questionWeightPair.question.name
            localQuestionWeightPair['id'] = questionWeightPair.question.id
            localQuestionWeightPair['description'] = questionWeightPair.question.description
            localQuestionWeightPair['weight'] = questionWeightPair.weight
            questionweightpair_fks.append(localQuestionWeightPair)

        response = serializer.data
        response["questionWeightPairs"] = questionweightpair_fks
        return Response(response)

class StudentAssignmentViewSet(viewsets.ModelViewSet):

    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    http_method_names = ['get', 'post']
    permission_classes = (IsStudentUser,)

    def list(self, request):
        logger.warn("list from Student Assignment")
        student = User(id=request.user.id)
        classes = Class.objects.filter(students=student)
        assignmentSet = set()
        for clazz in classes:
            for assignment in clazz.assignments.all():
                assignmentSet.add(assignment.id)

        assignments = Assignment.objects.filter(pk__in=assignmentSet)
        serializer = self.get_serializer(assignments, many=True)
        
        for idx, assignment in enumerate(assignments):
            submissions = Submission.objects.filter(learner=student, assignment=assignment).values('assignment', 'question').distinct()
            serializer.data[idx]['numSubmissions'] = len(submissions)

            score = 0
            possibleScore = 0
            for question in assignment.questions.all():
                try:
                    latest_submission = Submission.objects.filter(learner=student, assignment=assignment, question=question.question).latest('submittedAt')
                    logger.warn("Successful unit tests:")
                    successfulUnitTests = latest_submission.successfulUnitTests.all()
                    numSuccessfulUnitTests = len(successfulUnitTests)
                    numUnitTestsInQuestion = len(question.question.unitTests.all())

                    if numSuccessfulUnitTests == numUnitTestsInQuestion:
                        score += question.weight
                except:
                    logger.warn("Exception encountered")
                    pass
                possibleScore += question.weight
                logger.warn(latest_submission)

            logger.warn(submissions)
            serializer.data[idx]['score'] = score
            serializer.data[idx]['possibleScore'] = possibleScore
        
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        student = User(id=request.user.id)
        classes = Class.objects.filter(students=student)
        assignmentSet = set()
        for clazz in classes:
            for assignment in clazz.assignments.all():
                assignmentSet.add(assignment.id)

        
        if int(pk) not in assignmentSet:
            raise PermissionDenied()

        assignmentObj = get_object_or_404(self.queryset, pk=pk)
        serializer = self.get_serializer(assignmentObj)

        questionweightpair_fks = []

        for questionWeightPair in assignmentObj.questions.all():
            localQuestionWeightPair = {}
            localQuestionWeightPair['name'] = questionWeightPair.question.name
            localQuestionWeightPair['id'] = questionWeightPair.question.id
            localQuestionWeightPair['description'] = questionWeightPair.question.description
            localQuestionWeightPair['weight'] = questionWeightPair.weight
            questionweightpair_fks.append(localQuestionWeightPair)

        response = serializer.data
        response["questionWeightPairs"] = questionweightpair_fks
        return Response(response)

class TeacherCompetitionStatusViewSet(viewsets.ModelViewSet):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    http_method_names = ['get', 'post']
    permission_classes = (IsTeacherUser,)
 
    def create(self, request):
        logger.warn("----- >> UPDATE STATUS")
        tmpID = request.data['id']
        newActive = request.data['active']
        logger.warn(tmpID)
        logger.warn(newActive)

        oldCompetition = Competition.objects.get(pk=tmpID)

        logger.warn("----- >> OLD PRE-")
        logger.warn(oldCompetition.name)
        logger.warn(oldCompetition.active)
        oldCompetition.active = False
        if newActive == "True":
            oldCompetition.active = True
        oldCompetition.save()

        logger.warn("----- >> OLD POST-")
        logger.warn(oldCompetition.active)

        return Response({}, status=status.HTTP_201_CREATED)  

    
class TeacherCompetitionViewSet(viewsets.ModelViewSet):

    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    http_method_names = ['get', 'post']
    permission_classes = (IsTeacherUser,)

    def create(self, request, *args, **kwargs):
        request.data['author'] = request.user.id
        questionweightpair_fks = []

        for questionWeightPair in request.data['questions']:
            data = {}
            data['question'] = questionWeightPair['question']
            data['weight'] = questionWeightPair['weight']
            questionweightpair_serializer = QuestionWeightPairSerializer(data = data)
                
            try:
                questionweightpair_serializer.is_valid()
                questionweightpair_serializer.save()
                questionweightpair_fks.append(questionweightpair_serializer['id'].value)
                logger.warn("Valid Serializer- Question Weight Pair")
                
            except TokenError as e:
                raise InvalidToken(e.args[0]) 

        # done making question weight pairs    
        request.data['questions'] = questionweightpair_fks

        competitionData = {}
        competitionData['name'] = request.data['name']
        competitionData['author'] = request.data['author']
        competitionData['questions'] = request.data['questions']

        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            competition = serializer.save()
            logger.warn("Valid Serializer")
            
        except TokenError as e:
            logger.warn("Token Error")
            raise InvalidToken(e.args[0])

        competitionForClass = Class.objects.get(id=request.data['class'])
        competitionForClass.competitions.add(competition)

        return Response({}, status=status.HTTP_201_CREATED)  

    def list(self, request):
        logger.warn("list from Competition")
        logger.warn("----- >> LIST FROM COMPETITION!")
        logger.warn(request)
        logger.warn("-------------------")

        serializer = self.get_serializer(Competition.objects.filter(author=request.user.id), many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        logger.warn("----- >> RETRIEVE FROM COMPETITION!")
        competitionObj = get_object_or_404(self.queryset, pk=pk)
        serializer = self.get_serializer(competitionObj)

        questionweightpair_fks = []

        for questionWeightPair in competitionObj.questions.all():
            localQuestionWeightPair = {}
            localQuestionWeightPair['name'] = questionWeightPair.question.name
            localQuestionWeightPair['id'] = questionWeightPair.question.id
            localQuestionWeightPair['description'] = questionWeightPair.question.description
            localQuestionWeightPair['weight'] = questionWeightPair.weight
            questionweightpair_fks.append(localQuestionWeightPair)

        response = serializer.data
        response["questionWeightPairs"] = questionweightpair_fks
        return Response(response)

class StudentCompetitionViewSet(viewsets.ModelViewSet):

    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    http_method_names = ['get', 'post']
    permission_classes = (IsStudentUser,)

    def list(self, request):
        logger.warn("list from Competition")
        student = User(id=request.user.id)
        classes = Class.objects.filter(students=student)
        competitionSet = set()
        for clazz in classes:
            for competition in clazz.competitions.all():
                competitionSet.add(competition.id)

        competitions = Competition.objects.filter(pk__in=competitionSet)
        serializer = self.get_serializer(competitions, many=True)
        
        for idx, competition in enumerate(competitions):
            submissions = Submission.objects.filter(learner=student, competition=competition).values('competition', 'question').distinct()
            serializer.data[idx]['numSubmissions'] = len(submissions)

            score = 0
            possibleScore = 0
            for question in competition.questions.all():
                try:
                    latest_submission = Submission.objects.filter(learner=student, competition=competition, question=question.question).latest('submittedAt')
                    logger.warn("Successful unit tests:")
                    successfulUnitTests = latest_submission.successfulUnitTests.all()
                    numSuccessfulUnitTests = len(successfulUnitTests)
                    numUnitTestsInQuestion = len(question.question.unitTests.all())

                    if numSuccessfulUnitTests == numUnitTestsInQuestion:
                        score += question.weight
                except:
                    logger.warn("Exception encountered")
                    pass
                possibleScore += question.weight
                #logger.warn(latest_submission)

            logger.warn(submissions)
            serializer.data[idx]['score'] = score
            serializer.data[idx]['possibleScore'] = possibleScore
        
        return Response(serializer.data)
        

    def retrieve(self, request, pk=None):
        student = User(id=request.user.id)
        classes = Class.objects.filter(students=student)
        competitionSet = set()
        for clazz in classes:
            for competition in clazz.competitions.all():
                competitionSet.add(competition.id)

        if int(pk) not in competitionSet:
            raise PermissionDenied()

        competitionObj = get_object_or_404(self.queryset, pk=pk)
        serializer = self.get_serializer(competitionObj)

        questionweightpair_fks = []

        for questionWeightPair in competitionObj.questions.all():
            localQuestionWeightPair = {}
            localQuestionWeightPair['name'] = questionWeightPair.question.name
            localQuestionWeightPair['id'] = questionWeightPair.question.id
            localQuestionWeightPair['description'] = questionWeightPair.question.description
            localQuestionWeightPair['weight'] = questionWeightPair.weight
            questionweightpair_fks.append(localQuestionWeightPair)

        response = serializer.data
        response["questionWeightPairs"] = questionweightpair_fks
        return Response(response)

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

class JoinClassViewSet(viewsets.ModelViewSet):

    http_method_names = ['post']
    permission_classes = (IsStudentUser,)

    # A student can join a class
    def create(self, request, *args, **kwargs):
        user = User.objects.get(id=request.data['userId'])
        studentClass = Class.objects.get(secretKey=request.data['secretKey'])
        logger.warn(" ----- > > > ")

        logger.warn(user)
        logger.warn(studentClass)
        studentClass.students.add(user)
        
        return Response({}, status=status.HTTP_201_CREATED) 
        
class StudentClassViewset(viewsets.ModelViewSet):

    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = (IsStudentUser,)
    http_method_names = ['get', 'post', 'delete']

    # A student can list their classes
    def list(self, request):
        logger.warn("list from StudentClassviewset")
        studentId = self.request.query_params.get('studentId')
        if studentId != str(request.user.id):
            raise PermissionDenied()
        logger.warn(studentId)
        student = User(id=studentId)
        self.queryset = Class.objects.filter(students=student)
        serializer = self.get_serializer(self.queryset, many=True)
        
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        if str(pk) != str(request.user.id):
            raise PermissionDenied()
        classObj = Class.objects.filter(students = pk)
        serializer = self.get_serializer(classObj, many=True)
        return Response(serializer.data)

class AssignmentStudentViewSet(viewsets.ModelViewSet):

    queryset = Assignment.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['get', 'post', 'delete']

    
    def list(self, request):
        logger.warn("list from AssignmentStudentViewset")
        assignmentId = self.request.query_params.get('assignmentId')
        logger.warn(assignmentId)
        clazz = Class.objects.get(assignments=assignmentId)
        serializer = self.get_serializer(clazz.students.all(), many=True)
        students = serializer.data
        assignment = Assignment(id=assignmentId)
        for student in students:
            logger.warn(student)
            submissions = Submission.objects.filter(learner=User(student['id']), assignment=assignment).values('assignment', 'question').distinct()
            logger.warn(len(submissions))
            logger.warn(len(assignment.questions.all()))
            student["progress"] = 100 * len(submissions) / len(assignment.questions.all())

        return Response(students)

class AssignmentQuestionViewSet(viewsets.ModelViewSet):

    queryset = Assignment.objects.all()
    serializer_class = QuestionWeightPairSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['get', 'post', 'delete']

    def list(self, request):
        logger.warn("list from AssignmentStudentViewset")
        assignmentId = self.request.query_params.get('assignmentId')
        logger.warn(assignmentId)
        assignment = Assignment(id=assignmentId)
        serializer = self.get_serializer(assignment.questions.all(), many=True)
        return Response(serializer.data)

class TeacherQuestionViewSet(viewsets.ModelViewSet):

    queryset = CodeQuestion.objects.all()
    serializer_class = QuestionSerializer
    http_method_names = ['get', 'post']
    permission_classes = [IsTeacherUser]

    # A teacher can create a question
    def create(self, request, *args, **kwargs):
            if not request.user.is_staff:
                raise PermissionDenied()

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
        queryset = CodeQuestion.objects.filter(author_id=request.user.id)

        logger.warn("list from QuestionViewSet")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        logger.warn("retrieve from QuestionViewSet")
        classObj = get_object_or_404(self.queryset, pk=pk, author_id=request.user.id)
        unitTests = classObj.unitTests.all()
        solutions = classObj.solutions.all()
        serializer = self.get_serializer(classObj)
        unitTestSerializer = UnitTestSerializer(unitTests, many=True)
        solutionSerializer = SolutionSerializer(solutions, many=True)
        response_obj = serializer.data
        response_obj["unitTests"] = unitTestSerializer.data
        response_obj["solutions"] = solutionSerializer.data
        return Response(response_obj)

class StudentQuestionViewSet(viewsets.ModelViewSet):

    queryset = CodeQuestion.objects.all()
    serializer_class = QuestionSerializer
    http_method_names = ['get', 'post']
    permission_classes = [IsStudentUser]

    def create(self, request, *args, **kwargs):
        raise PermissionDenied()

    def list(self, request):
        student = User(id=request.user.id)
        classes = Class.objects.filter(students=student)
        assignmentSet = set()
        for clazz in classes:
            for assignment in clazz.assignments.all():
                assignmentSet.add(assignment.id)

        questionSet = set()
        assignments = Assignment.objects.filter(pk__in=assignmentSet)
        for assign in assignments:
            for question in assign.questions.all():
                questionSet.add(question.id)

        queryset = CodeQuestion.objects.filter(pk__in=questionSet)

        logger.warn("list from QuestionViewSet")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        logger.warn("retrieve from QuestionViewSet")
        student = User(id=request.user.id)
        classes = Class.objects.filter(students=student)
        
        assignmentSet = set()
        for clazz in classes:
            for assignment in clazz.assignments.all():
                assignmentSet.add(assignment.id)

        questionSet = set()
        assignments = Assignment.objects.filter(pk__in=assignmentSet)
        for assign in assignments:
            for question in assign.questions.all():
                questionSet.add(question.id)

        if int(pk) not in questionSet:
            logger.warn("Got here!")
            raise PermissionDenied()
            
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

class ClassViewSet(viewsets.ModelViewSet):

    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsTeacherUser|IsStudentUser]
    http_method_names = ['get', 'post', 'delete']

    def create(self, request, *args, **kwargs):
        logger.warn("Create from Classviewset")

        if not request.user.is_staff:
            raise PermissionDenied()

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

class StudentViewSet(viewsets.ModelViewSet):

    serializer_class = StudentSerializer
    permission_classes = (IsTeacherUser,)
    http_method_names = ['get', 'post', 'delete']

    # A teacher can list all the students in their classes
    def list(self, request):
        logger.warn("list from StudentViewSet")

        classes = Class.objects.filter(teacher=request.user.id)
        logger.warn(classes)
        studentSet = set()
        for clazz in classes:
            for student in clazz.students.all():
                studentSet.add(student.id)
        
        serializer = self.get_serializer(User.objects.filter(pk__in=studentSet, is_student=True), many=True)
        
        return Response(serializer.data)

class TeacherScoreViewSet(viewsets.ModelViewSet):

    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    http_method_names = ['get']
    permission_classes = (IsTeacherUser,)

    # may just remove list. 
    def list(self, request):
        logger.warn("list from Competition")
        student = User(id=request.user.id)
        classes = Class.objects.filter(students=student)
        competitionSet = set()
        for clazz in classes:
            for competition in clazz.competitions.all():
                competitionSet.add(competition.id)

        competitions = Competition.objects.filter(pk__in=competitionSet)
        serializer = self.get_serializer(competitions, many=True)
        
        for idx, competition in enumerate(competitions):
            submissions = Submission.objects.filter(learner=student, competition=competition).values('competition', 'question').distinct()
            serializer.data[idx]['numSubmissions'] = len(submissions)

            score = 0
            possibleScore = 0
            for question in competition.questions.all():
                try:
                    latest_submission = Submission.objects.filter(learner=student, competition=competition, question=question.question).latest('submittedAt')
                    logger.warn("Successful unit tests:")
                    successfulUnitTests = latest_submission.successfulUnitTests.all()
                    numSuccessfulUnitTests = len(successfulUnitTests)
                    numUnitTestsInQuestion = len(question.question.unitTests.all())

                    if numSuccessfulUnitTests == numUnitTestsInQuestion:
                        score += question.weight
                except:
                    logger.warn("Exception encountered")
                    pass
                possibleScore += question.weight
                #logger.warn(latest_submission)

            logger.warn(submissions)
            serializer.data[idx]['score'] = score
            serializer.data[idx]['possibleScore'] = possibleScore
        
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        logger.warn("----- >> RETRIEVE FROM Competition Scores!")
        competitionObj = get_object_or_404(self.queryset, pk=pk)

        studentScoreList = {}
        # this is all users in total, it could be better
        allStudents = User.objects.all()
        for student in allStudents:

            score = 0
            serializer = self.get_serializer(competitionObj)
            for questionWeightPair in competitionObj.questions.all():
                try:
                    #print(questionWeightPair.question.name)
                    latest_submission = Submission.objects.filter(learner=student, competition=competitionObj, question=questionWeightPair.question).latest('submittedAt')
                    successfulUnitTests = latest_submission.successfulUnitTests.all()
                    numSuccessfulUnitTests = len(successfulUnitTests)
                    numUnitTestsInQuestion = len(questionWeightPair.question.unitTests.all())

                    if numSuccessfulUnitTests == numUnitTestsInQuestion:
                        score += questionWeightPair.weight
                except:
                    logger.warn("Exception encountered")
                    pass
            studentScoreList[student.username] = score 
        sorted_studentList = sorted(studentScoreList.items(), key=lambda item: item[1])
        return Response(sorted_studentList[-3:])

