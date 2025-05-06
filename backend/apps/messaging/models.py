from django.db import models
from django.conf import settings
from apps.patients.models import Patient
from apps.selfcheck.models import SelfCheck

class Message(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_messages'
    )
    # 환자 대상 메시지일 때
    patient = models.ForeignKey(
        Patient,
        null=True,
        blank=True,
        related_name='messages',
        on_delete=models.CASCADE
    )
    # 자가검진 알림 메시지일 때
    selfcheck = models.ForeignKey(
        SelfCheck,
        null=True,
        blank=True,
        related_name='messages',
        on_delete=models.CASCADE
    )
    content = models.TextField()
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
    )

    def __str__(self):
        # ✅ sender.role을 사용 (User 모델에 role 필드 필요)
        if self.patient:
            return f"[{self.created_at}] {self.sender.role} → {self.patient.patient_id}"
        return f"[{self.created_at}] {self.sender.role} → (no patient)"

    class Meta:
        ordering = ['-created_at']
