# backend/apps/messaging/serializers.py

from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        # Message 모델에 실제 있는 필드만 나열 (sent_at 제거)
        fields = [
            'id',
            'patient',
            'selfcheck',
            'sender_role',
            'content',
            'created_at',
        ]
        # 클라이언트 입력이 아닌, 서버 자동 생성 필드(read-only)
        read_only_fields = ['id', 'created_at']
