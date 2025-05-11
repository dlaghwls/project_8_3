// src/pages/auth/SignupPage.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AuthPages.css';

const SignupPage: React.FC = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!employeeId) {
      newErrors.employeeId = '사원번호를 입력해주세요';
    } else if (!employeeId.match(/^(DOC|NUR)-\d{4,}/)) {
      newErrors.employeeId = 'DOC- 또는 NUR- 형식이어야 합니다 (예: DOC-1234)';
    }

    if (!name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (password.length < 4) {
      newErrors.password = '비밀번호는 최소 4자 이상이어야 합니다';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const role = employeeId.startsWith('DOC-') ? 'doctor' : 'nurse';

      await axios.post(
        'http://localhost:8000/api/register/',
        {
          username: employeeId,
          employee_id: employeeId,
          name,
          password,
          role,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      alert('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="auth-container">
      <header className="auth-header">
        <div className="logo-container" onClick={() => navigate('/')}>
          <img src="/assets/images/logo.png" alt="StrokeCare+ Logo" className="logo" />
          <h1 className="logo-text">StrokeCare+ 회원가입</h1>
        </div>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="employeeId" className="required">사원번호</label>
              <input
                type="text"
                id="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="DOC-1234 또는 NUR-5678 형식"
                className={`input-field ${errors.employeeId ? 'input-error' : ''}`}
              />
              {errors.employeeId && (
                <p className="error-text">{errors.employeeId}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="name" className="required">이름</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`input-field ${errors.name ? 'input-error' : ''}`}
              />
              {errors.name && (
                <p className="error-text">{errors.name}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="required">비밀번호</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input-field ${errors.password ? 'input-error' : ''}`}
              />
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="required">비밀번호 확인</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
              />
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword}</p>
              )}
            </div>

            <button type="submit" className="auth-submit-button">회원가입</button>

            <div className="auth-links">
              <span>이미 계정이 있으신가요?</span>
              <Link to="/login" className="login-link">로그인</Link>
            </div>
          </form>
        </div>
      </main>

      <footer className="auth-footer">
        <p>&copy; 2025 StrokeCare+ All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default SignupPage;