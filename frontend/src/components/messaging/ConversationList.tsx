// src/components/messaging/ConversationList.tsx
import React, { useEffect, useState } from 'react';
import { List, ListItemButton, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../store/AuthContext';

interface Conversation {
  other_id: number;
  other_name: string;
  other_employeeId: string;
  last_message: string;
  last_at: string;
}

const ConversationList: React.FC = () => {
  const { user } = useAuth();
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Backend 에서는 “내가 관여된 대화방“ 목록을 제공하는 엔드포인트 필요
        const { data } = await api.get<Conversation[]>('/messages/conversations/');
        setConvs(data);
      } catch (e: any) {
        console.error(e);
        setError('대화 목록 로딩 실패');
      }
    };
    load();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <List>
      {convs.map(c => (
        <ListItemButton
          key={c.other_id}
          component={Link}
          to={`${c.other_id}`}
        >
          <ListItemAvatar>
            <Avatar>{c.other_name.charAt(0)}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${c.other_name} (${c.other_employeeId})`}
            secondary={c.last_message}
          />
          <Typography variant="caption">
            {new Date(c.last_at).toLocaleString('ko-KR')}
          </Typography>
        </ListItemButton>
      ))}
      {convs.length === 0 && <Typography>대화가 없습니다.</Typography>}
    </List>
  );
};

export default ConversationList;
