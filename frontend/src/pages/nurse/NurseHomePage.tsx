// src/pages/nurse/NurseHomePage.tsx

import { useNavigate } from 'react-router-dom';
import heroImg from '../img/nurse1.avif';
import heroImg2 from '../img/nurse2.avif';
import nimg1 from '../img/nimg1.jpg';
import nimg3 from '../img/nimg3.jpg';
const tourImages = [nimg1, nimg3];
import {
  Box,
  Grid,
  Card,
  CardMedia,
  Typography,
  Button,
  Container
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MessageIcon from '@mui/icons-material/Message';

declare module '*.avif';

const menuItems = [
  { label: '대시보드',     icon: <DashboardIcon sx={{ fontSize: 32 }} />, path: '/nurse/dashboard' },
  { label: '환자 등록',     icon: <PersonAddIcon sx={{ fontSize: 32 }} />, path: '/nurse/register' },
  { label: '자가문진 결과', icon: <AssessmentIcon sx={{ fontSize: 32 }} />, path: '/nurse/patients' },
  { label: '메시지',       icon: <MessageIcon sx={{ fontSize: 32 }} />, path: '/nurse/messages' },
];

// ▶ Hero 슬라이더
const HeroSlider: React.FC = () => {
  const slides = [heroImg, heroImg2];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: 500,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {slides.map((src, i) => (
        <Box
          key={i}
          component="img"
          src={src}
          alt={`slide-${i}`}
          sx={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            transition: 'opacity 1s ease-in-out',
            opacity: i === index ? 1 : 0,
          }}
        />
      ))}

      {/* 도트 인디케이터 */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
        }}
      >
        {slides.map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: i === index
                ? 'rgba(255,255,255,0.9)'
                : 'rgba(255,255,255,0.5)',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const NurseHomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
      <Box
  sx={{
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    py: 1,
    px: 7,
  }}
>
  <Container maxWidth="lg" sx={{ ml: 'auto' }}>
    <Grid container spacing={2} alignItems="flex-start">
      {/* 1) 히어로 배너 (왼쪽, 6칸) */}
      <Grid item xs={12} md={6}>
        <Card sx={{ width: '100%', height: 500, borderRadius: 2, overflow: 'hidden' }}>
          <CardMedia
            component="img"
            image={heroImg}
            alt="히어로 배너"
            sx={{ width: '100%', height: 500, objectFit: 'cover' }}
          />
        </Card>
      </Grid>

      {/* 2) 메뉴 + 둘러보기 (중간, 3칸) */}
      <Grid item xs={12} md={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* 2-1) 통합 메뉴 카드 */}
          <Card sx={{ width: '100%', height: 300, display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
            <Grid
              container
              sx={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                borderTop: '1px solid rgba(0,0,0,0.12)',
              }}
            >
              {menuItems.map((item, idx) => (
                <Box
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRight: idx % 2 === 0 ? '1px solid rgba(0,0,0,0.12)' : undefined,
                    borderBottom: idx < 2 ? '1px solid rgba(0,0,0,0.12)' : undefined,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {item.icon}
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Grid>
             <Box sx={{ p: 2 }}>
              <Button
                 variant="contained"
                 fullWidth
                 sx={{ height: 48 }}
                 onClick={() => navigate('/nurse/calendar')} // ← 경로 맞춰서 이동
               >
                 오늘 일정 보기 →
              </Button>
             </Box>
          </Card>

          {/* 2-2) 둘러보기 카드 */}
          <Card sx={{ width: '100%', height: 185, p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              둘러보기
            </Typography>
            <Grid container spacing={1}>
              {tourImages.map((src, idx) => (
                <Grid item xs={6} key={idx}>
                  <CardMedia
                    component="img"
                    src={src}
                    alt={`둘러보기 ${idx + 1}`}
                    sx={{ height: 100, objectFit: 'cover', borderRadius: 1 }}
                   />
                </Grid>
              ))}
            </Grid>
          </Card>
        </Box>
      </Grid>

      {/* 3) 진료 및 예약문의 카드 (오른쪽, 3칸) */}
      <Grid item xs={12} md={3}>
        <Card sx={{ width: '100%', height: 500, p: 2, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6">진료 및 예약문의</Typography>
          <Typography variant="h3" sx={{ my: 1 }}>
            1544-0344
          </Typography>
          <Typography variant="body2" color="text.secondary">
            평일 09:00 - 18:00
          </Typography>
          <Typography variant="body2" color="text.secondary">
            주말 09:00 - 14:00
          </Typography>
        </Card>
      </Grid>
    </Grid>
  </Container>
</Box>
  );
};

export default NurseHomePage;
