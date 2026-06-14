// Service/SubjectTeacherService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class SubjectTeacherService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // ==================== ASSIGNMENT OPERATIONS ====================

  /**
   * Create assignments (one teacher to multiple subjects)
   * POST /api/SubjectTeacher
   * @param {Object} data - { teacherId: string, subjects: Array<{ subjectId: string, classArmId?: string, academicPeriodId: string }> }
   */
  async createAssignments(data) {
    console.log("createAssignments called with:", data);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/SubjectTeacher', data);
      console.log("Create assignments response:", response.data);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Assignments created successfully'
      };
    } catch (error) {
      console.error("Create assignments error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create assignments',
        errors: error.response?.data?.errors || []
      };
    }
  }

  /**
   * Bulk assign from Excel file
   * POST /api/SubjectTeacher/bulk/excel
   * @param {File} file - Excel file to upload
   */
  async bulkAssignFromExcel(file) {
    console.log("bulkAssignFromExcel called");
    try {
      const token = authService.getAccessToken();
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${this.baseURL}/SubjectTeacher/bulk/excel`, {
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
        message: data.message || 'Failed to process bulk assignment',
        errors: data.errors || []
      };
    } catch (error) {
      console.error("Bulk assign error:", error);
      return {
        success: false,
        message: error.message || 'Failed to process bulk assignment'
      };
    }
  }

  /**
   * Download Excel template
   * GET /api/SubjectTeacher/template
   */
  async downloadTemplate() {
    console.log("downloadTemplate called");
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${this.base_URL}/SubjectTeacher/template`, {
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
      a.download = 'Subject_Teacher_Template.xlsx';
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

  /**
   * Get all assignments with filters
   * GET /api/SubjectTeacher
   * @param {Object} filters - { teacherId?, subjectId?, classArmId?, academicPeriodId?, includeDeleted? }
   */
  async getAllAssignments(filters = {}) {
    console.log("getAllAssignments called with filters:", filters);
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      
      if (filters.teacherId) params.teacherId = filters.teacherId;
      if (filters.subjectId) params.subjectId = filters.subjectId;
      if (filters.classArmId) params.classArmId = filters.classArmId;
      if (filters.academicPeriodId) params.academicPeriodId = filters.academicPeriodId;
      if (filters.includeDeleted) params.includeDeleted = filters.includeDeleted;
      
      const response = await axiosInstance.get('/SubjectTeacher', { params });
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
        message: error.response?.data?.message || 'Failed to fetch assignments',
        data: []
      };
    }
  }

  /**
   * Get assignment by ID
   * GET /api/SubjectTeacher/{assignmentId}
   * @param {string} assignmentId - UUID of the assignment
   */
  async getAssignmentById(assignmentId) {
    console.log("getAssignmentById called for:", assignmentId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/SubjectTeacher/${assignmentId}`);
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

  /**
   * Get teachers by subject
   * GET /api/SubjectTeacher/subject/{subjectId}
   * @param {string} subjectId - UUID of the subject
   * @param {string} academicPeriodId - Optional academic period ID
   */
  async getTeachersBySubject(subjectId, academicPeriodId = null) {
    console.log("getTeachersBySubject called for:", subjectId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (academicPeriodId) params.academicPeriodId = academicPeriodId;
      
      const response = await axiosInstance.get(`/SubjectTeacher/subject/${subjectId}`, { params });
      console.log("Get teachers by subject response:", response.data);
      return {
        success: true,
        data: response.data.teachers || [],
        count: response.data.count || 0,
        message: 'Teachers fetched successfully'
      };
    } catch (error) {
      console.error("Get teachers by subject error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch teachers',
        data: []
      };
    }
  }

  /**
   * Get subjects taught by a teacher
   * GET /api/SubjectTeacher/teacher/{teacherId}
   * @param {string} teacherId - UUID of the teacher
   * @param {string} academicPeriodId - Optional academic period ID
   */
  async getSubjectsByTeacher(teacherId, academicPeriodId = null) {
    console.log("getSubjectsByTeacher called for:", teacherId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (academicPeriodId) params.academicPeriodId = academicPeriodId;
      
      const response = await axiosInstance.get(`/SubjectTeacher/teacher/${teacherId}`, { params });
      console.log("Get subjects by teacher response:", response.data);
      return {
        success: true,
        data: response.data.subjects || [],
        count: response.data.count || 0,
        message: 'Subjects fetched successfully'
      };
    } catch (error) {
      console.error("Get subjects by teacher error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch subjects',
        data: []
      };
    }
  }

  /**
   * Get teacher for a specific subject in a class arm
   * GET /api/SubjectTeacher/subject/{subjectId}/class-arm/{classArmId}/period/{academicPeriodId}
   */
  async getTeacherForSubjectInClassArm(subjectId, classArmId, academicPeriodId) {
    console.log("getTeacherForSubjectInClassArm called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/SubjectTeacher/subject/${subjectId}/class-arm/${classArmId}/period/${academicPeriodId}`);
      console.log("Get teacher response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Teacher fetched successfully'
      };
    } catch (error) {
      console.error("Get teacher for subject in class arm error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch teacher'
      };
    }
  }

  /**
   * Update assignment
   * PUT /api/SubjectTeacher/{assignmentId}
   * @param {string} assignmentId - UUID of the assignment
   * @param {Object} data - { teacherId?, subjectId?, classArmId?, academicPeriodId? }
   */
  async updateAssignment(assignmentId, data) {
    console.log("updateAssignment called for:", assignmentId, "with data:", data);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/SubjectTeacher/${assignmentId}`, data);
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

  /**
   * Delete assignment (soft delete)
   * DELETE /api/SubjectTeacher/{assignmentId}
   * @param {string} assignmentId - UUID of the assignment
   */
  async deleteAssignment(assignmentId) {
    console.log("deleteAssignment called for:", assignmentId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/SubjectTeacher/${assignmentId}`);
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

  // ==================== TEACHER STUDENT METHODS ====================

  /**
   * Get students for scoring (for teachers)
   * GET /api/SubjectTeacher/my-students
   * @param {string} termId - Optional term ID
   */
  async getMyStudentsForScoring(termId = null) {
    console.log("getMyStudentsForScoring called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (termId) params.termId = termId;
      
      const response = await axiosInstance.get('/SubjectTeacher/my-students', { params });
      console.log("Get my students response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Students fetched successfully'
      };
    } catch (error) {
      console.error("Get my students error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch students'
      };
    }
  }

  /**
   * Get students for a specific subject (for teachers)
   * GET /api/SubjectTeacher/my-subject-students/{subjectId}
   * @param {string} subjectId - UUID of the subject
   * @param {Object} options - { classArmId?, termId? }
   */
  async getMySubjectStudents(subjectId, options = {}) {
    console.log("getMySubjectStudents called for:", subjectId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (options.classArmId) params.classArmId = options.classArmId;
      if (options.termId) params.termId = options.termId;
      
      const response = await axiosInstance.get(`/SubjectTeacher/my-subject-students/${subjectId}`, { params });
      console.log("Get my subject students response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Students fetched successfully'
      };
    } catch (error) {
      console.error("Get my subject students error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch students'
      };
    }
  }
}

// Export singleton instance
const subjectTeacherService = new SubjectTeacherService();
export default subjectTeacherService;

// Export individual functions for backward compatibility
export const createAssignments = async (data) => {
  return await subjectTeacherService.createAssignments(data);
};

export const bulkAssignFromExcel = async (file) => {
  return await subjectTeacherService.bulkAssignFromExcel(file);
};

export const downloadTemplate = async () => {
  return await subjectTeacherService.downloadTemplate();
};

export const getAllAssignments = async (filters = {}) => {
  return await subjectTeacherService.getAllAssignments(filters);
};

export const getAssignmentById = async (assignmentId) => {
  return await subjectTeacherService.getAssignmentById(assignmentId);
};

export const getTeachersBySubject = async (subjectId, academicPeriodId = null) => {
  return await subjectTeacherService.getTeachersBySubject(subjectId, academicPeriodId);
};

export const getSubjectsByTeacher = async (teacherId, academicPeriodId = null) => {
  return await subjectTeacherService.getSubjectsByTeacher(teacherId, academicPeriodId);
};

export const getTeacherForSubjectInClassArm = async (subjectId, classArmId, academicPeriodId) => {
  return await subjectTeacherService.getTeacherForSubjectInClassArm(subjectId, classArmId, academicPeriodId);
};

export const updateAssignment = async (assignmentId, data) => {
  return await subjectTeacherService.updateAssignment(assignmentId, data);
};

export const deleteAssignment = async (assignmentId) => {
  return await subjectTeacherService.deleteAssignment(assignmentId);
};

export const getMyStudentsForScoring = async (termId = null) => {
  return await subjectTeacherService.getMyStudentsForScoring(termId);
};

export const getMySubjectStudents = async (subjectId, options = {}) => {
  return await subjectTeacherService.getMySubjectStudents(subjectId, options);
};