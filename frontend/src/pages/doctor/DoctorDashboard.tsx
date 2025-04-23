import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Button
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const token = localStorage.getItem('token') || '';
        const response = await axios.get('/api/patients/', {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        console.log("📦 response.data =", response.data);
  
        let receivedData: any[] = [];
  
        if (Array.isArray(response.data)) {
          receivedData = response.data;
        } else if (response.data && Array.isArray(response.data.results)) {
          receivedData = response.data.results;
        } else {
          console.error("예상 못한 응답 구조:", response.data);
          throw new Error('응답이 배열이 아님');
        }
  
        const sorted = receivedData.sort(
          (a: any, b: any) => b.risk_score - a.risk_score
        );
  
        setPatients(sorted);
      } catch (apiError) {
        console.error('API 요청 실패:', apiError);
        setError('환자 데이터를 불러오는 데 실패했습니다.');
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPatients();
    const interval = setInterval(fetchPatients, 30000);
    return () => clearInterval(interval);
  }, []);

  const handlePatientCheck = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/patients/${id}/check/`, 
        { is_checked: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPatients(patients.map(patient => 
        patient.id === id ? { ...patient, is_checked: true } : patient
      ));
    } catch (error) {
      console.error('환자 확인 상태 업데이트 실패:', error);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'error';
    if (score >= 50) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography align="center" variant="h6">환자 데이터 로딩 중...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" minHeight="50vh" p={3}>
        <Typography color="error" variant="h6" gutterBottom>{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          새로고침
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          뇌졸중 위험 환자 대시보드
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          위험도가 높은 환자가 상단에 표시됩니다.
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell><strong>환자명</strong></TableCell>
              <TableCell><strong>성별/나이</strong></TableCell>
              <TableCell><strong>위험도</strong></TableCell>
              <TableCell><strong>최종 업데이트</strong></TableCell>
              <TableCell><strong>상태</strong></TableCell>
              <TableCell><strong>액션</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <TableRow
                  key={patient.id}
                  sx={{
                    backgroundColor: patient.is_checked ? 'inherit' : 'rgba(255, 235, 235, 0.2)'
                  }}
                >
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.gender === 'M' ? '남' : '여'} / {patient.age}세</TableCell>
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
                      <Button
                        component={Link}
                        to={`/doctor/patient/${patient.id}`}
                        startIcon={<VisibilityIcon />}
                        size="small"
                        variant="outlined"
                      >
                        상세보기
                      </Button>
                      {!patient.is_checked && (
                        <Button
                          onClick={() => handlePatientCheck(patient.id)}
                          startIcon={<CheckCircleIcon />}
                          size="small"
                          variant="contained"
                          color="primary"
                        >
                          확인
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" color="textSecondary">
                    표시할 환자가 없습니다
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DoctorDashboard;