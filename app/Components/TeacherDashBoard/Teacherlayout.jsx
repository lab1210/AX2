"use client";
import React, { Suspense, useEffect, useState } from "react";
import LeftSidebar from "./LeftSideBar";
import { usePathname, useRouter } from "next/navigation";
import BottomNavBar from "./BottomNavbar";
import {
  clearAuthToken,
  getAuthToken,
  getUserDetails,
  refreshToken,
} from "../../Service/AuthService";
import { BiChevronLeft } from "react-icons/bi";
import RightSidebar from "./RightSideBar";

const TeacherLayout = ({ children, dynamicContent }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [headerTitle, setHeaderTitle] = useState("Dashboard");
  const pathName = usePathname();
  const router = useRouter();

  const generateTitle = (path) => {
    const parts = path.split("/");
    const formattedParts = parts.slice(2).map((part) => {
      return part
        .replace(/-/g, " ")
        .replace(/\b\w/g, (match) => match.toUpperCase());
    });

    if (formattedParts.length >= 2) {
      return {
        firstPart: formattedParts[0],
        restParts: formattedParts.slice(1).join(" / "),
      };
    }
    return formattedParts.join(" / ") || "Dashboard";
  };

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
  }, [router]);

  useEffect(() => {
    const title = generateTitle(pathName);
    setHeaderTitle(title);
  }, [pathName]);

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center z-[1000]">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const isDashboard = pathName === "/Teacher";

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:grid w-full h-screen grid-cols-[20%_60%_20%] xl:grid-cols-[15%_65%_20%] overflow-hidden">
        {/* Left Sidebar */}
        <div>
          <Suspense>
            <LeftSidebar setUser={setUser} user={user} />
          </Suspense>
        </div>
        {/* Main Content */}
        <div className="w-full h-screen overflow-y-scroll no-scrollbar">
          <div className="pb-16 lg:pb-4 lg:rounded-b-lg">
            {children}
          </div>
        </div>
        {/* Right Sidebar */}
        <div className="bg-[#F7F8FA]">
          <RightSidebar />
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="block lg:hidden w-full min-h-screen bg-[#F7F8FA]">
        <div className="w-full min-h-screen">
          {children}
        </div>
        <BottomNavBar setUser={setUser} user={user} />
      </div>
    </>
  );
};

export default TeacherLayout;