from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} → {self.receiver}: {self.content[:20]}"

    class Meta:
        ordering = ['-timestamp']  # 최신순 정렬

# JWT 로그인 붙으면 request.user로 자동 sender 넣을 수 있게 구조만 맞춰둔 상태임