"use client";
import React, { createContext, Suspense, useEffect, useState, useContext } from "react";
import styles from "../../School-Admin/css/spinner.module.css";
import { useRouter, usePathname } from "next/navigation";
import { MdWarning } from "react-icons/md";
import authService from "@/Service/AuthService";
import SchoolAdminLeft from "../SchoolAdminDashBoard/LeftSideBar";
import DashboardHeader from "../SchoolAdminDashBoard/DashboardHeader";
import { Toaster } from "react-hot-toast";

const SchoolAdminLayoutContext = createContext(null);

export const useSchoolAdminLayout = () => {
  return useContext(SchoolAdminLayoutContext);
};

const SchoolAdminLayout = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = authService.getAccessToken();
      const user = authService.getUser();
      
      if (token && user) {
        // Check if user has SchoolAdmin role
        const hasSchoolAdminRole = user.roles?.includes("SchoolAdmin");
        
        if (hasSchoolAdminRole) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          authService.logout();
          window.location.href = "/"
        }
      } else {
        setIsAuthenticated(false);
        if (pathname !== "/") {
          window.location.href = "/"
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    const handleStorage = (event) => {
      if (event.key === "accessToken" && !event.newValue) {
        setIsAuthenticated(false);
        window.location.href = "/"
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, [router, pathname]);

  // Check token expiration periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenExpiration = () => {
      const token = authService.getAccessToken();
      if (!token) {
        setIsAuthenticated(false);
        window.location.href = "/"
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, router]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const authContextValue = {
    isAuthenticated,
    isLoading,
    user: authService.getUser(),
    logout: () => {
      authService.logout();
      setIsAuthenticated(false);
      window.location.href = "/"
    },
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isSmallScreen) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <MdWarning className="text-red-600 text-6xl mb-4" />
        <p className="text-lg font-semibold text-red-600">
          School Admin access is not available on small screens.
        </p>
        <p className="text-md text-gray-600">
          Please use a larger screen to continue.
        </p>
      </div>
    );
  }

  return (
    <SchoolAdminLayoutContext.Provider value={authContextValue}>
      <div className="grid sm:grid-cols-[200px_auto] xl:grid-cols-[220px_auto] overflow-hidden w-screen h-screen">
        <div className="bg-[#004080] max-h-screen">
          <Suspense fallback={<div className={styles.loadingContainer}><div className={styles.spinner}></div></div>}>
            <SchoolAdminLeft />
          </Suspense>
        </div>
        <div className="grid grid-rows-[68px_1fr] lg:h-full sm:min-h-screen">
          <DashboardHeader />
          <Toaster position="top-right" />
          <div className="h-full lg:overflow-hidden overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </SchoolAdminLayoutContext.Provider>
  );
};

export default SchoolAdminLayout;