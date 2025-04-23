# backend/users/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('doctor', '의사'),
        ('nurse', '간호사'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    employee_id = models.CharField(max_length=20, unique=True)  # DOC-xxxx 또는 NUR-xxxx 형식
    name = models.CharField(max_length=50)  # 실제 이름
    USERNAME_FIELD = 'employee_id'  # ✅ 이거 꼭 추가
    REQUIRED_FIELDS = ['username', 'name', 'role']
    
    class Meta:
        db_table = 'users'
