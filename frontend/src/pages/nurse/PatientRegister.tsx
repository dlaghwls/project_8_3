// src/pages/nurse/PatientRegister.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper
} from '@mui/material';

const PatientRegister: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName]           = useState('');
  const [gender, setGender]       = useState<'M'|'F'>('F');
  const [birthDate, setBirthDate] = useState('');
  const [patientId, setPatientId] = useState('');
  const [error, setError]         = useState<string|null>(null);

  const handleRegister = async () => {
    setError(null);
    if (!name || !birthDate || !patientId) {
      setError('모든 필드를 채워주세요.');
      return;
    }

    try {
      await api.post('/patients/', {
        name,
        gender,
        birth_date: birthDate,
        patient_id: patientId
      });
      // 등록 후 목록으로 돌아가기
      navigate('/nurse');
    } catch (e: any) {
        console.error('등록 실패 상세 에러: ', e.response?.data)
        setError(
          e.response?.data?.patient_id?.[0]    // 예: ["This field is required."]
          || e.response?.data?.birth_date?.[0]
          || e.response?.data?.name?.[0]
          || e.response?.data?.detail          // DRF에서 뱉는 일반 메시지
          || '환자 등록에 실패했습니다.'
        )
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, backgroundImage: 'none',  backgroundColor: 'white' }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          환자 등록
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <TextField
          label="이름"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth sx={{ mb: 2 }}
        />

        <TextField
          select
          label="성별"
          value={gender}
          onChange={e => setGender(e.target.value as 'M'|'F')}
          fullWidth sx={{ mb: 2 }}
        >
          <MenuItem value="M">남자</MenuItem>
          <MenuItem value="F">여자</MenuItem>
        </TextField>

        <TextField
          label="생년월일"
          type="date"
          value={birthDate}
          onChange={e => setBirthDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth sx={{ mb: 2 }}
        />

        <TextField
          label="환자 ID"
          value={patientId}
          onChange={e => setPatientId(e.target.value)}
          fullWidth sx={{ mb: 3 }}
        />

        <Button variant="contained" fullWidth onClick={handleRegister}>
          등록
        </Button>
      </Paper>
    </Box>
  );
};

export default PatientRegister;
