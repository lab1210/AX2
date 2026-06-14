"use client";
import { Toaster } from "react-hot-toast";
import React, {
  Suspense,
  useEffect,
  useState,
  useContext,
  createContext,
} from "react";
import styles from "../../Super-Admin/css/spinner.module.css";
import { useRouter, usePathname } from "next/navigation";
import { MdWarning } from "react-icons/md";
import LeftSidebar from "./LeftSidebar";
import authService from "@/Service/AuthService"; // Import new auth service

// Create a context for Super Admin authentication
const SuperAdminAuthContext = createContext(null);

export const useSuperAdminAuth = () => {
  return useContext(SuperAdminAuthContext);
};

export default function SuperAdminRootLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // Use usePathname instead of router.pathname
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      // Use new auth service
      const token = authService.getAccessToken();
      const user = authService.getUser();
      
      if (token && user) {
        // Verify user has SuperAdmin role
        const hasSuperAdminRole = user.roles?.includes("SuperAdmin");
        
        if (hasSuperAdminRole) {
          setIsAuthenticated(true);
        } else {
          // User doesn't have SuperAdmin role
          setIsAuthenticated(false);
          authService.logout();
          router.push("/login");
        }
      } else {
        setIsAuthenticated(false);
        // Redirect to login if not on login page
        if (pathname !== "/login") {
          router.push("/login");
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for storage events (logout from other tabs)
    const handleStorage = (event) => {
      if (event.key === "accessToken" && !event.newValue) {
        setIsAuthenticated(false);
        router.push("/login");
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, [router, pathname]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Also check for token expiration periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenExpiration = () => {
      const token = authService.getAccessToken();
      if (!token) {
        setIsAuthenticated(false);
        router.push("/login");
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, router]);

  const authContextValue = {
    isAuthenticated,
    isLoading,
    user: authService.getUser(),
    logout: () => {
      authService.logout();
      setIsAuthenticated(false);
      router.push("/login");
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
      <div className="grid sm:grid-cols-[150px_auto] md:grid-cols-[150px_auto] xl:grid-cols-[200px_auto] overflow-hidden w-screen h-screen">
        <div className="bg-[#01427A] h-full">
          <Suspense fallback={<div className={styles.loadingContainer}><div className={styles.spinner}></div></div>}>
            <LeftSidebar />
          </Suspense>
        </div>
        <div className="flex flex-col h-screen overflow-hidden">
          <Toaster position="top-right" />
          {children}
        </div>
      </div>
    </SuperAdminAuthContext.Provider>
  );
}