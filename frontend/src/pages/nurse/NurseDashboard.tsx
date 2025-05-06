// src/pages/nurse/NurseDashboard.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Box,
  Typography,
  Button,
  Paper,
  Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface Patient {
  id: number;
  name: string;
  gender: 'M'|'F';
  birth_date: string;
  patient_id: string;
}

const NurseDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError]       = useState<string|null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Patient[]>('/patients/');
        setPatients(data);
      } catch (e: any) {
        setError('환자 목록을 불러오지 못했습니다.');
      }
    })();
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, px: 2 }}>
      {/* 1) 헤더와 등록 버튼 */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h4">환자 목록</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/nurse/register')}
        >
          환자 등록
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* 2) 환자 카드 리스트 */}
      {patients.length === 0
        ? (
          <Typography align="center" sx={{ mt: 4 }}>
            등록된 환자가 없습니다.
          </Typography>
        )
        : patients.map(p => (
          <Paper
            key={p.id}
            elevation={2}
            sx={{
              mb: 2,    // 카드 간 여백
              p: 2,     // 카드 내부 패딩
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box>
              <Typography variant="h6">
                {p.name} (ID: {p.patient_id})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                생년월일: {new Date(p.birth_date).toLocaleDateString()} ・ 성별: {p.gender === 'M' ? '남자' : '여자'}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => navigate(`/nurse/vitals/${p.id}`)}
            >
              바이탈 입력
            </Button>
          </Paper>
        ))
      }

      {/* 3) 우측 하단 고정: 환자 등록 포털 FAB */}
      <Fab
        color="primary"
        onClick={() => navigate('/nurse/register')}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default NurseDashboard;
