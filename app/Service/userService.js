import axios from "axios";
import { createAuthHeaders } from "./AuthService"; // Assuming you have an AuthService for handling tokens

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const createSuperAdmin = async (superAdminData) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }
    const url = `${BASE_URL}/superadmins/create/`;
    const response = await axios.post(url, superAdminData, { headers });
    return response;
  } catch (error) {
    console.error("Error creating SuperAdmin:", error);
    if (error.response) {
      console.error("Backend Error Data:", error.response.data);
      console.error("Backend Error Status:", error.response.status);
      console.error("Backend Error Headers:", error.response.headers);
      throw error;
    } else if (error.request) {
      console.error("No response received:", error.request);
      throw new Error("No response received from the server.");
    } else {
      console.error("Error setting up the request:", error.message);
      throw new Error(`Request setup error: ${error.message}`);
    }
  }
};

// Function to get all SuperAdmins with optional filtering
export const getSuperAdmins = async (filters = {}, page = 1, pageSize = 10) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }
    let url = `${BASE_URL}/superadmins/?page=${page}&page_size=${pageSize}`;
    for (const key in filters) {
      if (
        filters.hasOwnProperty(key) &&
        filters[key] !== undefined &&
        filters[key] !== null &&
        filters[key] !== ""
      ) {
        url += `&${key}=${filters[key]}`;
      }
    }
    const response = await axios.get(url, { headers });
    return response;
  } catch (error) {
    console.error("Error fetching SuperAdmins:", error);
    throw error;
  }
};

// Function to get a specific SuperAdmin by ID
export const getSuperAdminById = async (superAdminId) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }
    const url = `${BASE_URL}/superadmins/${superAdminId}/`;
    const response = await axios.get(url, { headers });
    return response;
  } catch (error) {
    console.error(`Error fetching SuperAdmin with ID ${superAdminId}:`, error);
    throw error;
  }
};

// Function to update a SuperAdmin's profile
export const updateSuperAdmin = async (superAdminId, updateData) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }
    const url = `${BASE_URL}/superadmins/${superAdminId}/`;
    const response = await axios.put(url, updateData, { headers });
    return response;
  } catch (error) {
    console.error(`Error updating SuperAdmin with ID ${superAdminId}:`, error);
    throw error;
  }
};

// Function to delete a SuperAdmin's profile
export const deleteSuperAdmin = async (superAdminId) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }
    const url = `${BASE_URL}/superadmins/${superAdminId}/`;
    const response = await axios.delete(url, { headers });
    return response;
  } catch (error) {
    console.error(`Error deleting SuperAdmin with ID ${superAdminId}:`, error);
    throw error;
  }
};
