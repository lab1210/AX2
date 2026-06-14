// Service/AcademicEntityService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class AcademicEntityService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // ==================== SUBJECT OPERATIONS ====================

  // Create a new subject
  async createSubject(subjectData) {
    console.log("createSubject called with:", subjectData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/AcademicEntity/subject', subjectData);
      console.log("Create subject response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Subject created successfully'
      };
    } catch (error) {
      console.error("Create subject error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create subject'
      };
    }
  }

  // Get subject by ID
  async getSubjectById(subjectId) {
    console.log("getSubjectById called for:", subjectId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/AcademicEntity/subject/${subjectId}`);
      console.log("Get subject by id response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Subject fetched successfully'
      };
    } catch (error) {
      console.error("Get subject by id error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch subject'
      };
    }
  }

  // Get all subjects for the school
  async getAllSubjects(includeDeleted = false) {
    console.log("getAllSubjects called with includeDeleted:", includeDeleted);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/AcademicEntity/subjects', {
        params: { includeDeleted }
      });
      console.log("Get all subjects response:", response.data);
      return {
        success: true,
        data: response.data.subjects || [],
        count: response.data.count || 0,
        message: 'Subjects fetched successfully'
      };
    } catch (error) {
      console.error("Get all subjects error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch subjects'
      };
    }
  }

  // Update a subject
  async updateSubject(subjectId, updateData) {
    console.log("updateSubject called for:", subjectId, "with data:", updateData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/AcademicEntity/subject/${subjectId}`, updateData);
      console.log("Update subject response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Subject updated successfully'
      };
    } catch (error) {
      console.error("Update subject error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update subject'
      };
    }
  }

  // Delete a subject (soft delete)
  async deleteSubject(subjectId) {
    console.log("deleteSubject called for:", subjectId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/AcademicEntity/subject/${subjectId}`);
      console.log("Delete subject response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Subject deleted successfully'
      };
    } catch (error) {
      console.error("Delete subject error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete subject'
      };
    }
  }

  // Restore a deleted subject
  async restoreSubject(subjectId) {
    console.log("restoreSubject called for:", subjectId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/AcademicEntity/subject/${subjectId}/restore`);
      console.log("Restore subject response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Subject restored successfully'
      };
    } catch (error) {
      console.error("Restore subject error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to restore subject'
      };
    }
  }

  // ==================== DEPARTMENT OPERATIONS ====================

  // Create a new department
  async createDepartment(departmentData) {
    console.log("createDepartment called with:", departmentData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/AcademicEntity/department', departmentData);
      console.log("Create department response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Department created successfully'
      };
    } catch (error) {
      console.error("Create department error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create department'
      };
    }
  }

  // Get department by ID
  async getDepartmentById(departmentId) {
    console.log("getDepartmentById called for:", departmentId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/AcademicEntity/department/${departmentId}`);
      console.log("Get department by id response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Department fetched successfully'
      };
    } catch (error) {
      console.error("Get department by id error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch department'
      };
    }
  }

  // Get all departments for the school
  async getAllDepartments(includeDeleted = false) {
    console.log("getAllDepartments called with includeDeleted:", includeDeleted);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/AcademicEntity/departments', {
        params: { includeDeleted }
      });
      console.log("Get all departments response:", response.data);
      return {
        success: true,
        data: response.data.departments || [],
        count: response.data.count || 0,
        message: 'Departments fetched successfully'
      };
    } catch (error) {
      console.error("Get all departments error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch departments'
      };
    }
  }

  // Update a department
  async updateDepartment(departmentId, updateData) {
    console.log("updateDepartment called for:", departmentId, "with data:", updateData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/AcademicEntity/department/${departmentId}`, updateData);
      console.log("Update department response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Department updated successfully'
      };
    } catch (error) {
      console.error("Update department error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update department'
      };
    }
  }

  // Delete a department (soft delete)
  async deleteDepartment(departmentId) {
    console.log("deleteDepartment called for:", departmentId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/AcademicEntity/department/${departmentId}`);
      console.log("Delete department response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Department deleted successfully'
      };
    } catch (error) {
      console.error("Delete department error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete department'
      };
    }
  }

  // Restore a deleted department
  async restoreDepartment(departmentId) {
    console.log("restoreDepartment called for:", departmentId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/AcademicEntity/department/${departmentId}/restore`);
      console.log("Restore department response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Department restored successfully'
      };
    } catch (error) {
      console.error("Restore department error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to restore department'
      };
    }
  }
}

// Export singleton instance
const academicEntityService = new AcademicEntityService();
export default academicEntityService;

// Export individual functions for backward compatibility
export const createSubject = async (data) => {
  return await academicEntityService.createSubject(data);
};

export const getSubjectById = async (subjectId) => {
  return await academicEntityService.getSubjectById(subjectId);
};

export const getAllSubjects = async (includeDeleted = false) => {
  return await academicEntityService.getAllSubjects(includeDeleted);
};

export const updateSubject = async (subjectId, data) => {
  return await academicEntityService.updateSubject(subjectId, data);
};

export const deleteSubject = async (subjectId) => {
  return await academicEntityService.deleteSubject(subjectId);
};

export const restoreSubject = async (subjectId) => {
  return await academicEntityService.restoreSubject(subjectId);
};

export const createDepartment = async (data) => {
  return await academicEntityService.createDepartment(data);
};

export const getDepartmentById = async (departmentId) => {
  return await academicEntityService.getDepartmentById(departmentId);
};

export const getAllDepartments = async (includeDeleted = false) => {
  return await academicEntityService.getAllDepartments(includeDeleted);
};

export const updateDepartment = async (departmentId, data) => {
  return await academicEntityService.updateDepartment(departmentId, data);
};

export const deleteDepartment = async (departmentId) => {
  return await academicEntityService.deleteDepartment(departmentId);
};

export const restoreDepartment = async (departmentId) => {
  return await academicEntityService.restoreDepartment(departmentId);
};