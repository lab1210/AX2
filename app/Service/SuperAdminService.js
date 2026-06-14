// Service/SuperAdminMetricsService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class SuperAdminMetricsService {
  constructor() {
    this.baseURL = BASE_URL;
    console.log('=== SuperAdminMetricsService initialized ===');
    console.log('BASE_URL from env:', BASE_URL);
    console.log('this.baseURL:', this.baseURL);
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    console.log('getAxiosInstance called');
    const instance = authService.getAxiosInstance();
    console.log('Axios instance created:', !!instance);
    return instance;
  }

  // Get SuperAdmin metrics (dashboard stats)
  async getSuperAdminMetrics() {
    console.log('\n=== getSuperAdminMetrics called ===');
    
    try {
      // DEBUG: Check token before request
      const token = authService.getAccessToken();
      console.log('1. Token exists:', !!token);
      if (token) {
        console.log('2. Token preview:', token.substring(0, 50) + '...');
        console.log('3. Token length:', token.length);
        
        // Decode token to check role
        try {
          const parts = token.split('.');
          const payload = JSON.parse(atob(parts[1]));
          console.log('4. Token payload:', payload);
          console.log('5. Roles in token:', payload.role || payload.roles || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
          console.log('6. User ID in token:', payload.nameid || payload.sub);
        } catch (e) {
          console.log('Could not decode token:', e.message);
        }
      } else {
        console.log('2. NO TOKEN FOUND!');
      }
      
      console.log('7. Base URL:', this.baseURL);
      console.log('8. Full URL:', `${this.baseURL}/SuperAdmin/metrics`);
      
      const axiosInstance = this.getAxiosInstance();
      
      // Add request interceptor to see headers
      axiosInstance.interceptors.request.use(
        (config) => {
          console.log('9. Request URL:', config.url);
          console.log('10. Request Method:', config.method);
          console.log('11. Request Headers:', JSON.stringify(config.headers, null, 2));
          return config;
        },
        (error) => {
          console.error('Request interceptor error:', error);
          return Promise.reject(error);
        }
      );
      
      console.log('12. Making request to /SuperAdmin/metrics...');
      const response = await axiosInstance.get('/SuperAdmin/metrics');
      
      console.log('13. Response status:', response.status);
      console.log('14. Response headers:', response.headers);
      console.log('15. Response data:', response.data);
      
      if (response.data && response.data.success) {
        console.log('16. Success! Metrics fetched');
        return {
          success: true,
          data: response.data.data
        };
      }
      
      console.log('16. Response indicated failure');
      return {
        success: false,
        message: response.data?.message || 'Failed to fetch metrics'
      };
    } catch (error) {
      console.error('\n=== ERROR IN getSuperAdminMetrics ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response status text:', error.response.statusText);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received. Request:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Network error occurred'
      };
    }
  }

  // Create new SuperAdmin
  async createSuperAdmin(superAdminData) {
    console.log('\n=== createSuperAdmin called ===');
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/SuperAdmin', superAdminData);
      
      console.log('Create response:', response.data);
      return {
        success: true,
        data: response.data,
        message: 'SuperAdmin created successfully'
      };
    } catch (error) {
      console.error('Create superadmin error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create SuperAdmin'
      };
    }
  }

  // Get all SuperAdmins
  async getAllSuperAdmins() {
    console.log('\n=== getAllSuperAdmins called ===');
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/SuperAdmin');
      
      return {
        success: true,
        data: response.data,
        message: 'SuperAdmins fetched successfully'
      };
    } catch (error) {
      console.error('Get all superadmins error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch SuperAdmins'
      };
    }
  }

  // Get SuperAdmin by ID
  async getSuperAdminById(userId) {
    console.log('\n=== getSuperAdminById called for userId:', userId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/SuperAdmin/${userId}`);
      
      return {
        success: true,
        data: response.data,
        message: 'SuperAdmin fetched successfully'
      };
    } catch (error) {
      console.error('Get superadmin by id error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch SuperAdmin'
      };
    }
  }

  // Get SuperAdmin by Email
  async getSuperAdminByEmail(email) {
    console.log('\n=== getSuperAdminByEmail called for email:', email);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/SuperAdmin/email/${encodeURIComponent(email)}`);
      
      return {
        success: true,
        data: response.data,
        message: 'SuperAdmin fetched successfully'
      };
    } catch (error) {
      console.error('Get superadmin by email error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch SuperAdmin'
      };
    }
  }

  // Update SuperAdmin
  async updateSuperAdmin(userId, updateData) {
    console.log('\n=== updateSuperAdmin called for userId:', userId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/SuperAdmin/${userId}`, updateData);
      
      return {
        success: true,
        data: response.data,
        message: 'SuperAdmin updated successfully'
      };
    } catch (error) {
      console.error('Update superadmin error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update SuperAdmin'
      };
    }
  }

  // Delete SuperAdmin
  async deleteSuperAdmin(userId) {
    console.log('\n=== deleteSuperAdmin called for userId:', userId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/SuperAdmin/${userId}`);
      
      return {
        success: true,
        message: response.data?.message || 'SuperAdmin deleted successfully'
      };
    } catch (error) {
      console.error('Delete superadmin error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete SuperAdmin'
      };
    }
  }

  // Resend confirmation email
  async resendConfirmationEmail(userId) {
    console.log('\n=== resendConfirmationEmail called for userId:', userId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/SuperAdmin/${userId}/resend-confirmation`);
      
      return {
        success: true,
        message: response.data?.message || 'Confirmation email sent successfully'
      };
    } catch (error) {
      console.error('Resend confirmation email error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send confirmation email'
      };
    }
  }
}

// Export singleton instance
const superAdminMetricsService = new SuperAdminMetricsService();
export default superAdminMetricsService;

// Also export individual functions for backward compatibility
export const getMetrics = async () => {
  return await superAdminMetricsService.getSuperAdminMetrics();
};

export const createSuperAdmin = async (data) => {
  return await superAdminMetricsService.createSuperAdmin(data);
};

export const getAllSuperAdmins = async () => {
  return await superAdminMetricsService.getAllSuperAdmins();
};

export const getSuperAdminById = async (userId) => {
  return await superAdminMetricsService.getSuperAdminById(userId);
};

export const getSuperAdminByEmail = async (email) => {
  return await superAdminMetricsService.getSuperAdminByEmail(email);
};

export const updateSuperAdmin = async (userId, data) => {
  return await superAdminMetricsService.updateSuperAdmin(userId, data);
};

export const deleteSuperAdmin = async (userId) => {
  return await superAdminMetricsService.deleteSuperAdmin(userId);
};

export const resendConfirmationEmail = async (userId) => {
  return await superAdminMetricsService.resendConfirmationEmail(userId);
};