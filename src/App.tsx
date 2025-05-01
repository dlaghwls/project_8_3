import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 컴포넌트 import
import { AuthProvider } from './store/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DoctorLayout from './components/layout/DoctorLayout';
import NurseLayout from './components/layout/NurseLayout'; // 간호사 레이아웃 (필요 시 구현)
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage'; // 회원가입 페이지 import 추가
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import NurseDashboard from './pages/nurse/NurseDashboard'; // 간호사 대시보드 (필요 시 구현)
import PatientDetail from './pages/doctor/PatientDetail';
import VitalInput from './pages/nurse/VitalInput'; // 간호사용 바이탈 입력 페이지 (필요 시 구현)
import NotFound from '@/pages/doctor/NotFound';
import MessageCenter from './components/messaging/MessageCenter';
import ErrorBoundary from './components/common/ErrorBoundary';

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
      <ErrorBoundary>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* 공개 라우트 */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} /> {/* 회원가입 라우트 추가 */}
              
              {/* 의사 전용 보호된 라우트 */}
              <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
                <Route element={<DoctorLayout />}>
                  <Route path="/doctor" element={<DoctorDashboard />} />
                  <Route path="/doctor/patient/:id" element={<PatientDetail />} />
                  <Route path="/doctor/messages" element={<MessageCenter />} />
                </Route>
              </Route>
              
              {/* 간호사 전용 보호된 라우트 */}
              <Route element={<ProtectedRoute allowedRoles={['nurse']} />}>
                <Route element={<NurseLayout />}>
                  <Route path="/nurse" element={<NurseDashboard />} />
                  <Route path="/nurse/vital-input" element={<VitalInput />} />
                  <Route path="/nurse/messages" element={<MessageCenter />} />
                </Route>
              </Route>
              
              {/* 기본 리디렉션 및 404 페이지 */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
