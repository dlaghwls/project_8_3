# 루트 진입점만 include
from django.contrib import admin
from django.urls import path, include
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import UserRegisterView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', UserRegisterView.as_view(), name='user_register'),
    
    # 기존 앱 포함함
    path('admin/', admin.site.urls), # 관리자 페이지
    path('api/patients/', include('apps.patients.urls')), # 환자 등록
    path('api/vitals/', include('apps.vitals.urls')), # 환자 vital 입력
    path('api/selfcheck/', include('apps.selfcheck.urls')), # 환자 자가문진
    path('api/messages/', include('apps.messaging.urls')), # 의사-간호사 메세지 송수신

]

