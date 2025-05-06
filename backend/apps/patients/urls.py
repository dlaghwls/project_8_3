# apps/patients/urls.py

from django.urls import path
from .views import (
    PatientListCreateView,
    PatientRetrieveUpdateView,
    PatientLoginView,
)

urlpatterns = [
    # (루트에서 이미 api/patients/ 로 include 하므로 여기선 빈 문자열)
    path('', PatientListCreateView.as_view(), name='patient-list-create'),
    path('<int:id>/', PatientRetrieveUpdateView.as_view(), name='patient-detail'),
    path('login/', PatientLoginView.as_view(), name='patient-login'),
]
