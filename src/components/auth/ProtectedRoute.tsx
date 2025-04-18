import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: ('doctor' | 'nurse' | 'patient')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user } = useAuth();
  
  console.log('ProtectedRoute - 현재 사용자:', user);
  
  // 로그인하지 않은 경우
  if (!user) {
    console.log('인증되지 않음: 로그인 페이지로 이동');
    return <Navigate to="/login" replace />;
  }
  
  // 권한이 맞지 않는 경우
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log('권한 없음: 허용된 역할만 접근 가능');
    return <Navigate to="/unauthorized" replace />;
  }
  
  // 인증 및 권한 검증 통과
  console.log('인증 성공: 보호된 라우트 접근 허용');
  return <Outlet />;
};

export default ProtectedRoute;
