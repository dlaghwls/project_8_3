# backend/users/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserRegisterSerializer

# class UserViewSet(viewsets.ReadOnlyModelViewSet):
#     permission_classes = [IsAuthenticated]
#     serializer_class = UserSerializer
    
#     def get_queryset(self):
#         current_user = self.request.user
#         # 자신을 제외한 모든 사용자 반환
#         return User.objects.exclude(id=current_user.id).order_by('name')
class UserRegisterView(APIView):
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "회원가입 완료!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)