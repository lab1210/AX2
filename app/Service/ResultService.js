// Service/ResultManagementService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class ResultManagementService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // ==================== ASSESSMENT CATEGORIES ====================

  /**
   * Create assessment category
   * POST /api/AssessmentCategory
   */
  async createAssessmentCategory(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/AssessmentCategory', data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Assessment category created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create assessment category'
      };
    }
  }

  /**
   * Update assessment category
   * PUT /api/AssessmentCategory/{categoryId}
   */
  async updateAssessmentCategory(categoryId, data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/AssessmentCategory/${categoryId}`, data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Assessment category updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update assessment category'
      };
    }
  }

  /**
   * Get all assessment categories
   * GET /api/AssessmentCategory
   */
  async getAllAssessmentCategories(isActive = null, isExam = null) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (isActive !== null) params.isActive = isActive;
      if (isExam !== null) params.isExam = isExam;
      const response = await axiosInstance.get('/AssessmentCategory', { params });
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Assessment categories fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch assessment categories',
        data: []
      };
    }
  }

  /**
   * Get exam categories
   * GET /api/AssessmentCategory/exam
   */
  async getExamCategories(isActive = null) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (isActive !== null) params.isActive = isActive;
      const response = await axiosInstance.get('/AssessmentCategory/exam', { params });
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Exam categories fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch exam categories',
        data: []
      };
    }
  }

  /**
   * Get non-exam (CA) categories
   * GET /api/AssessmentCategory/non-exam
   */
  async getNonExamCategories(isActive = null) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (isActive !== null) params.isActive = isActive;
      const response = await axiosInstance.get('/AssessmentCategory/non-exam', { params });
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Non-exam categories fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch non-exam categories',
        data: []
      };
    }
  }

  /**
   * Get assessment category by ID
   * GET /api/AssessmentCategory/{categoryId}
   */
  async getAssessmentCategoryById(categoryId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/AssessmentCategory/${categoryId}`);
      return {
        success: true,
        data: response.data,
        message: 'Assessment category fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch assessment category'
      };
    }
  }

  /**
   * Bulk create assessment categories
   * POST /api/AssessmentCategory/bulk
   */
  async bulkCreateAssessmentCategories(categories) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/AssessmentCategory/bulk', categories);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Assessment categories created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create assessment categories'
      };
    }
  }

  /**
   * Toggle assessment category status
   * PATCH /api/AssessmentCategory/{categoryId}/toggle
   */
  async toggleAssessmentCategoryStatus(categoryId, isActive) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.patch(`/AssessmentCategory/${categoryId}/toggle`, null, {
        params: { isActive }
      });
      return {
        success: true,
        message: response.data.message || `Assessment category ${isActive ? 'activated' : 'deactivated'} successfully`
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to toggle assessment category status'
      };
    }
  }

  /**
   * Delete assessment category
   * DELETE /api/AssessmentCategory/{categoryId}
   */
  async deleteAssessmentCategory(categoryId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/AssessmentCategory/${categoryId}`);
      return {
        success: true,
        message: response.data.message || 'Assessment category deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete assessment category'
      };
    }
  }

  // ==================== GRADES ====================

  /**
   * Create grade
   * POST /api/Grade
   */
  async createGrade(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/Grade', data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Grade created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create grade'
      };
    }
  }

  /**
   * Update grade
   * PUT /api/Grade/{gradeId}
   */
  async updateGrade(gradeId, data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/Grade/${gradeId}`, data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Grade updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update grade'
      };
    }
  }

  /**
   * Get all grades
   * GET /api/Grade
   */
  async getAllGrades() {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Grade');
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Grades fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch grades',
        data: []
      };
    }
  }

  /**
   * Get grade by ID
   * GET /api/Grade/{gradeId}
   */
  async getGradeById(gradeId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Grade/${gradeId}`);
      return {
        success: true,
        data: response.data,
        message: 'Grade fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch grade'
      };
    }
  }

  /**
   * Get grade by score
   * GET /api/Grade/score/{score}
   */
  async getGradeByScore(score) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Grade/score/${score}`);
      return {
        success: true,
        data: response.data,
        message: 'Grade fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch grade'
      };
    }
  }

  /**
   * Delete grade
   * DELETE /api/Grade/{gradeId}
   */
  async deleteGrade(gradeId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/Grade/${gradeId}`);
      return {
        success: true,
        message: response.data.message || 'Grade deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete grade'
      };
    }
  }

  // ==================== ANNUAL WEIGHTS ====================

  /**
   * Create or update annual weights
   * POST /api/AnnualWeight/weights
   */
  async createOrUpdateWeights(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/AnnualWeight/weights', data);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Annual weights saved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to save annual weights'
      };
    }
  }

  /**
   * Update a single annual weight
   * PUT /api/AnnualWeight/{weightId}
   */
  async updateAnnualWeight(weightId, data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/AnnualWeight/${weightId}`, data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Annual weight updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update annual weight'
      };
    }
  }

  /**
   * Get all annual weights
   * GET /api/AnnualWeight
   */
  async getAllAnnualWeights(classYearId = null, sessionId = null) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (classYearId) params.classYearId = classYearId;
      if (sessionId) params.sessionId = sessionId;
      const response = await axiosInstance.get('/AnnualWeight', { params });
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Annual weights fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch annual weights',
        data: []
      };
    }
  }

  /**
   * Get annual weight summary
   * GET /api/AnnualWeight/summary/{classYearId}/{sessionId}
   */
  async getAnnualWeightSummary(classYearId, sessionId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/AnnualWeight/summary/${classYearId}/${sessionId}`);
      return {
        success: true,
        data: response.data,
        message: 'Annual weight summary fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch annual weight summary'
      };
    }
  }

  /**
   * Get annual weight by ID
   * GET /api/AnnualWeight/{weightId}
   */
  async getAnnualWeightById(weightId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/AnnualWeight/${weightId}`);
      return {
        success: true,
        data: response.data,
        message: 'Annual weight fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch annual weight'
      };
    }
  }

  /**
   * Delete annual weight
   * DELETE /api/AnnualWeight/{weightId}
   */
  async deleteAnnualWeight(weightId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/AnnualWeight/${weightId}`);
      return {
        success: true,
        message: response.data.message || 'Annual weight deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete annual weight'
      };
    }
  }

  // ==================== RESULT CONFIGURATION ====================

  /**
   * Create or update result configuration
   * POST /api/ResultConfiguration
   */
  async createOrUpdateConfiguration(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/ResultConfiguration', data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Result configuration saved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to save result configuration'
      };
    }
  }

  /**
   * Update result configuration
   * PUT /api/ResultConfiguration
   */
  async updateConfiguration(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put('/ResultConfiguration', data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Result configuration updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update result configuration'
      };
    }
  }

  /**
   * Get result configuration
   * GET /api/ResultConfiguration
   */
  async getConfiguration() {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/ResultConfiguration');
      return {
        success: true,
        data: response.data,
        message: 'Result configuration fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch result configuration',
        data: null
      };
    }
  }

  /**
   * Delete result configuration
   * DELETE /api/ResultConfiguration
   */
  async deleteConfiguration() {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete('/ResultConfiguration');
      return {
        success: true,
        message: response.data.message || 'Result configuration deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete result configuration'
      };
    }
  }

  // ==================== TERM RESULT CALCULATIONS ====================

  /**
   * Calculate term results in bulk
   * POST /api/ResultCalculation/term/calculate
   */
  async calculateTermResults(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/ResultCalculation/term/calculate', data);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Term results calculated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to calculate term results'
      };
    }
  }

  /**
   * Get student term report
   * GET /api/ResultCalculation/term/student/{studentId}/term/{termId}
   */
  async getStudentTermReport(studentId, termId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/ResultCalculation/term/student/${studentId}/term/${termId}`);
      return {
        success: true,
        data: response.data,
        message: 'Student term report fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch student term report'
      };
    }
  }

  /**
   * Get class term report
   * GET /api/ResultCalculation/term/class/{classArmId}/term/{termId}
   */
  async getClassTermReport(classArmId, termId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/ResultCalculation/term/class/${classArmId}/term/${termId}`);
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Class term report fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch class term report',
        data: []
      };
    }
  }

  /**
   * Get term results by subject
   * GET /api/ResultCalculation/term/subject/{subjectId}/term/{termId}
   */
  async getTermResultsBySubject(subjectId, termId, classArmId = null) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = classArmId ? { classArmId } : {};
      const response = await axiosInstance.get(`/ResultCalculation/term/subject/${subjectId}/term/${termId}`, { params });
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Term results fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch term results',
        data: []
      };
    }
  }

  // ==================== ANNUAL RESULT CALCULATIONS ====================

  /**
   * Calculate annual results in bulk
   * POST /api/ResultCalculation/annual/calculate
   */
  async calculateAnnualResults(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/ResultCalculation/annual/calculate', data);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Annual results calculated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to calculate annual results'
      };
    }
  }

  /**
   * Get student annual report
   * GET /api/ResultCalculation/annual/student/{studentId}/session/{sessionId}
   */
  async getStudentAnnualReport(studentId, sessionId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/ResultCalculation/annual/student/${studentId}/session/${sessionId}`);
      return {
        success: true,
        data: response.data,
        message: 'Student annual report fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch student annual report'
      };
    }
  }

  /**
   * Get class annual report
   * GET /api/ResultCalculation/annual/class/{classYearId}/session/{sessionId}
   */
  async getClassAnnualReport(classYearId, sessionId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/ResultCalculation/annual/class/${classYearId}/session/${sessionId}`);
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Class annual report fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch class annual report',
        data: []
      };
    }
  }

  /**
   * Get annual results by subject
   * GET /api/ResultCalculation/annual/subject/{subjectId}/session/{sessionId}
   */
  async getAnnualResultsBySubject(subjectId, sessionId, classYearId = null) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = classYearId ? { classYearId } : {};
      const response = await axiosInstance.get(`/ResultCalculation/annual/subject/${subjectId}/session/${sessionId}`, { params });
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Annual results fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch annual results',
        data: []
      };
    }
  }

  // ==================== RESULT VISIBILITY ====================

  /**
   * Create or update result visibility
   * POST /api/ResultVisibility
   */
  async createOrUpdateVisibility(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/ResultVisibility', data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Result visibility saved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to save result visibility'
      };
    }
  }

  /**
   * Update result visibility
   * PUT /api/ResultVisibility/{visibilityId}
   */
  async updateVisibility(visibilityId, data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/ResultVisibility/${visibilityId}`, data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Result visibility updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update result visibility'
      };
    }
  }

  /**
   * Get all visibilities
   * GET /api/ResultVisibility
   */
  async getAllVisibilities(termId = null) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = termId ? { termId } : {};
      const response = await axiosInstance.get('/ResultVisibility', { params });
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Visibilities fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch visibilities',
        data: []
      };
    }
  }

  /**
   * Get visibility by term
   * GET /api/ResultVisibility/term/{termId}
   */
  async getVisibilityByTerm(termId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/ResultVisibility/term/${termId}`);
      return {
        success: true,
        data: response.data,
        message: 'Visibility fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch visibility'
      };
    }
  }

  /**
   * Check result visibility
   * GET /api/ResultVisibility/check
   */
  async checkResultVisibility(termId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/ResultVisibility/check', { params: { termId } });
      return {
        success: true,
        data: response.data,
        message: 'Result visibility check completed'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check result visibility'
      };
    }
  }

  /**
   * Delete visibility
   * DELETE /api/ResultVisibility/{visibilityId}
   */
  async deleteVisibility(visibilityId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/ResultVisibility/${visibilityId}`);
      return {
        success: true,
        message: response.data.message || 'Result visibility deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete result visibility'
      };
    }
  }

  // ==================== COMMENT TOPICS ====================

  /**
   * Create comment topic
   * POST /api/Comment/topics
   */
  async createCommentTopic(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/Comment/topics', data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Topic created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create topic'
      };
    }
  }

  /**
   * Update comment topic
   * PUT /api/Comment/topics/{topicId}
   */
  async updateCommentTopic(topicId, data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/Comment/topics/${topicId}`, data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Topic updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update topic'
      };
    }
  }

  /**
   * Get all comment topics
   * GET /api/Comment/topics
   */
  async getAllCommentTopics(isActive = null) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = {};
      if (isActive !== null) params.isActive = isActive;
      const response = await axiosInstance.get('/Comment/topics', { params });
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Topics fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch topics',
        data: []
      };
    }
  }

  /**
   * Get comment topic by ID
   * GET /api/Comment/topics/{topicId}
   */
  async getCommentTopicById(topicId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Comment/topics/${topicId}`);
      return {
        success: true,
        data: response.data,
        message: 'Topic fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch topic'
      };
    }
  }

  /**
   * Delete comment topic
   * DELETE /api/Comment/topics/{topicId}
   */
  async deleteCommentTopic(topicId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/Comment/topics/${topicId}`);
      return {
        success: true,
        message: response.data.message || 'Topic deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete topic'
      };
    }
  }

  // ==================== CLASS TEACHER COMMENTS ====================

  /**
   * Create or update comments for a student
   * POST /api/Comment/comments
   */
  async createOrUpdateComments(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/Comment/comments', data);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Comments saved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to save comments'
      };
    }
  }

  /**
   * Update a comment
   * PUT /api/Comment/comments/{commentId}
   */
  async updateComment(commentId, data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.put(`/Comment/comments/${commentId}`, data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Comment updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update comment'
      };
    }
  }

  /**
   * Get student comments summary
   * GET /api/Comment/comments/student/{studentId}/term/{termId}
   */
  async getStudentCommentsSummary(studentId, termId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Comment/comments/student/${studentId}/term/${termId}`);
      return {
        success: true,
        data: response.data,
        message: 'Student comments fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch student comments'
      };
    }
  }

  /**
   * Get class comments
   * GET /api/Comment/comments/class/{classArmId}/term/{termId}
   */
  async getClassComments(classArmId, termId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Comment/comments/class/${classArmId}/term/${termId}`);
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Class comments fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch class comments',
        data: []
      };
    }
  }

  /**
   * Get comment by ID
   * GET /api/Comment/comments/{commentId}
   */
  async getCommentById(commentId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Comment/comments/${commentId}`);
      return {
        success: true,
        data: response.data,
        message: 'Comment fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch comment'
      };
    }
  }

  /**
   * Delete comment
   * DELETE /api/Comment/comments/{commentId}
   */
  async deleteComment(commentId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/Comment/comments/${commentId}`);
      return {
        success: true,
        message: response.data.message || 'Comment deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete comment'
      };
    }
  }

  /**
   * Delete all comments for a student
   * DELETE /api/Comment/comments/student/{studentId}/term/{termId}
   */
  async deleteAllCommentsForStudent(studentId, termId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/Comment/comments/student/${studentId}/term/${termId}`);
      return {
        success: true,
        message: response.data.message || 'All comments deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete comments'
      };
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * Validate CA and Exam scores
   */
  validateScores(caScore, examScore) {
    const total = caScore + examScore;
    return {
      isValid: total === 100,
      total: total,
      message: total === 100 
        ? "✓ Valid configuration" 
        : `✗ CA + Exam = ${total}, must equal 100`
    };
  }

  /**
   * Get score color based on percentage
   */
  getScoreColor(percentage) {
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  }

  /**
   * Get grade based on percentage (fallback)
   */
  getGradeFallback(percentage) {
    if (percentage >= 70) return 'A';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 45) return 'D';
    if (percentage >= 40) return 'E';
    return 'F';
  }

  /**
   * Get remark based on percentage (fallback)
   */
  getRemarkFallback(percentage) {
    if (percentage >= 70) return 'Excellent';
    if (percentage >= 60) return 'Very Good';
    if (percentage >= 50) return 'Good';
    if (percentage >= 45) return 'Fair';
    if (percentage >= 40) return 'Pass';
    return 'Fail';
  }
}

// Export singleton instance
const resultManagementService = new ResultManagementService();
export default resultManagementService;

// Export individual functions for backward compatibility
// Assessment Categories
export const createAssessmentCategory = (data) => resultManagementService.createAssessmentCategory(data);
export const updateAssessmentCategory = (categoryId, data) => resultManagementService.updateAssessmentCategory(categoryId, data);
export const getAllAssessmentCategories = (isActive, isExam) => resultManagementService.getAllAssessmentCategories(isActive, isExam);
export const getExamCategories = (isActive) => resultManagementService.getExamCategories(isActive);
export const getNonExamCategories = (isActive) => resultManagementService.getNonExamCategories(isActive);
export const getAssessmentCategoryById = (categoryId) => resultManagementService.getAssessmentCategoryById(categoryId);
export const bulkCreateAssessmentCategories = (categories) => resultManagementService.bulkCreateAssessmentCategories(categories);
export const toggleAssessmentCategoryStatus = (categoryId, isActive) => resultManagementService.toggleAssessmentCategoryStatus(categoryId, isActive);
export const deleteAssessmentCategory = (categoryId) => resultManagementService.deleteAssessmentCategory(categoryId);

// Grades
export const createGrade = (data) => resultManagementService.createGrade(data);
export const updateGrade = (gradeId, data) => resultManagementService.updateGrade(gradeId, data);
export const getAllGrades = () => resultManagementService.getAllGrades();
export const getGradeById = (gradeId) => resultManagementService.getGradeById(gradeId);
export const getGradeByScore = (score) => resultManagementService.getGradeByScore(score);
export const deleteGrade = (gradeId) => resultManagementService.deleteGrade(gradeId);

// Annual Weights
export const createOrUpdateWeights = (data) => resultManagementService.createOrUpdateWeights(data);
export const updateAnnualWeight = (weightId, data) => resultManagementService.updateAnnualWeight(weightId, data);
export const getAllAnnualWeights = (classYearId, sessionId) => resultManagementService.getAllAnnualWeights(classYearId, sessionId);
export const getAnnualWeightSummary = (classYearId, sessionId) => resultManagementService.getAnnualWeightSummary(classYearId, sessionId);
export const getAnnualWeightById = (weightId) => resultManagementService.getAnnualWeightById(weightId);
export const deleteAnnualWeight = (weightId) => resultManagementService.deleteAnnualWeight(weightId);

// Result Configuration
export const createOrUpdateConfiguration = (data) => resultManagementService.createOrUpdateConfiguration(data);
export const updateConfiguration = (data) => resultManagementService.updateConfiguration(data);
export const getConfiguration = () => resultManagementService.getConfiguration();
export const deleteConfiguration = () => resultManagementService.deleteConfiguration();

// Term Results
export const calculateTermResults = (data) => resultManagementService.calculateTermResults(data);
export const getStudentTermReport = (studentId, termId) => resultManagementService.getStudentTermReport(studentId, termId);
export const getClassTermReport = (classArmId, termId) => resultManagementService.getClassTermReport(classArmId, termId);
export const getTermResultsBySubject = (subjectId, termId, classArmId) => resultManagementService.getTermResultsBySubject(subjectId, termId, classArmId);

// Annual Results
export const calculateAnnualResults = (data) => resultManagementService.calculateAnnualResults(data);
export const getStudentAnnualReport = (studentId, sessionId) => resultManagementService.getStudentAnnualReport(studentId, sessionId);
export const getClassAnnualReport = (classYearId, sessionId) => resultManagementService.getClassAnnualReport(classYearId, sessionId);
export const getAnnualResultsBySubject = (subjectId, sessionId, classYearId) => resultManagementService.getAnnualResultsBySubject(subjectId, sessionId, classYearId);

// Result Visibility
export const createOrUpdateVisibility = (data) => resultManagementService.createOrUpdateVisibility(data);
export const updateVisibility = (visibilityId, data) => resultManagementService.updateVisibility(visibilityId, data);
export const getAllVisibilities = (termId) => resultManagementService.getAllVisibilities(termId);
export const getVisibilityByTerm = (termId) => resultManagementService.getVisibilityByTerm(termId);
export const checkResultVisibility = (termId) => resultManagementService.checkResultVisibility(termId);
export const deleteVisibility = (visibilityId) => resultManagementService.deleteVisibility(visibilityId);

// Comment Topics
export const createCommentTopic = (data) => resultManagementService.createCommentTopic(data);
export const updateCommentTopic = (topicId, data) => resultManagementService.updateCommentTopic(topicId, data);
export const getAllCommentTopics = (isActive) => resultManagementService.getAllCommentTopics(isActive);
export const getCommentTopicById = (topicId) => resultManagementService.getCommentTopicById(topicId);
export const deleteCommentTopic = (topicId) => resultManagementService.deleteCommentTopic(topicId);

// Comments
export const createOrUpdateComments = (data) => resultManagementService.createOrUpdateComments(data);
export const updateComment = (commentId, data) => resultManagementService.updateComment(commentId, data);
export const getStudentCommentsSummary = (studentId, termId) => resultManagementService.getStudentCommentsSummary(studentId, termId);
export const getClassComments = (classArmId, termId) => resultManagementService.getClassComments(classArmId, termId);
export const getCommentById = (commentId) => resultManagementService.getCommentById(commentId);
export const deleteComment = (commentId) => resultManagementService.deleteComment(commentId);
export const deleteAllCommentsForStudent = (studentId, termId) => resultManagementService.deleteAllCommentsForStudent(studentId, termId);