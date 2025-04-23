from rest_framework import serializers
from .models import SelfCheck

class SelfCheckSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)

    class Meta:
        model = SelfCheck
        fields = '__all__'
        read_only_fields = ['submitted_at', 'patient_name']

