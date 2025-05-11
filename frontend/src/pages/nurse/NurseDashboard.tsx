// src/pages/nurse/NurseDashboard.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Fab,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Pagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface Patient {
  id: number;
  name: string;
  gender: 'M' | 'F';
  birth_date: string;
  patient_id: string;
}

const PAGE_SIZE = 10;

const NurseDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Patient[]>('/patients/');
        setPatients(data);
        setCurrentPage(1);
      } catch {
        setError('환자 목록을 불러오지 못했습니다.');
      }
    })();
  }, []);

  const handleCTUpload = async (patientId: number, file: File) => {
    setUploadingId(patientId);
    const formData = new FormData();
    formData.append('dicom_file', file);

    try {
      await api.post(`/patients/${patientId}/upload_ct/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSnackbar({ open: true, message: 'CT 업로드 성공', severity: 'success' });
      const { data } = await api.get<Patient[]>('/patients/');
      setPatients(data);
    } catch (e: any) {
      const msg = e.response?.data?.dicom_file?.[0] || 'CT 업로드 실패';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setUploadingId(null);
    }
  };

  const totalPages = Math.ceil(patients.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagePatients = patients.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', my: 4, px: 3, backgroundImage: 'none',  backgroundColor: 'white'   }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" color="text.primary">환자 목록</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/nurse/register')}>환자 등록</Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      {patients.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>등록된 환자가 없습니다.</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {pagePatients.map((p) => (
              <Grid item xs={12} sm={6} key={p.id}>
                <Card>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Box>
                      <Typography variant="subtitle1">{p.name} (ID: {p.patient_id})</Typography>
                      <Typography variant="body2" color="text.secondary">
                        생년월일: {new Date(p.birth_date).toLocaleDateString()} ・ 성별: {p.gender === 'M' ? '남자' : '여자'}
                      </Typography>
                    </Box>

                    <CardActions sx={{ gap: 1 }}>
                      <Button size="small" variant="outlined" onClick={() => navigate(`/nurse/vitals/${p.id}`)}>바이탈 입력</Button>
                      <Button
                        size="small"
                        variant="outlined"
                        component="label"
                        disabled={uploadingId === p.id}
                        startIcon={uploadingId === p.id ? <CircularProgress size={16} /> : null}
                      >
                        {uploadingId === p.id ? '업로드 중...' : 'CT 업로드'}
                        <input type="file" hidden accept=".dcm" onChange={(e) => e.target.files?.[0] && handleCTUpload(p.id, e.target.files[0])} />
                      </Button>
                    </CardActions>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination count={totalPages} page={currentPage} onChange={(_, page) => setCurrentPage(page)} color="primary" />
            </Box>
          )}
        </>
      )}

      <Fab color="secondary" sx={{ position: 'fixed', bottom: 24, right: 24 }} onClick={() => navigate('/nurse/register')}>
        <AddIcon />
      </Fab>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert onClose={() => setSnackbar((s) => ({ ...s, open: false }))} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NurseDashboard;