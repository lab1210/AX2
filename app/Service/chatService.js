//ChatService.js

import axios from "axios";
import { createAuthHeaders } from "./AuthService";

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/messages/`;

export const getMessages = async () => {
  const headers = createAuthHeaders();
  try {
    const response = await axios.get(`${BASE_URL}inbox/`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching inbox messages:", error);
    throw new Error("Failed to fetch messages. Please try again later.");
  }
};

export const sendMessage = async (
  recipient,
  content,
  sender,
  isRead = false
) => {
  const headers = createAuthHeaders();
  try {
    const response = await axios.post(
      `${BASE_URL}send/`,
      {
        data: {
          content: content,
          is_read: isRead,
          sender: sender,
          recipient: recipient,
        },
      },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
