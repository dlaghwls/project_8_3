from django.urls import path
from .views import PatientListCreateView, PatientRetrieveUpdateView

urlpatterns = [
    path('', PatientListCreateView.as_view(), name='patient-list-create'), # 전체 조회, 등록
    path('<int:id>/', PatientRetrieveUpdateView.as_view(), name='patient-detail'), # id로 매칭칭
]
