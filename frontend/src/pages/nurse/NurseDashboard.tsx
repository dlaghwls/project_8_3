import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Grid,
} from '@mui/material';

interface FormData {
  name: string;
  gender: string;
  birth_date: string;
  patient_id: string;
}

const NurseDashboard: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    gender: '',
    birth_date: '',
    patient_id: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (input: string): string | null => {
    const d = new Date(input);
    return isNaN(d.getTime())
      ? null
      : d.toISOString().split('T')[0];
  };

  const handleSubmit = async () => {
    // 1) 필수 입력 체크
    if (!formData.name || !formData.gender || !formData.birth_date || !formData.patient_id) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    // 2) 날짜 포맷 검사
    const birth = formatDate(formData.birth_date);
    if (!birth) {
      alert('생년월일을 YYYY-MM-DD 형식으로 입력해주세요.');
      return;
    }

    try {
      // 3) 환자 생성 요청
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:8000/api/patients/',
        { ...formData, birth_date: birth },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      // 4) 백엔드가 돌려준 실제 PK(id)로 리다이렉트
      const newId = res.data.id;
      alert(`환자 등록 완료 (새 ID: ${newId})`);
      navigate(`/vitals/${newId}`);
    } catch (err: any) {
      console.error(err.response || err);
      alert('환자 등록에 실패했습니다.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          환자 등록
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="이름"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="생년월일"
              name="birth_date"
              placeholder="예: 1990-01-01"
              value={formData.birth_date}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="환자등록번호"
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={handleSubmit}>
              등록
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default NurseDashboard;