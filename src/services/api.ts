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

// Error handling helper
const handleApiError = (error, context) => {
  console.error(`Error during ${context}:`, error);
  throw error;
};

// ==========================================
// REGISTRATION API ENDPOINTS
// ==========================================
export const authAPI = {
  signup: async (userData) => {
    try {
      const response = await apiClient.post('/signup', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      return handleApiError(error, 'signup');
    }
  },
  
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      return handleApiError(error, 'login');
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getProfile: async () => {
    try {
      const response = await apiClient.get('/profile');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching profile');
    }
  },
  
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/profile', userData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updating profile');
    }
  }
};

// ==========================================
// PROVIDER API ENDPOINTS
// ==========================================
export const providerAPI = {
  registerProvider: async (providerData) => {
    try {
      const response = await apiClient.post('/providers/register', providerData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'registering provider');
    }
  },
  
  getProviderProfile: async (providerId) => {
    try {
      const response = await apiClient.get(`/providers/${providerId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching provider profile');
    }
  },
  
  updateProviderProfile: async (providerData) => {
    try {
      const response = await apiClient.put(`/providers/${providerData.provider_id}`, providerData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updating provider profile');
    }
  },
  
  listProviders: async (filters = {}) => {
    try {
      const response = await apiClient.get('/providers', { params: filters });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'listing providers');
    }
  },
  
  getCertificationStatus: async (providerId) => {
    try {
      const response = await apiClient.get(`/providers/${providerId}/certification`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'checking certification status');
    }
  }
};

// ==========================================
// COMMUNITY API ENDPOINTS
// ==========================================
export const communityAPI = {
  getCommunityDetails: async (communityId) => {
    try {
      const response = await apiClient.get(`/communities/${communityId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching community details');
    }
  },
  
  browseCommunities: async (location) => {
    try {
      const response = await apiClient.get('/communities/browse', {
        params: { location }
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'browsing communities');
    }
  },
  
  createCommunity: async (communityData) => {
    try {
      const response = await apiClient.post('/communities/create', communityData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'creating community');
    }
  },
  
  joinCommunity: async (communityId) => {
    try {
      const response = await apiClient.post('/join-community', { communityId });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'joining community');
    }
  },
  
  updateAllocation: async (allocation) => {
    try {
      const response = await apiClient.post('/update-allocation', { allocation });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updating allocation');
    }
  }
};

// ==========================================
// DATA COLLECTION API ENDPOINTS
// ==========================================
export const dataCollectionAPI = {
  submitAddress: async (addressData) => {
    try {
      const response = await apiClient.post('/address', addressData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'submitting address');
    }
  },
  
  getSolarPotential: async (location) => {
    try {
      const response = await apiClient.get('/solar-potential', {
        params: { location }
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching solar potential');
    }
  },
  
  submitCommunityDemand: async (demandData) => {
    try {
      const response = await apiClient.post('/community-demand', demandData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'submitting community demand');
    }
  },
  
  calculateSolarPlan: async (energyData) => {
    try {
      const response = await apiClient.post('/calculate-solar-plan', energyData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'calculating solar plan');
    }
  }
};

// ==========================================
// PLAN GENERATION API ENDPOINTS
// ==========================================
export const planAPI = {
  generateSolarPlan: async (planData) => {
    try {
      const response = await apiClient.post('/solar-plan', planData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'generating solar plan');
    }
  },
  
  getRoofEstimates: async (buildingData) => {
    try {
      const response = await apiClient.post('/roof-estimate', buildingData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getting roof estimates');
    }
  },
  
  submitHouseInfo: async (houseData) => {
    try {
      const response = await apiClient.post('/houseinfo', houseData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'submitting house info');
    }
  },
  
  updateSettings: async (settings) => {
    try {
      const response = await apiClient.post('/settings', settings);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updating settings');
    }
  }
};

// ==========================================
// PROVIDER CONNECTION API ENDPOINTS
// ==========================================
export const providerAPI = {
  getProviders: async () => {
    try {
      const response = await apiClient.get('/providers');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching providers');
    }
  },
  
  requestQuote: async (providerId) => {
    try {
      const response = await apiClient.post('/quote', { providerId });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'requesting quote');
    }
  },
  
  submitVote: async (providerVote) => {
    try {
      const response = await apiClient.post('/vote', providerVote);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'submitting vote');
    }
  },
  
  getVotingResults: async (communityId) => {
    try {
      const response = await apiClient.get('/vote-results', {
        params: { communityId }
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching voting results');
    }
  }
};

// ==========================================
// COST SHARING API ENDPOINTS
// ==========================================
export const costAPI = {
  updateCostShare: async (costShareData) => {
    try {
      const response = await apiClient.post('/cost-share', costShareData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updating cost sharing');
    }
  },
  
  getPayments: async () => {
    try {
      const response = await apiClient.get('/payments');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching payments');
    }
  },
  
  makePayment: async (paymentData) => {
    try {
      const response = await apiClient.post('/pay', paymentData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'processing payment');
    }
  },
  
  getInvoices: async () => {
    try {
      const response = await apiClient.get('/invoices');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching invoices');
    }
  }
};

// ==========================================
// INSTALLATION TRACKING API ENDPOINTS
// ==========================================
export const installationAPI = {
  getInstallationStatus: async (installationId) => {
    try {
      const response = await apiClient.get('/installation-status', {
        params: { installationId }
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching installation status');
    }
  },
  
  getMilestones: async (installationId) => {
    try {
      const response = await apiClient.get('/milestones', {
        params: { installationId }
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching milestones');
    }
  },
  
  submitFeedback: async (feedbackData) => {
    try {
      const response = await apiClient.post('/feedback', feedbackData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'submitting feedback');
    }
  }
};

// ==========================================
// MONITORING API ENDPOINTS
// ==========================================
export const monitoringAPI = {
  getSavingsAnalysis: async (communityId) => {
    try {
      const response = await apiClient.post('/savings-analysis', { communityId });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching savings analysis');
    }
  },
  
  getCarbonReport: async (communityId) => {
    try {
      const response = await apiClient.get('/carbon-report', {
        params: { communityId }
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching carbon report');
    }
  },
  
  getAlerts: async () => {
    try {
      const response = await apiClient.get('/alerts');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching alerts');
    }
  },
  
  getEnergyData: async (userId) => {
    try {
      const response = await apiClient.post('/energy-data', { userId });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching energy data');
    }
  }
};
