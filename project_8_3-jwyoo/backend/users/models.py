# backend/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('doctor', '의사'),
        ('nurse', '간호사'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    employee_id = models.CharField(max_length=20, unique=True)  # DOC-xxxx 또는 NUR-xxxx 형식
    name = models.CharField(max_length=50)  # 실제 이름

    # ✅ 여기 추가!
    username = models.CharField(
        max_length=150,
        unique=True,
        help_text='사용자 계정 ID입니다.'  # <- 이 부분이 마이그레이션을 유도함
    )

    class Meta:
        db_table = 'users'