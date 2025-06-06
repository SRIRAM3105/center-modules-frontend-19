
import axios from 'axios';

// Base URL for all API calls - using a dynamic URL that works in both development and production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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
    console.log('API Request:', { url: config.url, method: config.method, data: config.data });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', { url: response.config.url, status: response.status, data: response.data });
    return response;
  },
  (error) => {
    // Handle token expiration or authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    console.error('API Response Error:', { 
      url: error.config?.url, 
      status: error.response?.status,
      message: error.message,
      data: error.response?.data 
    });
    return Promise.reject(error);
  }
);

// Error handling helper
const handleApiError = (error, context) => {
  console.error(`Error during ${context}:`, error);
  
  // Return a structured error object for component use
  return {
    error: true,
    message: error.response?.data?.message || `An error occurred during ${context}`,
    status: error.response?.status || 500,
    details: error.response?.data || error.message
  };
};

// ==========================================
// AUTH API ENDPOINTS
// ==========================================
export const authAPI = {
  signup: async (userData) => {
    try {
      console.log("API Signup request:", userData);
      const response = await apiClient.post('/auth/signup', userData);
      console.log("API Signup response:", response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          roles: response.data.roles
        }));
      }
      return { success: true, ...response.data };
    } catch (error) {
      console.error("Error in signup API call:", error);
      return handleApiError(error, 'signup');
    }
  },
  
  login: async (credentials) => {
    try {
      console.log("API Login request:", credentials);
      const response = await apiClient.post('/auth/login', credentials);
      console.log("API Login response:", response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          roles: response.data.roles
        }));
      }
      return { success: true, ...response.data };
    } catch (error) {
      console.error("Error in login API call:", error);
      return handleApiError(error, 'login');
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },
  
  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching profile');
    }
  },
  
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updating profile');
    }
  },
  
  resetPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'resetting password');
    }
  },
  
  confirmResetPassword: async (token, newPassword) => {
    try {
      const response = await apiClient.post('/auth/confirm-reset-password', { 
        token, 
        newPassword 
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'confirming password reset');
    }
  }
};

// ==========================================
// PROVIDER API ENDPOINTS
// ==========================================
export const providerAPI = {
  registerProvider: async (providerData) => {
    try {
      const response = await apiClient.post('/providers', providerData);
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
  
  updateProviderProfile: async (providerId, providerData) => {
    try {
      const response = await apiClient.put(`/providers/${providerId}`, providerData);
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
  },
  
  getProviders: async () => {
    try {
      const response = await apiClient.get('/providers');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching providers');
    }
  },
  
  requestQuote: async (providerId, quoteData) => {
    try {
      const response = await apiClient.post(`/providers/${providerId}/quotes`, quoteData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'requesting quote');
    }
  },
  
  getQuoteRequests: async () => {
    try {
      const response = await apiClient.get('/providers/quotes/requests');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching quote requests');
    }
  },
  
  submitQuote: async (requestId, quoteData) => {
    try {
      const response = await apiClient.post(`/providers/quotes/${requestId}/submit`, quoteData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'submitting quote');
    }
  },
  
  getActiveProjects: async () => {
    try {
      const response = await apiClient.get('/providers/projects/active');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching active projects');
    }
  },
  
  updateInstallationProgress: async (projectId, progressData) => {
    try {
      const response = await apiClient.put(`/providers/projects/${projectId}/progress`, progressData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updating installation progress');
    }
  },
  
  submitVote: async (communityId, providerVote) => {
    try {
      const response = await apiClient.post(`/communities/${communityId}/votes`, providerVote);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'submitting vote');
    }
  },
  
  getVotingResults: async (communityId) => {
    try {
      const response = await apiClient.get(`/communities/${communityId}/votes`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching voting results');
    }
  },
  
  selectWinningProvider: async (providerId) => {
    try {
      const response = await apiClient.post(`/providers/${providerId}/select-winner`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'selecting winning provider');
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
  
  browseCommunities: async (zipCode) => {
    try {
      const response = await apiClient.get('/communities', { 
        params: typeof zipCode === 'string' ? { zipCode } : zipCode 
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'browsing communities');
    }
  },
  
  createCommunity: async (communityData) => {
    try {
      const response = await apiClient.post('/communities', communityData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'creating community');
    }
  },
  
  joinCommunity: async (communityId) => {
    try {
      const response = await apiClient.post(`/communities/${communityId}/members`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'joining community');
    }
  },
  
  joinCommunityByCode: async (inviteCode) => {
    try {
      const response = await apiClient.post('/communities/join-by-code', { inviteCode });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'joining community by code');
    }
  },
  
  getUserCommunities: async () => {
    try {
      const response = await apiClient.get('/communities/user/communities');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching user communities');
    }
  },
  
  updateAllocation: async (communityId, allocation) => {
    try {
      const response = await apiClient.put(`/communities/${communityId}/allocation`, { allocation });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updating allocation');
    }
  },
  
  submitVote: async (communityId, providerId) => {
    try {
      const response = await apiClient.post(`/communities/${communityId}/votes`, { providerId });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'submitting vote');
    }
  },
  
  getVotingResults: async (communityId) => {
    try {
      const response = await apiClient.get(`/communities/${communityId}/votes`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching voting results');
    }
  }
};

// ==========================================
// DATA COLLECTION API ENDPOINTS
// ==========================================
export const dataCollectionAPI = {
  submitElectricityUsage: async (usageData) => {
    try {
      const response = await apiClient.post('/electricity-usage', usageData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'submitting electricity usage');
    }
  },
  
  getUserElectricityUsage: async () => {
    try {
      const response = await apiClient.get('/electricity-usage');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching electricity usage');
    }
  },
  
  submitAddress: async (addressData) => {
    try {
      const response = await apiClient.post('/data/addresses', addressData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'submitting address');
    }
  },
  
  getSolarPotential: async (addressId) => {
    try {
      const response = await apiClient.get(`/data/addresses/${addressId}/solar-potential`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching solar potential');
    }
  },
  
  submitCommunityDemand: async (communityId, demandData) => {
    try {
      const response = await apiClient.post(`/communities/${communityId}/demand`, demandData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'submitting community demand');
    }
  },
  
  calculateSolarPlan: async (addressId, energyData) => {
    try {
      const response = await apiClient.post(`/data/addresses/${addressId}/solar-plan`, energyData);
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
  generateSolarPlan: async (addressId, planData) => {
    try {
      const response = await apiClient.post(`/plans/${addressId}`, planData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'generating solar plan');
    }
  },
  
  getRoofEstimates: async (addressId) => {
    try {
      const response = await apiClient.get(`/plans/${addressId}/roof-estimate`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getting roof estimates');
    }
  },
  
  submitHouseInfo: async (addressId, houseData) => {
    try {
      const response = await apiClient.post(`/plans/${addressId}/house-info`, houseData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'submitting house info');
    }
  },
  
  updateSettings: async (planId, settings) => {
    try {
      const response = await apiClient.put(`/plans/${planId}/settings`, settings);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updating settings');
    }
  }
};

// ==========================================
// COST SHARING API ENDPOINTS
// ==========================================
export const costAPI = {
  updateCostShare: async (communityId, costShareData) => {
    try {
      const response = await apiClient.put(`/communities/${communityId}/cost-share`, costShareData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updating cost sharing');
    }
  },
  
  getPayments: async (userId) => {
    try {
      const response = await apiClient.get(`/payments/user/${userId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching payments');
    }
  },
  
  getCommunityPayments: async (communityId) => {
    try {
      const response = await apiClient.get(`/payments/community/${communityId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching community payments');
    }
  },
  
  calculateQuoteSplit: async (quoteData) => {
    try {
      const response = await apiClient.post('/payments/calculate-quote-split', quoteData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'calculating quote split');
    }
  },
  
  createPaymentPlan: async (paymentPlanData) => {
    try {
      const response = await apiClient.post('/payments/create-payment-plan', paymentPlanData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'creating payment plan');
    }
  },
  
  processPayment: async (paymentData) => {
    try {
      const response = await apiClient.post('/payments/process-payment', paymentData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'processing payment');
    }
  },
  
  makePayment: async (paymentData) => {
    try {
      const response = await apiClient.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'processing payment');
    }
  },
  
  getInvoices: async (userId) => {
    try {
      const response = await apiClient.get(`/invoices/user/${userId}`);
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
      const response = await apiClient.get(`/installations/${installationId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching installation status');
    }
  },
  
  getMilestones: async (installationId) => {
    try {
      const response = await apiClient.get(`/installations/${installationId}/milestones`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching milestones');
    }
  },
  
  submitFeedback: async (installationId, feedbackData) => {
    try {
      const response = await apiClient.post(`/installations/${installationId}/feedback`, feedbackData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'submitting feedback');
    }
  },
  
  updateInstallationProgress: async (installationId, progressData) => {
    try {
      const response = await apiClient.put(`/installations/${installationId}/progress`, progressData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updating installation progress');
    }
  }
};

// ==========================================
// MONITORING API ENDPOINTS
// ==========================================
export const monitoringAPI = {
  getSavingsAnalysis: async (communityId) => {
    try {
      const response = await apiClient.get(`/communities/${communityId}/savings`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching savings analysis');
    }
  },
  
  getCarbonReport: async (communityId) => {
    try {
      const response = await apiClient.get(`/communities/${communityId}/carbon-report`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching carbon report');
    }
  },
  
  getAlerts: async (userId) => {
    try {
      const response = await apiClient.get(`/monitoring/alerts/user/${userId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching alerts');
    }
  },
  
  getEnergyData: async (installationId) => {
    try {
      const response = await apiClient.get(`/monitoring/energy-data/${installationId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching energy data');
    }
  },
  
  getSystemPerformance: async (installationId, period = 'monthly') => {
    try {
      const response = await apiClient.get(`/monitoring/performance/${installationId}`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetching system performance');
    }
  }
};
