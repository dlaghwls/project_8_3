from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ['employee_id', 'name', 'role', 'password']

    def create(self, validated_data):
        # ─── 비밀번호 분리하고 일반 필드로 User 객체 생성 ───────────
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
