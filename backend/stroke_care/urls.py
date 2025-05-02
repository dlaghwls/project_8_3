# backend/stroke_care/urls.py

from django.contrib import admin
from django.urls import path, include
from users.views import SignupView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/patients/',  include('apps.patients.urls')),
    path('api/vitals/',    include('apps.vitals.urls')),
    path('api/selfcheck/', include('apps.selfcheck.urls')),
    path('api/messages/',  include('apps.messaging.urls')),       # ← 여기가 messaging 앱
    path('api/users/',     include('users.urls')),

    path('api/register/', SignupView.as_view(), name='register'),
    path('api/token/',         TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(),  name='token_refresh'),
]