import React, { useEffect, useState } from 'react';
import { 
  List, ListItemButton, ListItemAvatar, Avatar, 
  ListItemText, Typography, Box, Paper, Container,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../store/AuthContext';
import messageBackground from '../../assets/images/message.jpg'; // 이미지 경로 확인 필요

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<Conversation[]>('/messages/conversations/');
        setConvs(data);
      } catch (e: any) {
        console.error(e);
        setError('대화 목록 로딩 실패');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
          메시지 대화목록
        </Typography>
        
        <Paper
          elevation={3}
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box p={3} textAlign="center">
              <Typography color="error">{error}</Typography>
            </Box>
          ) : (
            <List>
              {convs.map(c => (
                <ListItemButton
                  key={c.other_id}
                  component={Link}
                  to={`${c.other_id}`}
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
                    <Avatar sx={{ width: 48, height: 48 }}>
                      {c.other_name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight="500">
                          {c.other_name} ({c.other_employeeId})
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(c.last_at).toLocaleString('ko-KR')}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography 
                        noWrap 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ maxWidth: '80%' }}
                      >
                        {c.last_message}
                      </Typography>
                    }
                  />
                </ListItemButton>
              ))}
              {convs.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography>대화가 없습니다.</Typography>
                </Box>
              )}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ConversationList;
