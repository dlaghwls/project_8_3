from django.urls import path
from .views import SelfCheckListCreateView, SelfCheckDetailView

urlpatterns = [
    path('', SelfCheckListCreateView.as_view(), name='selfcheck-list'),
    path('<int:pk>/', SelfCheckDetailView.as_view(), name='selfcheck-detail'),
]
