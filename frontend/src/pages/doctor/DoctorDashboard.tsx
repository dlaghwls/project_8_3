import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Button,
  TablePagination, Select, MenuItem, FormControl, InputLabel
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
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked' | 'unchecked'>('all');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token') || '';
        const response = await axios.get('/api/patients/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        let receivedData: any[] = [];
        if (Array.isArray(response.data)) {
          receivedData = response.data;
        } else if (response.data && Array.isArray(response.data.results)) {
          receivedData = response.data.results;
        } else {
          throw new Error('예상 못한 응답 구조');
        }

        setPatients(receivedData);
      } catch (apiError) {
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

  const filteredPatients = useMemo(() => {
    let result = [...patients];

    if (statusFilter === 'checked') {
      result = result.filter(p => p.is_checked);
    } else if (statusFilter === 'unchecked') {
      result = result.filter(p => !p.is_checked);
    }

    result.sort((a, b) => 
      sortOrder === 'asc' ? a.risk_score - b.risk_score : b.risk_score - a.risk_score
    );

    return result;
  }, [patients, sortOrder, statusFilter]);

  const paginatedPatients = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredPatients.slice(start, start + rowsPerPage);
  }, [filteredPatients, page, rowsPerPage]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography align="center" variant="h6">환자 데이터 로딩 중...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color="error" variant="h6" gutterBottom>{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          새로고침
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          뇌졸중 위험 환자 대시보드
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          위험도가 높은 환자가 상단에 표시됩니다.
        </Typography>

        <Box display="flex" justifyContent="space-between" mb={2} width="100%">
          <FormControl size="small">
            <InputLabel>정렬</InputLabel>
            <Select
              value={sortOrder}
              label="정렬"
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            >
              <MenuItem value="desc">위험도 높은 순</MenuItem>
              <MenuItem value="asc">위험도 낮은 순</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>상태</InputLabel>
            <Select
              value={statusFilter}
              label="상태"
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'checked' | 'unchecked')}
            >
              <MenuItem value="all">전체</MenuItem>
              <MenuItem value="checked">확인됨</MenuItem>
              <MenuItem value="unchecked">미확인</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper} sx={{ width: '100%', borderRadius: 2, boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell align="center"><strong>환자명</strong></TableCell>
                <TableCell align="center"><strong>성별/나이</strong></TableCell>
                <TableCell align="center"><strong>위험도</strong></TableCell>
                <TableCell align="center"><strong>최종 업데이트</strong></TableCell>
                <TableCell align="center"><strong>상태</strong></TableCell>
                <TableCell align="center"><strong>액션</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPatients.length > 0 ? (
                paginatedPatients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    sx={{
                      backgroundColor: patient.is_checked ? 'inherit' : 'rgba(255, 235, 235, 0.2)'
                    }}
                  >
                    <TableCell align="center">{patient.name}</TableCell>
                    <TableCell align="center">{patient.gender === 'M' ? '남' : '여'} / {patient.age}세</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${patient.risk_score}%`}
                        color={getRiskColor(patient.risk_score)}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell align="center">{new Date(patient.updated_at).toLocaleString('ko-KR')}</TableCell>
                    <TableCell align="center">
                      {patient.is_checked ? (
                        <Chip label="확인됨" color="success" size="small" />
                      ) : (
                        <Chip label="미확인" color="error" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
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
          <TablePagination
            component="div"
            count={filteredPatients.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10]}
            sx={{ display: 'flex', justifyContent: 'center' }}
          />
        </TableContainer>
      </Box>
    </Container>
  );
};

export default DoctorDashboard;
