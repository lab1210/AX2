// useInitializeUser.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  clearAuthToken,
  getAuthToken,
  getUserDetails,
  refreshToken,
} from "@/Service/AuthService";

export const useInitializeUser = (setUser, setIsLoading) => {
  const router = useRouter();

  useEffect(() => {
    const initializeUser = async () => {
      const token = getAuthToken();
      if (!token) {
        router.push("/");
        return;
      }
      try {
        const userDetails = getUserDetails();
        setUser(userDetails);
        setIsLoading(false);
      } catch (err) {
        try {
          const newToken = await refreshToken(token);
          if (newToken) {
            const refreshedUserDetails = getUserDetails();
            setUser(refreshedUserDetails);
          } else {
            clearAuthToken();
            router.push("/");
          }
        } catch (refresherr) {
          clearAuthToken();
          router.push("/");
        } finally {
          setIsLoading(false);
        }
      }
    };
    initializeUser();
  }, [router, setUser, setIsLoading]);
};
