from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Message
from .serializers import MessageSerializer, RecipientSerializer
from django.contrib.auth import get_user_model
from django.db.models import Q  # ✅ Q 객체 임포트 추가
import logging
from apps.patients.models import Patient

logger = logging.getLogger(__name__)
User = get_user_model()

class MessageListCreateView(generics.ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        return Message.objects.filter(receiver=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        receiver_id = self.request.data.get('receiver')
        patient_id = self.request.data.get('patient')
        
        # # ✅ 환자 ID 검증 (필요한 경우만)
        # if patient_id and not Patient.objects.filter(id=patient_id).exists():
        #     raise ValidationError({"patient": "유효하지 않은 환자 ID입니다."})
        
        # ✅ 수신자 유효성 검증
        if not User.objects.filter(id=receiver_id).exists():
            raise ValidationError({"receiver": "유효하지 않은 수신자입니다."})
        
        serializer.save(
            sender=self.request.user,
            patient_id=patient_id  # ✅ sender_role 제거
        )

    def create(self, request, *args, **kwargs):
        try:
            # ✅ 필수 필드 검증
            if 'receiver' not in request.data:
                raise ValidationError({"receiver": ["이 필드는 필수입니다."]})
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

class RecipientListView(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = RecipientSerializer
    
    def get_queryset(self):
        # ✅ 의료진(의사, 간호사)만 반환
        return User.objects.filter(
            Q(role='doctor') | Q(role='nurse')
        ).exclude(id=self.request.user.id)