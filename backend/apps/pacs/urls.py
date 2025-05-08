from django.urls import path
from .views import list_dicom_instances

urlpatterns = [
    path("instances/", list_dicom_instances),
]
