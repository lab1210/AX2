"use client";
import React, { Suspense, useEffect, useState } from "react";
import LeftSidebar from "../TeacherDashBoard/LeftSideBar";
import { usePathname, useRouter } from "next/navigation";
import BottomNavBar from "../TeacherDashBoard/BottomNavbar";
import {
  clearAuthToken,
  getAuthToken,
  getUserDetails,
  refreshToken,
} from "../../Service/AuthService";
import { BiChevronLeft } from "react-icons/bi";

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
      <div className="w-full h-screen grid xl:grid-cols-[15%_1fr] grid-cols-[20%_1fr] overflow-hidden lg:overflow-auto bg-gray-100">
        {/* Left Sidebar */}
        <div className="hidden md:block">
          <Suspense>
            <LeftSidebar setUser={setUser} user={user} />
          </Suspense>
        </div>

        {/* Main Content */}
        <div className="grid grid-rows-[auto_1fr] overflow-hidden h-full">
          {/* Content Section */}
          <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-16 lg:pb-4 lg:rounded-b-lg">
            {children}
          </div>
        </div>
      </div>

      <BottomNavBar setUser={setUser} user={user} />
    </>
  );
};

export default TeacherLayout;