from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Patient, CTScan
from .serializers import PatientSerializer
import logging
from .serializers import CTScanUploadSerializer, CTScanSerializer, PatientDetailSerializer
from rest_framework.generics import RetrieveAPIView
from django.shortcuts import get_object_or_404
from apps.vitals.models import Vital
from .serializers import VitalSignSerializer
from .m1.utils import run_segmentation
from rest_framework.parsers import MultiPartParser, FormParser 
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

class CTUploadView(APIView):
    """
    POST /api/patients/{patient_id}/upload_ct/
    DICOM 파일을 업로드해서 CTScan 레코드를 생성합니다.
    """
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, patient_id):
        # 1) patient 인스턴스 가져오기
        patient = get_object_or_404(Patient, pk=patient_id)

        # 2) serializer로 검증 (request.data 안에 'dicom_file'이 있어야 합니다)
        serializer = CTScanUploadSerializer(data=request.data)
        if not serializer.is_valid():
            # 에러 내용을 바로 클라이언트에 리턴
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # 3) 저장 (patient를 전달)
        serializer.save(patient=patient)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class CTScanListView(APIView):
    def get(self, request, patient_id):
        try:
            patient = Patient.objects.get(pk=patient_id)
        except Patient.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        scans = CTScan.objects.filter(patient=patient).order_by('-uploaded_at')
        serializer = CTScanSerializer(scans, many=True)
        return Response(serializer.data)
    

class PatientDetailView(RetrieveAPIView):
    """
    GET /api/patients/{pk}/
    환자 기본 정보와 vitals, ct_scans, comments를 한 번에 반환
    """
    queryset = Patient.objects.all()
    serializer_class = PatientDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'


class VitalSignListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/patients/{patient_id}/vitals/   → 해당 환자 바이탈 리스트 반환
    POST /api/patients/{patient_id}/vitals/   → 새 바이탈 생성 후 반환
    """
    serializer_class = VitalSignSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Vital.objects.filter(patient_id=self.kwargs['patient_id']) \
                             .order_by('-measured_at')

    def perform_create(self, serializer):
        patient = get_object_or_404(Patient, pk=self.kwargs['patient_id'])
        serializer.save(patient=patient)

class CTSegmentView(APIView):
    def post(self, request, patient_id, scan_id):
        scan = get_object_or_404(CTScan, pk=scan_id, patient__pk=patient_id)
        full_path = run_segmentation(scan.dicom_file.path)
        # 파일시스템 경로 → 클라이언트가 접근할 URL
        rel_url = full_path.replace(str(settings.MEDIA_ROOT), settings.MEDIA_URL)
        return Response({'segmented_url': rel_url}, status=status.HTTP_200_OK)