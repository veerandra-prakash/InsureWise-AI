import API from './api';

export const authService = {
  /**
   * Register a new user
   */
  async register(userData) {
    const response = await API.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('insurewise_token', response.data.token);
      localStorage.setItem('insurewise_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  /**
   * Login user
   */
  async login(credentials) {
    const response = await API.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('insurewise_token', response.data.token);
      localStorage.setItem('insurewise_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  /**
   * Get current authenticated user profile
   */
  async getMe() {
    const response = await API.get('/auth/me');
    return response.data;
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('insurewise_token');
    localStorage.removeItem('insurewise_user');
  }
};
