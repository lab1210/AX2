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
    return response.data;
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
    return response.data;
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
    const url = `${BASE_URL}/assignments/subject_department/${subjectDepartmentId}/`;
    const response = await axios.put(url, subjectDepartmentData, { headers });
    return response.data;
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
    const url = `${BASE_URL}/assignments/subject_department/${subjectDepartmentId}/`;
    const response = await axios.delete(url, { headers });
    return response.data;
  } catch (error) {
    console.error(
      `Failed to delete subject department by id:${subjectDepartmentId}`,
      error
    );
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};
//TEACHER TO CLASS RELATIONSHIP
export const createTeachertoClassRelationship = async (teacherClass) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/assignments/class_teachers/bulk_create/`;
    const response = await axios.post(url, teacherClass, { headers });
    return response.data;
  } catch (error) {
    console.error("Failed to create Teacher to Class Relationship:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getTeacherClassRelationships = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/class_teachers/`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return response.data.results;
  } catch (error) {
    console.error("Failed to get Teacher to Class Relationships:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const updateTeacherClassRelationship = async (
  teacherClassId,
  teacherClassData
) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/class_teachers/${teacherClassId}`;
    const response = await axios.patch(url, teacherClassData, { headers });
    return response.data;
  } catch (error) {
    console.error(
      `Failed to update teacher to class relationship by id:${teacherClassId}`,
      error
    );
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const deleteTeacherClassRelationship = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/class_teachers/delete-multiple/`;
    const response = await axios.delete(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to delete`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//Subject teacher assignment

export const createSubjectTeacherAssignment = async (
  subjectTeacherAssignment
) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/assignments/teacher_assignments/`;
    const response = await axios.post(url, subjectTeacherAssignment, {
      headers,
    });
  } catch (error) {
    console.error("Failed to create Subject Teacher Assignment:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getSubjectTeacherAssignments = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/teacher_assignments/`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return response.data.results;
  } catch (error) {
    console.error("Failed to get Subject Teacher Assignments:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const updateSubjectTeacherAssignment = async (
  subjectTeacherAssignmentId,
  subjectTeacherAssignmentData
) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/teacher_assignments/${subjectTeacherAssignmentId}`;
    const response = await axios.put(url, subjectTeacherAssignmentData, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Failed to update subject teacher assignment by id:${subjectTeacherAssignmentId}`,
      error
    );
  }
};
export const deleteSubjectTeacherAssignment = async (
  subjectTeacherAssignmentId
) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/teacher_assignments/${subjectTeacherAssignmentId}`;
    const response = await axios.delete(url, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Failed to delete subject teacher assignment by id:${subjectTeacherAssignmentId}`,
      error
    );
  }
};
