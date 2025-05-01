import logging
from rest_framework import generics, filters
from rest_framework.exceptions import ValidationError  # ✅ 추가
from .models import Message
from .serializers import MessageSerializer
from .services import send_fcm_to_patient

logger = logging.getLogger(__name__)

class MessageListCreateView(generics.ListCreateAPIView):
    queryset = Message.objects.all().order_by('created_at')
    serializer_class = MessageSerializer
    filter_backends  = [filters.SearchFilter]
    search_fields    = ['patient__patient_id']

    def get_queryset(self):
        qs = super().get_queryset()
        receiver = self.request.query_params.get('receiver')
        since = self.request.query_params.get('since')  # ✅ 추가

        # ✅ receiver와 since에 대한 검증 및 필터 추가
        try:
            if receiver is not None:
                pid = int(receiver)
                qs = qs.filter(patient_id=pid)
            if since is not None:
                sid = int(since)
                qs = qs.filter(id__gt=sid)
        except ValueError:
            raise ValidationError("receiver와 since는 정수여야 합니다.")

        return qs

    def perform_create(self, serializer):
        try:
            msg = serializer.save()
        except Exception as e:
            logger.exception("🔥 메시지 저장 중 예외 발생")
            raise

        try:
            send_fcm_to_patient(
                patient_id=msg.patient,
                content=msg.content,
                title='간호사 메시지'
            )
        except Exception as e:
            logger.exception("🔥 FCM 전송 중 예외 발생")
