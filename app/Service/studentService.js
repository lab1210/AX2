// Service/StudentService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class StudentService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // ==================== SELF REGISTRATION (PUBLIC) ====================

  /**
   * Self registration using token
   * POST /api/Student/self-register
   * @param {Object} registrationData - Student registration data
   */
  async selfRegisterStudent(registrationData) {
    console.log("selfRegisterStudent called with:", registrationData);
    try {
      const response = await fetch(`${this.baseURL}/Student/self-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });
      
      const data = await response.json();
      console.log("Self register response:", data);
      
      if (response.ok) {
        return {
          success: true,
          data: data.data,
          message: data.message || 'Registration successful'
        };
      }
      
      return {
        success: false,
        message: data.message || 'Registration failed'
      };
    } catch (error) {
      console.error("Self register error:", error);
      return {
        success: false,
        message: error.message || 'Network error occurred'
      };
    }
  }

  // ==================== SCHOOL ADMIN OPERATIONS ====================

  /**
   * Get student limit status for the school
   * GET /api/Student/limit-status
   */
  async getStudentLimitStatus() {
    console.log("getStudentLimitStatus called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Student/limit-status');
      console.log("Get student limit status response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Student limit status fetched successfully'
      };
    } catch (error) {
      console.error("Get student limit status error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch student limit status'
      };
    }
  }

  /**
   * Create a single student
   * POST /api/Student
   * @param {Object} studentData - Student creation data
   */
  async createStudent(studentData) {
    console.log("createStudent called with:", studentData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/Student', studentData);
      console.log("Create student response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Student created successfully'
      };
    } catch (error) {
      console.error("Create student error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create student'
      };
    }
  }

  /**
   * Bulk create students via Excel upload
   * POST /api/Student/bulk
   * @param {File} file - Excel file to upload
   */
  async bulkCreateStudents(file) {
    console.log("bulkCreateStudents called");
    try {
      const token = authService.getAccessToken();
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${this.baseURL}/Student/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      console.log("Bulk create response:", data);
      
      if (response.ok) {
        return {
          success: true,
          data: data,
          message: data.message || 'Bulk upload completed'
        };
      }
      
      return {
        success: false,
        message: data.message || 'Failed to process bulk upload',
        errors: data.errors || []
      };
    } catch (error) {
      console.error("Bulk create error:", error);
      return {
        success: false,
        message: error.message || 'Failed to process bulk upload'
      };
    }
  }

  /**
   * Download Excel template for student bulk upload
   * GET /api/Student/template
   */
  async downloadTemplate() {
    console.log("downloadTemplate called");
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${this.baseURL}/Student/template`, {
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
      a.download = 'Student_Template.xlsx';
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

  // ==================== CRUD OPERATIONS ====================

  /**
   * Get all students
   * GET /api/Student
   * @param {string} search - Optional search term
   * @param {boolean} includeDeleted - Include deleted students
   */
  async getAllStudents(search = '', includeDeleted = false) {
    console.log("getAllStudents called with search:", search, "includeDeleted:", includeDeleted);
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (search) params.search = search;
      if (includeDeleted) params.includeDeleted = includeDeleted;
      
      const response = await axiosInstance.get('/Student', { params });
      console.log("Get all students response:", response.data);
      return {
        success: true,
        data: response.data.students || [],
        count: response.data.count || 0,
        message: 'Students fetched successfully'
      };
    } catch (error) {
      console.error("Get all students error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch students',
        data: []
      };
    }
  }

  /**
   * Get student by ID
   * GET /api/Student/{userId}
   * @param {string} userId - Student user ID
   */
  async getStudentById(userId) {
    console.log("getStudentById called for:", userId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Student/${userId}`);
      console.log("Get student by id response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Student fetched successfully'
      };
    } catch (error) {
      console.error("Get student by id error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch student'
      };
    }
  }

  /**
   * Update a student
   * PUT /api/Student/{userId}
   * @param {string} userId - Student user ID
   * @param {Object} updateData - Student update data
   */
  async updateStudent(userId, updateData) {
    console.log("updateStudent called for:", userId, "with data:", updateData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/Student/${userId}`, updateData);
      console.log("Update student response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Student updated successfully'
      };
    } catch (error) {
      console.error("Update student error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update student'
      };
    }
  }

  /**
   * Soft delete a student
   * DELETE /api/Student/{userId}
   * @param {string} userId - Student user ID
   */
  async deleteStudent(userId) {
    console.log("deleteStudent called for:", userId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/Student/${userId}`);
      console.log("Delete student response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Student deleted successfully'
      };
    } catch (error) {
      console.error("Delete student error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete student'
      };
    }
  }

  /**
   * Restore a soft-deleted student
   * POST /api/Student/{userId}/restore
   * @param {string} userId - Student user ID
   */
  async restoreStudent(userId) {
    console.log("restoreStudent called for:", userId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/Student/${userId}/restore`);
      console.log("Restore student response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Student restored successfully'
      };
    } catch (error) {
      console.error("Restore student error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to restore student'
      };
    }
  }

  // ==================== GRADUATION ENDPOINTS ====================

  /**
   * Get graduated students with filters
   * GET /api/Student/graduated
   * @param {Object} filters - { fromDate?, toDate?, sessionId?, search?, page?, pageSize? }
   */
  async getGraduatedStudents(filters = {}) {
    console.log("getGraduatedStudents called with filters:", filters);
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      
      if (filters.fromDate) params.fromDate = filters.fromDate;
      if (filters.toDate) params.toDate = filters.toDate;
      if (filters.sessionId) params.sessionId = filters.sessionId;
      if (filters.search) params.search = filters.search;
      if (filters.page) params.page = filters.page;
      if (filters.pageSize) params.pageSize = filters.pageSize;
      
      const response = await axiosInstance.get('/Student/graduated', { params });
      console.log("Get graduated students response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Graduated students fetched successfully'
      };
    } catch (error) {
      console.error("Get graduated students error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch graduated students'
      };
    }
  }

  /**
   * Export graduated students to Excel
   * GET /api/Student/graduated/export
   * @param {Object} filters - { fromDate?, toDate?, sessionId? }
   */
  async exportGraduatedStudents(filters = {}) {
    console.log("exportGraduatedStudents called with filters:", filters);
    try {
      const token = authService.getAccessToken();
      const params = new URLSearchParams();
      
      if (filters.fromDate) params.append('fromDate', filters.fromDate);
      if (filters.toDate) params.append('toDate', filters.toDate);
      if (filters.sessionId) params.append('sessionId', filters.sessionId);
      
      const response = await fetch(`${this.baseURL}/Student/graduated/export?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to export graduated students');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GraduatedStudents_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      return {
        success: true,
        message: 'Export completed successfully'
      };
    } catch (error) {
      console.error("Export graduated students error:", error);
      return {
        success: false,
        message: error.message || 'Failed to export graduated students'
      };
    }
  }

  /**
   * Get available graduation sessions for filtering
   * GET /api/Student/graduated/sessions
   */
  async getGraduationSessions() {
    console.log("getGraduationSessions called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Student/graduated/sessions');
      console.log("Get graduation sessions response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Sessions fetched successfully'
      };
    } catch (error) {
      console.error("Get graduation sessions error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch sessions'
      };
    }
  }
}

// Export singleton instance
const studentService = new StudentService();
export default studentService;

// Export individual functions for backward compatibility
export const selfRegisterStudent = async (data) => {
  return await studentService.selfRegisterStudent(data);
};

export const getStudentLimitStatus = async () => {
  return await studentService.getStudentLimitStatus();
};

export const createStudent = async (data) => {
  return await studentService.createStudent(data);
};

export const bulkCreateStudents = async (file) => {
  return await studentService.bulkCreateStudents(file);
};

export const downloadStudentTemplate = async () => {
  return await studentService.downloadTemplate();
};

export const getAllStudents = async (search = '', includeDeleted = false) => {
  return await studentService.getAllStudents(search, includeDeleted);
};

export const getStudentById = async (userId) => {
  return await studentService.getStudentById(userId);
};

export const updateStudent = async (userId, data) => {
  return await studentService.updateStudent(userId, data);
};

export const deleteStudent = async (userId) => {
  return await studentService.deleteStudent(userId);
};

export const restoreStudent = async (userId) => {
  return await studentService.restoreStudent(userId);
};

export const getGraduatedStudents = async (filters = {}) => {
  return await studentService.getGraduatedStudents(filters);
};

export const exportGraduatedStudents = async (filters = {}) => {
  return await studentService.exportGraduatedStudents(filters);
};

export const getGraduationSessions = async () => {
  return await studentService.getGraduationSessions();
};