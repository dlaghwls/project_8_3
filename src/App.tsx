import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 컴포넌트 import
import { AuthProvider } from './store/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DoctorLayout from './components/layout/DoctorLayout';
import LoginPage from './pages/auth/LoginPage';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDetail from './pages/doctor/PatientDetail';
import NotFound from '@/pages/doctor/NotFound';
import MessageCenter from './components/messaging/MessageCenter';
import ErrorBoundary from './components/common/ErrorBoundary';  // 🔥 추가

// 테마 설정
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  }
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary> {/* 🔥 에러 바운더리 적용 시작 */}
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* 공개 라우트 */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* 의사 전용 보호된 라우트 */}
              <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
                <Route element={<DoctorLayout />}>
                  <Route path="/doctor" element={<DoctorDashboard />} />
                  <Route path="/doctor/patient/:id" element={<PatientDetail />} />
                  <Route path="/doctor/messages" element={<MessageCenter />} />
                </Route>
              </Route>
              
              {/* 기본 리디렉션 및 404 페이지 */}
              <Route path="/" element={<Navigate to="/doctor" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary> {/* 🔥 에러 바운더리 적용 끝 */}
    </ThemeProvider>
  );
};

export default App;
