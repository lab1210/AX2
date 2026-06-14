// Service/SubscriptionService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class SubscriptionService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // ==================== SUPER ADMIN ENDPOINTS ====================

  // Create a new subscription
  async createSubscription(subscriptionData) {
    console.log("createSubscription called with:", subscriptionData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/Subscription', subscriptionData);
      console.log("Create subscription response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Subscription created successfully'
      };
    } catch (error) {
      console.error("Create subscription error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create subscription'
      };
    }
  }

  // Get all subscriptions with optional search
  async getAllSubscriptions(search = '') {
    console.log("getAllSubscriptions called with search:", search);
    try {
      const axiosInstance = this.getAxiosInstance();
      const url = search ? `/Subscription?search=${encodeURIComponent(search)}` : '/Subscription';
      const response = await axiosInstance.get(url);
      console.log("Get all subscriptions response:", response.data);
      return {
        success: true,
        data: response.data.subscriptions || [],
        count: response.data.count || 0,
        searchTerm: response.data.searchTerm
      };
    } catch (error) {
      console.error("Get all subscriptions error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch subscriptions'
      };
    }
  }

  // Get subscription by ID
  async getSubscriptionById(subscriptionId) {
    console.log("getSubscriptionById called for id:", subscriptionId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Subscription/${subscriptionId}`);
      console.log("Get subscription by id response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Subscription fetched successfully'
      };
    } catch (error) {
      console.error("Get subscription by id error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch subscription'
      };
    }
  }

  // Get subscription by school ID
  async getSubscriptionBySchoolId(schoolId) {
    console.log("getSubscriptionBySchoolId called for schoolId:", schoolId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Subscription/school/${schoolId}`);
      console.log("Get subscription by school id response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Subscription fetched successfully'
      };
    } catch (error) {
      console.error("Get subscription by school id error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch subscription'
      };
    }
  }

  // Update subscription amount (PATCH)
  async patchSubscriptionAmount(subscriptionId, amountData) {
    console.log("patchSubscriptionAmount called for id:", subscriptionId, "with data:", amountData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.patch(`/Subscription/${subscriptionId}/amount`, amountData);
      console.log("Patch subscription amount response:", response.data);
      return {
        success: true,
        data: response.data.subscription,
        message: response.data.message || 'Subscription amount updated successfully'
      };
    } catch (error) {
      console.error("Patch subscription amount error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update subscription amount'
      };
    }
  }

  // Delete subscription
  async deleteSubscription(subscriptionId) {
    console.log("deleteSubscription called for id:", subscriptionId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/Subscription/${subscriptionId}`);
      console.log("Delete subscription response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Subscription deleted successfully'
      };
    } catch (error) {
      console.error("Delete subscription error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete subscription'
      };
    }
  }

  // Activate subscription
  async activateSubscription(subscriptionId) {
    console.log("activateSubscription called for id:", subscriptionId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/Subscription/${subscriptionId}/activate`);
      console.log("Activate subscription response:", response.data);
      return {
        success: true,
        data: response.data.subscription,
        message: response.data?.message || 'Subscription activated successfully'
      };
    } catch (error) {
      console.error("Activate subscription error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to activate subscription'
      };
    }
  }

  // Deactivate subscription
  async deactivateSubscription(subscriptionId) {
    console.log("deactivateSubscription called for id:", subscriptionId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/Subscription/${subscriptionId}/deactivate`);
      console.log("Deactivate subscription response:", response.data);
      return {
        success: true,
        data: response.data.subscription,
        message: response.data?.message || 'Subscription deactivated successfully'
      };
    } catch (error) {
      console.error("Deactivate subscription error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to deactivate subscription'
      };
    }
  }

  // Get active subscriptions
  async getActiveSubscriptions() {
    console.log("getActiveSubscriptions called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Subscription/status/active');
      console.log("Get active subscriptions response:", response.data);
      return {
        success: true,
        data: response.data.subscriptions || [],
        count: response.data.count || 0,
        status: response.data.status
      };
    } catch (error) {
      console.error("Get active subscriptions error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch active subscriptions'
      };
    }
  }

  // Get expired/inactive subscriptions
  async getExpiredSubscriptions() {
    console.log("getExpiredSubscriptions called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Subscription/status/expired');
      console.log("Get expired subscriptions response:", response.data);
      return {
        success: true,
        data: response.data.subscriptions || [],
        count: response.data.count || 0,
        status: response.data.status
      };
    } catch (error) {
      console.error("Get expired subscriptions error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch expired subscriptions'
      };
    }
  }

  // Generate bill for subscription
  async generateBill(subscriptionId) {
    console.log("generateBill called for id:", subscriptionId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Subscription/${subscriptionId}/bill`);
      console.log("Generate bill response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Bill generated successfully'
      };
    } catch (error) {
      console.error("Generate bill error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate bill'
      };
    }
  }

  // Send bill to school email
  async sendBillToSchool(subscriptionId) {
    console.log("sendBillToSchool called for id:", subscriptionId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/Subscription/${subscriptionId}/send-bill`);
      console.log("Send bill response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Bill sent to school email successfully'
      };
    } catch (error) {
      console.error("Send bill error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send bill'
      };
    }
  }

  // ==================== SCHOOL ADMIN ENDPOINTS ====================

  /**
   * Get current school's subscription (SchoolAdmin only)
   * GET /api/Subscription/my-subscription
   */
  async getCurrentSubscription() {
    console.log("getCurrentSubscription called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Subscription/my-subscription');
      console.log("Get current subscription response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Subscription fetched successfully'
      };
    } catch (error) {
      console.error("Get current subscription error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'No subscription found',
        data: null
      };
    }
  }

  /**
   * Get current school's bill (SchoolAdmin only)
   * GET /api/Subscription/my-bill
   */
  async getMyBill() {
    console.log("getMyBill called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Subscription/my-bill');
      console.log("Get my bill response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Bill fetched successfully'
      };
    } catch (error) {
      console.error("Get my bill error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch bill'
      };
    }
  }

  /**
   * Get current school's receipt (SchoolAdmin only)
   * GET /api/Subscription/my-receipt
   */
  async getMyReceipt() {
    console.log("getMyReceipt called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Subscription/my-receipt');
      console.log("Get my receipt response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Receipt fetched successfully'
      };
    } catch (error) {
      console.error("Get my receipt error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch receipt'
      };
    }
  }

  /**
   * Get current school's subscription status (SchoolAdmin only)
   * GET /api/Subscription/my-status
   */
  async getMySubscriptionStatus() {
    console.log("getMySubscriptionStatus called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Subscription/my-status');
      console.log("Get subscription status response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Subscription status fetched successfully'
      };
    } catch (error) {
      console.error("Get subscription status error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch subscription status'
      };
    }
  }
}

// Export singleton instance
const subscriptionService = new SubscriptionService();
export default subscriptionService;

// Export individual functions for backward compatibility
// Super Admin exports
export const createSubscription = async (data) => {
  return await subscriptionService.createSubscription(data);
};

export const getAllSubscriptions = async (search = '') => {
  return await subscriptionService.getAllSubscriptions(search);
};

export const getSubscriptionById = async (subscriptionId) => {
  return await subscriptionService.getSubscriptionById(subscriptionId);
};

export const getSubscriptionBySchoolId = async (schoolId) => {
  return await subscriptionService.getSubscriptionBySchoolId(schoolId);
};

export const patchSubscriptionAmount = async (subscriptionId, amountData) => {
  return await subscriptionService.patchSubscriptionAmount(subscriptionId, amountData);
};

export const deleteSubscription = async (subscriptionId) => {
  return await subscriptionService.deleteSubscription(subscriptionId);
};

export const activateSubscription = async (subscriptionId) => {
  return await subscriptionService.activateSubscription(subscriptionId);
};

export const deactivateSubscription = async (subscriptionId) => {
  return await subscriptionService.deactivateSubscription(subscriptionId);
};

export const getActiveSubscriptions = async () => {
  return await subscriptionService.getActiveSubscriptions();
};

export const getExpiredSubscriptions = async () => {
  return await subscriptionService.getExpiredSubscriptions();
};

export const generateBill = async (subscriptionId) => {
  return await subscriptionService.generateBill(subscriptionId);
};

export const sendBillToSchool = async (subscriptionId) => {
  return await subscriptionService.sendBillToSchool(subscriptionId);
};

// School Admin exports
export const getCurrentSubscription = async () => {
  return await subscriptionService.getCurrentSubscription();
};

export const getMyBill = async () => {
  return await subscriptionService.getMyBill();
};

export const getMyReceipt = async () => {
  return await subscriptionService.getMyReceipt();
};

export const getMySubscriptionStatus = async () => {
  return await subscriptionService.getMySubscriptionStatus();
};