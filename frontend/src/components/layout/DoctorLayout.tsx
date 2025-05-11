import React, { useState, useRef } from 'react';
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Toolbar, Typography, Box, Button, CssBaseline, Container
} from '@mui/material';
import { ExitToApp as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../../store/AuthContext';

const navItems = [
  { label: '대시보드', path: '/doctor/dashboard' },
  { label: '메시지', path: '/doctor/messages' }
];

const DoctorLayout: React.FC = () => {
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
        overflowX: 'hidden',
        width: '100vw',
        justifyContent: 'flex-start',
        position: 'relative',
      }}
    >
      <CssBaseline />

      {/* 배경 이미지만 흐리게 처리 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          overflowX: 'hidden',
          width: '100vw',
          justifyContent: 'flex-start',
          position: 'absolute',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          filter: 'blur(5px)', // 배경 이미지에 블러 효과 적용
        }}
      />

      {/* 상단 Toolbar */}
      <Toolbar
        sx={{
          py: 2,
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1200,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)', // 상단바 배경 흐림 효과
        }}
      >
        <Typography
          component={RouterLink}
          to="/doctor"
          variant="h6"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer',
            '&:hover': { color: 'inherit' }
          }}
        >
          Doctor StrokeCare+
        </Typography>

        <Box sx={{ display: 'flex', ml: 6, gap: 4 }}>
          {navItems.map(item => (
            <Box
              key={item.label}
              sx={{ position: 'relative' }}
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              <Typography
                component={RouterLink}
                to={item.path}
                variant="body1"
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  px: 1,
                  py: 0.5,
                  borderBottom: hovered === item.label ? '2px solid #1976d2' : 'none',
                  '&:hover': { color: '#1976d2' }
                }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ ml: 'auto' }}>
          <Button
            color="inherit"
            size="small"
            startIcon={<LogoutIcon fontSize="small" />}
            sx={{ textTransform: 'none', fontSize: '0.875rem' }}
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        </Box>
      </Toolbar>

      {/* 본문 영역 */}
      <Container
        maxWidth="lg"
        sx={{
          mt: 10,
          mb: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flexGrow: 1,
          zIndex: 1,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 'lg' }}>
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
};

export default DoctorLayout;
