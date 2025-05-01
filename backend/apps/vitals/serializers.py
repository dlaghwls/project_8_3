from rest_framework import serializers
from .models import Vital

class VitalSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    class Meta:
        model = Vital
        fields = '__all__'  # 모든 필드 포함
        read_only_fields = ['patient_name']
