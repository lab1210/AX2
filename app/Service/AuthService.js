import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const token = "authToken";
const refreshTokenStorage = "refreshToken";

export const Login = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login/`, {
      username: username,
      password: password,
    });
    const authToken = response.data.access;
    const refreshToken = response.data.refresh;
    if (authToken && refreshToken) {
      localStorage.setItem(token, authToken);
      localStorage.setItem(refreshTokenStorage, refreshToken);
      return response.data;
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem(token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(token);
  localStorage.removeItem(refreshTokenStorage);
};

export const getRefreshToken = () => {
  return localStorage.getItem(refreshTokenStorage);
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
  const authToken = getAuthToken();

  if (!refreshToken) {
    console.warn("No refreshToken Available");
    clearAuthToken();
    return;
  }
  try {
    await axios.post(
      `${BASE_URL}/logout/`,
      {
        refresh: refreshToken,
        access: authToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
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
