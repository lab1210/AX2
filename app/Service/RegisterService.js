import axios from "axios";
import { createAuthHeaders } from "./AuthService";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const verifyOtp = async (otp, schoolId) => {
  try {
    const response = await axios.post(`${BASE_URL}/registration/verify/`, {
      otp,
      school_id: schoolId,
    });
    if (response.status === 200) {
      const { message, temp_token } = response.data;
      console.log("Verification successful:", message);
      console.log("Temporary token:", temp_token);

      return { message, temp_token }; // Return the response data
    } else {
      throw new Error("Unexpected response status");
    }
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
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }
    const url = `${BASE_URL}/registration-pins/generate/`;
    const response = await axios.post(url, { num_pins: numPins }, { headers });

    return response.data;
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
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }
    const url = `${BASE_URL}/registration-pins/`;
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching registration pin:",
      error.response?.data || error.message
    );
    throw error;
  }
};
