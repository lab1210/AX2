import axios from "axios";
import { createAuthHeaders } from "./AuthService";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const verifyOtp = async (otp, schoolId) => {
  try {
    const response = await axios.post(`${BASE_URL}/registration/verify/`, {
      otp,
      school_id: schoolId,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error verifying registration pin:",
      error.response?.data || error.message
    );
    throw error; // Propagate the error to be handled elsewhere if needed
  }
};

export const generateOtp = async (numPins) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error("Authentication token not found.");
      return null;
    }
    const url = `${BASE_URL}/registration-pins/generate/`;
    const response = await axios.post(url, { num_pins: numPins }, { headers });

    return response.data.pins; // ✅ Return the array directly
  } catch (error) {
    console.error(
      "Error generating registration pin:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getPins = async () => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error("Authentication token not found.");
      return { data: null, error: "Unauthorized" };
    }

    const url = `${BASE_URL}/registration-pins/`;
    const response = await axios.get(url, { headers });

    return { data: response.data.pins }; // ✅ Return the array as `data`
  } catch (error) {
    console.error(
      "Error fetching registration pin:",
      error.response?.data || error.message
    );
    return { data: null, error: error.response?.data?.error || error.message };
  }
};
