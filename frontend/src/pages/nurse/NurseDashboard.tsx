// src/pages/nurse/NurseDashboard.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Box,
  Typography,
  Button,
  Paper,
  Fab,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface Patient {
  id: number;
  name: string;
  gender: 'M' | 'F';
  birth_date: string;
  patient_id: string;
}

const NurseDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
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

  const handleCTUpload = async (patientId: number, file: File) => {
    setUploadingId(patientId);
    const formData = new FormData();
    formData.append('ct_image', file);

    try {
      await api.post(
        `/patients/${patientId}/upload_ct/`,  // 백엔드 엔드포인트에 맞게 조정하세요
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setSnackbar({ open: true, message: 'CT 업로드 성공', severity: 'success' });
    } catch (e: any) {
      console.error(e);
      setSnackbar({ open: true, message: 'CT 업로드 실패', severity: 'error' });
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, px: 2 }}>
      {/* 1) 헤더와 등록 버튼 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">환자 목록</Typography>
        <Button variant="contained" onClick={() => navigate('/nurse/register')}>
          환자 등록
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* 2) 환자 카드 리스트 */}
      {patients.length === 0 ? (
        <Typography align="center" sx={{ mt: 4 }}>
          등록된 환자가 없습니다.
        </Typography>
      ) : (
        patients.map((p) => (
          <Paper
            key={p.id}
            elevation={2}
            sx={{
              mb: 2,
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="h6">
                {p.name} (ID: {p.patient_id})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                생년월일: {new Date(p.birth_date).toLocaleDateString()} ・ 성별:{' '}
                {p.gender === 'M' ? '남자' : '여자'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/nurse/vitals/${p.id}`)}
              >
                바이탈 입력
              </Button>

              {/* CT 업로드 버튼 & 파일 input */}
              <Button
                variant="outlined"
                component="label"
                disabled={uploadingId === p.id}
                startIcon={uploadingId === p.id ? <CircularProgress size={16} /> : undefined}
              >
                {uploadingId === p.id ? '업로드 중...' : 'CT 업로드'}
                <input
                  type="file"
                  hidden
                  accept=".dcm,image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleCTUpload(p.id, e.target.files[0]);
                    }
                  }}
                />
              </Button>
            </Box>
          </Paper>
        ))
      )}

      {/* 3) 환자 등록 FAB */}
      <Fab
        color="primary"
        onClick={() => navigate('/nurse/register')}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <AddIcon />
      </Fab>

      {/* 업로드 성공·실패 알림 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NurseDashboard;
