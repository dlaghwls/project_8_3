from django.urls import path
from .views import (
    SelfCheckListCreateView,
    SelfCheckDetailView,
    SelfCheckListByPatientView
)

urlpatterns = [
    # 특정 환자의 모든 자가문진 조회 (간호사 페이지용)
    path('patient/<int:patient_id>/', SelfCheckListByPatientView.as_view(), name='selfcheck-list-by-patient'),
    
    # 단일 자가문진 조회/수정/삭제 (기본 PK 기반)
    path('<int:pk>/', SelfCheckDetailView.as_view(), name='selfcheck-detail'),
    
    # 모든 자가문진 조회 및 생성
    path('', SelfCheckListCreateView.as_view(), name='selfcheck-list'),
]
