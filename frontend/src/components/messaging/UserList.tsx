import React, { useEffect, useState } from 'react';
import {
  List, ListItem, ListItemButton, ListItemAvatar, 
  Avatar, ListItemText, CircularProgress, Typography, 
  Box, Paper, Container
} from '@mui/material';
import api from '../../services/api';
import messageBackground from '../../assets/images/message.jpg'; // 이미지 경로 확인 필요

interface User {
  id: number;
  name: string;
  employee_id: string;
  role: 'doctor' | 'nurse';
}

interface UserListProps {
  onSelectUser: (userId: number) => void;
}

const UserList: React.FC<UserListProps> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get<User[]>('/messages/recipients/');
        setUsers(data);
      } catch (err) {
        setError('사용자 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
          메시지 보낼 사용자 선택
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
              {users.map((user) => (
                <ListItem key={user.id} disablePadding>
                  <ListItemButton
                    onClick={() => onSelectUser(user.id)}
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
                        {user.name?.charAt(0) ?? '?'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="500">
                          {`${user.name} (${user.employee_id})`}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {user.role === 'doctor' ? '의사' : '간호사'}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default UserList;
