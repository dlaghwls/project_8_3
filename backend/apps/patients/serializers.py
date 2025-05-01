# backend/apps/patients/serializers.py
from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Patient
        fields = ['id', 'patient_id', 'name', 'gender', 
                  'birth_date', 'phone', 'address', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_patient_id(self, value):
        if not value.isdigit() or len(value) != 8:
            raise serializers.ValidationError(
                '환자등록번호는 숫자 8자리만 가능합니다.'
            )
        return value
