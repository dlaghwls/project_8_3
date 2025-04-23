from rest_framework import serializers
from .models import Vital
from apps.patients.models import Patient

class VitalSerializer(serializers.ModelSerializer):
    patient = serializers.SlugRelatedField(
        queryset=Patient.objects.all(),
        slug_field='patient_id'
    )
    patient_name = serializers.CharField(source='patient.name', read_only=True)

    class Meta:
        model = Vital
        fields = '__all__'
        read_only_fields = ['patient_name']

