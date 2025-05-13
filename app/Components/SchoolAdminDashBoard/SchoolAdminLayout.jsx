"use client";
import React, { createContext, Suspense, useEffect, useState } from "react";
import styles from "../../School-Admin/css/spinner.module.css";
import { useRouter } from "next/navigation";
import { MdWarning } from "react-icons/md";
import { getAuthToken } from "../../Service/AuthService";
import SchoolAdminLeft from "../SchoolAdminDashBoard/LeftSideBar";
import DashboardHeader from "../SchoolAdminDashBoard/DashboardHeader";
const SchoolAdminLayoutContext = createContext(null);

export const useSchoolAdminLayout = () => {
  return useContext(SchoolAdminLayoutContext);
};
const SchoolAdminLayout = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = getAuthToken();
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        if (router.pathname !== "/") {
          router.push("/");
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    const handleStorage = (event) => {
      if (event.key === "authToken" && !event.newValue) {
        setIsAuthenticated(false);
        if (router.pathname !== "/") {
          router.push("/");
        }
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, [router]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  const authContextValue = {
    isAuthenticated,
    isLoading,
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
      <div className="grid sm:grid-cols-[150px_auto] md:grid-cols-[200px_auto] xl:grid-cols-[220px_auto] overflow-hidden w-screen h-screen">
        <div className="bg-[#004080] max-h-screen">
          <Suspense>
            <SchoolAdminLeft />
          </Suspense>
        </div>
        <div className="grid grid-rows-[68px_1fr] h-full">
          <DashboardHeader />
          <div className="h-full overflow-hidden">{children}</div>
        </div>
      </div>
    </SchoolAdminLayoutContext.Provider>
  );
};

export default SchoolAdminLayout;
