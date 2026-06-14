// Service/ClassArmDepartmentService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class ClassArmDepartmentService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // ==================== MAPPING OPERATIONS ====================

  /**
   * Create mappings for multiple class arms to one department
   * POST /api/ClassArmDepartment
   * @param {Object} data - { classArmIds: string[], departmentId: string }
   */
  async createMappings(data) {
    console.log("createMappings called with:", data);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/ClassArmDepartment', data);
      console.log("Create mappings response:", response.data);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Mappings created successfully'
      };
    } catch (error) {
      console.error("Create mappings error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create mappings',
        errors: error.response?.data?.errors || []
      };
    }
  }

  /**
   * Get all mappings with filters
   * GET /api/ClassArmDepartment
   * @param {Object} filters - { classArmId?, departmentId?, includeDeleted? }
   */
  async getAllMappings(filters = {}) {
    console.log("getAllMappings called with filters:", filters);
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      
      if (filters.classArmId) params.classArmId = filters.classArmId;
      if (filters.departmentId) params.departmentId = filters.departmentId;
      if (filters.includeDeleted) params.includeDeleted = filters.includeDeleted;
      
      const response = await axiosInstance.get('/ClassArmDepartment', { params });
      console.log("Get all mappings response:", response.data);
      return {
        success: true,
        data: response.data.mappings || [],
        count: response.data.count || 0,
        message: 'Mappings fetched successfully'
      };
    } catch (error) {
      console.error("Get all mappings error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch mappings',
        data: []
      };
    }
  }

  /**
   * Get mapping by ID
   * GET /api/ClassArmDepartment/{mappingId}
   * @param {string} mappingId - UUID of the mapping
   */
  async getMappingById(mappingId) {
    console.log("getMappingById called for:", mappingId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/ClassArmDepartment/${mappingId}`);
      console.log("Get mapping by id response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Mapping fetched successfully'
      };
    } catch (error) {
      console.error("Get mapping by id error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch mapping'
      };
    }
  }

  /**
   * Update a mapping
   * PUT /api/ClassArmDepartment/{mappingId}
   * @param {string} mappingId - UUID of the mapping
   * @param {Object} data - { departmentId?, classArmId? }
   */
  async updateMapping(mappingId, data) {
    console.log("updateMapping called for:", mappingId, "with data:", data);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/ClassArmDepartment/${mappingId}`, data);
      console.log("Update mapping response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Mapping updated successfully'
      };
    } catch (error) {
      console.error("Update mapping error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update mapping'
      };
    }
  }

  /**
   * Soft delete a mapping
   * DELETE /api/ClassArmDepartment/{mappingId}
   * @param {string} mappingId - UUID of the mapping
   */
  async deleteMapping(mappingId) {
    console.log("deleteMapping called for:", mappingId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/ClassArmDepartment/${mappingId}`);
      console.log("Delete mapping response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Mapping deleted successfully'
      };
    } catch (error) {
      console.error("Delete mapping error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete mapping'
      };
    }
  }

  /**
   * Get departments by class arm
   * Helper method to get departments for a specific class arm
   * @param {string} classArmId - UUID of the class arm
   */
  async getDepartmentsByClassArm(classArmId) {
    console.log("getDepartmentsByClassArm called for:", classArmId);
    try {
      const result = await this.getAllMappings({ classArmId });
      if (result.success) {
        const departments = result.data.map(mapping => ({
          id: mapping.departmentId,
          name: mapping.departmentName,
          mappingId: mapping.id
        }));
        return {
          success: true,
          data: departments,
          count: departments.length,
          message: 'Departments fetched successfully'
        };
      }
      return result;
    } catch (error) {
      console.error("Get departments by class arm error:", error);
      return {
        success: false,
        message: error.message || 'Failed to fetch departments',
        data: []
      };
    }
  }

  /**
   * Get class arms by department
   * Helper method to get class arms for a specific department
   * @param {string} departmentId - UUID of the department
   */
  async getClassArmsByDepartment(departmentId) {
    console.log("getClassArmsByDepartment called for:", departmentId);
    try {
      const result = await this.getAllMappings({ departmentId });
      if (result.success) {
        const classArms = result.data.map(mapping => ({
          id: mapping.classArmId,
          name: mapping.classArmName,
          className: mapping.classYearName,
          fullName: `${mapping.classYearName} ${mapping.classArmName}`,
          mappingId: mapping.id
        }));
        return {
          success: true,
          data: classArms,
          count: classArms.length,
          message: 'Class arms fetched successfully'
        };
      }
      return result;
    } catch (error) {
      console.error("Get class arms by department error:", error);
      return {
        success: false,
        message: error.message || 'Failed to fetch class arms',
        data: []
      };
    }
  }
}

// Export singleton instance
const classArmDepartmentService = new ClassArmDepartmentService();
export default classArmDepartmentService;

// Export individual functions for backward compatibility
export const createMappings = async (data) => {
  return await classArmDepartmentService.createMappings(data);
};

export const getAllMappings = async (filters = {}) => {
  return await classArmDepartmentService.getAllMappings(filters);
};

export const getMappingById = async (mappingId) => {
  return await classArmDepartmentService.getMappingById(mappingId);
};

export const updateMapping = async (mappingId, data) => {
  return await classArmDepartmentService.updateMapping(mappingId, data);
};

export const deleteMapping = async (mappingId) => {
  return await classArmDepartmentService.deleteMapping(mappingId);
};

export const getDepartmentsByClassArm = async (classArmId) => {
  return await classArmDepartmentService.getDepartmentsByClassArm(classArmId);
};

export const getClassArmsByDepartment = async (departmentId) => {
  return await classArmDepartmentService.getClassArmsByDepartment(departmentId);
};