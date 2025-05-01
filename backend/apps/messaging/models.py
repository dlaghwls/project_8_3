from django.db import models
from apps.patients.models import Patient
from apps.selfcheck.models import SelfCheck

class Message(models.Model):
    patient = models.ForeignKey(
        Patient,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='messages'  # 🔧 related_name 추가: 역참조 시 clarity 제공
    )
    selfcheck = models.ForeignKey(
        SelfCheck,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='messages'  # 🔧 related_name 추가: 역참조 시 clarity 제공
    )
    sender_role = models.CharField(
        max_length=10,
        choices=[
            ('doctor', '의사'),
            ('nurse',  '간호사'),
        ],
        default='nurse',  # 기본값 유지
    )
    content = models.TextField()
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True  # 🔧 성능 향상: 시간 기반 정렬/필터 쿼리 속도 향상
    )

    def __str__(self):
        if self.patient:  # 🔧 patient가 None일 경우를 안전하게 처리
            return f"[{self.created_at}] {self.sender_role} → {self.patient.patient_id}"
        return f"[{self.created_at}] {self.sender_role} → (no patient)"

    class Meta:
        ordering = ['-created_at']  # 🔧 기본 정렬 순서 설정: 최신 메시지가 먼저
