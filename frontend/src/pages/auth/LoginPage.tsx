// src/pages/auth/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import api from '../../services/api';
import './AuthPages.css';

const LoginPage: React.FC = () => {
  const [employee_id, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!employee_id.match(/^(DOC|NUR)-\d{4,}/)) {
      setError('사원번호 형식이 올바르지 않습니다. (예: DOC-1234 또는 NUR-5678)');
      return;
    }

    try {
      const res = await api.post('/users/login/', {
        employee_id,
        password
      });
      const { access, refresh, user: logged } = res.data;

      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);

      login({
        id: logged.id,
        employeeId: logged.employee_id,
        name: logged.name,
        role: logged.role,
      });

      navigate(logged.role === 'doctor' ? '/doctor' : '/nurse');
    } catch (err) {
      setError('사원번호 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="auth-container">
      <header className="auth-header">
        <div className="logo-container" onClick={() => navigate('/')}>
          <img src="/assets/images/logo.png" alt="StrokeCare+ Logo" className="logo" />
          <h1 className="logo-text">StrokeCare+ 로그인</h1>
        </div>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="employee_id" className="required">사원번호</label>
              <input
                type="text"
                id="employee_id"
                value={employee_id}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="DOC-1234 또는 NUR-5678 형식"
                required
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="required">비밀번호</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <button type="submit" className="auth-submit-button">로그인</button>

            <div className="auth-links">
              <span>계정이 없으신가요?</span>
              <Link to="/signup" className="signup-link">회원가입</Link>
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

export default LoginPage;