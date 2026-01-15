import axios from 'axios';

const API_BASE_URL = '/api';

// 设置默认配置
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

// 请求拦截器 - 添加 token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
