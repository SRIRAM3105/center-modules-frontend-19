
import axios from 'axios';

// Base URL for all API calls
const API_BASE_URL = 'http://localhost:8080/api';

// Configure axios defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Community data endpoints
export const communityAPI = {
  getCommunityDetails: async () => {
    try {
      const response = await apiClient.get('/community-details');
      return response.data;
    } catch (error) {
      console.error('Error fetching community details:', error);
      throw error;
    }
  },
  
  updateAllocation: async (newAllocation) => {
    try {
      const response = await apiClient.post('/update-allocation', { allocation: newAllocation });
      return response.data;
    } catch (error) {
      console.error('Error updating allocation:', error);
      throw error;
    }
  }
};

// User energy data endpoints
export const energyDataAPI = {
  submitEnergyData: async (energyData) => {
    try {
      const response = await apiClient.post('/energy-data', energyData);
      return response.data;
    } catch (error) {
      console.error('Error submitting energy data:', error);
      throw error;
    }
  },
  
  calculateSolarPlan: async (userData) => {
    try {
      const response = await apiClient.post('/calculate-solar-plan', userData);
      return response.data;
    } catch (error) {
      console.error('Error calculating solar plan:', error);
      throw error;
    }
  }
};

// Provider matching endpoints
export const providerAPI = {
  getProviders: async () => {
    try {
      const response = await apiClient.get('/providers');
      return response.data;
    } catch (error) {
      console.error('Error fetching providers:', error);
      throw error;
    }
  },
  
  selectProvider: async (providerId) => {
    try {
      const response = await apiClient.post('/select-provider', { providerId });
      return response.data;
    } catch (error) {
      console.error('Error selecting provider:', error);
      throw error;
    }
  },
  
  voteForProvider: async (providerId) => {
    try {
      const response = await apiClient.post('/vote-provider', { providerId });
      return response.data;
    } catch (error) {
      console.error('Error voting for provider:', error);
      throw error;
    }
  },
  
  getMajorityVotedProvider: async () => {
    try {
      const response = await apiClient.get('/majority-voted-provider');
      return response.data;
    } catch (error) {
      console.error('Error fetching majority voted provider:', error);
      throw error;
    }
  }
};

// Payment endpoints
export const paymentAPI = {
  processPayment: async (paymentDetails) => {
    try {
      const response = await apiClient.post('/process-payment', paymentDetails);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },
  
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await apiClient.get(`/payment-status/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment status:', error);
      throw error;
    }
  }
};

// Monitoring endpoints
export const monitoringAPI = {
  getEnergyProduction: async (dateRange) => {
    try {
      const response = await apiClient.get('/energy-production', { params: dateRange });
      return response.data;
    } catch (error) {
      console.error('Error fetching energy production data:', error);
      throw error;
    }
  },
  
  getSavingsSummary: async () => {
    try {
      const response = await apiClient.get('/savings-summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching savings summary:', error);
      throw error;
    }
  }
};
