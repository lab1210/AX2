import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
import { createAuthHeaders } from "./AuthService"; // Adjust path as needed

export const RegisterTeacher = async (teacherData) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }
    const url = `${BASE_URL}/teachers/self-register/`;
    const response = await axios.post(url, teacherData, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error registering teacher:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const SchoolAdminRegisterTeacher = async (teacherData) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }
    const url = `${BASE_URL}/teachers/create/`;
    const response = await axios.post(url, teacherData, { headers });
    return response.data;
  } catch (error) {
    s;
    console.error(
      "Error registering teacher:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
