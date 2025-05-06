from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import SelfCheck
from .serializers import SelfCheckSerializer
from apps.patients.models import Patient
import logging

logger = logging.getLogger(__name__)

class SelfCheckListByPatientView(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SelfCheckSerializer

    def get_queryset(self):
        patient_id = self.kwargs['patient_id']
        return SelfCheck.objects.filter(patient_id=patient_id)

class SelfCheckListCreateView(generics.ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SelfCheckSerializer
    queryset = SelfCheck.objects.all().order_by('-submitted_at')

    def create(self, request, *args, **kwargs):
        try:
            # 요청 데이터 로깅
            print(f"요청 데이터: {request.data}")
            
            # 1. 필수 필드 검증
            if 'patient' not in request.data:
                raise ValidationError({"detail": "환자 ID(patient)는 필수입니다."})
            
            # 2. 환자 존재 여부 확인
            patient_id = request.data['patient']
            if not Patient.objects.filter(id=patient_id).exists():
                raise ValidationError({"detail": "유효하지 않은 환자 ID입니다."})

            # 3. 데이터 검증 및 저장
            serializer = self.get_serializer(data=request.data)
            
            # 유효성 검사 실패 시 상세 오류 출력
            if not serializer.is_valid():
                print(f"유효성 검사 오류: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
            self.perform_create(serializer)
            
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        
        except Exception as e:
            print(f"예외 발생: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


    def perform_create(self, serializer):
        serializer.save()  # ✅ user 필드 제거

class SelfCheckDetailView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = SelfCheck.objects.all()
    serializer_class = SelfCheckSerializer
    lookup_field = 'pk'
