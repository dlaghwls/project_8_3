# backend/apps/messaging/views.py

import logging
from rest_framework import generics, filters
from rest_framework.exceptions import ValidationError
from .models import Message
from .serializers import MessageSerializer
from .services import send_fcm_to_patient

logger = logging.getLogger(__name__)

class MessageListCreateAPIView(generics.ListCreateAPIView):
    """
    GET  /api/messages/?patient=<patient_id>&since=<last_id>   → 해당 환자의 메시지 목록 조회
    POST /api/messages/                                      → 메시지 생성
    """
    queryset = Message.objects.all().order_by('-created_at')
    serializer_class = MessageSerializer
    filter_backends = [filters.SearchFilter]
    # (검색필터는 유지해도 되고, 없어도 동작에는 영향 없습니다)
    search_fields = ['patient__patient_id']

    def get_queryset(self):
        qs = super().get_queryset()
        patient = self.request.query_params.get('patient')
        since  = self.request.query_params.get('since')

        try:
            if patient is not None:
                pid = int(patient)
                qs = qs.filter(patient_id=pid)
            if since is not None:
                sid = int(since)
                qs = qs.filter(id__gt=sid)
        except ValueError:
            raise ValidationError("patient와 since는 정수여야 합니다.")

        return qs

    def perform_create(self, serializer):
        # 1) 메시지 저장
        try:
            msg = serializer.save()
        except Exception:
            logger.exception("🔥 메시지 저장 중 예외 발생")
            raise

        # 2) FCM 푸시 알림 (인자명 content→message)
        try:
            send_fcm_to_patient(
                patient_id=msg.patient_id,
                message=msg.content,
                title='간호사 메시지'
            )
        except Exception:
            logger.exception("🔥 FCM 전송 중 예외 발생")


class MessageRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    """
    DELETE /api/messages/<pk>/   → 메시지 단건 삭제
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer