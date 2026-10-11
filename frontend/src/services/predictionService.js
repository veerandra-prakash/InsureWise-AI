import API from './api';

export const predictionService = {
  /**
   * Submit 20 raw input features to Node backend for ML prediction & SHAP explanation
   */
  async createPrediction(inputFeatures) {
    const response = await API.post('/predictions', inputFeatures);
    return response.data;
  },

  /**
   * Fetch authenticated user's prediction history
   */
  async getHistory() {
    const response = await API.get('/predictions');
    return response.data;
  },

  /**
   * Fetch a single prediction record by ID
   */
  async getPredictionById(id) {
    const response = await API.get(`/predictions/${id}`);
    return response.data;
  },

  /**
   * Delete a prediction record by ID
   */
  async deletePrediction(id) {
    const response = await API.delete(`/predictions/${id}`);
    return response.data;
  },

  /**
   * Check status of underlying ML microservice
   */
  async getMLHealth() {
    const response = await API.get('/predictions/ml-health');
    return response.data;
  }
};
