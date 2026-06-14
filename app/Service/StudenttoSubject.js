// Service/SubjectRuleAndRegistrationService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class SubjectRuleAndRegistrationService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // ==================== RULE MANAGEMENT (Admin Only) ====================

  /**
   * Add a compulsory subject for a class arm
   * POST /api/SubjectRuleAndRegistration/compulsory/{classArmId}
   * @param {string} classArmId - UUID of the class arm
   * @param {Object} data - { subjectId }
   */
  async addCompulsorySubject(classArmId, data) {
    console.log("addCompulsorySubject called with:", classArmId, data);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/SubjectRuleAndRegistration/compulsory/${classArmId}`, data);
      console.log("Add compulsory subject response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Compulsory subject added successfully'
      };
    } catch (error) {
      console.error("Add compulsory subject error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add compulsory subject'
      };
    }
  }

  /**
   * Add an optional subject for a class arm
   * POST /api/SubjectRuleAndRegistration/optional/{classArmId}
   * @param {string} classArmId - UUID of the class arm
   * @param {Object} data - { subjectId }
   */
  async addOptionalSubject(classArmId, data) {
    console.log("addOptionalSubject called with:", classArmId, data);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/SubjectRuleAndRegistration/optional/${classArmId}`, data);
      console.log("Add optional subject response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Optional subject added successfully'
      };
    } catch (error) {
      console.error("Add optional subject error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add optional subject'
      };
    }
  }

  /**
   * Add a group selection rule for a class arm
   * POST /api/SubjectRuleAndRegistration/group/{classArmId}
   * @param {string} classArmId - UUID of the class arm
   * @param {Object} data - { subjectIds, minSelect, maxSelect }
   */
  async addGroupRule(classArmId, data) {
    console.log("addGroupRule called with:", classArmId, data);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/SubjectRuleAndRegistration/group/${classArmId}`, data);
      console.log("Add group rule response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Group rule added successfully'
      };
    } catch (error) {
      console.error("Add group rule error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add group rule'
      };
    }
  }

  /**
   * Get all rules for a class arm
   * GET /api/SubjectRuleAndRegistration/{classArmId}/rules
   * @param {string} classArmId - UUID of the class arm
   */
  async getRules(classArmId) {
    console.log("getRules called for:", classArmId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/SubjectRuleAndRegistration/${classArmId}/rules`);
      console.log("Get rules response:", response.data);
      return {
        success: true,
        data: response.data.rules || [],
        count: response.data.count || 0,
        message: 'Rules fetched successfully'
      };
    } catch (error) {
      console.error("Get rules error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch rules',
        data: []
      };
    }
  }

  /**
   * Delete a rule
   * DELETE /api/SubjectRuleAndRegistration/rule/{ruleId}
   * @param {string} ruleId - UUID of the rule
   */
  async deleteRule(ruleId) {
    console.log("deleteRule called for:", ruleId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/SubjectRuleAndRegistration/rule/${ruleId}`);
      console.log("Delete rule response:", response.data);
      return {
        success: true,
        message: response.data.message || 'Rule deleted successfully'
      };
    } catch (error) {
      console.error("Delete rule error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete rule'
      };
    }
  }

  // ==================== STUDENT REGISTRATION ====================

  /**
   * Get registration view for a student (what subjects they can select)
   * GET /api/SubjectRuleAndRegistration/student/view
   */
  async getRegistrationView() {
    console.log("getRegistrationView called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/SubjectRuleAndRegistration/student/view');
      console.log("Get registration view response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Registration view fetched successfully'
      };
    } catch (error) {
      console.error("Get registration view error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch registration view'
      };
    }
  }

  /**
   * Submit student registration
   * POST /api/SubjectRuleAndRegistration/student/submit
   * @param {Object} data - { subjectIds: string[] }
   */
  async submitRegistration(data) {
    console.log("submitRegistration called with:", data);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/SubjectRuleAndRegistration/student/submit', data);
      console.log("Submit registration response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Registration submitted successfully'
      };
    } catch (error) {
      console.error("Submit registration error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit registration'
      };
    }
  }

  /**
   * Get student's current registration
   * GET /api/SubjectRuleAndRegistration/student/registration
   */
  async getMyRegistration() {
    console.log("getMyRegistration called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/SubjectRuleAndRegistration/student/registration');
      console.log("Get my registration response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Registration fetched successfully'
      };
    } catch (error) {
      console.error("Get my registration error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch registration'
      };
    }
  }

  /**
   * Withdraw a subject from registration
   * POST /api/SubjectRuleAndRegistration/student/withdraw/{registrationId}
   * @param {string} registrationId - UUID of the registration
   */
  async withdrawSubject(registrationId) {
    console.log("withdrawSubject called for:", registrationId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/SubjectRuleAndRegistration/student/withdraw/${registrationId}`);
      console.log("Withdraw subject response:", response.data);
      return {
        success: true,
        message: response.data.message || 'Subject withdrawn successfully'
      };
    } catch (error) {
      console.error("Withdraw subject error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to withdraw subject'
      };
    }
  }

  // ==================== TEACHER OPERATIONS ====================

  /**
   * Get all registered students for a teacher
   * GET /api/SubjectRuleAndRegistration/teacher/registered-students
   * @param {string} termId - Optional term ID
   */
  async getTeacherRegisteredStudents(termId = null) {
    console.log("getTeacherRegisteredStudents called with termId:", termId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (termId) params.termId = termId;
      
      const response = await axiosInstance.get('/SubjectRuleAndRegistration/teacher/registered-students', { params });
      console.log("Get teacher registered students response:", response.data);
      return {
        success: true,
        data: response.data.students || [],
        count: response.data.count || 0,
        message: 'Registered students fetched successfully'
      };
    } catch (error) {
      console.error("Get teacher registered students error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch registered students',
        data: []
      };
    }
  }

  /**
   * Get pending registrations for a teacher
   * GET /api/SubjectRuleAndRegistration/teacher/pending
   */
  async getPendingRegistrations() {
    console.log("getPendingRegistrations called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/SubjectRuleAndRegistration/teacher/pending');
      console.log("Get pending registrations response:", response.data);
      return {
        success: true,
        data: response.data.registrations || [],
        count: response.data.count || 0,
        message: 'Pending registrations fetched successfully'
      };
    } catch (error) {
      console.error("Get pending registrations error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch pending registrations',
        data: []
      };
    }
  }

  /**
   * Teacher updates and approves a student's registration
   * POST /api/SubjectRuleAndRegistration/teacher/approve
   * @param {Object} data - { studentId, subjectIds }
   */
  async teacherUpdateAndApprove(data) {
    console.log("teacherUpdateAndApprove called with:", data);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/SubjectRuleAndRegistration/teacher/approve', data);
      console.log("Teacher approve response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Registration approved successfully'
      };
    } catch (error) {
      console.error("Teacher approve error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to approve registration'
      };
    }
  }

  /**
   * Teacher registers a student directly
   * POST /api/SubjectRuleAndRegistration/teacher/register-student/{studentId}
   * @param {string} studentId - UUID of the student
   * @param {Object} data - { subjectIds }
   */
  async teacherRegisterStudent(studentId, data) {
    console.log("teacherRegisterStudent called for:", studentId, data);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/SubjectRuleAndRegistration/teacher/register-student/${studentId}`, data);
      console.log("Teacher register student response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Student registered successfully'
      };
    } catch (error) {
      console.error("Teacher register student error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to register student'
      };
    }
  }

  // ==================== SCHOOL ADMIN VIEW REGISTERED STUDENTS ====================

  /**
   * Get all registered students for a specific class arm (School Admin)
   * This endpoint allows school admin to see which students are assigned to which subjects
   * GET /api/SubjectRuleAndRegistration/admin/class-arm/{classArmId}/registered-students
   * @param {string} classArmId - UUID of the class arm
   * @param {string} termId - Optional term ID
   */
  async getAdminRegisteredStudentsByClassArm(classArmId, termId = null) {
    console.log("getAdminRegisteredStudentsByClassArm called for:", classArmId, termId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (termId) params.termId = termId;
      
      const response = await axiosInstance.get(`/SubjectRuleAndRegistration/admin/class-arm/${classArmId}/registered-students`, { params });
      console.log("Get admin registered students response:", response.data);
      return {
        success: true,
        data: response.data.students || [],
        count: response.data.count || 0,
        message: 'Registered students fetched successfully'
      };
    } catch (error) {
      console.error("Get admin registered students error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch registered students',
        data: []
      };
    }
  }

  /**
   * Get all registered students across all class arms (School Admin)
   * GET /api/SubjectRuleAndRegistration/admin/all-registered-students
   * @param {string} termId - Optional term ID
   * @param {string} classArmId - Optional class arm filter
   * @param {string} search - Optional search term
   */
  async getAllRegisteredStudents(termId = null, classArmId = null, search = null) {
    console.log("getAllRegisteredStudents called with filters:", { termId, classArmId, search });
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (termId) params.termId = termId;
      if (classArmId) params.classArmId = classArmId;
      if (search) params.search = search;
      
      const response = await axiosInstance.get('/SubjectRuleAndRegistration/admin/all-registered-students', { params });
      console.log("Get all registered students response:", response.data);
      return {
        success: true,
        data: response.data.students || [],
        count: response.data.count || 0,
        message: 'Registered students fetched successfully'
      };
    } catch (error) {
      console.error("Get all registered students error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch registered students',
        data: []
      };
    }
  }

  /**
   * Get subjects registered by a specific student (School Admin)
   * GET /api/SubjectRuleAndRegistration/admin/student/{studentId}/subjects
   * @param {string} studentId - UUID of the student
   * @param {string} termId - Optional term ID
   */
  async getStudentRegisteredSubjects(studentId, termId = null) {
    console.log("getStudentRegisteredSubjects called for:", studentId, termId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (termId) params.termId = termId;
      
      const response = await axiosInstance.get(`/SubjectRuleAndRegistration/admin/student/${studentId}/subjects`, { params });
      console.log("Get student registered subjects response:", response.data);
      return {
        success: true,
        data: response.data.subjects || [],
        message: 'Student subjects fetched successfully'
      };
    } catch (error) {
      console.error("Get student registered subjects error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch student subjects',
        data: []
      };
    }
  }

  /**
   * Export registered students to Excel (School Admin)
   * GET /api/SubjectRuleAndRegistration/admin/export-registered-students
   * @param {string} termId - Optional term ID
   * @param {string} classArmId - Optional class arm filter
   */
  async exportRegisteredStudents(termId = null, classArmId = null) {
    console.log("exportRegisteredStudents called");
    try {
      const token = authService.getAccessToken();
      const params = new URLSearchParams();
      if (termId) params.append('termId', termId);
      if (classArmId) params.append('classArmId', classArmId);
      
      const response = await fetch(`${this.baseURL}/SubjectRuleAndRegistration/admin/export-registered-students?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to export registered students');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `RegisteredStudents_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      return {
        success: true,
        message: 'Export completed successfully'
      };
    } catch (error) {
      console.error("Export registered students error:", error);
      return {
        success: false,
        message: error.message || 'Failed to export registered students'
      };
    }
  }
}

// Export singleton instance
const subjectRuleAndRegistrationService = new SubjectRuleAndRegistrationService();
export default subjectRuleAndRegistrationService;

// Export individual functions for backward compatibility
export const addCompulsorySubject = async (classArmId, data) => {
  return await subjectRuleAndRegistrationService.addCompulsorySubject(classArmId, data);
};

export const addOptionalSubject = async (classArmId, data) => {
  return await subjectRuleAndRegistrationService.addOptionalSubject(classArmId, data);
};

export const addGroupRule = async (classArmId, data) => {
  return await subjectRuleAndRegistrationService.addGroupRule(classArmId, data);
};

export const getRules = async (classArmId) => {
  return await subjectRuleAndRegistrationService.getRules(classArmId);
};

export const deleteRule = async (ruleId) => {
  return await subjectRuleAndRegistrationService.deleteRule(ruleId);
};

export const getRegistrationView = async () => {
  return await subjectRuleAndRegistrationService.getRegistrationView();
};

export const submitRegistration = async (data) => {
  return await subjectRuleAndRegistrationService.submitRegistration(data);
};

export const getMyRegistration = async () => {
  return await subjectRuleAndRegistrationService.getMyRegistration();
};

export const withdrawSubject = async (registrationId) => {
  return await subjectRuleAndRegistrationService.withdrawSubject(registrationId);
};

export const getTeacherRegisteredStudents = async (termId = null) => {
  return await subjectRuleAndRegistrationService.getTeacherRegisteredStudents(termId);
};

export const getPendingRegistrations = async () => {
  return await subjectRuleAndRegistrationService.getPendingRegistrations();
};

export const teacherUpdateAndApprove = async (data) => {
  return await subjectRuleAndRegistrationService.teacherUpdateAndApprove(data);
};

export const teacherRegisterStudent = async (studentId, data) => {
  return await subjectRuleAndRegistrationService.teacherRegisterStudent(studentId, data);
};

// School Admin specific exports
export const getAdminRegisteredStudentsByClassArm = async (classArmId, termId = null) => {
  return await subjectRuleAndRegistrationService.getAdminRegisteredStudentsByClassArm(classArmId, termId);
};

export const getAllRegisteredStudents = async (termId = null, classArmId = null, search = null) => {
  return await subjectRuleAndRegistrationService.getAllRegisteredStudents(termId, classArmId, search);
};

export const getStudentRegisteredSubjects = async (studentId, termId = null) => {
  return await subjectRuleAndRegistrationService.getStudentRegisteredSubjects(studentId, termId);
};

export const exportRegisteredStudents = async (termId = null, classArmId = null) => {
  return await subjectRuleAndRegistrationService.exportRegisteredStudents(termId, classArmId);
};