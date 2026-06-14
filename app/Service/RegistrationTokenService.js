// Service/RegTokenService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class RegTokenService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // ==================== TOKEN GENERATION ====================

  /**
   * Generate tokens from Excel file (bulk upload)
   * POST /api/Token/bulk-upload/{schoolId}
   * @param {string} schoolId - UUID of the school
   * @param {File} file - Excel file to upload
   * @param {Object} options - { type, expiresAt, sendEmails }
   */
  async bulkUploadTokens(schoolId, file, options = {}) {
    console.log("bulkUploadTokens called with schoolId:", schoolId, "options:", options);
    try {
      const token = authService.getAccessToken();
      const formData = new FormData();
      formData.append('file', file);
      
      // Add query parameters
      const params = new URLSearchParams();
      if (options.type) params.append('type', options.type);
      if (options.expiresAt) params.append('expiresAt', options.expiresAt);
      if (options.sendEmails !== undefined) params.append('sendEmails', options.sendEmails);
      
      const url = `${this.baseURL}/Token/bulk-upload/${schoolId}?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      console.log("Bulk upload response:", data);
      
      if (response.ok) {
        return {
          success: true,
          data: data,
          message: data.message || 'Tokens generated successfully'
        };
      }
      
      return {
        success: false,
        message: data.message || 'Failed to generate tokens',
        errors: data.errors || [],
        errorRows: data.errorRows || []
      };
    } catch (error) {
      console.error("Bulk upload error:", error);
      return {
        success: false,
        message: error.message || 'Failed to process bulk upload'
      };
    }
  }

  /**
   * Generate tokens manually (form input - bulk)
   * POST /api/Token/manual/{schoolId}
   * @param {string} schoolId - UUID of the school
   * @param {Object} data - { type, expiresAt, sendEmails, recipients }
   */
  async generateTokensManually(schoolId, data) {
    console.log("generateTokensManually called with schoolId:", schoolId, "data:", data);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/Token/manual/${schoolId}`, data);
      console.log("Manual token generation response:", response.data);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Tokens generated successfully'
      };
    } catch (error) {
      console.error("Manual token generation error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate tokens'
      };
    }
  }

  /**
   * Generate single token (simple form)
   * POST /api/Token/single/{schoolId}
   * @param {string} schoolId - UUID of the school
   * @param {Object} data - { type, email, firstName, lastName, phoneNumber, expiresAt, sendEmail }
   */
  async generateSingleToken(schoolId, data) {
    console.log("generateSingleToken called with schoolId:", schoolId, "data:", data);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/Token/single/${schoolId}`, data);
      console.log("Single token generation response:", response.data);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Token generated successfully'
      };
    } catch (error) {
      console.error("Single token generation error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate token'
      };
    }
  }

  /**
   * Download Excel template for bulk token generation
   * GET /api/Token/template/{type}
   * @param {string} type - 'Student' or 'Teacher'
   */
  async downloadTemplate(type) {
    console.log("downloadTemplate called for type:", type);
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${this.baseURL}/Token/template/${type}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to download template');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'Student' ? 'Student_Token_Template.xlsx' : 'Teacher_Token_Template.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      return {
        success: true,
        message: 'Template downloaded successfully'
      };
    } catch (error) {
      console.error("Download template error:", error);
      return {
        success: false,
        message: error.message || 'Failed to download template'
      };
    }
  }

  // ==================== TOKEN VALIDATION ====================

  /**
   * Get token info (for validation before registration)
   * GET /api/Token/info/{token}
   * @param {string} token - Registration token
   */
  async getTokenInfo(token) {
    console.log("getTokenInfo called for token:", token);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Token/info/${token}`);
      console.log("Token info response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Token info fetched successfully'
      };
    } catch (error) {
      console.error("Get token info error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch token info'
      };
    }
  }

  /**
   * Validate token and email (for self-registration)
   * GET /api/Token/validate
   * @param {string} token - Registration token
   * @param {string} email - User's email
   */
  async validateTokenAndEmail(token, email) {
    console.log("validateTokenAndEmail called for token:", token, "email:", email);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Token/validate', {
        params: { token, email }
      });
      console.log("Token validation response:", response.data);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Token is valid'
      };
    } catch (error) {
      console.error("Token validation error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid token',
        data: error.response?.data
      };
    }
  }

  // ==================== TOKEN MANAGEMENT ====================

  /**
   * Get all tokens for a school
   * GET /api/Token/school/{schoolId}
   * @param {string} schoolId - UUID of the school
   * @param {Object} filters - { type?, status? }
   */
  async getSchoolTokens(schoolId, filters = {}) {
    console.log("getSchoolTokens called for schoolId:", schoolId, "filters:", filters);
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      
      const response = await axiosInstance.get(`/Token/school/${schoolId}`, { params });
      console.log("Get school tokens response:", response.data);
      return {
        success: true,
        data: response.data.tokens || [],
        count: response.data.count || 0,
        type: response.data.type,
        status: response.data.status,
        message: 'Tokens fetched successfully'
      };
    } catch (error) {
      console.error("Get school tokens error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch tokens',
        data: []
      };
    }
  }

  /**
   * Get token statistics
   * GET /api/Token/stats/{schoolId}
   * @param {string} schoolId - UUID of the school
   */
  async getTokenStats(schoolId) {
    console.log("getTokenStats called for schoolId:", schoolId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Token/stats/${schoolId}`);
      console.log("Token stats response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Token stats fetched successfully'
      };
    } catch (error) {
      console.error("Get token stats error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch token stats'
      };
    }
  }

  /**
   * Revoke a token
   * DELETE /api/Token/revoke/{token}
   * @param {string} token - Registration token
   */
  async revokeToken(token) {
    console.log("revokeToken called for token:", token);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/Token/revoke/${token}`);
      console.log("Revoke token response:", response.data);
      return {
        success: true,
        message: response.data.message || 'Token revoked successfully'
      };
    } catch (error) {
      console.error("Revoke token error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to revoke token'
      };
    }
  }
// In RegTokenService.js - Add this method

/**
 * Get registration info including school and class data for self-registration
 * GET /api/Token/registration-info/{token}
 * @param {string} token - Registration token
 */
async getRegistrationInfo(token) {
  console.log("getRegistrationInfo called for token:", token);
  try {
    const response = await fetch(`${this.baseURL}/Token/registration-info/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log("Registration info response:", data);
    
    if (response.ok) {
      return {
        success: true,
        data: data,
        message: 'Registration info fetched successfully'
      };
    }
    
    return {
      success: false,
      message: data.message || 'Failed to fetch registration info',
      data: null
    };
  } catch (error) {
    console.error("Get registration info error:", error);
    return {
      success: false,
      message: error.message || 'Network error occurred',
      data: null
    };
  }
}
  // ==================== HELPER METHODS ====================

  /**
   * Get token status badge color
   * @param {string} status - Token status
   */
  getTokenStatusColor(status) {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Used':
        return 'bg-blue-100 text-blue-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Revoked':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get token type badge color
   * @param {string} type - Token type
   */
  getTokenTypeColor(type) {
    switch (type) {
      case 'Student':
        return 'bg-purple-100 text-purple-800';
      case 'Teacher':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   */
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  /**
   * Check if token is expired
   * @param {string} expiresAt - Expiration date
   */
  isTokenExpired(expiresAt) {
    return new Date(expiresAt) < new Date();
  }
}

// Export singleton instance
const regTokenService = new RegTokenService();
export default regTokenService;

// Export individual functions for backward compatibility
export const bulkUploadTokens = async (schoolId, file, options) => {
  return await regTokenService.bulkUploadTokens(schoolId, file, options);
};

export const generateTokensManually = async (schoolId, data) => {
  return await regTokenService.generateTokensManually(schoolId, data);
};

export const generateSingleToken = async (schoolId, data) => {
  return await regTokenService.generateSingleToken(schoolId, data);
};

export const downloadTemplate = async (type) => {
  return await regTokenService.downloadTemplate(type);
};

export const getTokenInfo = async (token) => {
  return await regTokenService.getTokenInfo(token);
};

export const validateTokenAndEmail = async (token, email) => {
  return await regTokenService.validateTokenAndEmail(token, email);
};


export const getSchoolTokens = async (schoolId, filters) => {
  return await regTokenService.getSchoolTokens(schoolId, filters);
};

export const getTokenStats = async (schoolId) => {
  return await regTokenService.getTokenStats(schoolId);
};

export const revokeToken = async (token) => {
  return await regTokenService.revokeToken(token);
};
export const getRegistrationInfo = async (token) => {
  return await regTokenService.getRegistrationInfo(token);
};