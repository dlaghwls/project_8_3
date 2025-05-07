# ── backend/stroke_care/urls.py ──
from users.views import SignupView, MeView, LoginView
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/patients/',  include('apps.patients.urls')),
    path('api/vitals/',    include('apps.vitals.urls')),
    path('api/selfcheck/', include('apps.selfcheck.urls')),
    path('api/messages/',  include('apps.messaging.urls')),
    path('api/users/',     include('users.urls')),            # 🔧 여기를 users.urls로
    path('api/users/login/',   LoginView.as_view(), name='login'),
    path('api/users/register/', SignupView.as_view(), name='register'),
    path('api/patients/', include('apps.patients.urls')),

    # ✅ 프론트 요청에 맞춘 직접 경로 추가!
    path('api/register/', SignupView.as_view(), name='register'),
    path('api/users/me/',       MeView.as_view(),     name='me'),
    
    # JWT
    path('api/token/',         TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(),  name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)