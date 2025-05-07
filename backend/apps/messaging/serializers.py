from rest_framework import serializers
from .models import Message
from django.contrib.auth import get_user_model

User = get_user_model()

class MessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    sender_name = serializers.CharField(source='sender.name', read_only=True)
    receiver_id = serializers.IntegerField(source='receiver.id', read_only=True)
    receiver = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        required=True
    )
    
    class Meta:
        model = Message
        fields = [
            'id', 'patient', 'selfcheck',
            'sender_id', 'sender_name', 
            'receiver_id', 'content', 
            'created_at', 'receiver'
        ]
        read_only_fields = [
            'id', 'created_at', 
            'sender_id', 'sender_name', 
            'receiver_id'
        ]
        # ✅ 선택적 필드 설정
        extra_kwargs = {
            'patient': {'required': False},
            'selfcheck': {'required': False},
        }

    def validate_receiver(self, value):
        if not User.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("유효하지 않은 수신자입니다.")
        return value

    def validate_content(self, value):
        if len(value.strip()) < 1:
            raise serializers.ValidationError("메시지 내용을 입력하세요.")
        return value

class RecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'employee_id', 'name', 'role']
        read_only_fields = fields  # 모든 필드를 읽기 전용으로 설정
