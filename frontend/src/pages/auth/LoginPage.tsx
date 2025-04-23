// LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material';
import axios from 'axios';

const LoginPage = () => {
  const [employee_id, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!employee_id.match(/^(DOC|NUR)-\d{4,}/)) {
      setError('사원번호 형식이 올바르지 않습니다. (예: DOC-1234 또는 NUR-5678)');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/users/login/', {
        employee_id,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { access = '', refresh = '' } = res.data || {};
      if (!access || !refresh) {
        throw new Error('토큰이 올바르게 반환되지 않았습니다.');
      }

      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      const role = employee_id.startsWith('DOC-') ? 'doctor' : 'nurse';

      login({
        employeeId: employee_id,
        name: res.data.name || employee_id,
        role,
      });

      setError('');
      navigate(role === 'doctor' ? '/doctor' : '/nurse');

    } catch (err) {
      console.error('로그인 실패:', err);
      setError('사원번호 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            StrokeCare+ 로그인
          </Typography>

          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="사원번호"
              value={employee_id}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="DOC-1234 또는 NUR-5678 형식"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              label="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              로그인
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                계정이 없으신가요? <Link to="/signup">회원가입</Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
