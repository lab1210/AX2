// Service/PaymentService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class PaymentService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // ==================== PAYSTACK CONFIGURATION ====================

  /**
   * Get Paystack configuration for school
   * GET /api/Payment/config
   */
  async getPaystackConfig() {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Payment/config');
      return {
        success: true,
        data: response.data,
        message: 'Paystack config fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch Paystack config'
      };
    }
  }

  /**
   * Update Paystack configuration for school
   * PUT /api/Payment/config
   * @param {Object} data - { paystackPublicKey, paystackSecretKey }
   */
  async updatePaystackConfig(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put('/Payment/config', data);
      return {
        success: true,
        message: response.data.message || 'Paystack config updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update Paystack config'
      };
    }
  }

  // ==================== FEE CATEGORY MANAGEMENT ====================

  /**
   * Create fee category
   * POST /api/Fee/categories
   * @param {Object} data - { name, description, type, scope }
   */
  async createFeeCategory(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/Fee/categories', data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Fee category created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create fee category'
      };
    }
  }

  /**
   * Get all fee categories
   * GET /api/Fee/categories
   */
  async getFeeCategories() {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Fee/categories');
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Fee categories fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch fee categories',
        data: []
      };
    }
  }

  // ==================== FEE STRUCTURE MANAGEMENT ====================

  /**
   * Create fee structure
   * POST /api/Fee/structures
   * @param {Object} data - { feeCategoryId, classYearId?, termId, amount, dueDate? }
   */
  async createFeeStructure(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/Fee/structures', data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Fee structure created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create fee structure'
      };
    }
  }

  /**
   * Get all fee structures
   * GET /api/Fee/structures
   * @param {string} termId - Optional term ID
   */
  async getFeeStructures(termId = null) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = termId ? { termId } : {};
      const response = await axiosInstance.get('/Fee/structures', { params });
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Fee structures fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch fee structures',
        data: []
      };
    }
  }

  // ==================== FEE ACCOUNT MANAGEMENT ====================

  /**
   * Generate compulsory fee accounts
   * POST /api/Fee/generate/{termId}
   * @param {string} termId - Term ID
   */
  async generateCompulsoryAccounts(termId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/Fee/generate/${termId}`);
      return {
        success: true,
        message: response.data.message || 'Compulsory accounts generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate compulsory accounts'
      };
    }
  }

  /**
   * Sync compulsory fee amounts
   * POST /api/Fee/sync/{termId}
   * @param {string} termId - Term ID
   */
  async syncCompulsoryAmounts(termId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/Fee/sync/${termId}`);
      return {
        success: true,
        message: response.data.message || 'Compulsory amounts synced successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to sync compulsory amounts'
      };
    }
  }

  // ==================== STUDENT VIEWS ====================

  /**
   * Get student fee summary for a term
   * GET /api/Payment/my-fees/term/{termId}
   * @param {string} termId - Term ID
   */
  async getMyFeesForTerm(termId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Payment/my-fees/term/${termId}`);
      return {
        success: true,
        data: response.data,
        message: 'Fee summary fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch fee summary'
      };
    }
  }

  /**
   * Get all terms fee summary for student
   * GET /api/Payment/my-fees/all
   */
  async getAllMyFees() {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Payment/my-fees/all');
      return {
        success: true,
        data: response.data,
        message: 'All fees fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch all fees'
      };
    }
  }

  /**
   * Get available optional fees
   * GET /api/Payment/optional-fees/available
   * @param {string} termId - Term ID
   */
  async getAvailableOptionalFees(termId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Payment/optional-fees/available', { params: { termId } });
      return {
        success: true,
        data: response.data,
        message: 'Optional fees fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch optional fees'
      };
    }
  }

  // ==================== ADMIN VIEWS ====================

  /**
   * Get all payment history (Admin only)
   * GET /api/Payment/admin/payment-history
   * @param {Object} filters - { termId?, classYearId?, studentId?, fromDate?, toDate?, page?, pageSize? }
   */
  async getAllPaymentHistory(filters = {}) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (filters.termId) params.termId = filters.termId;
      if (filters.classYearId) params.classYearId = filters.classYearId;
      if (filters.studentId) params.studentId = filters.studentId;
      if (filters.fromDate) params.fromDate = filters.fromDate;
      if (filters.toDate) params.toDate = filters.toDate;
      if (filters.page) params.page = filters.page;
      if (filters.pageSize) params.pageSize = filters.pageSize;
      
      const response = await axiosInstance.get('/Payment/admin/payment-history', { params });
      return {
        success: true,
        data: response.data.payments || [],
        count: response.data.count || 0,
        page: response.data.page,
        pageSize: response.data.pageSize,
        message: 'Payment history fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch payment history',
        data: []
      };
    }
  }

  /**
   * Get student payment history (Admin only)
   * GET /api/Payment/admin/student-payments/{studentId}
   * @param {string} studentId - Student ID
   * @param {string} termId - Optional term ID
   */
  async getStudentPaymentHistory(studentId, termId = null) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = termId ? { termId } : {};
      const response = await axiosInstance.get(`/Payment/admin/student-payments/${studentId}`, { params });
      return {
        success: true,
        data: response.data,
        message: 'Student payment history fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch student payment history'
      };
    }
  }

  // ==================== PAYMENTS ====================

  /**
   * Initialize compulsory payment
   * POST /api/Payment/pay/compulsory
   * @param {Object} data - { amount }
   */
  async payCompulsoryFees(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/Payment/pay/compulsory', data);
      return {
        success: true,
        data: response.data,
        message: 'Payment initialized successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to initialize payment'
      };
    }
  }

  /**
   * Initialize optional payment
   * POST /api/Payment/pay/optional
   * @param {Object} data - { optionalFeeIds }
   */
  async payOptionalFees(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/Payment/pay/optional', data);
      return {
        success: true,
        data: response.data,
        message: 'Payment initialized successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to initialize payment'
      };
    }
  }

  // ==================== RECEIPTS ====================

  /**
   * Get payment receipt
   * GET /api/Payment/receipt/{reference}
   * @param {string} reference - Payment reference
   */
  async getPaymentReceipt(reference) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Payment/receipt/${reference}`);
      return {
        success: true,
        data: response.data,
        message: 'Receipt fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch receipt'
      };
    }
  }

  // ==================== SUBSCRIPTION PAYMENTS ====================

  /**
   * Initialize subscription payment
   * POST /api/SubscriptionPayment/initialize
   * @param {string} subscriptionId - Subscription ID
   */
  async initializeSubscriptionPayment(subscriptionId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/SubscriptionPayment/initialize', { subscriptionId });
      return {
        success: true,
        data: response.data,
        message: 'Subscription payment initialized successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to initialize subscription payment'
      };
    }
  }

  /**
   * Verify subscription payment
   * GET /api/SubscriptionPayment/verify
   * @param {string} reference - Payment reference
   */
  async verifySubscriptionPayment(reference) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/SubscriptionPayment/verify', { params: { reference } });
      return {
        success: true,
        data: response.data,
        message: 'Payment verified successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to verify payment'
      };
    }
  }

  /**
   * Get subscription receipt
   * GET /api/SubscriptionPayment/receipt/{subscriptionId}
   * @param {string} subscriptionId - Subscription ID
   */
  async getSubscriptionReceipt(subscriptionId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/SubscriptionPayment/receipt/${subscriptionId}`);
      return {
        success: true,
        data: response.data,
        message: 'Receipt fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch receipt'
      };
    }
  }
}

// Export singleton instance
const paymentService = new PaymentService();
export default paymentService;

// Export individual functions for backward compatibility
export const getPaystackConfig = () => paymentService.getPaystackConfig();
export const updatePaystackConfig = (data) => paymentService.updatePaystackConfig(data);
export const createFeeCategory = (data) => paymentService.createFeeCategory(data);
export const getFeeCategories = () => paymentService.getFeeCategories();
export const createFeeStructure = (data) => paymentService.createFeeStructure(data);
export const getFeeStructures = (termId) => paymentService.getFeeStructures(termId);
export const generateCompulsoryAccounts = (termId) => paymentService.generateCompulsoryAccounts(termId);
export const syncCompulsoryAmounts = (termId) => paymentService.syncCompulsoryAmounts(termId);
export const getMyFeesForTerm = (termId) => paymentService.getMyFeesForTerm(termId);
export const getAllMyFees = () => paymentService.getAllMyFees();
export const getAvailableOptionalFees = (termId) => paymentService.getAvailableOptionalFees(termId);
export const payCompulsoryFees = (data) => paymentService.payCompulsoryFees(data);
export const payOptionalFees = (data) => paymentService.payOptionalFees(data);
export const getPaymentReceipt = (reference) => paymentService.getPaymentReceipt(reference);
export const initializeSubscriptionPayment = (subscriptionId) => paymentService.initializeSubscriptionPayment(subscriptionId);
export const verifySubscriptionPayment = (reference) => paymentService.verifySubscriptionPayment(reference);
export const getSubscriptionReceipt = (subscriptionId) => paymentService.getSubscriptionReceipt(subscriptionId);
export const getAllPaymentHistory = (filters) => paymentService.getAllPaymentHistory(filters);
export const getStudentPaymentHistory = (studentId, termId) => paymentService.getStudentPaymentHistory(studentId, termId);