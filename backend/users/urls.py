# ── backend/users/urls.py ──
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import SignupView, LoginView, UserViewSet

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    path('register/', SignupView.as_view(), name='user-register'),  # ✅ 프론트 요청 URL 대응
    path('signup/',   SignupView.as_view(), name='user-signup'),    # ← 기존 유지해도 무방
    path('login/',    LoginView.as_view(),  name='user-login'),
    path('', include(router.urls)),
]
