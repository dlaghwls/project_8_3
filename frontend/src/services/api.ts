// frontend/src/services/api.ts

import axios, {
  AxiosError,
  InternalAxiosRequestConfig,    // ← 추가
} from 'axios';

// Vite 환경변수 사용 예시 (없으면 로컬 기본 URL)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 1) 요청 인터셉터
api.interceptors.request.use(
  // 파라미터 타입을 InternalAxiosRequestConfig 로 변경
  (config: InternalAxiosRequestConfig) => {
    // headers 가 undefined 일 수 있으므로 초기화
    config.headers = config.headers || {};
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 2) 응답 인터셉터
api.interceptors.response.use(
  response => response,
  async (error: AxiosError & { config?: InternalAxiosRequestConfig & { _retry?: boolean } }) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('리프레시 토큰 없음');

        const { data } = await axios.post(
          `${API_BASE_URL}/accounts/token/refresh/`,
          { refresh: refreshToken },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        localStorage.setItem('token', data.access);
        // 재시도 요청 헤더 갱신
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // 리프레시 실패 시 로그아웃
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
