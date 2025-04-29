//ComplianceDocService.js

import axios from "axios";
import { createAuthHeaders } from "./AuthService";

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/compliance-verification/`;

const handleRequestError = (error) => {
  console.error("API Request Error:", error);
  if (error.response) {
    console.error("  Data:", error.response.data);
    console.error("  Status:", error.response.status);
    console.error("  Headers:", error.response.headers);

    switch (error.response.status) {
      case 400:
        throw new Error(
          "Bad Request: The server could not understand the request due to invalid syntax."
        );
      case 401:
        throw new Error(
          "Unauthorized: Please authenticate to access this resource."
        );
      case 403:
        throw new Error(
          "Forbidden: You do not have permission to access this resource."
        );
      case 404:
        throw new Error("Not Found: The requested resource was not found.");
      case 500:
        throw new Error(
          "Internal Server Error: Something went wrong on the server."
        );
      default:
        throw new Error(
          `Request failed with status code ${error.response.status}`
        );
    }
  } else if (error.request) {
    console.error("No response received from the server.");
    throw new Error("Network Error: Could not connect to the server.");
  } else {
    console.error("Error setting up the request:", error.message);
    throw new Error(`Request setup error: ${error.message}`);
  }
};

const checkAuthHeader = () => {
  const headers = createAuthHeaders();
  if (!headers.Authorization) {
    console.error("Auth token missing");
    throw new Error("Authentication token is missing.");
  }
  return headers;
};

export const getComplianceDocs = async () => {
  try {
    const headers = checkAuthHeader();
    let response = await axios.get(BASE_URL, {
      headers,
    });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

export const createComplianceDoc = async (formData) => {
  try {
    const headers = checkAuthHeader();
    let response = await axios.post(`${BASE_URL}create/`, formData, {
      headers,
    });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

export const updateComplianceDoc = async (formData, id) => {
  try {
    const headers = checkAuthHeader();
    let response = await axios.put(`${BASE_URL}${id}/`, formData, {
      headers,
    });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

export const getComplianceDocByID = async (id) => {
  try {
    const headers = checkAuthHeader();
    let response = await axios.get(`${BASE_URL}${id}/`, {
      headers,
    });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};
