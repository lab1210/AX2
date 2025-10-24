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
    return response.data;
  } catch (error) {
    console.error("Failed to create notifications:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getNotifications = async (notifications) => {
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
    return response.data;
  } catch (error) {
    console.error("Failed to get notifications:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getNotification = async (id) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/notifications/${id}/`;
    const response = await axios.post(url, { headers });
    return response.data;
  } catch (error) {
    console.error("Failed to get notification:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const UpdateNotification = async (id, notifications) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/notifications/${id}`;
    const response = await axios.put(url, notifications, { headers });
    return response.data;
  } catch (error) {
    console.error("Failed to update notification:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const UpdateNotificationpartial = async (id, notifications) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/notifications/${id}`;
    const response = await axios.patch(url, notifications, { headers });
    return response.data;
  } catch (error) {
    console.error("Failed to update notification:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const DeleteNotification = async (id) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/notifications/${id}/`;
    const response = await axios.delete(url, { headers });
    return response.data;
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getTeacherNotifications = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/notifications/teacher-and-everyone/`;
    const response = await axios.get(url, { headers });

    // Filter notifications for teachers only

    return response.data;
  } catch (error) {
    console.error("Failed to get teacher notifications:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};
