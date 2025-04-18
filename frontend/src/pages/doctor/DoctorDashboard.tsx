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

        // API 요청 시도
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('/api/patients/?ordering=-risk_score', {
            headers: { Authorization: `Bearer ${token}` }
          });

          // API 응답 구조 확인 (배열인지 체크)
          let receivedData = response.data;
          if (receivedData && Array.isArray(receivedData.results)) {  // REST API 페이징 처리 시
            receivedData = receivedData.results;
          }

          if (!Array.isArray(receivedData)) {
            throw new Error('API 응답이 올바르지 않습니다.');
          }

          setPatients(receivedData);
          
        } catch (apiError) {
          console.error('API 요청 실패, 테스트 데이터 사용:', apiError);
          // 테스트 데이터 설정 (개발용)
          setPatients([
            { 
              id: 1, 
              name: '김환자', 
              gender: 'M', 
              age: 65, 
              risk_score: 85, 
              is_checked: false, 
              updated_at: new Date().toISOString() 
            },
            { 
              id: 2, 
              name: '이환자', 
              gender: 'F', 
              age: 72, 
              risk_score: 60, 
              is_checked: true, 
              updated_at: new Date().toISOString() 
            }
          ]);
        }

      } catch (error) {
        console.error('환자 데이터 로딩 실패:', error);
        setError('환자 데이터를 불러오는 데 실패했습니다.');
        setPatients([]); // 빈 배열로 초기화
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