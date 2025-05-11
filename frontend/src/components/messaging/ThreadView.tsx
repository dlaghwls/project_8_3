import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  List, ListItem, ListItemAvatar, Avatar, ListItemText, 
  Typography, Box, Paper, Container, CircularProgress 
} from '@mui/material';
import api from '../../services/api';
import messageBackground from '../../assets/images/message.jpg'; // 이미지 경로 확인 필요

interface Message {
  id: number;
  content: string;
  sender_name: string;
  created_at: string;
  sender_id: number; // 추가: 발신자 ID (내가 보낸 메시지 구분용)
}

const ThreadView: React.FC = () => {
  const { otherId } = useParams<{ otherId: string }>();
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [otherName, setOtherName] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<Message[]>(`/messages/conversations/${otherId}/`);
        setMsgs(data);
        
        // 상대방 이름 가져오기 (있다면)
        if (data.length > 0) {
          const other = data.find(m => m.sender_id.toString() === otherId);
          if (other) {
            setOtherName(other.sender_name);
          }
        }
      } catch (e: any) {
        console.error(e);
        setError('채팅 로딩 실패');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [otherId]);

  return (
    <Box 
      sx={{ 
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${messageBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          opacity: 0.6,
          zIndex: -1
        }
      }}
    >
      <Container maxWidth="md" sx={{ py: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        ) : (
          <>
            <Typography
              variant="h5"
              align="center"
              sx={{ 
                mb: 3, 
                fontWeight: 'bold', 
                color: '#1976d2',
                textShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              {otherName ? `${otherName}님과의 대화` : '대화 내용'}
            </Typography>
            
            <Paper
              elevation={3}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 3,
                overflow: 'hidden'
              }}
            >
              <List sx={{ p: 2 }}>
                {msgs.map(m => (
                  <ListItem 
                    key={m.id}
                    sx={{ 
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ width: 48, height: 48 }}>
                        {m.sender_name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1" fontWeight="500">
                            {m.sender_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(m.created_at).toLocaleString('ko-KR')}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            mt: 1,
                            whiteSpace: 'pre-wrap',
                            color: 'text.primary'
                          }}
                        >
                          {m.content}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
                {msgs.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography>아직 메시지가 없습니다.</Typography>
                  </Box>
                )}
              </List>
            </Paper>
          </>
        )}
      </Container>
    </Box>
  );
};

export default ThreadView;
