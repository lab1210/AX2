// Service/SchoolAdminService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class SchoolAdminService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // Create a new School Admin
  async createSchoolAdmin(schoolAdminData) {
    console.log("createSchoolAdmin called with:", schoolAdminData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/SchoolAdmin', schoolAdminData);
      console.log("Create school admin response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'School Admin created successfully'
      };
    } catch (error) {
      console.error("Create school admin error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create school admin'
      };
    }
  }

  // Get all School Admins with optional search
  async getAllSchoolAdmins(search = '', includeDeleted = false) {
    console.log("getAllSchoolAdmins called with search:", search, "includeDeleted:", includeDeleted);
    try {
      const axiosInstance = this.getAxiosInstance();
      const url = `/SchoolAdmin?search=${encodeURIComponent(search)}&includeDeleted=${includeDeleted}`;
      const response = await axiosInstance.get(url);
      console.log("Get all school admins response:", response.data);
      return {
        success: true,
        data: response.data.schoolAdmins || [],
        count: response.data.count || 0,
        searchTerm: response.data.searchTerm,
        includeDeleted: response.data.includeDeleted
      };
    } catch (error) {
      console.error("Get all school admins error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch school admins'
      };
    }
  }

  // Get School Admin by ID
  async getSchoolAdminById(userId) {
    console.log("getSchoolAdminById called for userId:", userId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/SchoolAdmin/${userId}`);
      console.log("Get school admin by id response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'School Admin fetched successfully'
      };
    } catch (error) {
      console.error("Get school admin by id error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch school admin'
      };
    }
  }

  // Update School Admin
  async updateSchoolAdmin(userId, updateData) {
    console.log("updateSchoolAdmin called for userId:", userId, "with data:", updateData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/SchoolAdmin/${userId}`, updateData);
      console.log("Update school admin response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'School Admin updated successfully'
      };
    } catch (error) {
      console.error("Update school admin error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update school admin'
      };
    }
  }
async getSchoolAdminMetrics() {
    console.log("getSchoolAdminMetrics called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/SchoolAdmin/metrics');
      console.log("Get school admin metrics response:", response.data);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      }
      return {
        success: false,
        message: response.data?.message || 'Failed to fetch metrics'
      };
    } catch (error) {
      console.error("Get school admin metrics error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch metrics'
      };
    }
  }
  // Soft delete School Admin
  async deleteSchoolAdmin(userId) {
    console.log("deleteSchoolAdmin called for userId:", userId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/SchoolAdmin/${userId}`);
      console.log("Delete school admin response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'School Admin deleted successfully'
      };
    } catch (error) {
      console.error("Delete school admin error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete school admin'
      };
    }
  }

  // Resend confirmation email to School Admin
  async resendConfirmationEmail(userId) {
    console.log("resendConfirmationEmail called for userId:", userId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/SchoolAdmin/${userId}/resend-confirmation`);
      console.log("Resend confirmation email response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Confirmation email sent successfully'
      };
    } catch (error) {
      console.error("Resend confirmation email error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send confirmation email'
      };
    }
  }
}

// Export singleton instance
const schoolAdminService = new SchoolAdminService();
export default schoolAdminService;

// Export individual functions for backward compatibility
export const createSchoolAdmin = async (data) => {
  return await schoolAdminService.createSchoolAdmin(data);
};

export const getAllSchoolAdmins = async (search = '', includeDeleted = false) => {
  return await schoolAdminService.getAllSchoolAdmins(search, includeDeleted);
};

export const getSchoolAdminById = async (userId) => {
  return await schoolAdminService.getSchoolAdminById(userId);
};

export const updateSchoolAdmin = async (userId, data) => {
  return await schoolAdminService.updateSchoolAdmin(userId, data);
};

export const deleteSchoolAdmin = async (userId) => {
  return await schoolAdminService.deleteSchoolAdmin(userId);
};

export const resendConfirmationEmail = async (userId) => {
  return await schoolAdminService.resendConfirmationEmail(userId);
};
export const getSchoolAdminMetrics = async () => {
  return await schoolAdminService.getSchoolAdminMetrics();
};