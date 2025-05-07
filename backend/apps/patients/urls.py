# apps/patients/urls.py

from django.urls import path
from .views import (
    PatientListCreateView,
    PatientRetrieveUpdateView,
    PatientLoginView,
    CTUploadView,
    CTScanListView,
    PatientDetailView,
    VitalSignListCreateView,
)

urlpatterns = [
    # (루트에서 이미 api/patients/ 로 include 하므로 여기선 빈 문자열)
    path('<int:pk>/', PatientDetailView.as_view(), name='patient-detail'),
    path('', PatientListCreateView.as_view(), name='patient-list-create'),
    path('<int:id>/', PatientRetrieveUpdateView.as_view(), name='patient-detail'),
    path('login/', PatientLoginView.as_view(), name='patient-login'),
    path('<int:patient_id>/upload_ct/', CTUploadView.as_view(), name='patient-ct-upload'),
    path('<int:patient_id>/ct_scans/', CTScanListView.as_view(), name='ctscan-list'),

    path('<int:patient_id>/vitals/', VitalSignListCreateView.as_view(), name='vitals-list-create'),
]
