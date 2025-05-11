import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  Typography,
  Box
} from '@mui/material';
import api from '../../services/api';

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/messages/recipients/');
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
        <ListItem
          button
          key={user.id}
          onClick={() => onSelectUser(user.id)}
          sx={{
            '&:hover': { backgroundColor: '#f5f5f5' },
            cursor: 'pointer'
          }}
        >
          <ListItemAvatar>
            <Avatar>
              {user.name.charAt(0)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${user.name} (${user.employee_id})`}
            secondary={user.role === 'doctor' ? '의사' : '간호사'}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default UserList;