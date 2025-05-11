// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',        // 병원·헬스케어 블루
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00bfa5',        // 보조 그린 컬러
    },
    background: {
      default: '#f5f5f5',     // 페이지 전체 배경색
      paper: '#ffffff',       // 카드·패널 배경
    },
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans KR", sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700 },
    h2: { fontSize: '1.75rem', fontWeight: 600 },
    h3: { fontSize: '1.5rem', fontWeight: 500 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.4 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2',
        },
      },
    },
  },
});

export default theme;
