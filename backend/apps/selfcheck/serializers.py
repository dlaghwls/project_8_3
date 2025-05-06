from rest_framework import serializers
from .models import SelfCheck

class SelfCheckSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    submitted_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    headache = serializers.BooleanField(default=False)
    dizziness = serializers.BooleanField(default=False)
    numbness = serializers.BooleanField(default=False)
    speech_difficulty = serializers.BooleanField(default=False)
    vision_blur = serializers.BooleanField(default=False)
    nausea = serializers.BooleanField(default=False)
    pain_score = serializers.IntegerField(default=0)
    mood = serializers.CharField(default='happy')
    pain_location = serializers.CharField(default='', allow_blank=True)
    
    class Meta:
        model = SelfCheck
        fields = [
            'id', 'patient', 'patient_name', 'headache', 'dizziness', 'numbness',
            'speech_difficulty', 'vision_blur', 'nausea', 'pain_score', 
            'mood', 'pain_location', 'submitted_at'
        ]
        read_only_fields = ['id', 'submitted_at']
