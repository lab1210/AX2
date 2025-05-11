import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const RegisterTeacher = async (teacherData) => {
  try {
    const url = `${BASE_URL}/teachers/self-register/`;
    const response = await axios.post(url, teacherData);
    return response.data;
  } catch (error) {
    console.error(
      "Error registering teacher:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
