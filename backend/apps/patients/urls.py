# backend/apps/patients/urls.py
from django.urls import path
from .views import (
    PatientListCreateView,
    PatientRetrieveUpdateView,
    PatientDeleteView,
    PatientLoginView,
)

urlpatterns = [
    # 환자 목록 조회 + 등록
    path('', PatientListCreateView.as_view(), name='patient-list-create'),

    # 환자 상세 조회 + 수정
    path('<int:id>/', PatientRetrieveUpdateView.as_view(), name='patient-detail'),

    # 환자 삭제 전용 엔드포인트
    path('<int:id>/delete/', PatientDeleteView.as_view(), name='patient-delete'),

    # 환자 로그인 (patient_id 기반)
    path('login/', PatientLoginView.as_view(), name='patient-login'),
]