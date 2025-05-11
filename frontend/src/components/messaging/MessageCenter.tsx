// src/components/messaging/MessageCenter.tsx
import React, { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import { useAuth } from '../../store/AuthContext';
import {
  Box, Typography, List, ListItemButton, ListItemText,
  ListItemAvatar, Avatar, Fab, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField,
  ToggleButton, ToggleButtonGroup, Paper, Container
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  id: number;
  content: string;
  sender_id: number;
  sender_name: string;
  receiver_id: number;
  is_read: boolean;
  created_at: string;
}
interface Recipient {
  id: number;
  employee_id: string;
  name: string;
  role: 'doctor'|'nurse';
}

const MessageCenter: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Typography>로그인 후 이용해주세요.</Typography>;
  const currentUserId = Number(user.id);

  const [messages, setMessages]     = useState<Message[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string|null>(null);
  const [filterMode, setFilterMode] = useState<'all'|'inbox'|'sent'>('all');
  const [composeOpen, setComposeOpen] = useState(false);
  const [newRecipient, setNewRecipient] = useState<number|''>('');
  const [newContent, setNewContent]   = useState('');

  // recipients → { [id]: Recipient }
  const recipientMap = useMemo(() => {
    return recipients.reduce((m, r) => {
      m[r.id] = r;
      return m;
    }, {} as Record<number, Recipient>);
  }, [recipients]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: msgs }  = await api.get<Message[]>('/messages/');
        const { data: users } = await api.get<Recipient[]>('/messages/recipients/');
        setMessages(msgs);
        setRecipients(users);
      } catch (e:any) {
        console.error(e);
        setError('메시지 로딩 실패');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return messages.filter(msg => {
      if (filterMode === 'inbox')  return msg.receiver_id === currentUserId;
      if (filterMode === 'sent')   return msg.sender_id   === currentUserId;
      return true;
    });
  }, [messages, filterMode, currentUserId]);

  const handleSend = async () => {
    if (!newRecipient || !newContent.trim()) return;
    try {
      const { data: sent } = await api.post<Message>(
        '/messages/',
        { receiver: newRecipient, content: newContent }
      );
      setMessages(prev => [sent, ...prev]);
      setComposeOpen(false);
      setNewRecipient('');
      setNewContent('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box 
      sx={{ 
        // position: 'fixed', // 'relative'에서 'fixed'로 변경
        // top: 0,
        // left: 0,
        // width: '100vw', // 전체 뷰포트 너비
        // height: '100vh', // 전체 뷰포트 높이
        // display: 'flex', // flexbox 활성화
        // justifyContent: 'center', // 가로 중앙 정렬
        // alignItems: 'center', // 세로 중앙 정렬
        // overflow: 'auto', // 내용이 넘칠 경우 스크롤 허용
        '&::before': {
          content: '""',
          position: 'fixed', // 'absolute'에서 'fixed'로 변경
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          opacity: 0.7, // 약간 더 진하게
          zIndex: -1
        }
      }}
    >
      <Container 
        maxWidth="md" 
        sx={{ 
          py: 4,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center', // 세로 중앙 정렬 추가
        }}
      >
        {/* 필터 부분 (중앙 정렬) */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, width: '100%' }}>
          <ToggleButtonGroup
            value={filterMode}
            exclusive
            onChange={(_, v) => v && setFilterMode(v)}
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 2,
              boxShadow: 1
            }}
          >
            <ToggleButton value="all">전체</ToggleButton>
            <ToggleButton value="inbox">받은 메시지</ToggleButton>
            <ToggleButton value="sent">보낸 메시지</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* 메시지 리스트 (중앙 정렬, 크기 확대) */}
        <Paper
          elevation={3}
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.95)', // 투명도 조정
            borderRadius: 3,
            overflow: 'hidden',
            mb: 3,
            width: '100%', // 가능한 전체 너비
            maxWidth: '800px', // 최대 너비 제한
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)' // 그림자 강화
          }}
        >
          {loading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography>로딩 중...</Typography>
            </Box>
          )}
          
          {error && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}
          
          {!loading && !error && (
            <List sx={{ p: 0 }}>
              {filtered.map(msg => {
                const isSent = msg.sender_id === currentUserId;
                const other = isSent
                  ? recipientMap[msg.receiver_id]
                  : recipientMap[msg.sender_id];
                const otherLabel = other
                  ? `${other.name} (${other.employee_id})`
                  : '알 수 없음';
                const primaryText = isSent
                  ? `나 → ${otherLabel}`
                  : `${msg.sender_name} → 나`;

                return (
                  <ListItemButton 
                    key={msg.id}
                    sx={{ 
                      p: 2.5,
                      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.08)'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ width: 48, height: 48, mr: 1 }}>
                        {isSent
                          ? (other?.name.charAt(0) ?? '?')
                          : msg.sender_name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="subtitle1" fontWeight="500">
                            {primaryText}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(msg.created_at).toLocaleString('ko-KR')}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            whiteSpace: 'pre-wrap',
                            color: 'text.primary'
                          }}
                        >
                          {msg.content}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                );
              })}

              {filtered.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography>
                    {filterMode === 'all'   && '메시지가 없습니다.'}
                    {filterMode === 'inbox' && '받은 메시지가 없습니다.'}
                    {filterMode === 'sent'  && '보낸 메시지가 없습니다.'}
                  </Typography>
                </Box>
              )}
            </List>
          )}
        </Paper>
      </Container>

      {/* 새 메시지 버튼 */}
      <Fab
        color="primary"
        onClick={() => setComposeOpen(true)}
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24,
          boxShadow: 3
        }}
      >
        <AddIcon />
      </Fab>

      {/* Compose Dialog */}
      <Dialog open={composeOpen} onClose={() => setComposeOpen(false)} fullWidth>
        <DialogTitle>새 메시지 작성</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="받는 사람"
            value={newRecipient}
            onChange={e => setNewRecipient(Number(e.target.value))}
            SelectProps={{ native: true }}
            sx={{ mb: 2 }}
          >
            <option value="">선택</option>
            {recipients.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.role === 'nurse' ? '간호사' : '의사'})
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="메시지 내용"
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComposeOpen(false)}>취소</Button>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSend}
            disabled={!newRecipient || !newContent.trim()}
          >
            전송
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MessageCenter;
