import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';  // services/api.ts 위치에 따라 조정
import {
  Container, Typography, Box, Paper,
  Card, CardHeader, CardContent, List,
  ListItem, ListItemText, Divider,
  TextField, Button, Chip, Grid, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface VitalSign {
  id: number;
  patient: number;
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
}

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [vitals, setVitals] = useState<VitalSign[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  // 위험도 칼라
  const getRiskColor = (score: number) => {
    if (score >= 80) return '#f44336';
    if (score >= 50) return '#ff9800';
    return '#4caf50';
  };

  useEffect(() => {
    if (!id) return;
    const pid = Number(id);
    const token = localStorage.getItem('token') || '';
    const headers = { Authorization: `Bearer ${token}` };

    // 1) 환자 정보
    const p1 = api.get<Patient>(`/patients/${pid}/`, { headers })
      .then(r => setPatient(r.data))
      .catch(e => console.error('환자 로드 실패', e));

    // 2) Vital Signs (환자별 필터)
    const p2 = api.get<VitalSign[]>(`/vitals/?patient=${pid}`, { headers })
      .then(r => setVitals(r.data.filter(v => v.patient === pid)))
      .catch(e => console.error('VitalSigns 로드 실패', e));

    // 3) 댓글 → 반드시 receiver 파라미터 사용!!!
    const p3 = api.get<Comment[]>(`/messages/?receiver=${pid}`, { headers })
      .then(r => setComments(r.data))
      .catch(e => console.error('댓글 로드 실패', e));

    Promise.all([p1, p2, p3]).finally(() => setLoading(false));
  }, [id]);

  // 댓글 등록
  const handleCommentSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newComment.trim() || !patient) return;

    try {
      const token = localStorage.getItem('token') || '';
      const headers = { Authorization: `Bearer ${token}` };

      await api.post(
        '/messages/',
        { patient_id: patient.id, content: newComment },
        { headers }
      );

      // 등록 후에도 receiver 로 다시 조회
      const r = await api.get<Comment[]>(`/messages/?receiver=${patient.id}`, { headers });
      setComments(r.data);
      setNewComment('');
    } catch (e) {
      console.error('댓글 등록 실패', e);
    }
  };

  // 댓글 삭제
  const handleDelete = async (cid: number) => {
    if (!window.confirm('정말 이 댓글을 삭제하시겠습니까?')) return;
    try {
      const token = localStorage.getItem('token') || '';
      await api.delete(`/messages/${cid}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(cs => cs.filter(c => c.id !== cid));
    } catch (e) {
      console.error('댓글 삭제 실패', e);
    }
  };

  if (loading) return <Typography align="center">로딩 중…</Typography>;
  if (!patient) return <Typography align="center">환자를 찾을 수 없습니다.</Typography>;

  // 차트 데이터
  const chartData = vitals.map(v => ({
    timestamp: new Date(v.measured_at).toLocaleString('ko-KR'),
    sbp: v.systolic_bp,
    dbp: v.diastolic_bp,
    hr: v.pulse,
    spo2: v.oxygen,
  }));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* 환자 기본 정보 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {patient.name} ({patient.gender==='M'?'남':'여'},{patient.age}세)
        </Typography>
        <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
          <Typography variant="h6">위험도:</Typography>
          <Chip
            label={`${patient.risk_score}%`}
            sx={{ bgcolor: getRiskColor(patient.risk_score), color:'white', fontWeight:'bold' }}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* 1) Vital Signs 추이 */}
        <Grid item xs={12}>
          <Paper sx={{ p:2 }}>
            <Typography variant="h6" gutterBottom>Vital Signs 추이</Typography>
            <Box sx={{ height:300 }}>
              {chartData.length>0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sbp" stroke="#8884d8" name="수축기 혈압"/>
                    <Line type="monotone" dataKey="dbp" stroke="#82ca9d" name="이완기 혈압"/>
                    <Line type="monotone" dataKey="hr"  stroke="#ff7300" name="심박수"/>
                    <Line type="monotone" dataKey="spo2" stroke="#0088fe" name="산소포화도"/>
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="text.secondary" align="center">데이터가 없습니다.</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* 2) 최신 Vital Signs */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="최신 Vital Signs" />
            <CardContent>
              {vitals.length>0 ? (
                <List>
                  <ListItem>
                    <ListItemText
                      primary="혈압"
                      secondary={`${vitals[0].systolic_bp}/${vitals[0].diastolic_bp} mmHg`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="심박수"
                      secondary={`${vitals[0].pulse} bpm`}
                    />
                  </ListItem>
                </List>
              ) : (
                <Typography color="text.secondary">데이터가 없습니다.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 3) 의사결정 가이드라인 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="의사결정 가이드라인" />
            <CardContent>
              <Typography variant="subtitle1">NIHSS 기반 중재 권고:</Typography>
              {patient.risk_score>=80 ? (
                <Typography color="error">즉시 중재 필요: CT 촬영 및 협진 즉시 의뢰</Typography>
              ) : patient.risk_score>=50 ? (
                <Typography color="warning.main">조기 중재 고려: 상태 면밀히 모니터링</Typography>
              ) : (
                <Typography color="success.main">예방적 관리: 정기 모니터링 유지</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 4) 코멘트 */}
        <Grid item xs={12}>
          <Paper sx={{ p:2 }}>
            <Typography variant="h6" gutterBottom>코멘트</Typography>
            <List>
              {comments.length>0 ? comments.map(c=>(
                <Box key={c.id} sx={{ position:'relative', mb:2 }}>
                  <ListItem>
                    <ListItemText
                      primaryTypographyProps={{ component:'div' }}
                      secondaryTypographyProps={{ component:'div' }}
                      primary={`${c.author_name} (${c.author_role})`}
                      secondary={
                        <>
                          <Typography component="div" variant="body2" color="text.secondary">
                            {new Date(c.created_at).toLocaleString('ko-KR')}
                          </Typography>
                          <Typography component="div" variant="body1">
                            {c.content}
                          </Typography>
                        </>
                      }
                    />
                    <IconButton
                      edge="end"
                      onClick={()=>handleDelete(c.id)}
                      sx={{ position:'absolute', right:8, top:8 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                  <Divider />
                </Box>
              )) : (
                <Typography color="text.secondary">등록된 코멘트가 없습니다.</Typography>
              )}
            </List>

            <Box component="form" onSubmit={handleCommentSubmit} sx={{ mt:2 }}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={10}>
                  <TextField
                    fullWidth
                    placeholder="새 코멘트 작성"
                    value={newComment}
                    onChange={e=>setNewComment(e.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button fullWidth variant="contained" type="submit">등록</Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDetail;