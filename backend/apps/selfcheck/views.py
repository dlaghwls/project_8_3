# ✅ backend/apps/selfcheck/views.py

# from django.shortcuts import render  ← ✅ 사용 안 함. 제거
from rest_framework import generics
from .models import SelfCheck
from .serializers import SelfCheckSerializer

# ✅ ListCreateAPIView 사용 → HTML 템플릿 안 씀
class SelfCheckListCreateView(generics.ListCreateAPIView):
    queryset = SelfCheck.objects.all().order_by('-submitted_at')
    serializer_class = SelfCheckSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        patient_id = self.request.query_params.get('patient')
        if patient_id is not None:
            qs = qs.filter(patient=int(patient_id))
        return qs

# ✅ RetrieveUpdateDestroyAPIView 사용 → 상세조회/수정/삭제 지원
class SelfCheckDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SelfCheck.objects.all()
    serializer_class = SelfCheckSerializer
