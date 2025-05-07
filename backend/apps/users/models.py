from django.db import models

# Create your models here.
# backend/apps/users/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('nurse', '간호사'),
        ('doctor', '의사'),
        ('patient', '환자'),
    ]
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='patient',
    )
