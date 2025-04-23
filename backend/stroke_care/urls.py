from django.contrib import admin
from django.urls import path, include
from users.views import UserRegisterView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/users/', include('users.urls')),
    path('api/register/', UserRegisterView.as_view(), name='user_register'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/patients/', include('apps.patients.urls')),
    path('api/vitals/', include('apps.vitals.urls')),
    path('api/selfcheck/', include('apps.selfcheck.urls')),
    path('api/messages/', include('apps.messaging.urls')),
]


