import axios from 'axios';

// Vite provides import.meta.env typings automatically; no need to redeclare them.

const AxiosConfig = axios.create({
    //@ts-ignore
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để tự động thêm token vào header
AxiosConfig.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response và token hết hạn
AxiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Có thể redirect về trang login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default AxiosConfig;
