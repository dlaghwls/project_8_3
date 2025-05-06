// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material';
import api from '../../services/api';  // axios 인스턴스 사용

const LoginPage: React.FC = () => {
  const [employee_id, setEmployeeId] = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState('');
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!employee_id.match(/^(DOC|NUR)-\d{4,}/)) {
      setError('사원번호 형식이 올바르지 않습니다. (예: DOC-1234 또는 NUR-5678)');
      return;
    }

    try {
      // 1) 로그인 토큰 요청
      const res = await api.post('/users/login/', {
        employee_id,
        password
      });
      const { access, refresh, user: logged } = res.data;

      if (!access || !refresh) {
        throw new Error('토큰이 올바르게 반환되지 않았습니다.');
      }

      // 2) 토큰 로컬 저장 및 인터셉터 헤더 세팅
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      

      // 4) AuthContext에 id 포함해서 로그인 처리
      login({
        id:         logged.id,         // 로그인 응답에 포함된 id
        employeeId: logged.employee_id,
        name:       logged.name,
        role:       logged.role,
      });

      // 5) 대시보드로 이동
      navigate(logged.role === 'doctor' ? '/doctor' : '/nurse');
    } catch (err: any) {
      console.error('로그인 실패:', err);
      setError('사원번호 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" align="center" gutterBottom>
            StrokeCare+ 로그인
          </Typography>

          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal" required fullWidth
              label="사원번호"
              value={employee_id}
              onChange={e => setEmployeeId(e.target.value)}
              placeholder="DOC-1234 또는 NUR-5678 형식"
            />
            <TextField
              margin="normal" required fullWidth type="password"
              label="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              로그인
            </Button>
            <Typography variant="body2" align="center">
              계정이 없으신가요? <Link to="/signup">회원가입</Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
