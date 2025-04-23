// frontend/src/components/messaging/UserList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/users/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('사용자 목록 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  return (
    <List sx={{ bgcolor: 'background.paper' }}>
      {loading ? (
        <Typography align="center">사용자 목록 로딩 중...</Typography>
      ) : users.length === 0 ? (
        <Typography align="center">등록된 사용자가 없습니다</Typography>
      ) : (
        users.map(user => (
          <ListItem 
            button 
            key={user.id} 
            onClick={() => onSelectUser(user)}
            alignItems="flex-start"
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: user.role === 'doctor' ? 'primary.main' : 'secondary.main' }}>
                {user.name.charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {user.role === 'doctor' ? '의사' : '간호사'}
                  </Typography>
                  {` - ${user.employee_id}`}
                </>
              }
            />
          </ListItem>
        ))
      )}
    </List>
  );
};

export default UserList;
