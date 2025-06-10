import axios from "axios";
import { createAuthHeaders } from "./AuthService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getStudents = async () => {
  try {
    const headers = createAuthHeaders();

    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return { error: "Unauthorized: No authentication token provided." };
    }
    const url = `${BASE_URL}/students/list/`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return { data: response.data.results };
  } catch (error) {
    console.error("Failed to get students:", error);
    return { error: error.response?.data || error.message || "Unknown error" };
  }
};
