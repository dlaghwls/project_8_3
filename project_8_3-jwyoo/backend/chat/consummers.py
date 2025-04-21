# backend/chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message
from users.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.room_name = f"user_{self.user_id}"
        
        # 그룹에 가입
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        # 그룹에서 나가기
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        receiver_id = data['receiver_id']
        
        # 메시지 저장
        message_obj = await self.save_message(message, receiver_id)
        
        # 수신자 그룹으로 메시지 전송
        receiver_room = f"user_{receiver_id}"
        await self.channel_layer.group_send(
            receiver_room,
            {
                'type': 'chat_message',
                'message': message_obj['content'],
                'sender_id': message_obj['sender_id'],
                'sender_name': message_obj['sender_name'],
                'timestamp': message_obj['timestamp']
            }
        )
        
        # 발신자에게도 메시지 전송 (UI 업데이트)
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'chat_message',
                'message': message_obj['content'],
                'receiver_id': receiver_id,
                'timestamp': message_obj['timestamp']
            }
        )
    
    async def chat_message(self, event):
        # WebSocket으로 메시지 전송
        await self.send(text_data=json.dumps(event))
    
    @database_sync_to_async
    def save_message(self, content, receiver_id):
        from django.utils import timezone
        sender = User.objects.get(id=self.user_id)
        receiver = User.objects.get(id=receiver_id)
        
        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            content=content
        )
        
        return {
            'content': message.content,
            'sender_id': sender.id,
            'sender_name': sender.name,
            'timestamp': message.timestamp.isoformat()
        }
