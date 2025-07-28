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
