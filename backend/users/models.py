from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, employee_id, password=None, **extra_fields):
        if not employee_id:
            raise ValueError('Employee ID는 필수 항목입니다.')
        user = self.model(employee_id=employee_id, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, employee_id, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(employee_id, password, **extra_fields)

class User(AbstractUser):
    username = None  # 기존 username 필드 비활성화
    employee_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=50)
    role = models.CharField(
        max_length=10,
        choices=[('doctor', '의사'), ('nurse', '간호사'), ('patient', '환자')],
        default='patient'
    )

    USERNAME_FIELD = 'employee_id'
    REQUIRED_FIELDS = ['name', 'role']

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.employee_id} ({self.name})"
