import React, { useEffect, useState } from 'react';
import {
  Box, Typography, List, ListItemButton, ListItemText, ListItemAvatar,
  Avatar, TextField, Button, Divider, Paper, Badge, Tabs, Tab
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  id: number;
  content: string;
  sender_id: number;
  sender_name: string;
  sender_role: string;
  is_read: boolean;
  created_at: string;
}

const MessageCenter = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [recipients, setRecipients] = useState<{id: number, name: string, role: string}[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<number | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 메시지 및 수신자 목록 불러오기
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 실제 API 연동 전 테스트 데이터
        const mockMessages = [
          { id: 1, content: '환자 김환자의 상태가 악화되었습니다. 확인 부탁드립니다.', sender_id: 102, sender_name: '김간호사', sender_role: 'nurse', is_read: false, created_at: new Date().toISOString() },
          { id: 2, content: '오늘 회진 일정이 변경되었습니다.', sender_id: 103, sender_name: '이간호사', sender_role: 'nurse', is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() }
        ];
        
        const mockRecipients = [
          { id: 102, name: '김간호사', role: 'nurse' },
          { id: 103, name: '이간호사', role: 'nurse' },
          { id: 104, name: '박간호사', role: 'nurse' }
        ];

        setMessages(mockMessages);
        setRecipients(mockRecipients);
        setUnreadCount(mockMessages.filter(msg => !msg.is_read).length);
        setLoading(false);
      } catch (error) {
        console.error('메시지 로딩 실패:', error);
        setError('메시지를 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 메시지 읽음 처리
  const markAsRead = async (id: number) => {
    try {
      // API 연동 전 클라이언트에서만 상태 변경
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, is_read: true } : msg
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('메시지 읽음 처리 실패:', error);
    }
  };

  // 새 메시지 전송
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRecipient) return;
    
    try {
      // 실제 API 연동 전 테스트 데이터 추가
      const newMsg = {
        id: Date.now(),
        content: newMessage,
        sender_id: 101, // 현재 로그인한 의사 ID (예시)
        sender_name: '김의사',
        sender_role: 'doctor',
        is_read: false,
        created_at: new Date().toISOString()
      };
      
      setMessages([newMsg, ...messages]);
      setNewMessage('');
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  };

  // 로딩 중 표시
  if (loading) {
    return <Typography>메시지 로딩 중...</Typography>;
  }

  // 오류 표시
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Tabs 
        value={activeTab} 
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab 
          label={
            <Badge badgeContent={unreadCount} color="error" max={99}>
              받은 메시지
            </Badge>
          } 
        />
        <Tab label="보낸 메시지" />
        <Tab label="새 메시지 작성" />
      </Tabs>

      {/* 받은 메시지 탭 */}
      {activeTab === 0 && (
        <List>
          {messages.filter(msg => msg.sender_role !== 'doctor').map(message => (
            <React.Fragment key={message.id}>
              <ListItemButton
                sx={{ 
                  bgcolor: message.is_read ? 'inherit' : 'rgba(25, 118, 210, 0.08)'
                }}
                onClick={() => !message.is_read && markAsRead(message.id)}
              >
                <ListItemAvatar>
                  <Avatar>{message.sender_name.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography component="span" variant="body1">
                        {message.sender_name} ({message.sender_role === 'nurse' ? '간호사' : '기타'})
                      </Typography>
                      <Typography component="span" variant="caption" color="text.secondary">
                        {new Date(message.created_at).toLocaleString('ko-KR')}
                      </Typography>
                    </Box>
                  }
                  secondary={message.content}
                />
              </ListItemButton>
              <Divider />
            </React.Fragment>
          ))}
          {messages.filter(msg => msg.sender_role !== 'doctor').length === 0 && (
            <Typography align="center" sx={{ py: 3 }}>받은 메시지가 없습니다.</Typography>
          )}
        </List>
      )}

      {/* 보낸 메시지 탭 */}
      {activeTab === 1 && (
        <List>
          {messages.filter(msg => msg.sender_role === 'doctor').map(message => (
            <React.Fragment key={message.id}>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>{message.sender_name.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography component="span" variant="body1">
                        {message.sender_name} (나)
                      </Typography>
                      <Typography component="span" variant="caption" color="text.secondary">
                        {new Date(message.created_at).toLocaleString('ko-KR')}
                      </Typography>
                    </Box>
                  }
                  secondary={message.content}
                />
              </ListItemButton>
              <Divider />
            </React.Fragment>
          ))}
          {messages.filter(msg => msg.sender_role === 'doctor').length === 0 && (
            <Typography align="center" sx={{ py: 3 }}>보낸 메시지가 없습니다.</Typography>
          )}
        </List>
      )}

      {/* 새 메시지 작성 탭 */}
      {activeTab === 2 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            새 메시지 작성
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            받는 사람:
          </Typography>
          <List sx={{ maxHeight: '200px', overflow: 'auto', border: '1px solid #eee', mb: 2 }}>
            {recipients.map(recipient => (
              <ListItemButton
                key={recipient.id}
                selected={selectedRecipient === recipient.id}
                onClick={() => setSelectedRecipient(recipient.id)}
              >
                <ListItemAvatar>
                  <Avatar>{recipient.name.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={recipient.name}
                  secondary={recipient.role === 'nurse' ? '간호사' : '의사'}
                />
              </ListItemButton>
            ))}
          </List>
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="메시지 내용..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              endIcon={<SendIcon />}
              onClick={sendMessage}
              disabled={!selectedRecipient || !newMessage.trim()}
            >
              전송
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default MessageCenter;