// Service/NotificationService.js

import authService from "@/Service/AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class NotificationService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get Axios instance with auth token
  getAxiosInstance() {
    return authService.getAxiosInstance();
  }

  // ==================== SEND NOTIFICATION ====================

  /**
   * Send notification to selected recipients
   * POST /api/Notification
   * @param {Object} data - { title, content, type, recipientGroup, targetId?, expiresAt? }
   */
  async sendNotification(data) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/Notification', data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Notification sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send notification'
      };
    }
  }

  // ==================== RECEIVE NOTIFICATIONS ====================

  /**
   * Get my notifications (for current user)
   * GET /api/Notification
   * @param {boolean} isRead - Filter by read status
   * @param {number} page - Page number
   * @param {number} pageSize - Items per page
   */
  async getMyNotifications(isRead = null, page = 1, pageSize = 20) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const params = { page, pageSize };
      if (isRead !== null) params.isRead = isRead;
      const response = await axiosInstance.get('/Notification', { params });
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Notifications fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch notifications',
        data: []
      };
    }
  }

  /**
   * Get notification stats
   * GET /api/Notification/stats
   */
  async getNotificationStats() {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Notification/stats');
      return {
        success: true,
        data: response.data,
        message: 'Notification stats fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch stats'
      };
    }
  }

  /**
   * Get notification by ID
   * GET /api/Notification/{notificationId}
   * @param {string} notificationId - Notification ID
   */
  async getNotificationById(notificationId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Notification/${notificationId}`);
      return {
        success: true,
        data: response.data,
        message: 'Notification fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch notification'
      };
    }
  }

  /**
   * Mark notification as read
   * POST /api/Notification/{notificationId}/read
   * @param {string} notificationId - Notification ID
   */
  async markAsRead(notificationId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post(`/Notification/${notificationId}/read`);
      return {
        success: true,
        message: response.data.message || 'Notification marked as read'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark as read'
      };
    }
  }

  /**
   * Mark all notifications as read
   * POST /api/Notification/read-all
   */
  async markAllAsRead() {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post('/Notification/read-all');
      return {
        success: true,
        message: response.data.message || 'All notifications marked as read'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark all as read'
      };
    }
  }

  // ==================== SENT NOTIFICATIONS ====================

  /**
   * Get sent notifications (for sender)
   * GET /api/Notification/sent
   * @param {number} page - Page number
   * @param {number} pageSize - Items per page
   */
  async getSentNotifications(page = 1, pageSize = 20) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Notification/sent', { params: { page, pageSize } });
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'Sent notifications fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch sent notifications',
        data: []
      };
    }
  }

  // ==================== ADMIN VIEW ====================

  /**
   * Get all notifications (Admin only)
   * GET /api/Notification/all
   * @param {number} page - Page number
   * @param {number} pageSize - Items per page
   */
  async getAllNotifications(page = 1, pageSize = 20) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Notification/all', { params: { page, pageSize } });
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        message: 'All notifications fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch notifications',
        data: []
      };
    }
  }

  // ==================== TEACHER HELPER ENDPOINTS ====================

  /**
   * Get accessible classes for teacher (for sending notifications)
   * GET /api/Notification/my-classes
   */
  async getMyAccessibleClasses() {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Notification/my-classes');
      return {
        success: true,
        data: response.data || [],
        message: 'Classes fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch classes',
        data: []
      };
    }
  }

  /**
   * Get subjects for teacher (for sending notifications)
   * GET /api/Notification/my-subjects
   */
  async getMySubjects() {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get('/Notification/my-subjects');
      return {
        success: true,
        data: response.data || [],
        message: 'Subjects fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch subjects',
        data: []
      };
    }
  }

  // ==================== DELETE ====================

  /**
   * Delete notification (Admin only)
   * DELETE /api/Notification/{notificationId}
   * @param {string} notificationId - Notification ID
   */
  async deleteNotification(notificationId) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.delete(`/Notification/${notificationId}`);
      return {
        success: true,
        message: response.data.message || 'Notification deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete notification'
      };
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * Get notification type badge color
   * @param {string} type - Notification type
   */
  getNotificationTypeColor(type) {
    switch (type) {
      case 'Information':
        return 'bg-blue-100 text-blue-800';
      case 'Alert':
        return 'bg-red-100 text-red-800';
      case 'Reminder':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get recipient group display name
   * @param {string} group - Recipient group
   */
  getRecipientGroupName(group) {
    switch (group) {
      case 'All':
        return 'All Users';
      case 'Students':
        return 'All Students';
      case 'Teachers':
        return 'All Teachers';
      case 'ClassTeachers':
        return 'Class Teachers';
      case 'SubjectTeachers':
        return 'Subject Teachers';
      case 'SpecificClass':
        return 'Specific Class';
      case 'SpecificSubject':
        return 'Specific Subject';
      default:
        return group;
    }
  }

  /**
   * Format notification title for display
   * @param {string} title - Notification title
   * @param {number} maxLength - Max length
   */
  truncateTitle(title, maxLength = 50) {
    if (!title) return '';
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;

// Export individual functions for backward compatibility
export const sendNotification = (data) => notificationService.sendNotification(data);
export const getMyNotifications = (isRead, page, pageSize) => notificationService.getMyNotifications(isRead, page, pageSize);
export const getNotificationStats = () => notificationService.getNotificationStats();
export const getNotificationById = (notificationId) => notificationService.getNotificationById(notificationId);
export const markAsRead = (notificationId) => notificationService.markAsRead(notificationId);
export const markAllAsRead = () => notificationService.markAllAsRead();
export const getSentNotifications = (page, pageSize) => notificationService.getSentNotifications(page, pageSize);
export const getAllNotifications = (page, pageSize) => notificationService.getAllNotifications(page, pageSize);
export const getMyAccessibleClasses = () => notificationService.getMyAccessibleClasses();
export const getMySubjects = () => notificationService.getMySubjects();
export const deleteNotification = (notificationId) => notificationService.deleteNotification(notificationId);