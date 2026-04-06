import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Hardcoded for now, can use env later
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    try {
      const storedUser = localStorage.getItem('crm_user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (error) {
      console.error('Error parsing user token', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
