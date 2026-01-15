import api from './axios.js';

// 认证相关
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout')
};

// 花销相关
export const expenseAPI = {
  list: (params) => api.get('/expenses', { params }),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`)
};

// 分类相关
export const categoryAPI = {
  list: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  delete: (id) => api.delete(`/categories/${id}`)
};

// 统计相关
export const statisticsAPI = {
  summary: (params) => api.get('/statistics/summary', { params }),
  byCategory: (params) => api.get('/statistics/by-category', { params }),
  byDate: (params) => api.get('/statistics/by-date', { params })
};
