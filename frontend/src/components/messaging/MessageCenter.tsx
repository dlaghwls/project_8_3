import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../store/AuthContext';
import axios from 'axios';
import {
  Box, Typography, Paper, TextField, Button, Tabs, Tab,
  Divider, Avatar, IconButton, Badge, CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UserList from "./UserList";
import { User, Message } from '../../types';

interface AuthUser {
  id: number;
  name: string;
  role: string;
  [key: string]: any; // 다른 가능한 필드 허용
}

const MessageCenter: React.FC = () => {
  const { user } = useAuth() as { user: AuthUser | null };
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // WebSocket 연결 설정
  useEffect(() => {
    if (user && user.id) {
      try {
        // WebSocket 연결
        socketRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${user.id}/`);
        
        // 메시지 수신 이벤트 핸들러
        socketRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          // 현재 선택된 사용자와 메시지 발신자가 일치하면 화면에 표시
          if (selectedUser && data.message && data.message.sender_id === selectedUser.id) {
            const newMsg: Message = {
              id: Date.now(), // 임시 ID
              content: data.message.content || '',
              sender: data.message.sender_id || 0,
              sender_id: data.message.sender_id || 0,
              sender_name: data.message.sender_name || '',
              receiver: user.id,
              timestamp: data.message.created_at || new Date().toISOString(),
              is_read: true
            };
            setMessages(prev => [...prev, newMsg]);
          }
        };
        
        socketRef.current.onclose = () => {
          console.log('WebSocket 연결 종료');
        };
      } catch (error) {
        console.error('WebSocket 연결 실패:', error);
      }
      
      return () => {
        // 컴포넌트 언마운트 시 WebSocket 연결 해제
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }
  }, [user, selectedUser]);
  
  // 대화 목록 불러오기
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/messages/conversations/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(response.data);
      } catch (error) {
        console.error('대화 목록 로딩 실패:', error);
      }
    };
    
    if (user) {
      fetchConversations();
    }
  }, [user]);
  
  // 선택한 사용자와의 대화 내용 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/api/messages/conversation/?user_id=${selectedUser.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 서버에서 받은 메시지 데이터 변환
        const formattedMessages: Message[] = response.data.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          receiver: msg.receiver,
          timestamp: msg.created_at || msg.timestamp,
          is_read: msg.is_read
        }));
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error('메시지 로딩 실패:', error);
        setError('메시지를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [selectedUser, user]);
  
  // 메시지 목록 스크롤 처리
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // 메시지 전송
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser || !user) return;
    
    // WebSocket을 통한 메시지 전송
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        message: newMessage,
        receiver_id: selectedUser.id
      }));
    }
    
    // UI에 바로 표시
    const newMsg: Message = {
      id: Date.now(), // 임시 ID
      content: newMessage,
      sender: user.id,
      receiver: selectedUser.id,
      timestamp: new Date().toISOString(),
      is_read: false
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };
  
  // 사용자 선택 핸들러
  const handleSelectUser = (selectedUser: User) => {
    setSelectedUser(selectedUser);
    setActiveTab(0); // 메시지 탭으로 전환
  };
  
  // 대화 파트너 선택 핸들러
  const handleSelectConversation = (partner: User) => {
    setSelectedUser(partner);
    setActiveTab(0); // 메시지 탭으로 전환
  };
  
  // 탭 변경 핸들러
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (newValue === 2) {
      setSelectedUser(null);
    }
  };
  
  return (
    <Paper sx={{ p: 3, height: '75vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {selectedUser && (
          <IconButton onClick={() => setSelectedUser(null)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          {selectedUser ? `${selectedUser.name}과의 대화` : '메시지 센터'}
        </Typography>
      </Box>
      
      {!selectedUser && (
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="메시지" />
          <Tab label="대화 목록" />
          <Tab label="새 메시지 작성" />
        </Tabs>
      )}
      
      <Divider sx={{ mb: 2 }} />
      
      {/* 메시지 목록/대화 화면 */}
      <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
        {/* 선택된 사용자와의 대화 화면 */}
        {selectedUser && (
          <Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error" align="center" sx={{ p: 3 }}>
                {error}
              </Typography>
            ) : messages.length === 0 ? (
              <Typography align="center" sx={{ p: 3 }}>
                아직 대화 내용이 없습니다. 첫 메시지를 보내보세요!
              </Typography>
            ) : (
              messages.map((message, index) => {
                const isMine = user && (message.sender === user.id || message.sender_id === user.id);
                return (
                  <Box
                    key={message.id || index}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMine ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      {!isMine && selectedUser && (
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            mr: 1,
                            bgcolor: selectedUser.role === 'doctor' ? '#1976d2' : '#dc004e'
                          }}
                        >
                          {selectedUser.name.charAt(0)}
                        </Avatar>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {new Date(message.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: isMine ? '#1976d2' : 'grey.100',
                        color: isMine ? 'white' : 'text.primary',
                        borderRadius: 2,
                        maxWidth: '80%'
                      }}
                    >
                      <Typography variant="body1">{message.content}</Typography>
                    </Box>
                  </Box>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </Box>
        )}
        
        {/* 새 메시지 작성 - 사용자 선택 */}
        {!selectedUser && activeTab === 2 && (
          <UserList onSelectUser={handleSelectUser} />
        )}
        
        {/* 받은 메시지 */}
        {!selectedUser && activeTab === 0 && (
          <Typography align="center" sx={{ p: 3 }}>
            대화할 사용자를 선택하세요
          </Typography>
        )}
        
        {/* 대화 목록 */}
        {!selectedUser && activeTab === 1 && (
          conversations.length === 0 ? (
            <Typography align="center" sx={{ p: 3 }}>
              아직 대화한 사용자가 없습니다
            </Typography>
          ) : (
            conversations.map(partner => (
              <Box
                key={partner.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer'
                }}
                onClick={() => handleSelectConversation(partner)}
              >
                <Avatar
                  sx={{
                    mr: 2,
                    bgcolor: partner.role === 'doctor' ? '#1976d2' : '#dc004e'
                  }}
                >
                  {partner.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">{partner.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {partner.role === 'doctor' ? '의사' : '간호사'} ({partner.employee_id})
                  </Typography>
                </Box>
              </Box>
            ))
          )
        )}
      </Box>
      
      {/* 메시지 입력 (선택된 사용자가 있을 때만 표시) */}
      {selectedUser && (
        <Box sx={{ display: 'flex', mt: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="메시지를 입력하세요..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            sx={{ ml: 1 }}
          >
            전송
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default MessageCenter;
