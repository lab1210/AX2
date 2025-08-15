import axios from "axios";
import { createAuthHeaders } from "./AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const createNotifications = async (notifications) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/notifications/`;
    const response = await axios.post(url, notifications, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to create notifications:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getNotifications = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/notifications/`;
    const response = await axios.get(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to get notifications:", error);
    return { error: error.response?.data || error.message || "Failed to get notifications" };
  }
};

export const getNotificationById = async (id) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/notifications/${id}/`;
    const response = await axios.get(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to get notification:", error);
    return { error: error.response?.data || error.message || "Failed to get notification" };
  }
};

export const markNotificationAsRead = async (id) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/notifications/${id}/read/`;
    const response = await axios.patch(url, {}, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return { error: error.response?.data || error.message || "Failed to mark notification as read" };
  }
};
