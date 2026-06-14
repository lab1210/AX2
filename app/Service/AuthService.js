// services/authService.js

import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Storage keys
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

class AuthService {
  constructor() {
    this.baseURL = BASE_URL;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // ============ TOKEN MANAGEMENT ============
  
  setTokens(accessToken, refreshToken) {
    if (typeof window !== "undefined") {
      if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  getAccessToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return null;
  }

  getRefreshToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  }

  clearTokens() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem("tempUserId");
    }
  }

  // ============ USER MANAGEMENT ============
  
  setUser(user) {
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  getUser() {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  getUserDetails() {
    const user = this.getUser();
    return {
      id: user?.id || null,
      username: user?.username || null,
      email: user?.email || null,
      fullName: user?.fullName || null,
      roles: user?.roles || [],
      schoolId: user?.schoolId || null,
      schoolName: user?.schoolName || null,
      schoolLogo: user?.schoolLogo || null,
      isSchoolActive: user?.isSchoolActive ?? true,
    };
  }

  hasRole(roleName) {
    const user = this.getUser();
    if (!user || !user.roles) return false;
    return user.roles.includes(roleName);
  }

  hasAnyRole(roles) {
    const user = this.getUser();
    if (!user || !user.roles) return false;
    return roles.some(role => user.roles.includes(role));
  }

  // ============ AXIOS INSTANCE WITH INTERCEPTORS ============
  
  getAxiosInstance() {
    const instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add token
    instance.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const newAccessToken = await this.refreshToken();
            if (newAccessToken) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return instance(originalRequest);
            }
          } catch (refreshError) {
            this.logout();
            if (typeof window !== "undefined") {
              window.location.href = "/";
            }
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return instance;
  }

  // ============ AUTHENTICATION ENDPOINTS ============
  
  // 1. LOGIN
  async login(usernameOrEmail, password) {
    try {
      const response = await axios.post(`${this.baseURL}/Auth/login`, {
        usernameOrEmail,
        password,
      });

      const data = response.data;

      if (data.success && data.accessToken && data.refreshToken) {
        this.setTokens(data.accessToken, data.refreshToken);
        this.setUser(data.user);
        
        return {
          success: true,
          data: data,
        };
      } else {
        return {
          success: false,
          message: data.message || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Network error occurred",
      };
    }
  }

  // 2. REFRESH TOKEN
  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const response = await axios.post(`${this.baseURL}/Auth/refresh-token`, 
        JSON.stringify(refreshToken),
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;

      if (data.success && data.accessToken) {
        this.setTokens(data.accessToken, data.refreshToken);
        this.setUser(data.user);
        
        // Process queued requests
        this.failedQueue.forEach(prom => prom.resolve(data.accessToken));
        this.failedQueue = [];
        
        return data.accessToken;
      }
      
      throw new Error("Failed to refresh token");
    } catch (error) {
      this.failedQueue.forEach(prom => prom.reject(error));
      this.failedQueue = [];
      this.clearTokens();
      return null;
    } finally {
      this.isRefreshing = false;
    }
  }

  // 3. LOGOUT
  async logout() {
    const token = this.getAccessToken();
    
    if (token) {
      try {
        const axiosInstance = this.getAxiosInstance();
        await axiosInstance.post("/Auth/logout");
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    
    this.clearTokens();
  }

  // 4. CHANGE PASSWORD (for authenticated users)
  async changePassword(currentPassword, newPassword) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post("/Auth/change-password", {
        currentPassword,
        newPassword,
      });

      return {
        success: true,
        message: response.data.message || "Password changed successfully",
      };
    } catch (error) {
      console.error("Change password error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to change password",
      };
    }
  }

  // 5. FORGOT PASSWORD (send reset link to email)
  async forgotPassword(email) {
    try {
      const response = await axios.post(`${this.baseURL}/Auth/forgot-password`, 
        JSON.stringify(email),
        { headers: { "Content-Type": "application/json" } }
      );

      return {
        success: true,
        message: response.data.message || "Password reset link sent",
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send reset link",
      };
    }
  }

  // 6. RESET PASSWORD (for users who forgot password)
  async resetPassword(email, token, newPassword) {
    try {
      const response = await axios.post(`${this.baseURL}/Auth/reset-password`, {
        email,
        token,
        newPassword,
      });

      return {
        success: true,
        message: response.data.message || "Password reset successfully",
      };
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to reset password",
      };
    }
  }

  // 7. SET PASSWORD (for first-time users / when MustChangePassword is true)
  async setPassword(userId, token, newPassword, confirmPassword) {
    try {
      const response = await axios.post(`${this.baseURL}/Auth/set-password`, {
        userId,
        token,
        newPassword,
        confirmPassword,
      });

      if (response.data) {
        this.clearTokens(); // Clear any temporary tokens
        return {
          success: true,
          message: response.data.message || "Password set successfully",
        };
      }
      
      return {
        success: false,
        message: "Failed to set password",
      };
    } catch (error) {
      console.error("Set password error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to set password. The link may have expired.",
      };
    }
  }

  // 8. VERIFY EMAIL
  async verifyEmail(userId, token) {
    try {
      const response = await axios.get(`${this.baseURL}/Auth/confirm-email`, {
        params: { userId, token },
      });

      return {
        success: true,
        message: response.data.message || "Email confirmed successfully",
      };
    } catch (error) {
      console.error("Email verification error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Email confirmation failed",
      };
    }
  }

  // 9. GET CURRENT USER (me)
  async getCurrentUser() {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get("/Auth/me");
      
      if (response.data) {
        this.setUser(response.data);
        return {
          success: true,
          user: response.data,
        };
      }
      
      return {
        success: false,
        user: null,
      };
    } catch (error) {
      console.error("Get current user error:", error);
      return {
        success: false,
        user: null,
      };
    }
  }

  // 10. VALIDATE USER ROLE (SuperAdmin only)
  async validateUserRole(userId, role) {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.get(`/Auth/validate-role/${userId}/${role}`);
      
      return {
        success: true,
        isValid: response.data.isValid,
      };
    } catch (error) {
      console.error("Validate role error:", error);
      return {
        success: false,
        isValid: false,
      };
    }
  }

  // ============ HELPER METHODS ============
  
  isAuthenticated() {
    const token = this.getAccessToken();
    return !!token;
  }

  createAuthHeaders() {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error("Authentication token not found.");
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  }
}

// Export singleton instance
export default new AuthService();

// Also export individual functions for backward compatibility
export const Login = async (username, password) => {
  const result = await authService.login(username, password);
  if (result.success) {
    return result.data;
  }
  throw new Error(result.message);
};

export const getUserDetails = () => {
  return authService.getUserDetails();
};

export const getAuthToken = () => {
  return authService.getAccessToken();
};

export const clearAuthToken = () => {
  authService.clearTokens();
};

export const hasRole = (roleName) => {
  return authService.hasRole(roleName);
};

export const getRefreshToken = () => {
  return authService.getRefreshToken();
};

export const refreshToken = async () => {
  return await authService.refreshToken();
};

export const logout = async () => {
  return await authService.logout();
};

export const createAuthHeaders = () => {
  return authService.createAuthHeaders();
};