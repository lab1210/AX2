// schoolservice.js
import axios from "axios";
import { createAuthHeaders } from "./AuthService"; // Adjust path as needed

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const createSchool = async (schoolData) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }

    const url = `${BASE_URL}/schools/create/`;
    const response = await axios.post(url, schoolData, { headers });
    return response;
  } catch (error) {
    console.error("Error creating school:", error);
    throw error;
  }
};

export const getSchools = async (
  filters = {},
  search = "",
  page = 1,
  pageSize = 10
) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }

    let url = `${BASE_URL}/schools/?page=${page}&page_size=${pageSize}`;

    // Add filters as query parameters
    for (const key in filters) {
      if (filters[key]) {
        url += `&${key}=${filters[key]}`;
      }
    }

    // Add search query parameter
    if (search) {
      url += `&search=${search}`;
    }

    const response = await axios.get(url, { headers });
    return response;
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw error;
  }
};

export const getSchoolById = async (schoolId) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }

    const url = `${BASE_URL}/schools/${schoolId}/`;
    const response = await axios.get(url, { headers });
    return response;
  } catch (error) {
    console.error(`Error fetching school with ID ${schoolId}:`, error);
    throw error;
  }
};

export const updateSchool = async (schoolId, schoolData) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }

    const url = `${BASE_URL}/schools/${schoolId}/`;
    const response = await axios.put(url, schoolData, { headers });
    return response;
  } catch (error) {
    console.error(`Error updating school with ID ${schoolId}:`, error);
    throw error;
  }
};

export const deleteSchool = async (schoolId) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }

    const url = `${BASE_URL}/schools/${schoolId}/`;
    const response = await axios.delete(url, { headers });
    return response;
  } catch (error) {
    console.error(`Error deleting school with ID ${schoolId}:`, error);
    throw error;
  }
};

export const getSchoolSubscriptions = async () => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }

    const url = `${BASE_URL}/schools/subscriptions/`;
    const response = await axios.get(url, { headers });
    return response;
  } catch (error) {
    console.error("Error fetching school subscriptions:", error);
    throw error;
  }
};

export const updateSchoolSubscription = async (
  subscriptionId,
  subscriptionData
) => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }

    const url = `${BASE_URL}/schools/subscriptions/${subscriptionId}/update/`;
    const response = await axios.patch(url, subscriptionData, { headers });
    return response;
  } catch (error) {
    console.error(
      `Error updating school subscription with ID ${subscriptionId}:`,
      error
    );
    throw error;
  }
};
