import axios from "axios";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const token = "authToken";
const refreshTokenStorage = "refreshToken";

export const Login = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login/`, {
      username,
      password,
    });

    const {
      access,
      refresh,
      id,
      username: userName,
      email,
      user_roles,
      super_admin,
      school_admin,
      student,
      teacher,
    } = response.data;

    if (access && refresh) {
      localStorage.setItem(token, access);
      localStorage.setItem(refreshTokenStorage, refresh);

      localStorage.setItem("user_id", id);
      localStorage.setItem("user_name", userName);
      localStorage.setItem("user_email", email);

      localStorage.setItem("user_roles", JSON.stringify(user_roles));

      if (super_admin) {
        localStorage.setItem("super_admin", JSON.stringify(super_admin));
      }
      if (school_admin) {
        localStorage.setItem("school_admin", JSON.stringify(school_admin));
      }
      if (student) {
        localStorage.setItem("student", JSON.stringify(student));
      }
      if (teacher) {
        localStorage.setItem("teacher", JSON.stringify(teacher));
      }

      return response.data;
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    throw error;
  }
};

export const getUserDetails = () => {
  return {
    id: localStorage.getItem("user_id"),
    username: localStorage.getItem("user_name"),
    email: localStorage.getItem("user_email"),
    roles: JSON.parse(localStorage.getItem("user_roles") || "[]"),
    super_admin: JSON.parse(localStorage.getItem("super_admin") || "null"),
    school_admin: JSON.parse(localStorage.getItem("school_admin") || "null"),
    student: JSON.parse(localStorage.getItem("student") || "null"),
    teacher: JSON.parse(localStorage.getItem("teacher") || "null"),
  };
};

export const getAuthToken = () => {
  return localStorage.getItem(token);
};

export const clearAuthToken = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_email");
  localStorage.removeItem("user_roles");
  localStorage.removeItem("super_admin");
  localStorage.removeItem("school_admin");
  localStorage.removeItem("student");
  localStorage.removeItem("teacher");
};

export const hasRole = (roleName) => {
  const roles = JSON.parse(localStorage.getItem("user_roles") || "[]");
  return roles.some((r) => r.role.name === roleName);
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const refreshToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.error("No refresh token available");
    clearAuthToken();
    window.location.href = "/"; // Redirect if in browser
    return null;
  }

  try {
    const response = await axios.post(`${BASE_URL}/login/refresh/`, {
      refresh: refreshToken,
    });

    if (response.data?.access) {
      localStorage.setItem(token, response.data.access);
      return response.data.access;
    }
    throw new Error("No access token in response");
  } catch (error) {
    console.error("Refresh token error:", error);
    clearAuthToken();
    window.location.href = "/"; // Redirect if in browser
    return null;
  }
};

export const logout = async () => {
  const refreshToken = getRefreshToken();
  console.log("refreshToken", refreshToken);
  const authToken = getAuthToken();
  console.log("authToken", authToken);

  if (!refreshToken || !authToken) {
    console.warn("Missing tokens");
    clearAuthToken();
    return;
  }

  try {
    await axios.post(
      `${BASE_URL}/logout/`,
      { refresh_token: refreshToken }, // or { refresh: refreshToken } if your backend expects that
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // ✅ Include auth header
        },
      }
    );

    clearAuthToken();
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    clearAuthToken(); // Still clear tokens on error for safety
    throw error;
  }
};

//HEADERS
export const createAuthHeaders = () => {
  const authToken = getAuthToken();
  if (!authToken) {
    throw new Error("Authentication token not found.");
  }
  return {
    Authorization: `Bearer ${authToken}`,
  };
};
