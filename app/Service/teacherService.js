// Service/TeacherService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class TeacherService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // ==================== SELF REGISTRATION (PUBLIC) ====================

  // Self registration using token
  async selfRegisterTeacher(registrationData) {
    console.log("selfRegisterTeacher called with:", registrationData);
    try {
      const response = await fetch(`${this.baseURL}/Teacher/self-register`, {
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

  // ==================== SCHOOLADMIN OPERATIONS ====================

  // Create a single teacher
  async createTeacher(teacherData) {
    console.log("createTeacher called with:", teacherData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/Teacher', teacherData);
      console.log("Create teacher response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Teacher created successfully'
      };
    } catch (error) {
      console.error("Create teacher error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create teacher'
      };
    }
  }

  // Bulk create teachers via Excel upload
  async bulkCreateTeachers(file) {
    console.log("bulkCreateTeachers called");
    try {
      const token = authService.getAccessToken();
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${this.baseURL}/Teacher/bulk`, {
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
        message: data.message || 'Failed to process bulk upload'
      };
    } catch (error) {
      console.error("Bulk create error:", error);
      return {
        success: false,
        message: error.message || 'Failed to process bulk upload'
      };
    }
  }

  // Download Excel template
  async downloadTemplate() {
    console.log("downloadTemplate called");
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${this.baseURL}/Teacher/template`, {
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
      a.download = 'Teacher_Template.xlsx';
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

  // Get all teachers
  async getAllTeachers(search = '', includeDeleted = false) {
    console.log("getAllTeachers called with search:", search, "includeDeleted:", includeDeleted);
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (search) params.search = search;
      if (includeDeleted) params.includeDeleted = includeDeleted;
      
      const response = await axiosInstance.get('/Teacher', { params });
      console.log("Get all teachers response:", response.data);
      return {
        success: true,
        data: response.data.teachers || [],
        count: response.data.count || 0,
        message: 'Teachers fetched successfully'
      };
    } catch (error) {
      console.error("Get all teachers error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch teachers'
      };
    }
  }

  // Get teacher by ID
  async getTeacherById(userId) {
    console.log("getTeacherById called for:", userId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Teacher/${userId}`);
      console.log("Get teacher by id response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Teacher fetched successfully'
      };
    } catch (error) {
      console.error("Get teacher by id error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch teacher'
      };
    }
  }

  // Update a teacher
  async updateTeacher(userId, updateData) {
    console.log("updateTeacher called for:", userId, "with data:", updateData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/Teacher/${userId}`, updateData);
      console.log("Update teacher response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Teacher updated successfully'
      };
    } catch (error) {
      console.error("Update teacher error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update teacher'
      };
    }
  }

  // Soft delete a teacher
  async deleteTeacher(userId) {
    console.log("deleteTeacher called for:", userId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/Teacher/${userId}`);
      console.log("Delete teacher response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Teacher deleted successfully'
      };
    } catch (error) {
      console.error("Delete teacher error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete teacher'
      };
    }
  }

  // Restore a soft-deleted teacher
  async restoreTeacher(userId) {
    console.log("restoreTeacher called for:", userId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/Teacher/${userId}/restore`);
      console.log("Restore teacher response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Teacher restored successfully'
      };
    } catch (error) {
      console.error("Restore teacher error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to restore teacher'
      };
    }
  }
}

// Export singleton instance
const teacherService = new TeacherService();
export default teacherService;

// Export individual functions for backward compatibility
export const selfRegisterTeacher = async (data) => {
  return await teacherService.selfRegisterTeacher(data);
};

export const createTeacher = async (data) => {
  return await teacherService.createTeacher(data);
};

export const bulkCreateTeachers = async (file) => {
  return await teacherService.bulkCreateTeachers(file);
};

export const downloadTeacherTemplate = async () => {
  return await teacherService.downloadTemplate();
};

export const getAllTeachers = async (search = '', includeDeleted = false) => {
  return await teacherService.getAllTeachers(search, includeDeleted);
};

export const getTeacherById = async (userId) => {
  return await teacherService.getTeacherById(userId);
};

export const updateTeacher = async (userId, data) => {
  return await teacherService.updateTeacher(userId, data);
};

export const deleteTeacher = async (userId) => {
  return await teacherService.deleteTeacher(userId);
};

export const restoreTeacher = async (userId) => {
  return await teacherService.restoreTeacher(userId);
};