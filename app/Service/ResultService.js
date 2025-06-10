import axios from "axios";
import { createAuthHeaders } from "./AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// ADD ACADEMIC YEAR
export const createcategory = async (yearData) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/result/assessment-categories/`;
    const response = await axios.post(url, yearData, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getCategory = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/result/assessment-categories/`;
    const response = await axios.get(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const UpdateCategory = async (categoryID, categoryData) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/result/assessment-categories/${categoryID}`;

    const response = await axios.patch(url, categoryData, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to update category:${categoryID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//Delete TERM
export const deleteCategory = async (categoryID) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/result/assessment-categories/${categoryID}`;

    const response = await axios.delete(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to delete category by id:${categoryID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const createResult = async (resultDat) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/result/result-configurations/`;
    const response = await axios.post(url, resultDat, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to create result:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getResults = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/result/result-configurations/`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return { data: response.data };
  } catch (error) {
    console.error("Failed to fetch result:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

//GRADING SYSTEMS

export const createGrading = async (grade) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/result/grading-systems/`;
    const response = await axios.post(url, grade, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to create grade:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getGrading = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/result/grading-systems/`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return { data: response.data };
  } catch (error) {
    console.error("Failed to fetch grades:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const UpdateGrade = async (gradeID, grade) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/result/grading-systems/${gradeID}`;

    const response = await axios.patch(url, grade, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to update gradeID:${gradeID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const deleteGrade = async (gradeID) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/result/grading-systems/${gradeID}/`;

    const response = await axios.delete(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to delete grade by id:${gradeID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const AddResultVisibility = async (result) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/result/result-visibility/`;
    const response = await axios.post(url, result, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to update result visibility:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getResultVisibility = async () => {
  try {
    const headers = createAuthHeaders();
    const url = `${BASE_URL}/result/result-visibility/`;

    const response = await axios.get(url, { headers });
    return { data: response.data };
  } catch (error) {
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const UpdateResultVisibility = async (resultID, result) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/result/result-visibility/${resultID}`;

    const response = await axios.patch(url, result, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to update result visibility:${resultID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const getAnnualweigh = async () => {
  try {
    const headers = createAuthHeaders();
    const url = `${BASE_URL}/result/annual-weight-configs/`;

    const response = await axios.get(url, { headers });
    return { data: response.data };
  } catch (error) {
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const AddAnnualweigh = async (result) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }

    const url = `${BASE_URL}/result/annual-weight-configs/`;
    const response = await axios.post(url, result, { headers });
    return { data: response.data };
  } catch (error) {
    console.error("Failed to add annual weight:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const UpdateAnnualWeigh = async (annualID, annual) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/result/annual-weight-configs/${annualID}`;

    const response = await axios.patch(url, annual, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to update :${annualID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};

export const DeleteAnnualWeigh = async (annualID, annual) => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/result/annual-weight-configs/${annualID}`;

    const response = await axios.delete(url, { headers });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to delete :${annualID}`, error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};
