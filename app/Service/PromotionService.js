// Service/PromotionService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class PromotionService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // ==================== PROMOTION CRITERIA (Admin only) ====================

  /**
   * Create promotion criteria
   * POST /api/Promotion/criteria
   * @param {Object} data - { classArmDepartmentId, minPercentage, description? }
   */
  async createCriteria(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/Promotion/criteria', data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Promotion criteria created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create promotion criteria'
      };
    }
  }

  /**
   * Update promotion criteria
   * PUT /api/Promotion/criteria/{criteriaId}
   * @param {string} criteriaId - Criteria ID
   * @param {Object} data - { minPercentage?, description?, isActive? }
   */
  async updateCriteria(criteriaId, data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/Promotion/criteria/${criteriaId}`, data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Promotion criteria updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update promotion criteria'
      };
    }
  }

  /**
   * Get all promotion criteria
   * GET /api/Promotion/criteria
   * @param {boolean} isActive - Optional filter by active status
   */
  async getAllCriteria(isActive = null) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (isActive !== null) params.isActive = isActive;
      const response = await axiosInstance.get('/Promotion/criteria', { params });
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Promotion criteria fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch promotion criteria',
        data: []
      };
    }
  }

  /**
   * Get promotion criteria by ID
   * GET /api/Promotion/criteria/{criteriaId}
   * @param {string} criteriaId - Criteria ID
   */
  async getCriteriaById(criteriaId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Promotion/criteria/${criteriaId}`);
      return {
        success: true,
        data: response.data,
        message: 'Promotion criteria fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch promotion criteria'
      };
    }
  }

  /**
   * Delete promotion criteria
   * DELETE /api/Promotion/criteria/{criteriaId}
   * @param {string} criteriaId - Criteria ID
   */
  async deleteCriteria(criteriaId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/Promotion/criteria/${criteriaId}`);
      return {
        success: true,
        message: response.data.message || 'Promotion criteria deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete promotion criteria'
      };
    }
  }

  // ==================== PROMOTION ELIGIBILITY ====================

  /**
   * Get class promotion eligibility
   * GET /api/Promotion/eligibility/class/{classArmId}/session/{sessionId}
   * @param {string} classArmId - Class arm ID
   * @param {string} sessionId - Session ID
   */
  async getClassPromotionEligibility(classArmId, sessionId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Promotion/eligibility/class/${classArmId}/session/${sessionId}`);
      return {
        success: true,
        data: response.data,
        message: 'Promotion eligibility fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch promotion eligibility'
      };
    }
  }

  /**
   * Get student eligibility
   * GET /api/Promotion/eligibility/student/{studentId}/session/{sessionId}
   * @param {string} studentId - Student ID
   * @param {string} sessionId - Session ID
   */
  async getStudentEligibility(studentId, sessionId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Promotion/eligibility/student/${studentId}/session/${sessionId}`);
      return {
        success: true,
        data: response.data,
        message: 'Student eligibility fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch student eligibility'
      };
    }
  }

  // ==================== PROMOTION ACTIONS ====================

  /**
   * Promote students in batch
   * POST /api/Promotion/promote/batch
   * @param {Object} data - { fromClassArmId, toClassArmId, sessionId, studentIds?, promoteAllEligible?, remarks? }
   */
  async promoteStudentsBatch(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/Promotion/promote/batch', data);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Students promoted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to promote students'
      };
    }
  }

  /**
   * Promote single student manually
   * POST /api/Promotion/promote/manual
   * @param {Object} data - { studentId, fromClassArmId, toClassArmId?, sessionId, finalPercentage, remarks? }
   */
  async promoteStudentManually(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/Promotion/promote/manual', data);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Student promoted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to promote student'
      };
    }
  }

  // ==================== PROMOTION HISTORY ====================

  /**
   * Get promotion history by student
   * GET /api/Promotion/history/student/{studentId}
   * @param {string} studentId - Student ID
   */
  async getPromotionHistoryByStudent(studentId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Promotion/history/student/${studentId}`);
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Promotion history fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch promotion history',
        data: []
      };
    }
  }

  /**
   * Get promotion history by class
   * GET /api/Promotion/history/class/{classArmId}/session/{sessionId}
   * @param {string} classArmId - Class arm ID
   * @param {string} sessionId - Session ID
   */
  async getPromotionHistoryByClass(classArmId, sessionId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Promotion/history/class/${classArmId}/session/${sessionId}`);
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Promotion history fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch promotion history',
        data: []
      };
    }
  }

  /**
   * Get promotion history by session
   * GET /api/Promotion/history/session/{sessionId}
   * @param {string} sessionId - Session ID
   */
  async getPromotionHistoryBySession(sessionId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Promotion/history/session/${sessionId}`);
      return {
        success: true,
        data: response.data,
        message: 'Promotion history fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch promotion history'
      };
    }
  }

  /**
   * Revert promotion
   * POST /api/Promotion/revert/{promotionId}
   * @param {string} promotionId - Promotion ID
   */
  async revertPromotion(promotionId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/Promotion/revert/${promotionId}`);
      return {
        success: true,
        message: response.data.message || 'Promotion reverted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to revert promotion'
      };
    }
  }
}

// Export singleton instance
const promotionService = new PromotionService();
export default promotionService;

// Export individual functions for backward compatibility
// Promotion Criteria
export const createCriteria = (data) => promotionService.createCriteria(data);
export const updateCriteria = (criteriaId, data) => promotionService.updateCriteria(criteriaId, data);
export const getAllCriteria = (isActive) => promotionService.getAllCriteria(isActive);
export const getCriteriaById = (criteriaId) => promotionService.getCriteriaById(criteriaId);
export const deleteCriteria = (criteriaId) => promotionService.deleteCriteria(criteriaId);

// Promotion Eligibility
export const getClassPromotionEligibility = (classArmId, sessionId) => promotionService.getClassPromotionEligibility(classArmId, sessionId);
export const getStudentEligibility = (studentId, sessionId) => promotionService.getStudentEligibility(studentId, sessionId);

// Promotion Actions
export const promoteStudentsBatch = (data) => promotionService.promoteStudentsBatch(data);
export const promoteStudentManually = (data) => promotionService.promoteStudentManually(data);

// Promotion History
export const getPromotionHistoryByStudent = (studentId) => promotionService.getPromotionHistoryByStudent(studentId);
export const getPromotionHistoryByClass = (classArmId, sessionId) => promotionService.getPromotionHistoryByClass(classArmId, sessionId);
export const getPromotionHistoryBySession = (sessionId) => promotionService.getPromotionHistoryBySession(sessionId);
export const revertPromotion = (promotionId) => promotionService.revertPromotion(promotionId);