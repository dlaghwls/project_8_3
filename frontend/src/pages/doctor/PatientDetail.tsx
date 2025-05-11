import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Grid from '@mui/material/GridLegacy';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface CTScan {
  id: number;
  dicom_file: string;
  uploaded_at: string;
}

interface VitalSign {
  id: number;
  measured_at: string;
  systolic_bp: number;
  diastolic_bp: number;
  pulse: number;
  respiration_rate: number;
  temperature: number;
  oxygen: number;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  author_name: string;
  author_role: string;
}

interface Patient {
  id: number;
  name: string;
  gender: string;
  age: number;
  risk_score: number;
  vitals: VitalSign[];
  comments: Comment[];
}
const BACKEND = "http://localhost:8000";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [ctScans, setCtScans] = useState<CTScan[]>([]);
  const [newComment, setNewComment] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [origUrl, setOrigUrl] = useState<string | null>(null);
  const [segmentUrl, setSegmentUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientDetail = async () => {
      try {
        const response = await api.get<Patient>(`/patients/${id}/`);
        setPatient(response.data);
      } catch (error) {
        console.error('환자 상세 정보 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCtScans = async () => {
      try {
        const resp = await api.get<CTScan[]>(`/patients/${id}/ct_scans/`);
        setCtScans(resp.data);
      } catch (e) {
        console.error('CT 스캔 목록 로딩 실패:', e);
      }
    };

    fetchPatientDetail();
    fetchCtScans();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post('/messages/', {
        patient: Number(id),
        content: newComment
      });
      const response = await api.get<Patient>(`/patients/${id}/`);
      setPatient(response.data);
      setNewComment('');
    } catch (error) {
      console.error('코멘트 등록 실패:', error);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return '#f44336';
    if (score >= 50) return '#ff9800';
    return '#4caf50';
  };

  if (loading || !patient) {
    return (
      <Typography align="center" variant="h6">
        환자 정보 로딩 중...
      </Typography>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {patient.name} ({patient.gender === 'M' ? '남' : '여'}, {patient.age}세)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">위험도: </Typography>
          <Chip
            label={`${patient.risk_score}%`}
            sx={{
              bgcolor: getRiskColor(patient.risk_score),
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Vital Signs 추이 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Vital Signs 추이
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={patient.vitals.map((v) => ({
                    timestamp: new Date(v.measured_at).toLocaleString('ko-KR'),
                    sbp: v.systolic_bp,
                    dbp: v.diastolic_bp,
                    hr: v.pulse,
                    spo2: v.oxygen
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sbp" name="수축기 혈압" stroke="#FF6384" />
                  <Line type="monotone" dataKey="dbp" name="이완기 혈압" stroke="#36A2EB" />
                  <Line type="monotone" dataKey="hr" name="심박수" stroke="#FFCE56" />
                  <Line type="monotone" dataKey="spo2" name="산소포화도" stroke="#4BC0C0" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* 최신 Vital Signs */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="최신 Vital Signs" />
            <CardContent>
              {patient.vitals.length > 0 ? (
                <List>
                  <ListItem>
                    <ListItemText
                      primary="혈압"
                      secondary={`${patient.vitals[0].systolic_bp}/${patient.vitals[0].diastolic_bp} mmHg`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="심박수"
                      secondary={`${patient.vitals[0].pulse} bpm`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="호흡수"
                      secondary={`${patient.vitals[0].respiration_rate} breaths/min`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="체온"
                      secondary={`${patient.vitals[0].temperature}°C`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="산소포화도"
                      secondary={`${patient.vitals[0].oxygen}%`}
                    />
                  </ListItem>
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, display: 'block', textAlign: 'right' }}
                  >
                    측정시간: {new Date(patient.vitals[0].measured_at).toLocaleString('ko-KR')}
                  </Typography>
                </List>
              ) : (
                <Typography>Vital 데이터가 없습니다.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 의사결정 가이드라인 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="의사결정 가이드라인" />
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                NIHSS 기반 중재 권고:
              </Typography>
              {patient.risk_score >= 80 ? (
                <Typography color="error">
                  <strong>즉시 중재 필요:</strong> CT 촬영 및 신경과 협진을 즉시 의뢰하세요.
                </Typography>
              ) : patient.risk_score >= 50 ? (
                <Typography color="warning.main">
                  <strong>조기 중재 고려:</strong> 상태 면밀히 모니터링하세요.
                </Typography>
              ) : (
                <Typography color="success.main">
                  <strong>예방적 관리:</strong> 정기 모니터링 유지.
                </Typography>
              )}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  권장 약물:
                </Typography>
                <List>
                  {patient.risk_score >= 70 && (
                    <ListItem>
                      <ListItemText
                        primary="항혈소판제"
                        secondary="아스피린 100mg/일 또는 클로피도그렐 75mg/일"
                      />
                    </ListItem>
                  )}
                  {patient.risk_score >= 50 && (
                    <ListItem>
                      <ListItemText
                        primary="항고혈압제"
                        secondary="수축기 혈압 140mmHg 이하 유지"
                      />
                    </ListItem>
                  )}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* CT 스캔 목록 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              CT 스캔 목록
            </Typography>
            {ctScans.length > 0 ? (
              <List>
                {ctScans.map((scan) => (
                  <ListItem
                    key={scan.id}
                    secondaryAction={
                      <>
                        <Button
                          component="a"
                          href={scan.dicom_file}
                          target="_blank"
                          variant="outlined"
                          size="small"
                        >
                          보기
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ ml: 1 }}
                          onClick={() => {
                            setOrigUrl(scan.dicom_file);
                            setSegmentUrl(null);
                            setModalOpen(true);
                            api
                              .post<{ segmented_url: string }>(
                                `/patients/${id}/ct_scans/${scan.id}/segment/`
                              )
                              .then((r) => setSegmentUrl(r.data.segmented_url))
                              .catch(() => setSegmentUrl(null));
                          }}
                        >
                          분할
                        </Button>
                      </>
                    }
                  >
                    <ListItemText
                      primary={`Scan #${scan.id}`}
                      secondary={new Date(scan.uploaded_at).toLocaleString('ko-KR')}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">등록된 CT 스캔이 없습니다.</Typography>
            )}
          </Paper>
        </Grid>

        {/* 코멘트 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              코멘트
            </Typography>
            <List>
              {patient.comments && patient.comments.length > 0 ? (
                patient.comments.map((comment) => (
                  <ListItem key={comment.id}>
                    <ListItemText
                      primary={`${comment.author_name} (${comment.author_role})`}
                      secondary={comment.content}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography sx={{ ml: 2 }} color="text.secondary">
                  등록된 코멘트가 없습니다.
                </Typography>
              )}
            </List>
            <TextField
              label="새 코멘트 작성"
              multiline
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCommentSubmit}
              sx={{ mt: 2 }}
            >
              코멘트 등록
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* 세그멘테이션 결과 모달 */}
      {/* Segmentation 결과 모달 */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Segmentation 결과</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography>원본</Typography>
              {/* 2. 여기를 아래 코드로 교체 */}
              {origUrl && (
                <img
                  src={origUrl.startsWith("http") ? origUrl : `${BACKEND}${origUrl}`}
                  alt="원본 CT"
                  style={{ maxWidth: '400px' }}
                />
              )}
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography>분할 결과</Typography>
              {segmentUrl ? (
                <img
                  src={segmentUrl!.startsWith("http") ? segmentUrl! : `${BACKEND}${segmentUrl!}`}
                  alt="분할 결과"
                  style={{ maxWidth: '400px' }}
                />
              ) : (
                <Typography color="error">로딩 중이거나 실패했습니다.</Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientDetail;