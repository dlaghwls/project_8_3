import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user } = useAuth();
  
  // 로그인하지 않은 경우
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // 권한이 맞지 않는 경우
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'doctor' ? '/doctor' : '/nurse'} replace />;
  }
  
  // 인증 및 권한 검증 통과
  return <Outlet />;
};

export default ProtectedRoute;
