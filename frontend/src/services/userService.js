import API from './api';

export const userService = {
  /**
   * Fetch user profile from Express backend
   */
  async getProfile() {
    const response = await API.get('/users/profile');
    return response.data;
  },

  /**
   * Update user profile in Express backend
   */
  async updateProfile(profileData) {
    const response = await API.put('/users/profile', profileData);
    if (response.data.data?.user) {
      const currentUser = JSON.parse(localStorage.getItem('insurewise_user') || '{}');
      const updatedUser = { ...currentUser, ...response.data.data.user };
      localStorage.setItem('insurewise_user', JSON.stringify(updatedUser));
    }
    return response.data;
  }
};
