import axios from "axios";
import { createAuthHeaders } from "./AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getTeachers = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/teachers/list/`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error; // This preserves the error response structure
    } else {
      throw new Error(error.message || "Failed to fetch teacher");
    }
  }
};
