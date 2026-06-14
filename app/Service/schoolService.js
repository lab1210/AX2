// Service/SchoolService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class SchoolService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // Create a new school
  async createSchool(schoolData) {
    console.log("createSchool called with:", schoolData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/School', schoolData);
      console.log("Create school response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'School created successfully'
      };
    } catch (error) {
      console.error("Create school error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create school'
      };
    }
  }

  // Get all schools with optional search
  async getAllSchools(search = '') {
    console.log("getAllSchools called with search:", search);
    try {
      const axiosInstance = this.getAxiosInstance();
      const url = search ? `/School?search=${encodeURIComponent(search)}` : '/School';
      const response = await axiosInstance.get(url);
      console.log("Get all schools response:", response.data);
      return {
        success: true,
        data: response.data.schools || [],
        count: response.data.count || 0,
        searchTerm: response.data.searchTerm
      };
    } catch (error) {
      console.error("Get all schools error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch schools'
      };
    }
  }

  // Get school by ID
  async getSchoolById(id) {
    console.log("getSchoolById called for id:", id);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/School/${id}`);
      console.log("Get school by id response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'School fetched successfully'
      };
    } catch (error) {
      console.error("Get school by id error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch school'
      };
    }
  }

  // Update school
  async updateSchool(id, updateData) {
    console.log("updateSchool called for id:", id, "with data:", updateData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/School/${id}`, updateData);
      console.log("Update school response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'School updated successfully'
      };
    } catch (error) {
      console.error("Update school error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update school'
      };
    }
  }

  // Delete school
  async deleteSchool(id) {
    console.log("deleteSchool called for id:", id);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/School/${id}`);
      console.log("Delete school response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'School deleted successfully'
      };
    } catch (error) {
      console.error("Delete school error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete school'
      };
    }
  }

  // Activate school
  async activateSchool(id) {
    console.log("activateSchool called for id:", id);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/School/${id}/activate`);
      console.log("Activate school response:", response.data);
      return {
        success: true,
        data: response.data.school,
        message: response.data?.message || 'School activated successfully'
      };
    } catch (error) {
      console.error("Activate school error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to activate school'
      };
    }
  }

  // Deactivate school
  async deactivateSchool(id) {
    console.log("deactivateSchool called for id:", id);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/School/${id}/deactivate`);
      console.log("Deactivate school response:", response.data);
      return {
        success: true,
        data: response.data.school,
        message: response.data?.message || 'School deactivated successfully'
      };
    } catch (error) {
      console.error("Deactivate school error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to deactivate school'
      };
    }
  }

  // Get active schools only
  async getActiveSchools() {
    console.log("getActiveSchools called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/School/active');
      console.log("Get active schools response:", response.data);
      return {
        success: true,
        data: response.data.schools || [],
        count: response.data.count || 0,
        status: response.data.status
      };
    } catch (error) {
      console.error("Get active schools error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch active schools'
      };
    }
  }
}

// Export singleton instance
const schoolService = new SchoolService();
export default schoolService;

// Export individual functions for backward compatibility
export const createSchool = async (data) => {
  return await schoolService.createSchool(data);
};

export const getAllSchools = async (search = '') => {
  return await schoolService.getAllSchools(search);
};

export const getSchoolById = async (id) => {
  return await schoolService.getSchoolById(id);
};

export const updateSchool = async (id, data) => {
  return await schoolService.updateSchool(id, data);
};

export const deleteSchool = async (id) => {
  return await schoolService.deleteSchool(id);
};

export const activateSchool = async (id) => {
  return await schoolService.activateSchool(id);
};

export const deactivateSchool = async (id) => {
  return await schoolService.deactivateSchool(id);
};

export const getActiveSchools = async () => {
  return await schoolService.getActiveSchools();
};