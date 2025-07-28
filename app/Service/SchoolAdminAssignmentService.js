import axios from "axios";
import { createAuthHeaders } from "./AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const createSubjectDepartmentRelationship = async (
  subjectDepartment
) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/assignments/subject_department/`;
    const response = await axios.post(url, subjectDepartment, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to create Subject Department Relationship:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getSubjectDepartmentRelationships = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/subject_department/`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return { data: response.data.results };
  } catch (error) {
    console.error("Failed to get Subject Department Relationships:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const updateSubjectDepartmentRelationship = async (
  subjectDepartmentId,
  subjectDepartmentData
) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/subject_department/${subjectDepartmentId}`;
    const response = await axios.put(url, subjectDepartmentData, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(
      `Failed to update subject department by id:${subjectDepartmentId}`,
      error
    );
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const deleteSubjectDepartmentRelationship = async (
  subjectDepartmentId
) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/subject_department/${subjectDepartmentId}`;
    const response = await axios.delete(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(
      `Failed to delete subject department by id:${subjectDepartmentId}`,
      error
    );
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};
