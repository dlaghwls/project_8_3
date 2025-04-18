# 루트 진입점만 include
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls), # 관리자 페이지
    path('api/patients/', include('apps.patients.urls')), # API 진입점
]

