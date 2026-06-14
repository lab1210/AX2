// Service/ComplianceService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class ComplianceService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // Create a new compliance record
  async createCompliance(complianceData) {
    console.log("createCompliance called with:", complianceData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/Compliance', complianceData);
      console.log("Create compliance response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Compliance record created successfully'
      };
    } catch (error) {
      console.error("Create compliance error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create compliance record'
      };
    }
  }

  // Get all compliance records with optional search
  async getAllCompliance(search = '') {
    console.log("getAllCompliance called with search:", search);
    try {
      const axiosInstance = this.getAxiosInstance();
      const url = search ? `/Compliance?search=${encodeURIComponent(search)}` : '/Compliance';
      const response = await axiosInstance.get(url);
      console.log("Get all compliance response:", response.data);
      return {
        success: true,
        data: response.data.complianceRecords || [],
        count: response.data.count || 0,
        searchTerm: response.data.searchTerm
      };
    } catch (error) {
      console.error("Get all compliance error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch compliance records'
      };
    }
  }

  // Get compliance by ID
  async getComplianceById(id) {
    console.log("getComplianceById called for id:", id);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Compliance/${id}`);
      console.log("Get compliance by id response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Compliance record fetched successfully'
      };
    } catch (error) {
      console.error("Get compliance by id error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch compliance record'
      };
    }
  }

  // Get compliance by school ID
  async getComplianceBySchoolId(schoolId) {
    console.log("getComplianceBySchoolId called for schoolId:", schoolId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Compliance/school/${schoolId}`);
      console.log("Get compliance by school id response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Compliance record fetched successfully'
      };
    } catch (error) {
      console.error("Get compliance by school id error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch compliance record'
      };
    }
  }

  // Update compliance record
  async updateCompliance(id, updateData) {
    console.log("updateCompliance called for id:", id, "with data:", updateData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/Compliance/${id}`, updateData);
      console.log("Update compliance response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Compliance record updated successfully'
      };
    } catch (error) {
      console.error("Update compliance error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update compliance record'
      };
    }
  }

  // Approve or reject compliance
  async approveCompliance(id, isApproved, rejectionReason = null) {
    console.log("approveCompliance called for id:", id, "isApproved:", isApproved);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/Compliance/${id}/approve`, {
        isApproved: isApproved,
        rejectionReason: rejectionReason
      });
      console.log("Approve compliance response:", response.data);
      return {
        success: true,
        data: response.data.compliance,
        message: response.data.message || (isApproved ? 'Compliance approved successfully' : 'Compliance rejected')
      };
    } catch (error) {
      console.error("Approve compliance error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to process compliance'
      };
    }
  }

  // Delete compliance record
  async deleteCompliance(id) {
    console.log("deleteCompliance called for id:", id);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/Compliance/${id}`);
      console.log("Delete compliance response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Compliance record deleted successfully'
      };
    } catch (error) {
      console.error("Delete compliance error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete compliance record'
      };
    }
  }

  // Get pending approvals
  async getPendingApprovals() {
    console.log("getPendingApprovals called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Compliance/status/pending');
      console.log("Get pending approvals response:", response.data);
      return {
        success: true,
        data: response.data.pendingApprovals || [],
        count: response.data.count || 0,
        status: response.data.status
      };
    } catch (error) {
      console.error("Get pending approvals error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch pending approvals'
      };
    }
  }

  // Get approved compliance records
  async getApprovedCompliance() {
    console.log("getApprovedCompliance called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Compliance/status/approved');
      console.log("Get approved compliance response:", response.data);
      return {
        success: true,
        data: response.data.approved || [],
        count: response.data.count || 0,
        status: response.data.status
      };
    } catch (error) {
      console.error("Get approved compliance error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch approved compliance'
      };
    }
  }

  // Get non-compliant schools
  async getNonCompliantSchools() {
    console.log("getNonCompliantSchools called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Compliance/status/non-compliant');
      console.log("Get non-compliant schools response:", response.data);
      return {
        success: true,
        data: response.data.nonCompliant || [],
        count: response.data.count || 0,
        status: response.data.status
      };
    } catch (error) {
      console.error("Get non-compliant schools error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch non-compliant schools'
      };
    }
  }

  // Send compliance notification to school
  async sendComplianceNotification(id) {
    console.log("sendComplianceNotification called for id:", id);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/Compliance/${id}/notify`);
      console.log("Send compliance notification response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Compliance notification sent successfully'
      };
    } catch (error) {
      console.error("Send compliance notification error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send compliance notification'
      };
    }
  }
}

// Export singleton instance
const complianceService = new ComplianceService();
export default complianceService;

// Export individual functions for backward compatibility
export const createCompliance = async (data) => {
  return await complianceService.createCompliance(data);
};

export const getAllCompliance = async (search = '') => {
  return await complianceService.getAllCompliance(search);
};

export const getComplianceById = async (id) => {
  return await complianceService.getComplianceById(id);
};

export const getComplianceBySchoolId = async (schoolId) => {
  return await complianceService.getComplianceBySchoolId(schoolId);
};

export const updateCompliance = async (id, data) => {
  return await complianceService.updateCompliance(id, data);
};

export const approveCompliance = async (id, isApproved, rejectionReason = null) => {
  return await complianceService.approveCompliance(id, isApproved, rejectionReason);
};

export const deleteCompliance = async (id) => {
  return await complianceService.deleteCompliance(id);
};

export const getPendingApprovals = async () => {
  return await complianceService.getPendingApprovals();
};

export const getApprovedCompliance = async () => {
  return await complianceService.getApprovedCompliance();
};

export const getNonCompliantSchools = async () => {
  return await complianceService.getNonCompliantSchools();
};

export const sendComplianceNotification = async (id) => {
  return await complianceService.sendComplianceNotification(id);
};