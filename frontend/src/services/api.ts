import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// 요청 인터셉터 - 토큰 주입
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 토큰 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        const response = await axios.post('http://localhost:8000/api/token/refresh/', {
          refresh: refreshToken,
        });
        const newAccess = response.data.access;
        localStorage.setItem('access_token', newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

// 자가문진 목록 조회
export const getSelfCheckList = async (patientId?: number) => {
  const response = await api.get('/selfcheck/', {
    params: patientId ? { patient: patientId } : {},
  });
  return response.data.results || response.data;
};

// 메시지 전송
export const sendMessage = async (
  receiverId: number,
  selfcheckId: number,
  content: string
) => {
  return api.post('/messages/', {
    receiver: receiverId,
    selfcheck: selfcheckId,
    content,
  });
};

export default api;
