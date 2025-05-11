import React, { useState, useRef } from 'react';
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Toolbar,
  Typography,
  Box,
  Button,
  MenuItem,
  CssBaseline,
  Container
} from '@mui/material';
import { ExitToApp as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../../store/AuthContext';
import bg from '../../pages/img/bg2.jpg'; // 배경 이미지 import

interface NavItem {
  label: string;
  path?: string;         // 클릭 시 이동할 기본 경로
  subs?: {               // 드롭다운에 나올 서브 메뉴
    label: string;
    path: string;
  }[];
}

const navItems: NavItem[] = [
  { label: '병원소개',     path: '/nurse/about',     subs: [
      { label: '병원둘러보기',  path: '/nurse/about/history' },
    ]
  },
  { label: '의료진소개',   path: '/nurse/doctors',   subs: [
      { label: '전문의',     path: '/nurse/doctors/specialist' },
      { label: '간호사',     path: '/nurse/doctors/nurses' },
    ]
  },
  { label: '진료안내',     path: '/nurse/services',   subs: [
      { label: '진료예약',    path: '/nurse/services/reserve' },
      { label: '달력예약',    path: '/nurse/services/calendar' },
    ]
  },
  { label: '병원소식',     path: '/nurse/news',       subs: [
      { label: '공지사항',    path: '/nurse/news/notice' },
      { label: '이벤트',      path: '/nurse/news/event' },
    ]
  },
  { label: '공지사항',     path: '/nurse/notice',     subs: [
      { label: '전체공지',    path: '/nurse/notice/all' },
    ]
  },
];

const NurseLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [hovered, setHovered] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMouseEnter = (label: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setHovered(label);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setHovered(null);
    }, 300);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        overflowX: 'hidden', // 가로 스크롤 방지 (혹시 모를 상황 대비)
        width: '100vw',
        justifyContent: 'flex-start', // 변경: center -> flex-start
        backgroundImage: `url(${bg})`, // 배경 이미지 적용
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <CssBaseline />

      {/* 상단 Toolbar */}
      <Toolbar
        sx={{
          py: 2,
          width: '100%',
          maxWidth: 'lg',
          mx: 'auto',
          px: 1,
          ml: { xs: 0, md: 15 },
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // 필요에 따라 배경색 조절
          backdropFilter: 'blur(10px)', // 필요에 따라 블러 효과
        }}
      >
        {/* 로고(홈으로) */}
        <Typography
          component={RouterLink}
          to="/nurse"
          variant="h6"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer',
            '&:hover': {
              color: 'inherit',
              textDecoration: 'none',
            },
          }}
        >
          Nurse StrokeCare+
        </Typography>

        {/* 네비게이션 메뉴 */}
        <Box sx={{ display: 'flex', ml: 6, gap: 4 }}>
          {navItems.map(item => (
            <Box
              key={item.label}
              sx={{
                position: 'relative',
                pb: 0.5,
              }}
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              {/* top-level 링크 */}
              <Typography
                component={RouterLink}
                to={item.path || '#'}
                variant="body1"
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  px: 1,
                  py: 0.5,
                  '&:hover': { color: 'inherit' }
                }}
              >
                {item.label}
              </Typography>

              {/* 서브 메뉴 드롭다운 */}
              {hovered === item.label && item.subs && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    mt: 1,
                    bgcolor: 'rgba(0, 0, 0, 0.9)', // 검은색 배경 (약간 투명) 또는 '#000'
                    boxShadow: 3,
                    borderRadius: 1,
                    zIndex: 10,
                    minWidth: 160,
                    overflow: 'hidden', // 내용이 넘치면 숨김
                    transformOrigin: 'top center',
                    transform: 'translateY(-10px)', // 초기 위치 약간 위로
                    opacity: 1, // 초기 투명도 1 (임시 변경)
                    transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
                  }}
                  onMouseEnter={(event) => {
                    requestAnimationFrame(() => {
                      (event.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (event.currentTarget as HTMLElement).style.opacity = '1';
                    });
                  }}
                  onMouseLeave={(event) => {
                    (event.currentTarget as HTMLElement).style.transform = 'translateY(-10px)';
                    (event.currentTarget as HTMLElement).style.opacity = '0';
                    handleMouseLeave();
                  }}
                >
                  {item.subs.map((sub, index) => (
                    <MenuItem
                      key={sub.label}
                      component={RouterLink}
                      to={sub.path}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)', // 약간 흰색에 가까운 회색
                        fontSize: '0.8rem', // 텍스트 크기 작게 조정
                        '&:hover': { bgcolor: 'action.hover' },
                        transition: 'opacity 0.15s ease-in-out', // 살짝 더 부드럽게
                        opacity: hovered === item.label ? 1 : 0,
                        transitionDelay: `${index * 0.08}s`, // 순차적으로 나타나게 딜레이 추가 (살짝 더 간격 늘림)
                      }}
                    >
                      {sub.label}
                    </MenuItem>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>

        {/* 오른쪽 빈 여백 */}
        <Box sx={{ flexGrow: 0.3 }} />

        {/* 작은 Logout 버튼 */}
        <Button
          color="inherit"
          size="small"
          startIcon={<LogoutIcon fontSize="small" />}
          sx={{ textTransform: 'none', fontSize: '0.875rem' }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Toolbar>

      {/* 본문 영역 */}
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          mb: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flexGrow: 1,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 'lg' }}>
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
};

export default NurseLayout;