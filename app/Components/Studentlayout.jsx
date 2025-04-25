"use client";
import React, { Suspense, useEffect, useState } from "react";
import LeftSidebar from "./StudentDashBoard/LeftSidebar";
import { usePathname, useRouter } from "next/navigation";
import RightSidebar from "./StudentDashBoard/RightSidebar";
import BottomNavBar from "./StudentDashBoard/BottomNavbar";
import {
  clearAuthToken,
  getAuthToken,
  getUserDetails,
  refreshToken,
} from "../Service/AuthService";
import { BiChevronLeft } from "react-icons/bi";

const Layout = ({ children }) => {
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

  const isDashboard = pathName === "/Student"; 

  return (
    <>
      <div className="w-full h-screen grid grid-cols-1 xl:grid-cols-[180px_1fr_260px] lg:grid-cols-[160px_1fr_230px] overflow-hidden bg-gray-100">
        <div className="hidden lg:block">
          <Suspense>
            <LeftSidebar setUser={setUser} user={user} />
          </Suspense>
        </div>

        <div className="grid grid-rows-[auto_1fr] overflow-hidden h-full">
          <div className="bg-white sticky top-0 z-10 p-3 pb-1.5 flex items-center justify-between lg:rounded-t-lg">
            <div className="flex items-center gap-4">
              {!isDashboard && (
                <button onClick={() => router.back()} className="lg:hidden">
                  <BiChevronLeft size={24} className="text-gray-700" />
                </button>
              )}
              {typeof headerTitle === "object" ? (
                <h2 className="text-xl font-bold">
                  <span className="text-gray-500">{headerTitle.firstPart}</span>
                  {" / "}
                  {headerTitle.restParts}
                </h2>
              ) : (
                <h2 className="text-2xl font-bold">{headerTitle}</h2>
              )}
            </div>
            {user?.profilePicture ? (
              <div className="rounded-full w-8 h-8 overflow-hidden lg:hidden">
              <img
                src={
                  user.student.profile_picture_path === null
                    ? "/female.png"
                    : user.student.profile_picture_path
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
              </div>
            ) : (
              <div className="rounded-full bg-gray-300 w-8 h-8 flex items-center justify-center">
                {user?.firstName?.charAt(0).toUpperCase()}{user?.lastName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="bg-white p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-16 lg:pb-4 lg:rounded-b-lg">
            {children}
          </div>
        </div>
        <div className="hidden lg:block bg-white h-full rounded-lg pr-4  overflow-hidden">
          <RightSidebar user={user} />
        </div>
      </div>

      <BottomNavBar setUser={setUser} user={user} />
    </>
  );
};

export default Layout;