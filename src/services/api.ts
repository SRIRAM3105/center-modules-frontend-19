
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

// Helper function to safely handle API calls
const safeApiCall = async (apiCall) => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    // If it's a connection error or server is not available, fail silently
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      console.warn('API connection issue - returning null');
      return null;
    }
    throw error;
  }
};

// Community data endpoints
export const communityAPI = {
  getCommunityDetails: async () => {
    return safeApiCall(() => apiClient.get('/community-details'));
  },
  
  updateAllocation: async (newAllocation) => {
    return safeApiCall(() => apiClient.post('/update-allocation', { allocation: newAllocation }));
  }
};

// User energy data endpoints
export const energyDataAPI = {
  submitEnergyData: async (energyData) => {
    return safeApiCall(() => apiClient.post('/energy-data', energyData));
  },
  
  calculateSolarPlan: async (userData) => {
    return safeApiCall(() => apiClient.post('/calculate-solar-plan', userData));
  }
};

// Provider matching endpoints
export const providerAPI = {
  getProviders: async () => {
    return safeApiCall(() => apiClient.get('/providers'));
  },
  
  selectProvider: async (providerId) => {
    return safeApiCall(() => apiClient.post('/select-provider', { providerId }));
  },
  
  voteForProvider: async (providerId) => {
    return safeApiCall(() => apiClient.post('/vote-provider', { providerId }));
  },
  
  getMajorityVotedProvider: async () => {
    return safeApiCall(() => apiClient.get('/majority-voted-provider'));
  }
};

// Payment endpoints
export const paymentAPI = {
  processPayment: async (paymentDetails) => {
    return safeApiCall(() => apiClient.post('/process-payment', paymentDetails));
  },
  
  getPaymentStatus: async (paymentId) => {
    return safeApiCall(() => apiClient.get(`/payment-status/${paymentId}`));
  }
};

// Monitoring endpoints
export const monitoringAPI = {
  getEnergyProduction: async (dateRange) => {
    return safeApiCall(() => apiClient.get('/energy-production', { params: dateRange }));
  },
  
  getSavingsSummary: async () => {
    return safeApiCall(() => apiClient.get('/savings-summary'));
  }
};
