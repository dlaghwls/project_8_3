import React from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// ✅ 올바른 임포트
import SelfCheckList from './pages/nurse/SelfCheckList';

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

import { AuthProvider } from './store/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DoctorLayout from './components/layout/DoctorLayout';
import NurseLayout from './components/layout/NurseLayout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import NurseDashboard from './pages/nurse/NurseDashboard';
import PatientDetail from './pages/doctor/PatientDetail';
import VitalInput from './pages/nurse/VitalInput';
import NotFound from '@/pages/doctor/NotFound';
import MessageCenter from './components/messaging/MessageCenter';
import ErrorBoundary from './components/common/ErrorBoundary';
import PatientRegister from './pages/nurse/PatientRegister';

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
              <Route path="/signup" element={<SignupPage />} />

              {/* 의사 전용 라우트 */}
              <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
                <Route element={<DoctorLayout />}>
                  <Route path="/doctor" element={<DoctorDashboard />} />
                  <Route path="/doctor/patient/:id" element={<PatientDetail />} />
                  <Route path="/doctor/messages" element={<MessageCenter />} />
                </Route>
              </Route>

              {/* 간호사 전용 라우트 */}
              <Route element={<ProtectedRoute allowedRoles={['nurse']} />}>
                <Route path="/nurse" element={<NurseLayout />}>
                  <Route index element={<NurseDashboard />} />

                  {/* 환자 관리 (자가문진 결과) */}
                  <Route path="patients">
                    <Route index element={<SelfCheckList />} /> {/* ✅ 수정 */}
                    <Route path=":patientId" element={<PatientDetail />} />
                  </Route>

                  {/* 기존 기능들 */}
                  <Route path="register" element={<PatientRegister />} />
                  <Route path="vitals/:patientId" element={<VitalInput />} />
                  <Route path="messages" element={<MessageCenter />} />
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
