from django.urls import path
from .views import MessageListCreateView, RecipientListView

urlpatterns = [
    path('', MessageListCreateView.as_view(), name='message-list-create'),  # ✅ /api/messages/
    path('recipients/', RecipientListView.as_view(), name='recipient-list'),  # ✅ /api/messages/recipients/
]
