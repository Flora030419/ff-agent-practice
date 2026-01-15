import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authAPI } from '../api/index.js';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '');
  const userId = ref(localStorage.getItem('userId') || '');
  const username = ref(localStorage.getItem('username') || '');

  const isLoggedIn = computed(() => !!token.value);

  async function register(username, email, password, confirmPassword) {
    try {
      const response = await authAPI.register({ username, email, password, confirmPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  }

  async function login(username, password) {
    try {
      const response = await authAPI.login({ username, password });
      token.value = response.data.token;
      userId.value = response.data.userId;

      localStorage.setItem('token', token.value);
      localStorage.setItem('userId', userId.value);
      localStorage.setItem('username', username);

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  }

  function logout() {
    token.value = '';
    userId.value = '';
    username.value = '';

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  }

  return {
    token,
    userId,
    username,
    isLoggedIn,
    register,
    login,
    logout
  };
});
