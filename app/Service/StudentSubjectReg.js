import axios from "axios";
import { createAuthHeaders } from "./AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getStudentSubjectRegistrations = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/student-subject-registrations/`;
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error; // This preserves the error response structure
    } else {
      throw new Error(error.message || "Failed to fetch assignments.");
    }
  }
};

export const registerStudentSubject = async (data) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/student-subject-registrations/`;
    const response = await axios.post(url, data, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error; // This preserves the error response structure
    } else {
      throw new Error(error.message || "Failed to register subject.");
    }
  }
};

export const getStudentSubjectById = async (id) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/student-subject-registrations/${id}`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error; // This preserves the error response structure
    } else {
      throw new Error(error.message || "Failed to fetch subject.");
    }
  }
};

export const updateStudentSubject = async (id, data) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/student-subject-registrations/${id}`;
    const response = await axios.put(url, data, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error; // This preserves the error response structure
    } else {
      throw new Error(error.message || "Failed to update subject.");
    }
  }
};

export const deleteStudentSubject = async (id) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/student-subject-registrations/${id}`;
    const response = await axios.delete(url, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error; // This preserves the error response structure
    } else {
      throw new Error(error.message || "Failed to delete subject.");
    }
  }
};
