import axios from "axios";
import { createAuthHeaders } from "./AuthService"; // Adjust path as needed

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getAllRoles = async () => {
  try {
    const headers = createAuthHeaders();
    if (!headers.Authorization) {
      console.error(
        "Authentication token not found. Cannot make authenticated request."
      );
      return null; // Or throw an error
    }

    const url = `${BASE_URL}/roles/`;
    const response = await axios.get(url, { headers });
    return response;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};
