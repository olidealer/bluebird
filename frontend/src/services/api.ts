
import axios from 'axios';

// Create an instance of axios
export const api = axios.create({
  baseURL: '/api', // The proxy in vite.config.js will handle this
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * We can intercept responses to handle global errors, like token expiration
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // For example, redirect to login page if token is invalid or expired
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
