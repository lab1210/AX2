import axios from "axios";
import { createAuthHeaders } from "./AuthService";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const RegisterStudent = async (studentData) => {
  try {
    const url = `${BASE_URL}/students/self-register/`;
    const response = await axios.post(url, studentData);
    return response.data;
  } catch (error) {
    console.error(
      "Error registering student:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
