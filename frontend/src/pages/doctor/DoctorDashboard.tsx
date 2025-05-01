// 📂 frontend/src/pages/doctor/DoctorDashboard.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

interface Patient {
  id: number;
  name: string;
  gender: string;
  age: number;
  risk_score: number;
  is_checked: boolean;
  updated_at: string;
}

const DoctorDashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 환자 목록 불러오기
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token') || '';
        const response = await axios.get('/api/patients/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        let dataArray: any[] = [];
        if (Array.isArray(response.data)) {
          dataArray = response.data;
        } else if (response.data && Array.isArray(response.data.results)) {
          dataArray = response.data.results;
        } else {
          throw new Error('API 응답이 배열이 아닙니다.');
        }

        // 위험도 내림차순 정렬
        dataArray.sort((a, b) => b.risk_score - a.risk_score);
        setPatients(dataArray);
      } catch (e: any) {
        console.error(e);
        setError('환자 데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
    const interval = setInterval(fetchPatients, 30000);
    return () => clearInterval(interval);
  }, []);

  // 환자 확인 처리
  const handlePatientCheck = async (id: number) => {
    try {
      const token = localStorage.getItem('token') || '';
      await axios.patch(`/api/patients/${id}/`, { is_checked: true }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(p =>
        p.map(pt => pt.id === id ? { ...pt, is_checked: true } : pt)
      );
    } catch (e) {
      console.error('확인 상태 업데이트 실패:', e);
    }
  };

  // 환자 삭제 처리
  const handlePatientDelete = async (id: number) => {
    if (!window.confirm('정말 이 환자를 삭제하시겠습니까?')) return;

    try {
      const token = localStorage.getItem('token') || '';
      await axios.delete(`/api/patients/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // 삭제된 환자 화면에서 제거
      setPatients(p => p.filter(pt => pt.id !== id));
    } catch (e) {
      console.error('환자 삭제 실패:', e);
      alert('삭제에 실패했습니다.');
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'error';
    if (score >= 50) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6">환자 데이터 로딩 중...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        뇌졸중 위험 환자 대시보드
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        위험도가 높은 환자가 상단에 표시됩니다.
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>환자명</TableCell>
              <TableCell>성별/나이</TableCell>
              <TableCell>위험도</TableCell>
              <TableCell>최종 업데이트</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>액션</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {patients.map(patient => (
              <TableRow
                key={patient.id}
                sx={{
                  backgroundColor: patient.is_checked ? 'inherit' : 'rgba(255,235,235,0.2)'
                }}
              >
                <TableCell>{patient.name}</TableCell>
                <TableCell>
                  {patient.gender === 'M' ? '남' : '여'} / {patient.age}세
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${patient.risk_score}%`}
                    color={getRiskColor(patient.risk_score)}
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell>
                  {new Date(patient.updated_at).toLocaleString('ko-KR')}
                </TableCell>
                <TableCell>
                  {patient.is_checked ? (
                    <Chip label="확인됨" color="success" size="small" />
                  ) : (
                    <Chip label="미확인" color="error" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* 상세보기 */}
                    <Button
                      component={Link}
                      to={`/doctor/patient/${patient.id}`}
                      startIcon={<VisibilityIcon />}
                      size="small"
                      variant="outlined"
                    >
                      상세보기
                    </Button>
                    {/* 확인 */}
                    {!patient.is_checked && (
                      <Button
                        onClick={() => handlePatientCheck(patient.id)}
                        startIcon={<CheckCircleIcon />}
                        size="small"
                        variant="contained"
                      >
                        확인
                      </Button>
                    )}
                    {/* 삭제 */}
                    <Button
                      onClick={() => handlePatientDelete(patient.id)}
                      startIcon={<DeleteIcon />}
                      size="small"
                      variant="contained"
                      color="error"
                    >
                      삭제
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DoctorDashboard;