from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User
from django.contrib.auth.hashers import make_password

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'name', 'role', 'employee_id']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class CustomTokenObtainPairSerializer(serializers.Serializer):
    employee_id = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        employee_id = attrs.get('employee_id')
        password = attrs.get('password')

        try:
            user = User.objects.get(employee_id=employee_id)
        except User.DoesNotExist:
            raise serializers.ValidationError('존재하지 않는 사원번호입니다.')

        if not user.check_password(password):
            raise serializers.ValidationError('비밀번호가 올바르지 않습니다.')

        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'employee_id': user.employee_id,
            'name': user.name,
            'role': user.role
        }
