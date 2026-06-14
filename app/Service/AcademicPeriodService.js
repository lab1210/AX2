// Service/AcademicPeriodService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class AcademicPeriodService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // ==================== SESSION ENDPOINTS ====================

  // Create a new academic session
  async createSession(sessionData) {
    console.log("createSession called with:", sessionData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/AcademicPeriod/session', sessionData);
      console.log("Create session response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Session created successfully'
      };
    } catch (error) {
      console.error("Create session error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create session'
      };
    }
  }

  // Get session by ID
  async getSessionById(sessionId) {
    console.log("getSessionById called for:", sessionId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/AcademicPeriod/session/${sessionId}`);
      console.log("Get session by id response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Session fetched successfully'
      };
    } catch (error) {
      console.error("Get session by id error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch session'
      };
    }
  }

  // Get all sessions for the school
  async getAllSessions(includeInactive = false, includeDeleted = false) {
    console.log("getAllSessions called with includeInactive:", includeInactive, "includeDeleted:", includeDeleted);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/AcademicPeriod/sessions', {
        params: { includeInactive, includeDeleted }
      });
      console.log("Get all sessions response:", response.data);
      return {
        success: true,
        data: response.data.sessions || [],
        count: response.data.count || 0,
        message: 'Sessions fetched successfully'
      };
    } catch (error) {
      console.error("Get all sessions error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch sessions'
      };
    }
  }

  // Update a session
  async updateSession(sessionId, updateData) {
    console.log("updateSession called for:", sessionId, "with data:", updateData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/AcademicPeriod/session/${sessionId}`, updateData);
      console.log("Update session response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Session updated successfully'
      };
    } catch (error) {
      console.error("Update session error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update session'
      };
    }
  }

  // Delete a session (soft delete)
  async deleteSession(sessionId) {
    console.log("deleteSession called for:", sessionId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/AcademicPeriod/session/${sessionId}`);
      console.log("Delete session response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Session deleted successfully'
      };
    } catch (error) {
      console.error("Delete session error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete session'
      };
    }
  }

  // Set a session as active
  async setActiveSession(sessionId) {
    console.log("setActiveSession called for:", sessionId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/AcademicPeriod/session/${sessionId}/set-active`);
      console.log("Set active session response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data?.message || 'Session set as active'
      };
    } catch (error) {
      console.error("Set active session error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to set active session'
      };
    }
  }

  // Get currently active session
  async getActiveSession() {
    console.log("getActiveSession called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/AcademicPeriod/active-session');
      console.log("Get active session response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Active session fetched successfully'
      };
    } catch (error) {
      console.error("Get active session error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch active session'
      };
    }
  }

  // ==================== TERM ENDPOINTS ====================

  // Create a new term
  async createTerm(termData) {
    console.log("createTerm called with:", termData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/AcademicPeriod/term', termData);
      console.log("Create term response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Term created successfully'
      };
    } catch (error) {
      console.error("Create term error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create term'
      };
    }
  }

  // Get term by ID
  async getTermById(termId) {
    console.log("getTermById called for:", termId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/AcademicPeriod/term/${termId}`);
      console.log("Get term by id response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Term fetched successfully'
      };
    } catch (error) {
      console.error("Get term by id error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch term'
      };
    }
  }

  // Get all terms for the school
  async getAllTerms(yearId = null, includeInactive = false, includeDeleted = false) {
    console.log("getAllTerms called with yearId:", yearId, "includeInactive:", includeInactive, "includeDeleted:", includeDeleted);
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = { includeInactive, includeDeleted };
      if (yearId) {
        params.yearId = yearId;
      }
      const response = await axiosInstance.get('/AcademicPeriod/terms', { params });
      console.log("Get all terms response:", response.data);
      return {
        success: true,
        data: response.data.terms || [],
        count: response.data.count || 0,
        message: 'Terms fetched successfully'
      };
    } catch (error) {
      console.error("Get all terms error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch terms'
      };
    }
  }

  // Update a term
  async updateTerm(termId, updateData) {
    console.log("updateTerm called for:", termId, "with data:", updateData);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/AcademicPeriod/term/${termId}`, updateData);
      console.log("Update term response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Term updated successfully'
      };
    } catch (error) {
      console.error("Update term error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update term'
      };
    }
  }

  // Delete a term (soft delete)
  async deleteTerm(termId) {
    console.log("deleteTerm called for:", termId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/AcademicPeriod/term/${termId}`);
      console.log("Delete term response:", response.data);
      return {
        success: true,
        message: response.data?.message || 'Term deleted successfully'
      };
    } catch (error) {
      console.error("Delete term error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete term'
      };
    }
  }

  // Set a term as active
  async setActiveTerm(termId) {
    console.log("setActiveTerm called for:", termId);
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/AcademicPeriod/term/${termId}/set-active`);
      console.log("Set active term response:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data?.message || 'Term set as active'
      };
    } catch (error) {
      console.error("Set active term error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to set active term'
      };
    }
  }

  // Get currently active term
  async getActiveTerm() {
    console.log("getActiveTerm called");
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/AcademicPeriod/active-term');
      console.log("Get active term response:", response.data);
      return {
        success: true,
        data: response.data,
        message: 'Active term fetched successfully'
      };
    } catch (error) {
      console.error("Get active term error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch active term'
      };
    }
  }
}

// Export singleton instance
const academicPeriodService = new AcademicPeriodService();
export default academicPeriodService;

// Export individual functions for backward compatibility
export const createSession = async (data) => {
  return await academicPeriodService.createSession(data);
};

export const getSessionById = async (sessionId) => {
  return await academicPeriodService.getSessionById(sessionId);
};

export const getAllSessions = async (includeInactive = false, includeDeleted = false) => {
  return await academicPeriodService.getAllSessions(includeInactive, includeDeleted);
};

export const updateSession = async (sessionId, data) => {
  return await academicPeriodService.updateSession(sessionId, data);
};

export const deleteSession = async (sessionId) => {
  return await academicPeriodService.deleteSession(sessionId);
};

export const setActiveSession = async (sessionId) => {
  return await academicPeriodService.setActiveSession(sessionId);
};

export const getActiveSession = async () => {
  return await academicPeriodService.getActiveSession();
};

export const createTerm = async (data) => {
  return await academicPeriodService.createTerm(data);
};

export const getTermById = async (termId) => {
  return await academicPeriodService.getTermById(termId);
};

export const getAllTerms = async (yearId = null, includeInactive = false, includeDeleted = false) => {
  return await academicPeriodService.getAllTerms(yearId, includeInactive, includeDeleted);
};

export const updateTerm = async (termId, data) => {
  return await academicPeriodService.updateTerm(termId, data);
};

export const deleteTerm = async (termId) => {
  return await academicPeriodService.deleteTerm(termId);
};

export const setActiveTerm = async (termId) => {
  return await academicPeriodService.setActiveTerm(termId);
};

export const getActiveTerm = async () => {
  return await academicPeriodService.getActiveTerm();
};