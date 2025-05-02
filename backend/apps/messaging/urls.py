# backend/apps/messaging/urls.py

from django.urls import path
from .views import MessageListCreateAPIView, MessageRetrieveDestroyAPIView

urlpatterns = [
    # GET  /api/messages/?patient=<id>&since=<id>
    # POST /api/messages/
    path('', MessageListCreateAPIView.as_view(), name='message-list-create'),
    # DELETE /api/messages/<pk>/
    path('<int:pk>/', MessageRetrieveDestroyAPIView.as_view(), name='message-detail'),
]