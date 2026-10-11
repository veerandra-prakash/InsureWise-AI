import axios from 'axios';

/**
 * Centralized Axios API client.
 * Normalizes import.meta.env.VITE_API_URL to ensure the '/api' prefix is attached
 * to match Express backend route mount points (/api/auth, /api/users, /api/predictions).
 */
const getBaseURL = () => {
  const rawUrl = import.meta.env.VITE_API_URL;
  if (!rawUrl) return '/api';
  const cleanUrl = rawUrl.replace(/\/+$/, '');
  if (cleanUrl.endsWith('/api')) {
    return cleanUrl;
  }
  return `${cleanUrl}/api`;
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token from localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('insurewise_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Handle HTTP 401 Unauthorized globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      localStorage.removeItem('insurewise_token');
      localStorage.removeItem('insurewise_user');
    }
    return Promise.reject(error);
  }
);

export default API;

