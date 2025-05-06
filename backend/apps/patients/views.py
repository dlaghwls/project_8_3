from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Patient
from .serializers import PatientSerializer
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class PatientListCreateView(generics.ListCreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def perform_create(self, serializer):
        try:
            patient_data = serializer.validated_data
            employee_id = patient_data['patient_id']  # ✅ employee_id로 변경
            
            # ✅ employee_id 기준으로 사용자 조회
            existing_user = User.objects.filter(employee_id=employee_id).first()
            if existing_user:
                user = existing_user
            else:
                user = User.objects.create_user(
                    employee_id=employee_id,
                    name=patient_data['name'],
                    role='patient',
                    password='default_password'
                )
            serializer.save(user=user)
        except Exception as e:
            logger.error(f"회원가입 오류: {str(e)}", exc_info=True)
            raise

class PatientRetrieveUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    lookup_field = 'id'

class PatientLoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        pid = request.data.get('patient_id')
        if not pid:
            return Response(
                {"detail": "patient_id를 입력하세요."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            patient = Patient.objects.get(patient_id=pid)
            
            if not hasattr(patient, 'user') or patient.user is None:
                user = User.objects.create_user(
                    employee_id=f"user_{patient.patient_id}",  # ✅ employee_id 사용
                    name=patient.name,
                    role='patient',
                    password='default_password'
                )
                patient.user = user
                patient.save()
            
            refresh = RefreshToken.for_user(patient.user)
            return Response({
                "patient": PatientSerializer(patient).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_200_OK)
            
        except Patient.DoesNotExist:
            return Response(
                {"detail": "존재하지 않는 환자 등록번호입니다."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"로그인 오류: {str(e)}", exc_info=True)
            return Response(
                {"detail": f"로그인 중 오류 발생: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
