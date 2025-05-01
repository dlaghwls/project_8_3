# backend/apps/patients/views.py
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Patient
from .serializers import PatientSerializer

# ────────────────────────────────────────────────────────────────
# 기존: 목록 조회 + 생성
class PatientListCreateView(generics.ListCreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

# ────────────────────────────────────────────────────────────────
# 기존: 상세 조회 + 수정
class PatientRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    lookup_field = 'id'

# ────────────────────────────────────────────────────────────────
# 추가: 삭제 전용
class PatientDeleteView(generics.DestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    lookup_field = 'id'

# ────────────────────────────────────────────────────────────────
# 추가: patient_id 기반 로그인
class PatientLoginView(APIView):
    permission_classes = []  # 인증 없이 접근 허용
    def post(self, request):
        pid = request.data.get('patient_id')
        if not pid:
            return Response({"detail": "patient_id를 입력하세요."},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            patient = Patient.objects.get(patient_id=pid)
        except Patient.DoesNotExist:
            return Response({"detail": "등록되지 않은 환자입니다."},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer = PatientSerializer(patient)
        return Response(serializer.data, status=status.HTTP_200_OK)
