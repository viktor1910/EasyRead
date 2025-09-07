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

export default AxiosConfig;
