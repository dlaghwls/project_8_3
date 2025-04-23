from rest_framework import serializers
from .models import Patient
from datetime import date
from apps.vitals.models import Vital
from django.utils.timezone import now
from apps.vitals.serializers import VitalSerializer

class PatientCreateSerializer(serializers.ModelSerializer):
    birth_date = serializers.DateField(
        format="%Y-%m-%d",
        input_formats=["%Y-%m-%d"],
        required=True
    )
    patient_id = serializers.CharField(required=True)
    class Meta:
        model = Patient
        fields = ['name', 'gender', 'birth_date', 'patient_id']

class PatientListSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField()
    risk_score = serializers.SerializerMethodField()
    is_checked = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = ['id', 'name', 'gender', 'age', 'risk_score', 'is_checked', 'updated_at']

    def get_age(self, obj):
        today = date.today()
        return today.year - obj.birth_date.year

    def get_risk_score(self, obj):
        latest_vital = Vital.objects.filter(patient=obj).order_by('-measured_at').first()

        if not latest_vital:
            return 0  

        score = 0
        if latest_vital.systolic_bp >= 180 or latest_vital.systolic_bp <= 90:
            score += 30
        if latest_vital.diastolic_bp >= 120 or latest_vital.diastolic_bp <= 60:
            score += 20
        if latest_vital.oxygen <= 95:
            score += 20
        if latest_vital.temperature >= 38.0 or latest_vital.temperature <= 35.5:
            score += 15
        if latest_vital.pulse >= 120 or latest_vital.pulse <= 50:
            score += 10
        if latest_vital.respiration_rate >= 25 or latest_vital.respiration_rate <= 10:
            score += 5

        return score

    def get_is_checked(self, obj):
        return False  

    def get_updated_at(self, obj):
        latest_vital = Vital.objects.filter(patient=obj).order_by('-measured_at').first()
        return latest_vital.measured_at if latest_vital else obj.created_at
    
class PatientDetailSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField()
    risk_score = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()
    vitals = VitalSerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = [
            'id', 'name', 'gender', 'birth_date', 'age', 'patient_id',
            'risk_score', 'updated_at', 'vitals'
        ]

    def get_age(self, obj):
        today = date.today()
        return today.year - obj.birth_date.year

    def get_risk_score(self, obj):
        latest = obj.vitals.order_by('-measured_at').first()
        if not latest:
            return 0

        score = 0
        if latest.systolic_bp >= 180 or latest.systolic_bp <= 90:
            score += 30
        if latest.diastolic_bp >= 120 or latest.diastolic_bp <= 60:
            score += 20
        if latest.oxygen <= 95:
            score += 20
        if latest.temperature >= 38.0 or latest.temperature <= 35.5:
            score += 15
        if latest.pulse >= 120 or latest.pulse <= 50:
            score += 10
        if latest.respiration_rate >= 25 or latest.respiration_rate <= 10:
            score += 5

        return score

    def get_updated_at(self, obj):
        latest = obj.vitals.order_by('-measured_at').first()
        return latest.measured_at if latest else obj.created_at
