import axios from "axios";
import { createAuthHeaders } from "./AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// ADD ACADEMIC YEAR
export const createAcademicYear = async (yearData) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/school_config/years/`;
    const response = await axios.post(url, yearData, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to create academic year:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//Get ACADEMIC YEARS

export const getAcademicYears = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/years/`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return { data: response.data.results };
  } catch (error) {
    console.error("Failed to get academic years:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//get year by id
export const getAcademicYearById = async (id) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/years/${id}`;
    const response = await axios.get(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to get academic year by id:${id}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//Update YEAR
export const updateAcademicYear = async (yearId, yearData) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/years/${yearId}/`;
    const response = await axios.patch(url, yearData, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to update academic year by id:${yearId}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//Delete YEAR
export const deleteAcademicYear = async (yearId) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/years/${yearId}/`;
    const response = await axios.delete(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to delete academic year by id:${yearId}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//ADD TERM
export const createTerm = async (termData) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/school_config/terms/`;
    const response = await axios.post(url, termData, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to create term:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//GET TERMS
export const getTerms = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/terms/`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return { data: response.data.results };
  } catch (error) {
    console.error("Failed to get terms:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getTermID = async (id) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/terms/${id}`;
    const response = await axios.get(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to get term by id:${id}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const UpdateTerm = async (termID, termData) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/terms/${termID}/`;
    const response = await axios.patch(url, termData, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to update term:${termID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//Delete TERM
export const deleteTerm = async (termID) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/terms/${termID}/`;
    const response = await axios.delete(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to delete term by id:${termID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//ADD Class
export const createClass = async (classData) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/school_config/class_years/`;
    const response = await axios.post(url, classData, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to create class:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//GET TERMS
export const getClass = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/class_years/`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return { data: response.data.results };
  } catch (error) {
    console.error("Failed to get class:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getclassByid = async (id) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/class_years/${id}`;
    const response = await axios.get(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to get class by id:${id}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const UpdateClass = async (classID, classData) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/class_years/${classID}/`;
    const response = await axios.patch(url, classData, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to update class:${classID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//Delete TERM
export const deleteClass = async (classID) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/class_years/${classID}/`;
    const response = await axios.delete(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to delete class by id:${classID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//ADD ClassArm
export const createArm = async (armData) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/school_config/classes/`;
    const response = await axios.post(url, armData, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to create class arm:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getClassArm = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/classes/`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return { data: response.data };
  } catch (error) {
    console.error("Failed to get class arms:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getclassArmByid = async (id) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/classes/${id}`;
    const response = await axios.get(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to get class arm by id:${id}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const UpdateClassArm = async (classArmID, classArmData) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/classes/${classArmID}/`;
    const response = await axios.patch(url, classArmData, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to update class arm:${classArmID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//Delete class arm
export const deleteClassArm = async (classArmID) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/classes/${classArmID}/`;
    const response = await axios.delete(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to delete class arm by id:${classArmID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const createDepartment = async (department) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/school_config/departments/`;
    const response = await axios.post(url, department, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to create department:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//GET TERMS
export const getDepartment = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/departments/`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to get departments:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getDepartmentbyID = async (id) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/departments/${id}`;
    const response = await axios.get(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to get department by id:${id}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const UpdateDepartment = async (departmentID, departmentData) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/departments/${departmentID}/`;
    const response = await axios.patch(url, departmentData, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to update department:${departmentID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//Delete class arm
export const deleteDepartment = async (departmentID) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/departments/${departmentID}/`;
    const response = await axios.delete(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to delete department by id:${departmentID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const createClassroom = async (classroomData) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/school_config/classrooms/`;
    const response = await axios.post(url, classroomData, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to create classroom:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//GET TERMS
export const getClassroom = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/classrooms/`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return { data: response.data };
  } catch (error) {
    console.error("Failed to get classrooms:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getclassroombyID = async (id) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/classrooms/${id}`;
    const response = await axios.get(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to get classroom by id:${id}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const UpdateClassroom = async (classroomID, classroomData) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/classrooms/${classroomID}/`;
    const response = await axios.patch(url, classroomData, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to update classroom:${classroomID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//Delete class arm
export const deleteClassroom = async (classroomID) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/classrooms/${classroomID}/`;
    const response = await axios.delete(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to delete classroom by id:${classroomID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const createSubject = async (subject) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/school_config/subjects/`;
    const response = await axios.post(url, subject, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to create subject:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//GET TERMS
export const getSubject = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/subjects/`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to get subjects:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getSubjectbyID = async (id) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/subjects/${id}`;
    const response = await axios.get(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to get subject by id:${id}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};
export const UpdateSubject = async (subjectID, subjectData) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/subjects/${subjectID}/`;
    const response = await axios.patch(url, subjectData, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to update subject:${subjectID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//Delete class arm
export const deleteSubject = async (subjectID) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/school_config/subjects/${subjectID}/`;
    const response = await axios.delete(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to delete subject by id:${subjectID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};
