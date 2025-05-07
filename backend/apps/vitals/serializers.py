# backend/apps/patients/serializers.py

from rest_framework import serializers
from .models import Patient, Vital  # 실제 모델명 확인
from apps.messaging.models import Message
class VitalSignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vital
        fields = ['id', 'patient', 'measured_at', 'systolic_bp', 'diastolic_bp',
                  'pulse', 'respiration_rate', 'temperature', 'oxygen']

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='sender.name', read_only=True)
    author_role = serializers.CharField(source='sender.role', read_only=True)

    class Meta:
        model = Message  # 또는 Comment 모델
        fields = ['id', 'content', 'created_at', 'author_name', 'author_role']

class PatientDetailSerializer(serializers.ModelSerializer):
    vitals = VitalSignSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = ['id', 'patient_id', 'name', 'gender', 'birth_date',
                  'age', 'risk_score', 'vitals', 'comments']
