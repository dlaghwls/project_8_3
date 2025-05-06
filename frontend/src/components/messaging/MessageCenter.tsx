// src/components/messaging/MessageCenter.tsx

import React, { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import { useAuth } from '../../store/AuthContext';
import {
  Box, Typography, List, ListItemButton, ListItemText,
  ListItemAvatar, Avatar, Fab, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField,
  ToggleButton, ToggleButtonGroup
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
    <Box sx={{ p: 2, position: 'relative' }}>
      {/* 필터 */}
      <ToggleButtonGroup
        value={filterMode}
        exclusive
        onChange={(_, v) => v && setFilterMode(v)}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="all">전체</ToggleButton>
        <ToggleButton value="inbox">받은 메시지</ToggleButton>
        <ToggleButton value="sent">보낸 메시지</ToggleButton>
      </ToggleButtonGroup>

      {/* 리스트 */}
      {loading && <Typography>로딩 중…</Typography>}
      {error   && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <List>
          {filtered.map(msg => {
            const isSent = msg.sender_id === currentUserId;

            // 보낼 때 표시할 상대
            const other = isSent
              ? recipientMap[msg.receiver_id]
              : recipientMap[msg.sender_id];

            // “이름 (등록번호)” 혹은 알 수 없으면 fallback
            const otherLabel = other
              ? `${other.name} (${other.employee_id})`
              : '알 수 없음';

            // primary text 결정
            const primaryText = isSent
              ? `나 → ${otherLabel}`
              : `${msg.sender_name} → 나`;

            return (
              <ListItemButton key={msg.id}>
                <ListItemAvatar>
                  <Avatar>
                    {isSent
                      ? (other?.name.charAt(0) ?? '?')
                      : msg.sender_name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        {primaryText}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(msg.created_at).toLocaleString('ko-KR')}
                      </Typography>
                    </Box>
                  }
                  secondary={msg.content}
                />
              </ListItemButton>
            );
          })}

          {filtered.length === 0 && (
            <Typography align="center" sx={{ py: 3 }}>
              {filterMode === 'all'   && '메시지가 없습니다.'}
              {filterMode === 'inbox' && '받은 메시지가 없습니다.'}
              {filterMode === 'sent'  && '보낸 메시지가 없습니다.'}
            </Typography>
          )}
        </List>
      )}

      {/* 새 메시지 버튼 */}
      <Fab
        color="primary"
        onClick={() => setComposeOpen(true)}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
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