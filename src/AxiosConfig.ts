import axios from 'axios';

// Vite provides import.meta.env typings automatically; no need to redeclare them.

const AxiosConfig = axios.create({
    //@ts-ignore
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor để thêm token vào header
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

// Response interceptor để xử lý lỗi authentication
AxiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // // Redirect to login page
      // window.location.href = '/login';
      console.log('aaaaaaaaaaaaaa')
    }
    return Promise.reject(error);
  }
);

export default AxiosConfig;
