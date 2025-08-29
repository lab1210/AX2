import axios from "axios";
import { createAuthHeaders } from "./AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// For students - Get class timetable
export const getClassTimetable = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/api/class-timetable/`;
    const response = await axios.get(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to get class timetable:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

// For teachers - Get teacher timetable
export const getTeacherTimetable = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/api/teacher-timetable/`;
    const response = await axios.get(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to get teacher timetable:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

// For school admins - Generate/Get timetable
export const generateTimetable = async (timetableData) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/api/generate-timetable/`;
    const response = await axios.post(url, timetableData, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to generate timetable:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};
