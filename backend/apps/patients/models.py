# backend/apps/patients/models.py

from django.db import models
from django.core.validators import RegexValidator

class Patient(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    eight_digit_validator = RegexValidator(
        regex=r'^\d{8}$',
        message='환자등록번호는 숫자 8자리만 입력할 수 있습니다.'
    )

    patient_id = models.CharField(
        max_length=8,
        unique=True,
        validators=[eight_digit_validator],
        help_text='8자리 숫자 (예: 20250001)'
    )
    # 환자 등록번호 (DB PK 아님, auto PK 별도 존재)
    name = models.CharField(max_length=100)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    birth_date = models.DateField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.patient_id})"


# ─────────────────────────────────────────────────────────
# 아래부터 새로 추가된 DeviceToken 모델
# 환자의 FCM 디바이스 토큰을 저장하기 위해 생성합니다.
# ─────────────────────────────────────────────────────────

class DeviceToken(models.Model):
    """
    환자(Device)별 FCM 토큰 저장용 모델
    """
    patient    = models.ForeignKey(Patient, on_delete=models.CASCADE)
    token      = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient.patient_id} → {self.token}"
