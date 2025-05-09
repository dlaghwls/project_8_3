# apps/patients/urls.py
from django.conf import settings
from django.conf.urls.static import static

from django.urls import path
from .views import (
    PatientListCreateView,
    PatientRetrieveUpdateView,
    PatientLoginView,
    CTUploadView,
    CTScanListView,
    VitalSignListCreateView,
    PatientDetailView,
    CTSegmentView,
)

urlpatterns = [
    # CT 업로드: /api/patients/<patient_id>/upload_ct/
    path('<int:patient_id>/upload_ct/', CTUploadView.as_view(), name='patient-ct-upload'),

    # CT 스캔 목록: /api/patients/<patient_id>/ct_scans/
    path('<int:patient_id>/ct_scans/', CTScanListView.as_view(), name='ctscan-list'),

    # 바이탈 목록 및 생성: /api/patients/<patient_id>/vitals/
    path('<int:patient_id>/vitals/', VitalSignListCreateView.as_view(), name='vitals-list-create'),

    # 세그멘테이션: /api/patients/<patient_id>/ct_scans/<scan_id>/segment/
    path(
        '<int:patient_id>/ct_scans/<int:scan_id>/segment/',
        CTSegmentView.as_view(),
        name='ctscan-segment'
    ),

    # 로그인: /api/patients/login/
    path('login/', PatientLoginView.as_view(), name='patient-login'),

    # 환자 상세 조회 (optional additional detail): /api/patients/<pk>/
    path('<int:pk>/', PatientDetailView.as_view(), name='patient-detail'),

    # 환자 조회/수정: /api/patients/<id>/
    path('<int:id>/', PatientRetrieveUpdateView.as_view(), name='patient-retrieve-update'),

    # 환자 목록 생성: /api/patients/
    path('', PatientListCreateView.as_view(), name='patient-list-create'),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,        # 예: '/media/'
        document_root=settings.MEDIA_ROOT  # 예: BASE_DIR/'media'
    )
