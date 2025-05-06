from django.urls import path
from .views import VitalListCreateView, VitalDetailView

urlpatterns = [
    path('', VitalListCreateView.as_view(), name='vital-list-create'),
    path('<int:pk>/', VitalDetailView.as_view(), name='vital-detail'),
]