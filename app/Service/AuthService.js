import axios from "axios";

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
    console.error("Login error:", error);
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
    return null;
  }

  try {
    const response = await axios.post(`${BASE_URL}/login/refresh/`, {
      refresh: refreshToken,
    });
    const newAccessToken = response.data.access;
    if (newAccessToken) {
      localStorage.setItem(token, newAccessToken);
      return newAccessToken;
    } else {
      console.error("Failed to refresh");
      clearAuthToken();
      return null;
    }
  } catch (error) {
    console.error("Error Refreshing", error);
    clearAuthToken();
    return null;
  }
};
export const logout = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    console.warn("No refreshToken available");
    clearAuthToken();
    return;
  }

  try {
    console.log("Logging out with refresh token:", refreshToken);
    await axios.post(
      `${BASE_URL}/logout/`, // Correct URL for logout
      { refresh_token: refreshToken }, // Send the refresh token in the body
      {
        headers: {
          "Content-Type": "application/json",
          ...createAuthHeaders(), // Add Bearer token in the headers
        },
      }
    );
    clearAuthToken();
    console.log("Logout Successful");
  } catch (error) {
    console.error("Logout error", error);
    clearAuthToken();
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
