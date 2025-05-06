import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  Typography,
  Box
} from '@mui/material';
import api from '../../services/api';

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <List>
      {users.map((user) => (
        <ListItem key={user.id} disablePadding>
          <ListItemButton
            onClick={() => onSelectUser(user.id)}
            sx={{
              '&:hover': { backgroundColor: '#f5f5f5' },
              cursor: 'pointer'
            }}
          >
            <ListItemAvatar>
              <Avatar>
                {user.name?.charAt(0) ?? '?'}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${user.name} (${user.employee_id})`}
              secondary={user.role === 'doctor' ? '의사' : '간호사'}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default UserList;
