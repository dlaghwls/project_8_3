# ── backend/users/views.py ──
from django.utils.decorators import method_decorator            # 🔧 추가
from django.views.decorators.csrf import csrf_exempt            # 🔧 추가

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken         # 🔧 추가
from django.contrib.auth import authenticate                     # 🔧 추가

from .models import User
from .serializers import UserSerializer

@method_decorator(csrf_exempt, name='dispatch')
class SignupView(APIView):
    # --- 인증 자체를 건너뜁니다 ---
    authentication_classes = []
    # --- 권한 검사만 예외(AllowAny)로 둡니다 ---
    permission_classes     = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': '회원가입 완료'},
                            status=status.HTTP_201_CREATED)

        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')                  # 🔧 추가
class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        employee_id = request.data.get("employee_id")
        password    = request.data.get("password")
        user = authenticate(employee_id=employee_id, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access':  str(refresh.access_token),
                'user': {
                    'id':          user.id, 
                    'employee_id': user.employee_id,
                    'name':        user.name,
                    'role':        user.role,
                }
            })
        return Response({'message': '로그인 실패'}, status=status.HTTP_401_UNAUTHORIZED)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class    = UserSerializer

    def get_queryset(self):
        return User.objects.exclude(id=self.request.user.id).order_by('name')


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        u = request.user
        return Response({
            'id':          u.id,
            'employee_id': u.employee_id,
            'name':        u.name,
            'role':        u.role,
        })