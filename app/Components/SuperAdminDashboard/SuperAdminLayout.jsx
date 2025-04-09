"use client";

import React, {
  Suspense,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import styles from "../../Super-Admin/css/spinner.module.css"; // Adjust the import path as needed
import { useRouter } from "next/navigation";
import { MdWarning } from "react-icons/md";
import LeftSidebar from "./LeftSidebar";
import { getAuthToken } from "@/app/Service/AuthService";

// Create a context for Super Admin authentication
const SuperAdminAuthContext = createContext(null);

export const useSuperAdminAuth = () => {
  return useContext(SuperAdminAuthContext);
};

export default function SuperAdminRootLayout({ children }) {
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
          Super Admin access is not available on small screens.
        </p>
        <p className="text-md text-gray-600">
          Please use a larger screen to continue.
        </p>
      </div>
    );
  }

  return (
    <SuperAdminAuthContext.Provider value={authContextValue}>
      <div className="grid sm:grid-cols-[150px_auto] md:grid-cols-[150px_auto] xl:grid-cols-[200px_auto] overflow-hidden w-screen  h-screen">
        <div className="bg-[#01427A] h-full ">
          <Suspense>
            <LeftSidebar />
          </Suspense>
        </div>
        <div className="flex flex-col h-screen overflow-hidden">{children}</div>
      </div>
    </SuperAdminAuthContext.Provider>
  );
}
