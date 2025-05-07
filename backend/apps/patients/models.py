from django.db import models
from django.conf import settings  # ✅ settings에서 유저 모델 참조
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractUser


class Patient(models.Model):
    # ✅ settings.AUTH_USER_MODEL 사용 (커스텀 유저 모델)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='patient_profile',
        null=True,  # 기존 데이터 호환을 위해
        blank=True
    )
    
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
    name = models.CharField(max_length=100)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    birth_date = models.DateField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.patient_id})"


class DeviceToken(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient.patient_id} → {self.token}"

class CTScan(models.Model):
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name='ct_scans'
    )
    dicom_file = models.FileField(upload_to='ct_scans/%Y/%m/%d/')
    uploaded_at = models.DateTimeField(auto_now_add=True)