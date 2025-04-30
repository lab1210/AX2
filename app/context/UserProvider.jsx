"use client";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const router = useRouter();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        // Important: Add a try-catch block
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        localStorage.removeItem("user"); // Remove corrupted data
      }
    }
    setIsLoading(false); // Set isLoading to false after checking localStorage
  }, []);

  // Helper function to update user and localStorage
  const updateUser = (newUser) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  const checkUser = () => {
    if (!user && !isLoading) {
      router.push("/"); // Redirect to login
      return false; // Return false to indicate redirection
    }
    return true; // Return true if user is logged in
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser: updateUser,
        isLoading,
        checkUser,
      }}
    >
      {" "}
      {/* Use updateUser */}
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
