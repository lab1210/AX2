// schoolAdminService.js
import axios from "axios";
import { createAuthHeaders } from "./AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getSchoolAdmin = async () => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }

    const url = `${BASE_URL}/school_admin/`;
    const response = await axios.get(url, { headers });

    return response;
  } catch (error) {
    console.error("Error fetching school admin data:", error);
    throw error;
  }
};

export const createSchoolAdmin = async (schoolAdminData) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }

    const url = `${BASE_URL}/school_admin/create/`;
    const response = await axios.post(url, schoolAdminData, { headers });
    return response;
  } catch (error) {
    console.error("Error creating school admin:", error);
    throw error;
  }
};

export const getSchoolAdminById = async (schoolAdminId) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }

    const url = `${BASE_URL}/school_admin/${schoolAdminId}/`;
    const response = await axios.get(url, { headers });
    return response;
  } catch (error) {
    console.error(
      `Error fetching school admin with ID ${schoolAdminId}:`,
      error
    );
    throw error;
  }
};

export const updateSchoolAdmin = async (schoolAdminId, updateData) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }

    const url = `${BASE_URL}/school_admin/${schoolAdminId}/update/`;
    const response = await axios.patch(url, updateData, { headers });
    return response;
  } catch (error) {
    console.error(
      `Error updating school admin with ID ${schoolAdminId}:`,
      error
    );
    throw error;
  }
};

export const deleteSchoolAdmin = async (schoolAdminId) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }

    const url = `${BASE_URL}/school_admin/${schoolAdminId}/update/`;
    const response = await axios.delete(url, { headers });
    return response;
  } catch (error) {
    console.error(
      `Error deleting school admin with ID ${schoolAdminId}:`,
      error
    );
    throw error;
  }
};
