import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Paper, FormControl, FormHelperText } from '@mui/material';
import axios from 'axios';

const SignupPage = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // 사원번호 검증
    if (!employeeId) {
      newErrors.employeeId = '사원번호를 입력해주세요';
    } else if (!employeeId.match(/^(DOC|NUR)-\d{4,}/)) {
      newErrors.employeeId = '사원번호는 DOC- 또는 NUR-로 시작해야 합니다 (예: DOC-1234)';
    }
    
    // 이름 검증
    if (!name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }
    
    // 비밀번호 검증
    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (password.length < 4) {
      newErrors.password = '비밀번호는 최소 4자 이상이어야 합니다';
    }
    
    // 비밀번호 확인 검증
    if (password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // 역할 결정 (DOC- 접두사는 의사, NUR- 접두사는 간호사)
      const role = employeeId.startsWith('DOC-') ? 'doctor' : 'nurse';
      
      // 실제 API 연동 시 사용할 코드
      // await axios.post('http://localhost:8000/api/auth/signup/', {
      //   employee_id: employeeId,
      //   name,
      //   password,
      //   role
      // });
      
      // 백엔드 연동 전까지는 로컬 스토리지에 저장 (데모용)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push({
        employeeId,
        name,
        password, // 실제로는 암호화 필요
        role
      });
      localStorage.setItem('users', JSON.stringify(users));
      
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            StrokeCare+ 회원가입
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="employeeId"
              label="사원번호"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="DOC-1234 또는 NUR-5678 형식"
              error={!!errors.employeeId}
              helperText={errors.employeeId}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              type="password"
              label="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              type="password"
              label="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              회원가입
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                이미 계정이 있으신가요? <Link to="/login">로그인</Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignupPage;
