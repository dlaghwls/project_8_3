// src/App.tsx

import React from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from './store/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DoctorLayout from './components/layout/DoctorLayout';
import NurseLayout from './components/layout/NurseLayout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDetail from './pages/doctor/PatientDetail';
import MessageCenter from './components/messaging/MessageCenter';
import SelfCheckList from './pages/nurse/SelfCheckList';
import PatientRegister from './pages/nurse/PatientRegister';
import VitalInput from './pages/nurse/VitalInput';
import NurseHomePage from './pages/nurse/NurseHomePage';
import NurseDashboard from './pages/nurse/NurseDashboard';
import NotFound from './pages/doctor/NotFound';
import DoctorHomePage from './pages/doctor/DoctorHomePage';

import Calendar from './pages/nurse/Calendar';   

import LandingPage from './pages/landing/LandingPage';
import SystemIntroPage from './pages/system/SystemIntroPage';
import TeamIntroPage from './pages/team/TeamIntroPage';

// 토큰이 있으면 axios 헤더 자동 설정
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// MUI 테마 정의
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  }
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* 공개 라우트 */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/system" element={<SystemIntroPage />} />
              <Route path="/team" element={<TeamIntroPage />} />

            {/* 의사 전용 라우트 */}
            <Route element={<ProtectedRoute allowedRoles={[ 'doctor' ]} />}>  
              <Route element={<DoctorLayout />}>
                <Route path="/doctor" element={<DoctorHomePage />} />
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor/patient/:id" element={<PatientDetail />} />
                <Route path="/doctor/messages" element={<MessageCenter />} />
              </Route>
            </Route>

            {/* 간호사 전용 라우트 */}
            <Route element={<ProtectedRoute allowedRoles={[ 'nurse' ]} />}>  
              <Route path="/nurse" element={<NurseLayout />}>
                {/* 홈 화면 */}
                <Route index element={<NurseHomePage />} />
                {/* 대시보드(페이징 처리 리스트) */}
                <Route path="dashboard" element={<NurseDashboard />} />
                {/* 자가문진 결과 */}
                <Route path="patients">
                  <Route index element={<SelfCheckList />} />
                  <Route path=":patientId" element={<PatientDetail />} />
                </Route>
                {/* 환자 등록, 바이탈 입력, 메시지 */}
                <Route path="register" element={<PatientRegister />} />
                <Route path="vitals/:patientId" element={<VitalInput />} />
                <Route path="messages" element={<MessageCenter />} />

                {/* 간호사 달력 */}
               <Route path="/nurse/calendar" element={<Calendar />} />
              </Route>
            </Route>
    
            {/* 기본 루트와 404 */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;