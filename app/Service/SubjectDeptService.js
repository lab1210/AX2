// Service/SubjectDepartmentService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class SubjectDepartmentService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // ==================== MAPPING OPERATIONS ====================

  /**
   * Create mappings for multiple subjects to one department
   * POST /api/SubjectDepartment
   * @param {Object} data - { subjectIds: string[], departmentId: string }
   */
  async createMappings(data) {
    console.log("createMappings called with:", data);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/SubjectDepartment', data);
      console.log("Create mappings response:", response.data);
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data, // Contains totalRequested, successful, failed, errors, etc.
        errors: response.data.errors || []
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
   * GET /api/SubjectDepartment
   * @param {Object} filters - { subjectId?, departmentId?, includeDeleted? }
   */
  async getAllMappings(filters = {}) {
    console.log("getAllMappings called with filters:", filters);
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      
      if (filters.subjectId) params.subjectId = filters.subjectId;
      if (filters.departmentId) params.departmentId = filters.departmentId;
      if (filters.includeDeleted) params.includeDeleted = filters.includeDeleted;
      
      const response = await axiosInstance.get('/SubjectDepartment', { params });
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
   * GET /api/SubjectDepartment/{mappingId}
   * @param {string} mappingId - UUID of the mapping
   */
  async getMappingById(mappingId) {
    console.log("getMappingById called for:", mappingId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/SubjectDepartment/${mappingId}`);
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
   * PUT /api/SubjectDepartment/{mappingId}
   * @param {string} mappingId - UUID of the mapping
   * @param {Object} data - { departmentId?, subjectId? }
   */
  async updateMapping(mappingId, data) {
    console.log("updateMapping called for:", mappingId, "with data:", data);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/SubjectDepartment/${mappingId}`, data);
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
   * DELETE /api/SubjectDepartment/{mappingId}
   * @param {string} mappingId - UUID of the mapping
   */
  async deleteMapping(mappingId) {
    console.log("deleteMapping called for:", mappingId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/SubjectDepartment/${mappingId}`);
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
   * Get departments by subject
   * Helper method to get departments for a specific subject
   * @param {string} subjectId - UUID of the subject
   */
  async getDepartmentsBySubject(subjectId) {
    console.log("getDepartmentsBySubject called for:", subjectId);
    try {
      const result = await this.getAllMappings({ subjectId });
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
      console.error("Get departments by subject error:", error);
      return {
        success: false,
        message: error.message || 'Failed to fetch departments',
        data: []
      };
    }
  }

  /**
   * Get subjects by department
   * Helper method to get subjects for a specific department
   * @param {string} departmentId - UUID of the department
   */
  async getSubjectsByDepartment(departmentId) {
    console.log("getSubjectsByDepartment called for:", departmentId);
    try {
      const result = await this.getAllMappings({ departmentId });
      if (result.success) {
        const subjects = result.data.map(mapping => ({
          id: mapping.subjectId,
          name: mapping.subjectName,
          mappingId: mapping.id
        }));
        return {
          success: true,
          data: subjects,
          count: subjects.length,
          message: 'Subjects fetched successfully'
        };
      }
      return result;
    } catch (error) {
      console.error("Get subjects by department error:", error);
      return {
        success: false,
        message: error.message || 'Failed to fetch subjects',
        data: []
      };
    }
  }
}

// Export singleton instance
const subjectDepartmentService = new SubjectDepartmentService();
export default subjectDepartmentService;

// Export individual functions for backward compatibility
export const createMappings = async (data) => {
  return await subjectDepartmentService.createMappings(data);
};

export const getAllMappings = async (filters = {}) => {
  return await subjectDepartmentService.getAllMappings(filters);
};

export const getMappingById = async (mappingId) => {
  return await subjectDepartmentService.getMappingById(mappingId);
};

export const updateMapping = async (mappingId, data) => {
  return await subjectDepartmentService.updateMapping(mappingId, data);
};

export const deleteMapping = async (mappingId) => {
  return await subjectDepartmentService.deleteMapping(mappingId);
};

export const getDepartmentsBySubject = async (subjectId) => {
  return await subjectDepartmentService.getDepartmentsBySubject(subjectId);
};

export const getSubjectsByDepartment = async (departmentId) => {
  return await subjectDepartmentService.getSubjectsByDepartment(departmentId);
};