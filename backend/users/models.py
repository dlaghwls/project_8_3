from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager

class User(AbstractUser):
    # ─── 기존 username 필드 제거 ────────────────────────────
    username = None                                               # 🔧 추가: AbstractUser 의 username 필드 비활성화

    # ─── 새로운 인증용 필드 ────────────────────────────────────
    employee_id = models.CharField(max_length=20, unique=True)
    name        = models.CharField(max_length=50)
    role        = models.CharField(
        max_length=10,
        choices=[('doctor', '의사'), ('nurse', '간호사')],
    )

    # ─── 사용자 생성 시 employee_id 로 로그인하도록 지정 ──────────
    USERNAME_FIELD  = 'employee_id'                               # 🔧 추가
    REQUIRED_FIELDS = ['name', 'role']                            # 🔧 추가: create_superuser 에 필요한 필드

    objects = UserManager()                                       # 🔧 추가: 기본 UserManager 사용

    def __str__(self):
        return f"{self.employee_id} ({self.name})"
