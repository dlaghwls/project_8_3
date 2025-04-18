# backend/users/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_queryset(self):
        current_user = self.request.user
        # 자신을 제외한 모든 사용자 반환
        return User.objects.exclude(id=current_user.id).order_by('name')
