# backend/chat/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Message
from .serializers import MessageSerializer

class MessageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        user = self.request.user
        # 사용자의 보낸 메시지와 받은 메시지 모두 가져오기
        return Message.objects.filter(sender=user) | Message.objects.filter(receiver=user)
    
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
    
    @action(detail=False, methods=['GET'])
    def get_conversations(self, request):
        """사용자가 대화한 모든 상대방 목록 가져오기"""
        user = request.user
        # 보낸 메시지의 수신자들
        receivers = User.objects.filter(received_messages__sender=user).distinct()
        # 받은 메시지의 발신자들
        senders = User.objects.filter(sent_messages__receiver=user).distinct()
        # 합치고 중복 제거
        contacts = (receivers | senders).distinct()
        
        from users.serializers import UserSerializer
        serializer = UserSerializer(contacts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['GET'])
    def conversation(self, request):
        """특정 사용자와의 대화 내용 가져오기"""
        user = request.user
        other_user_id = request.query_params.get('user_id')
        
        if not other_user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # 두 사용자 간의 모든 메시지 가져오기
        messages = Message.objects.filter(
            (models.Q(sender=user) & models.Q(receiver_id=other_user_id)) | 
            (models.Q(sender_id=other_user_id) & models.Q(receiver=user))
        ).order_by('timestamp')
        
        # 읽지 않은 메시지 읽음 표시
        messages.filter(receiver=user, is_read=False).update(is_read=True)
        
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
