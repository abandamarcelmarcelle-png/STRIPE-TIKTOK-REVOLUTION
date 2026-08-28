import { create } from 'zustand';
import API from '../api/client';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  signup: async (email, username, password, phone) => {
    try {
      set({ error: null });
      const response = await API.post('/auth/signup', {
        email,
        username,
        password,
        phone
      });
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      set({ user: response.data.user });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Signup failed';
      set({ error: message });
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      set({ error: null });
      const response = await API.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      set({ user: response.data.user });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      set({ error: message });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null });
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Verify token is still valid
        const response = await API.get('/auth/verify');
        set({ user: response.data.user, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ loading: false });
    }
  }
}));
