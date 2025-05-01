# apps/messaging/urls.py

from django.urls import path
from .views import MessageListCreateView

urlpatterns = [
    # GET  /api/messages/?sender=…&receiver=…
    # POST /api/messages/
    path('', MessageListCreateView.as_view(), name='message-list-create'),
]
