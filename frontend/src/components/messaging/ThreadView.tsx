// src/components/messaging/ThreadView.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';
import api from '../../services/api';

interface Message {
  id: number;
  content: string;
  sender_name: string;
  created_at: string;
}

const ThreadView: React.FC = () => {
  const { otherId } = useParams<{ otherId: string }>();
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<Message[]>(`/messages/conversations/${otherId}/`);
        setMsgs(data);
      } catch (e: any) {
        console.error(e);
        setError('채팅 로딩 실패');
      }
    };
    load();
  }, [otherId]);

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <List>
      {msgs.map(m => (
        <ListItem key={m.id}>
          <ListItemAvatar>
            <Avatar>{m.sender_name.charAt(0)}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={m.sender_name}
            secondary={
              <>
                <Typography component="span">{m.content}</Typography>
                <Typography variant="caption" display="block">
                  {new Date(m.created_at).toLocaleString('ko-KR')}
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
      {msgs.length === 0 && <Typography>메시지가 없습니다.</Typography>}
    </List>
  );
};

export default ThreadView;
