// Service/ClassArmTeacherService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class ClassArmTeacherService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // ==================== ASSIGNMENT OPERATIONS ====================

  // Assign teacher to multiple class arms
  async assignTeacherToMultipleArms(assignmentData) {
    console.log("assignTeacherToMultipleArms called with:", assignmentData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/ClassArmTeacher', assignmentData);
      console.log("Assign teacher response:", response.data);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Teacher assigned successfully'
      };
    } catch (error) {
      console.error("Assign teacher error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to assign teacher'
      };
    }
  }

  // Bulk assign from Excel
  async bulkAssignFromExcel(file) {
    console.log("bulkAssignFromExcel called");
    try {
      const token = authService.getAccessToken();
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${this.baseURL}/ClassArmTeacher/bulk/excel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      console.log("Bulk assign response:", data);
      
      if (response.ok) {
        return {
          success: true,
          data: data,
          message: data.message || 'Bulk assignment completed'
        };
      }
      
      return {
        success: false,
        message: data.message || 'Failed to process bulk assignment'
      };
    } catch (error) {
      console.error("Bulk assign error:", error);
      return {
        success: false,
        message: error.message || 'Failed to process bulk assignment'
      };
    }
  }

  // Download Excel template
  async downloadTemplate() {
    console.log("downloadTemplate called");
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${this.baseURL}/ClassArmTeacher/template`, {
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
      a.download = 'Teacher_Assignment_Template.xlsx';
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

  // Get all assignments
  async getAllAssignments(classArmId = null, teacherId = null, academicPeriodId = null, includeDeleted = false) {
    console.log("getAllAssignments called with filters:", { classArmId, teacherId, academicPeriodId, includeDeleted });
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = { includeDeleted };
      if (classArmId) params.classArmId = classArmId;
      if (teacherId) params.teacherId = teacherId;
      if (academicPeriodId) params.academicPeriodId = academicPeriodId;
      
      const response = await axiosInstance.get('/ClassArmTeacher', { params });
      console.log("Get all assignments response:", response.data);
      return {
        success: true,
        data: response.data.assignments || [],
        count: response.data.count || 0,
        message: 'Assignments fetched successfully'
      };
    } catch (error) {
      console.error("Get all assignments error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch assignments'
      };
    }
  }

  // Get assignment by ID
  async getAssignmentById(assignmentId) {
    console.log("getAssignmentById called for:", assignmentId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/ClassArmTeacher/${assignmentId}`);
      console.log("Get assignment by id response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Assignment fetched successfully'
      };
    } catch (error) {
      console.error("Get assignment by id error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch assignment'
      };
    }
  }

  // Update assignment
  async updateAssignment(assignmentId, updateData) {
    console.log("updateAssignment called for:", assignmentId, "with data:", updateData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/ClassArmTeacher/${assignmentId}`, updateData);
      console.log("Update assignment response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Assignment updated successfully'
      };
    } catch (error) {
      console.error("Update assignment error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update assignment'
      };
    }
  }

  // Delete assignment (soft delete)
  async deleteAssignment(assignmentId) {
    console.log("deleteAssignment called for:", assignmentId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/ClassArmTeacher/${assignmentId}`);
      console.log("Delete assignment response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Assignment deleted successfully'
      };
    } catch (error) {
      console.error("Delete assignment error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete assignment'
      };
    }
  }
}

// Export singleton instance
const classArmTeacherService = new ClassArmTeacherService();
export default classArmTeacherService;

// Export individual functions for backward compatibility
export const assignTeacherToMultipleArms = async (data) => {
  return await classArmTeacherService.assignTeacherToMultipleArms(data);
};

export const bulkAssignFromExcel = async (file) => {
  return await classArmTeacherService.bulkAssignFromExcel(file);
};

export const downloadTemplate = async () => {
  return await classArmTeacherService.downloadTemplate();
};

export const getAllAssignments = async (classArmId = null, teacherId = null, academicPeriodId = null, includeDeleted = false) => {
  return await classArmTeacherService.getAllAssignments(classArmId, teacherId, academicPeriodId, includeDeleted);
};

export const getAssignmentById = async (assignmentId) => {
  return await classArmTeacherService.getAssignmentById(assignmentId);
};

export const updateAssignment = async (assignmentId, data) => {
  return await classArmTeacherService.updateAssignment(assignmentId, data);
};

export const deleteAssignment = async (assignmentId) => {
  return await classArmTeacherService.deleteAssignment(assignmentId);
};