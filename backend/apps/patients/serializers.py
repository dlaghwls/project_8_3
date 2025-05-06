from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Patient
from apps.vitals.models import Vital
from apps.messaging.models import Message

class VitalSignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vital
        fields = [
            'id',
            'measured_at',
            'systolic_bp',
            'diastolic_bp',
            'pulse',
            'respiration_rate',
            'temperature',
            'oxygen',
        ]

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='sender.name', read_only=True)
    author_role = serializers.CharField(source='sender.role', read_only=True)

    class Meta:
        model = Message
        fields = [
            'id',
            'content',
            'created_at',
            'author_name',
            'author_role',
        ]

class PatientSerializer(serializers.ModelSerializer):
    """목록 조회(ListCreate)에 쓸 때는 기존 스펙만 내려줍니다."""
    class Meta:
        model = Patient
        fields = [
            'id', 'patient_id', 'name', 'gender',
            'birth_date', 'phone', 'address', 'created_at'
        ]
        
    def create(self, validated_data):
        # 유효성 검사를 위한 추가 처리 (중복 방지 등)
        try:
            return super().create(validated_data)
        except Exception as e:
            # 오류 상세 로깅
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"환자 생성 오류: {str(e)}")
            raise

class PatientDetailSerializer(PatientSerializer):
    """단일 조회(Retrieve) 시에 vitals, comments 를 nested 포함"""
    vitals = VitalSignSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta(PatientSerializer.Meta):
        # 목록에 내려주던 필드에 vitals, comments 추가
        fields = PatientSerializer.Meta.fields + ['vitals', 'comments']
