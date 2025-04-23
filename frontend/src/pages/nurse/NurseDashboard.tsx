
import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, TextField, Button, Paper, MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid';

const NurseDashboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birth_date: '',
    patient_id: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (input: string) => {
    const parsed = new Date(input);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];  
    }
    return null;
  };

  const navigate= useNavigate();

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');

    if (!formData.name || !formData.gender || !formData.birth_date || !formData.patient_id) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const formattedDate = formatDate(formData.birth_date);
    if (!formattedDate) {
      alert('생년월일을 올바른 날짜 형식으로 입력해주세요.');
      return;
    }

    const fixedData = {
      ...formData,
      birth_date: formattedDate
    };

    console.log('전송될 데이터:', fixedData);

    try {
      await axios.post('http://localhost:8000/api/patients/', fixedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert('환자 등록 완료');
      navigate(`/vitals/${formData.patient_id}`);
    } catch (error) {
      console.error('등록 실패:', error);
      alert('환자 등록 실패');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>환자 등록</Typography>
        <Grid container spacing={2}>
          <Grid span={12}>
            <TextField
              fullWidth
              label="이름"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid span={12}>
            <TextField
              fullWidth
              select
              label="성별"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <MenuItem value="M">남자</MenuItem>
              <MenuItem value="F">여자</MenuItem>
              <MenuItem value="O">기타</MenuItem>
            </TextField>
          </Grid>
          <Grid span={12}>
            <TextField
              fullWidth
              label="생년월일"
              name="birth_date"
              placeholder="예: 2025-04-22"
              value={formData.birth_date}
              onChange={handleChange}
            />
          </Grid>
          <Grid span={12}>
            <TextField
              fullWidth
              label="환자 ID"
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
            />
          </Grid>
          <Grid span={12}>
            <Button variant="contained" fullWidth onClick={handleSubmit}>등록</Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default NurseDashboard;
