// src/services/AuthService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/auth` 
  : 'http://localhost:5000/api/auth';


export default {
  async login(email, password) {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem('token', response.data.token);
  },

  async register(email, password) {
    await axios.post(`${API_URL}/register`, { email, password });
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};
