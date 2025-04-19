from django.db import models
from apps.patients.models import Patient

class Vital(models.Model):
    #  프론트가 환자 리스트에서 선택한 환자의 id만 넘겨주도록 세팅
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='vitals')

    systolic_bp = models.IntegerField(verbose_name="수축기 혈압")    # 예: 120
    diastolic_bp = models.IntegerField(verbose_name="이완기 혈압")   # 예: 80
    pulse = models.IntegerField(verbose_name="맥박")                # 예: 70
    respiration_rate = models.IntegerField(verbose_name="호흡수")   # 예: 20
    temperature = models.FloatField(verbose_name="체온")            # 예: 36.5
    oxygen = models.FloatField(verbose_name="산소포화도 (%)")        # 예: 98.0

    measured_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient.name} - {self.measured_at.strftime('%Y-%m-%d %H:%M')} 측정"
