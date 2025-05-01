# ── backend/stroke_care/urls.py ──
from users.views import SignupView 
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/patients/',  include('apps.patients.urls')),
    path('api/vitals/',    include('apps.vitals.urls')),
    path('api/selfcheck/', include('apps.selfcheck.urls')),
    path('api/messages/',  include('apps.messaging.urls')),
    path('api/users/',     include('users.urls')),            # 🔧 여기를 users.urls로
    
    # ✅ 프론트 요청에 맞춘 직접 경로 추가!
    path('api/register/', SignupView.as_view(), name='register'),

    # JWT
    path('api/token/',         TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(),  name='token_refresh'),
]
