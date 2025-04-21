from rest_framework import generics
from .models import Message
from .serializers import MessageSerializer

class MessageListCreateView(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def get_queryset(self):
        queryset = Message.objects.all()
        sender = self.request.query_params.get('sender')
        receiver = self.request.query_params.get('receiver')
        if sender:
            queryset = queryset.filter(sender_id=sender)
        if receiver:
            queryset = queryset.filter(receiver_id=receiver)
        return queryset
