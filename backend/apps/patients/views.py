# 실제로 동작할 API 동작 로직

from django.shortcuts import render
from rest_framework import generics
from .models import Patient
from .serializers import PatientSerializer

# 전체 목록 보기(GET) + 새 환자 등록(POST)을 처리하는 API
class PatientListCreateView(generics.ListCreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

# 특정 환자 조회(GET) + 수정(PUT/PATCH)하는 API
class PatientRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    lookup_field = 'id' # URL에서 /patients/3/ 이런 식으로 찾음

