import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  CircularProgress, Typography, Box,
  Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Snackbar, Alert
} from '@mui/material';
import { getSelfCheckList, sendMessage } from '../../services/api';

interface SelfCheck {
  id: number;
  patient: number;
  patient_name: string;
  submitted_at: string;
  pain_score: number;
  pain_location: string;
  mood: 'happy' | 'anxious' | 'depressed';
}

const SelfCheckList: React.FC = () => {
  const { patientId } = useParams<{ patientId?: string }>();
  const pidFromUrl = patientId ? Number(patientId) : undefined;
  const navigate = useNavigate();

  const [data, setData] = useState<SelfCheck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCheckId, setCurrentCheckId] = useState<number | null>(null);
  const [currentPatient, setCurrentPatient] = useState<number | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    text: string;
    severity: 'success' | 'error';
  }>({ open: false, text: '', severity: 'success' });

  useEffect(() => {
    setLoading(true);
    getSelfCheckList(pidFromUrl)
      .then(res => {
        console.log('문진 리스트 응답:', res);
        setData(res);
      })
      .catch(err => {
        console.error('문진 리스트 로드 에러:', err);
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pidFromUrl]);

  const handleOpenDialog = (checkId: number, patient: number) => {
    setCurrentCheckId(checkId);
    setCurrentPatient(patient);
    setMessageContent('');
    setOpenDialog(true);
  };

  const handleSendMessage = async () => {
    if (!currentPatient || !currentCheckId) return;
    try {
      await sendMessage(currentPatient, currentCheckId, messageContent);
      setSnackbar({ open: true, text: '메시지 전송 성공', severity: 'success' });
      setOpenDialog(false);
    } catch (err) {
      console.error('메시지 전송 에러:', err);
      setSnackbar({ open: true, text: '메시지 전송 실패', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (data?.length === 0) { // ✅ 옵셔널 체이닝
    return (
      <Typography mt={4} textAlign="center">
        {pidFromUrl
          ? '해당 환자의 자가문진 기록이 없습니다.'
          : '아직 자가문진 기록이 없습니다.'}
      </Typography>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        {pidFromUrl
          ? `${data[0]?.patient_name || data[0]?.patient}번 환자 문진 기록`
          : '전체 환자 문진 결과'}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>문진 ID</TableCell>
            <TableCell>환자명</TableCell>
            <TableCell>점수</TableCell>
            <TableCell>통증 위치</TableCell>
            <TableCell>기분</TableCell>
            <TableCell>제출 시간</TableCell>
            <TableCell>메시지</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map(row => ( // ✅ 옵셔널 체이닝
            <TableRow
              key={row.id}
              hover
              sx={{ cursor: pidFromUrl ? 'default' : 'pointer' }}
            >
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.patient_name || row.patient}</TableCell>
              <TableCell>{row.pain_score}</TableCell>
              <TableCell>{row.pain_location}</TableCell>
              <TableCell>
                {{happy: '좋음', anxious: '불안', depressed: '우울'}[row.mood] || '알 수 없음'}
              </TableCell>
              <TableCell>{new Date(row.submitted_at).toLocaleString()}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={e => {
                    e.stopPropagation();
                    handleOpenDialog(row.id, row.patient);
                  }}
                >
                  보내기
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>메시지 보내기</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="메시지 내용"
            value={messageContent}
            onChange={e => setMessageContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>취소</Button>
          <Button
            variant="contained"
            disabled={!messageContent.trim()}
            onClick={handleSendMessage}
          >
            전송
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SelfCheckList;
