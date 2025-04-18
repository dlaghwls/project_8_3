import React, { createContext, useContext, useState, ReactNode } from 'react';

// 사용자 정보 타입 정의
interface User {
  username: string;
  role: 'doctor' | 'nurse' | 'patient';
}

// AuthContext 타입 정의
interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

// 테스트용 기본값 설정
const defaultUser: User = {
  username: '김의사',
  role: 'doctor'
};

// 컨텍스트 생성
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {}
});

// AuthContext Hook
export const useAuth = () => useContext(AuthContext);

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 실제로는 null이어야 하지만, 개발 중이므로 기본값 설정
  const [user, setUser] = useState<User | null>(defaultUser); 

  // 로그인 함수 - 실제로는 API 호출 필요
  const login = (username: string, password: string) => {
    console.log('로그인 시도:', username, password);
    // 간단한 검증 (실제로는 서버에서 검증해야 함)
    if (password.length > 3) {
      setUser({
        username: username,
        role: 'doctor'
      });
    }
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
