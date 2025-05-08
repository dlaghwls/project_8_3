from django.shortcuts import render
import requests
from requests.auth import HTTPBasicAuth  
from django.http import JsonResponse
from django.conf import settings


ORTHANC_URL = settings.ORTHANC_URL
ORTHANC_USER = settings.ORTHANC_USER
ORTHANC_PASS = settings.ORTHANC_PASS

def list_dicom_instances(request):
    try:
        res = requests.get(
            f"{ORTHANC_URL}/instances",
            auth=HTTPBasicAuth(ORTHANC_USER, ORTHANC_PASS)
        )
        res.raise_for_status()
        return JsonResponse(res.json(), safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
