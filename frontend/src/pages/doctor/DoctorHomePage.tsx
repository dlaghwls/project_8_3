import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Paper, Divider,
  List, ListItem
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import MessageIcon from '@mui/icons-material/Message';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import jinryoImg from '../img/jinryo.png';
import jinryoImg2 from '../img/jinryo2.jpg';

const menuItems = [
  { label: '대시보드', icon: <DashboardIcon sx={{ fontSize: 32 }} />, path: '/doctor/dashboard' },
  { label: '메시지', icon: <MessageIcon sx={{ fontSize: 32 }} />, path: '/doctor/messages' },
];

// 이미지 슬라이더 컴포넌트
const HeroSlider = () => {
  const slides = [jinryoImg, jinryoImg2];
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
        height: '100%',
        minHeight: 350,
        overflow: 'hidden',
        // 테두리 제거
        borderRadius: '24px',
        border: 'none',
        boxShadow: '3'
        
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
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 1s ease-in-out',
            opacity: i === index ? 1 : 0,
          }}
        />
      ))}

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 3,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
          color: 'white',
          border: 'none' // 테두리 제거
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          정확한 진단
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          올바른 치료
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          border: 'none' // 테두리 제거
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
              border: 'none' // 테두리 제거
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const DoctorHomePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
       // backgroundImage: `url(${jinryoImg})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        // 배경 이미지와 콘텐츠 간 경계 제거
        padding: 0,
        margin: 0
      }}
    >
      {/* 메인 컨텐츠 */}
      <Container 
        disableGutters // 패딩 제거
        maxWidth={false} // 전체 너비 사용
        sx={{ 
          position: 'relative',
          py: 4,
          px: 0, // 추가 패딩 제거
          // 콘텐츠 컨테이너 테두리 제거
          border: 'none',
          boxShadow: 'none'
        }}
      >
        {/* 메인 영역 - 수정된 레이아웃 */}
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          pl: 0,
          // 메인 영역 테두리 제거
          border: 'none', 
          boxShadow: 'none'
        }}>
          {/* 1. 왼쪽: 슬라이더 블록 - 첫번째로 배치 */}
          <Box sx={{ 
            flex: 1.2, 
            ml: 0,
            // 슬라이더 컨테이너 테두리 제거
            border: 'none',
            boxShadow: 'none'
          }}>
            <HeroSlider />
          </Box>
          
          {/* 2. 가운데: 메뉴 아이콘 */}
          <Box sx={{ width: 80 }}>
            <List disablePadding>
              {menuItems.map((item) => (
                <ListItem 
                  key={item.label} 
                  button 
                  onClick={() => navigate(item.path)}
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    backgroundColor: 'white',
                    // 메뉴 아이템 테두리 대신 그림자만 사용
                    border: 'none',
                    boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.1)',
                    '&:hover': { boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)' }
                  }}
                >
                  <Box sx={{ color: '#1976d2', mb: 1 }}>
                    {item.icon}
                  </Box>
                  <Typography variant="body2">{item.label}</Typography>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* 3. 오른쪽: 진료 및 예약문의 카드 */}
          <Box sx={{ width: 280 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #4b6cb7 50%, #182848 130%)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                height: 'fit-content',
                // 카드 테두리 제거
                border: 'none',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                오류 문의
              </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ fontSize: 28, mr: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    010-9058-2410
                    </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                         담당자: 추교상
                </Typography>
                </Box>

              <Divider sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                my: 3,
                // 구분선 테두리 설정
                border: 'none',
                height: '1px'
              }} />

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <AccessTimeIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography>평일: 09:00-18:00</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <AccessTimeIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography>주말: 09:00-14:00</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography>점심시간: 12:00-13:00</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* 푸터 - 테두리 완전히 제거 */}
        <Box
          sx={{
            mt: 4,
            textAlign: 'center',
            py: 2,
            color: 'text.secondary',
            // 푸터 테두리 제거
            border: 'none',
            borderTop: 'none', // 상단 경계선 제거
            borderRadius: 0,
            backgroundColor: 'transparent'
          }}
        >
          <Typography variant="body2" fontWeight="medium">
            © 2025 StrokeCare+ | 건양대학교병원
          </Typography>
          <Typography variant="caption">
            미래융합교육원 · 3조
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default DoctorHomePage;