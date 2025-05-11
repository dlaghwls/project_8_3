import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Container
} from '@mui/material';
import { ChevronLeft, ChevronRight, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO
} from 'date-fns';

interface EventItem {
  id: number;
  date: string; // 'yyyy-MM-dd'
  text: string;
}

const Calendar: React.FC = () => {
  // 초기 월: 2025년 1월
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 0, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventText, setEventText] = useState<string>('');
  const [editEventId, setEditEventId] = useState<number | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);

  const handlePrev = () => setCurrentMonth(prev => subMonths(prev, 1));
  const handleNext = () => setCurrentMonth(prev => addMonths(prev, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  // 새 일정 추가 또는 기존 일정 편집
  const handleSave = () => {
    if (!selectedDate || !eventText.trim()) return;
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    if (editEventId != null) {
      // 수정
      setEvents(prev => prev.map(ev =>
        ev.id === editEventId ? { ...ev, text: eventText } : ev
      ));
    } else {
      // 신규
      setEvents(prev => [
        ...prev,
        { id: Date.now(), date: dateKey, text: eventText }
      ]);
    }
    handleCloseDialog();
  };

  const handleDayClick = (day: Date, ev?: EventItem) => {
    setSelectedDate(day);
    if (ev) {
      setEventText(ev.text);
      setEditEventId(ev.id);
    } else {
      setEventText('');
      setEditEventId(null);
    }
  };

  const handleDelete = (id: number) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
  };

  const handleCloseDialog = () => {
    setSelectedDate(null);
    setEditEventId(null);
    setEventText('');
  };

  return (
    <Container sx={{ maxWidth: 1000, mt: 4, bgcolor: '#fff', borderRadius: 2, p: 2 }}>
      {/* 헤더 & 내비 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handlePrev}><ChevronLeft /></IconButton>
        <Typography variant="h5">{format(currentMonth, 'yyyy년 MMMM')}</Typography>
        <IconButton onClick={handleNext}><ChevronRight /></IconButton>
      </Box>

      {/* 요일 헤더 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', mb: 1 }}>
        {['일','월','화','수','목','금','토'].map(d => (
          <Typography key={d} variant="subtitle2" sx={{ fontWeight: 'bold' }}>{d}</Typography>
        ))}
      </Box>

      {/* 날짜 격자 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: 100, gap: 1 }}>
        {allDays.map(day => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const dayEvents = events.filter(ev => ev.date === dayKey);
          return (
            <Paper
              key={dayKey}
              sx={{ p: 1, bgcolor: isSameMonth(day, monthStart) ? 'background.paper' : 'grey.100', cursor: 'pointer', position: 'relative' }}
            >
              {/* 날짜 번호 */}
              <Typography variant="body2" color={isSameDay(day, new Date()) ? 'primary' : 'textPrimary'}>
                {format(day, 'd')}
              </Typography>

              {/* 일정 목록 */}
              {dayEvents.map(ev => (
                <Box key={ev.id} sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Typography variant="caption" noWrap sx={{ flexGrow: 1 }}>
                    • {ev.text}
                  </Typography>
                  <IconButton size="small" onClick={() => handleDayClick(day, ev)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(ev.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              {/* 빈 셀 클릭 시 추가 */}
              {dayEvents.length === 0 && (
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onClick={() => handleDayClick(day)} />
              )}
            </Paper>
          );
        })}
      </Box>

      {/* 일정 추가/편집 다이얼로그 */}
      <Dialog open={!!selectedDate} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedDate ? format(selectedDate, 'yyyy년 MM월 dd일') : ''} 일정 {editEventId ? '수정' : '추가'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="일정 내용"
            fullWidth
            value={eventText}
            onChange={e => setEventText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button onClick={handleSave} variant="contained">저장</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Calendar;
