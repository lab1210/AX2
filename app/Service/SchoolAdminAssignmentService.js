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
    const url = `${BASE_URL}/assignments/class_teachers/${teacherClassId}/`;
    const response = await axios.put(url, teacherClassData, { headers });
    return response.data;
  } catch (error) {
    console.error(
      `Failed to update teacher to class relationship by id:${teacherClassId}`,
      error
    );
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const deleteTeacherClassRelationship = async (id) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/class_teachers/${id}/`;
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
    return response.data;
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

//class dept assignment

export const createClassDepartmentAssignment = async (
  classDepartmentAssignment
) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/assignments/class_departments/`;
    const response = await axios.post(url, classDepartmentAssignment, {
      headers,
    });
  } catch (error) {
    console.error("Failed to create class department Assignment:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getClassDepartmentAssignments = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/class_departments/`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to get class department Assignments:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const updateClassDepartmentAssignment = async (
  classDepartmentAssignmentId,
  classDepartmentAssignmentData
) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/class_departments/${classDepartmentAssignmentId}/`;
    const response = await axios.put(url, classDepartmentAssignmentData, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Failed to update class teacher assignment by id:${subjectTeacherAssignmentId}`,
      error
    );
  }
};
export const deleteClassDepartmentAssignment = async (
  classDepartmentAssignmentId
) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/class_departments/${classDepartmentAssignmentId}/`;
    const response = await axios.delete(url, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Failed to delete class department assignment by id:${classDepartmentAssignmentId}`,
      error
    );
  }
};

export const getclassdepartmentbyid = async (classDepartmentAssignmentId) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/class_departments/${classDepartmentAssignmentId}/`;
    const response = await axios.get(url, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Failed to get class department assignment by id:${classDepartmentAssignmentId}`,
      error
    );
  }
};

//Student to class relationship
export const getStudenttoClassRelationship = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/student-classes/`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to get Student to Class Relationships:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};
export const updateStudenttoClassRelationship = async (
  studentClassId,
  studentClassData
) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/student-classes/${studentClassId}/update/`;
    const response = await axios.patch(url, studentClassData, { headers });
    return response.data;
  } catch (error) {
    console.error(
      `Failed to update student to class relationship by id:${studentClassId}`,
      error
    );
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//STUDENT SUBJECT REGISTRATION

export const registerStudentSubject = async (studentSubjectRegistration) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/assignments/student-subject-registrations/`;
    const response = await axios.post(url, studentSubjectRegistration, {
      headers,
    });
  } catch (error) {
    console.error("Failed to Register Student Subject:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

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
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to get Student Subject Registrations:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const updateStudentSubjectRegistration = async (
  studentSubjectRegistrationId,
  studentSubjectRegistrationData
) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/student-subject-registrations/${studentSubjectRegistrationId}/`;
    const response = await axios.put(url, studentSubjectRegistrationData, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Failed to update student subject registration by id:${studentSubjectRegistrationId}`,
      error
    );
  }
};
export const deleteStudentSubjectRegistration = async (
  studentSubjectRegistrationId
) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/student-subject-registrations/${studentSubjectRegistrationId}/`;
    const response = await axios.delete(url, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Failed to delete student subject:${studentSubjectRegistrationId}`,
      error
    );
  }
};

//Registration Control

export const getRegistrationControl = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/registration-control/`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to get Registration Control:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const updateRegistrationControl = async (registrationControlData) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/assignments/registration-control/`;
    const response = await axios.put(url, registrationControlData, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update student subject registration `, error);
  }
};
