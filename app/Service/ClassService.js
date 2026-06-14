// Service/ClassService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class ClassService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // ==================== CLASS YEAR ENDPOINTS ====================

  // Create a new class year
  async createClassYear(classYearData) {
    console.log("createClassYear called with:", classYearData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/Class/year', classYearData);
      console.log("Create class year response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Class year created successfully'
      };
    } catch (error) {
      console.error("Create class year error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create class year'
      };
    }
  }

  // Get class year by ID
  async getClassYearById(classYearId) {
    console.log("getClassYearById called for:", classYearId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Class/year/${classYearId}`);
      console.log("Get class year by id response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Class year fetched successfully'
      };
    } catch (error) {
      console.error("Get class year by id error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch class year'
      };
    }
  }

  // Get all class years for the school
  async getAllClassYears(yearId = null) {
    console.log("getAllClassYears called with yearId:", yearId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (yearId) {
        params.yearId = yearId;
      }
      const response = await axiosInstance.get('/Class/years', { params });
      console.log("Get all class years response:", response.data);
      return {
        success: true,
        data: response.data.classYears || [],
        count: response.data.count || 0,
        message: 'Class years fetched successfully'
      };
    } catch (error) {
      console.error("Get all class years error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch class years'
      };
    }
  }

  // Update a class year
  async updateClassYear(classYearId, updateData) {
    console.log("updateClassYear called for:", classYearId, "with data:", updateData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/Class/year/${classYearId}`, updateData);
      console.log("Update class year response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Class year updated successfully'
      };
    } catch (error) {
      console.error("Update class year error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update class year'
      };
    }
  }

  // Delete a class year (soft delete)
  async deleteClassYear(classYearId) {
    console.log("deleteClassYear called for:", classYearId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/Class/year/${classYearId}`);
      console.log("Delete class year response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Class year deleted successfully'
      };
    } catch (error) {
      console.error("Delete class year error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete class year'
      };
    }
  }

  // ==================== CLASS ARM ENDPOINTS ====================

  // Create a new class arm
  async createClassArm(classArmData) {
    console.log("createClassArm called with:", classArmData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/Class/arm', classArmData);
      console.log("Create class arm response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Class arm created successfully'
      };
    } catch (error) {
      console.error("Create class arm error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create class arm'
      };
    }
  }

  // Get class arm by ID
  async getClassArmById(classArmId) {
    console.log("getClassArmById called for:", classArmId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Class/arm/${classArmId}`);
      console.log("Get class arm by id response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Class arm fetched successfully'
      };
    } catch (error) {
      console.error("Get class arm by id error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch class arm'
      };
    }
  }

  // Get all class arms for the school
  async getAllClassArms(classYearId = null) {
    console.log("getAllClassArms called with classYearId:", classYearId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (classYearId) {
        params.classYearId = classYearId;
      }
      const response = await axiosInstance.get('/Class/arms', { params });
      console.log("Get all class arms response:", response.data);
      return {
        success: true,
        data: response.data.classArms || [],
        count: response.data.count || 0,
        message: 'Class arms fetched successfully'
      };
    } catch (error) {
      console.error("Get all class arms error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch class arms'
      };
    }
  }

  // Update a class arm
  async updateClassArm(classArmId, updateData) {
    console.log("updateClassArm called for:", classArmId, "with data:", updateData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/Class/arm/${classArmId}`, updateData);
      console.log("Update class arm response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Class arm updated successfully'
      };
    } catch (error) {
      console.error("Update class arm error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update class arm'
      };
    }
  }

  // Delete a class arm (soft delete)
  async deleteClassArm(classArmId) {
    console.log("deleteClassArm called for:", classArmId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/Class/arm/${classArmId}`);
      console.log("Delete class arm response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Class arm deleted successfully'
      };
    } catch (error) {
      console.error("Delete class arm error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete class arm'
      };
    }
  }
}

// Export singleton instance
const classService = new ClassService();
export default classService;

// Export individual functions for backward compatibility
export const createClassYear = async (data) => {
  return await classService.createClassYear(data);
};

export const getClassYearById = async (classYearId) => {
  return await classService.getClassYearById(classYearId);
};

export const getAllClassYears = async (yearId = null) => {
  return await classService.getAllClassYears(yearId);
};

export const updateClassYear = async (classYearId, data) => {
  return await classService.updateClassYear(classYearId, data);
};

export const deleteClassYear = async (classYearId) => {
  return await classService.deleteClassYear(classYearId);
};

export const createClassArm = async (data) => {
  return await classService.createClassArm(data);
};

export const getClassArmById = async (classArmId) => {
  return await classService.getClassArmById(classArmId);
};

export const getAllClassArms = async (classYearId = null) => {
  return await classService.getAllClassArms(classYearId);
};

export const updateClassArm = async (classArmId, data) => {
  return await classService.updateClassArm(classArmId, data);
};

export const deleteClassArm = async (classArmId) => {
  return await classService.deleteClassArm(classArmId);
};