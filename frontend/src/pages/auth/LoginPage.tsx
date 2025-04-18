import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material';

const LoginPage = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 사원번호 유효성 검사
    if (!employeeId.match(/^(DOC|NUR)-\d{4,}/)) {
      setError('사원번호 형식이 올바르지 않습니다. (예: DOC-1234 또는 NUR-5678)');
      return;
    }

    // 백엔드 연동 전까지는 로컬 스토리지에서 사용자 확인 (데모용)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.employeeId === employeeId && u.password === password);
    
    if (user) {
      // 역할 결정 (DOC- 접두사는 의사, NUR- 접두사는 간호사)
      const role = employeeId.startsWith('DOC-') ? 'doctor' : 'nurse';
      
      // 로그인 정보 설정
      login({
        employeeId,
        name: user.name,  // 이름 정보 추가
        role,
      });
      
      // 역할에 따라 다른 페이지로 리디렉션
      navigate(role === 'doctor' ? '/doctor' : '/nurse');
    } else {
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
              value={employeeId}
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
            
            {/* 회원가입 링크 추가 */}
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
