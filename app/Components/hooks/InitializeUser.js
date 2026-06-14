// useInitializeUser.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import authService from "@/Service/AuthService";

export const useInitializeUser = (setUser, setIsLoading) => {
  const router = useRouter();

  useEffect(() => {
    const initializeUser = async () => {
      const token = authService.getAccessToken();
      
      if (!token) {
        router.push("/login");
        return;
      }
      
      try {
        const userDetails = authService.getUserDetails();
        console.log("User details from auth:", userDetails);
        setUser(userDetails);
        setIsLoading(false);
      } catch (err) {
        console.error("Error getting user details:", err);
        
        try {
          // Try to refresh the token
          const newToken = await authService.refreshToken();
          
          if (newToken) {
            const refreshedUserDetails = authService.getUserDetails();
            setUser(refreshedUserDetails);
            setIsLoading(false);
          } else {
            authService.clearTokens();
            router.push("/login");
          }
        } catch (refreshErr) {
          console.error("Refresh token failed:", refreshErr);
          authService.clearTokens();
          router.push("/login");
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    initializeUser();
  }, [router, setUser, setIsLoading]);
};