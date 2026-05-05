import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000/api',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;