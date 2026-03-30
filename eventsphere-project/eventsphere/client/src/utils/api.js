import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  me: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

export const expoAPI = {
  getAll: (params) => API.get('/expos', { params }),
  getOne: (id) => API.get(`/expos/${id}`),
  create: (data) => API.post('/expos', data),
  update: (id, data) => API.put(`/expos/${id}`, data),
  delete: (id) => API.delete(`/expos/${id}`),
  register: (id) => API.post(`/expos/${id}/register`),
  analytics: (id) => API.get(`/expos/${id}/analytics`),
};

export const exhibitorAPI = {
  getForExpo: (expoId) => API.get(`/exhibitors/expo/${expoId}`),
  getAll: (params) => API.get('/exhibitors', { params }),
  getMy: () => API.get('/exhibitors/my'),
  apply: (data) => API.post('/exhibitors', data),
  update: (id, data) => API.put(`/exhibitors/${id}`, data),
  updateStatus: (id, data) => API.patch(`/exhibitors/${id}/status`, data),
};

export const sessionAPI = {
  getForExpo: (expoId) => API.get(`/sessions/expo/${expoId}`),
  create: (data) => API.post('/sessions', data),
  update: (id, data) => API.put(`/sessions/${id}`, data),
  delete: (id) => API.delete(`/sessions/${id}`),
  bookmark: (id) => API.post(`/sessions/${id}/bookmark`),
};

export const bookingAPI = {
  getMy: () => API.get('/bookings/my'),
};

export default API;
