from django.db import models
from apps.patients.models import Patient

class SelfCheck(models.Model):
    MOOD_CHOICES = [
    ('happy', '좋음'),
    ('anxious', '불안'),
    ('depressed', '우울'),
    ]
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    
    headache = models.BooleanField()
    dizziness = models.BooleanField()
    numbness = models.BooleanField()
    speech_difficulty = models.BooleanField()
    vision_blur = models.BooleanField()
    nausea = models.BooleanField()
    pain_location = models.CharField() # 통증 위치 입력
    pain_score = models.IntegerField() # NRS 형식: 1~10까지 입력 
    mood = models.CharField(max_length=10, choices=MOOD_CHOICES) # 선택지 3개 중 택

    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient.name} - {self.submitted_at.strftime('%Y-%m-%d %H:%M')} 문진"

