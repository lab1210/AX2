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
}

// Export singleton instance
const subscriptionService = new SubscriptionService();
export default subscriptionService;

// Export individual functions for backward compatibility
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