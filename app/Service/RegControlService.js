// Service/RegistrationControlService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class RegistrationControlService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  /**
   * Create or update registration control (single configuration per school)
   * POST /api/RegistrationControl
   * @param {Object} data - { startDate, endDate, isOpen }
   */
  async createOrUpdateControl(data) {
    console.log("createOrUpdateControl called with:", data);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/RegistrationControl', data);
      console.log("Create/Update control response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Registration control saved successfully'
      };
    } catch (error) {
      console.error("Create/Update control error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to save registration control'
      };
    }
  }

  /**
   * Get the registration control configuration
   * GET /api/RegistrationControl
   */
  async getControl() {
    console.log("getControl called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/RegistrationControl');
      console.log("Get control response:", response.data);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Registration control fetched successfully'
      };
    } catch (error) {
      console.error("Get control error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch registration control',
        data: null
      };
    }
  }

  /**
   * Toggle registration open/close
   * PATCH /api/RegistrationControl/toggle
   * @param {boolean} isOpen - Whether registration should be open
   */
  async toggleRegistration(isOpen) {
    console.log("toggleRegistration called with:", isOpen);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.patch('/RegistrationControl/toggle', { isOpen });
      console.log("Toggle registration response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || `Registration ${isOpen ? 'opened' : 'closed'} successfully`
      };
    } catch (error) {
      console.error("Toggle registration error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to toggle registration'
      };
    }
  }

  /**
   * Check if registration is currently open (for students)
   * GET /api/RegistrationControl/status
   */
  async checkRegistrationStatus() {
    console.log("checkRegistrationStatus called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/RegistrationControl/status');
      console.log("Check registration status response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Registration status fetched successfully'
      };
    } catch (error) {
      console.error("Check registration status error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check registration status'
      };
    }
  }
}

// Export singleton instance
const registrationControlService = new RegistrationControlService();
export default registrationControlService;

// Export individual functions for backward compatibility
export const createOrUpdateControl = async (data) => {
  return await registrationControlService.createOrUpdateControl(data);
};

export const getControl = async () => {
  return await registrationControlService.getControl();
};

export const toggleRegistration = async (isOpen) => {
  return await registrationControlService.toggleRegistration(isOpen);
};

export const checkRegistrationStatus = async () => {
  return await registrationControlService.checkRegistrationStatus();
};