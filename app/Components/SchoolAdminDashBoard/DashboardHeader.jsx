"use client";
import {
  clearAuthToken,
  getAuthToken,
  getUserDetails,
  refreshToken,
} from "@/Service/AuthService";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";

const DashboardHeader = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [headerTitle, setHeaderTitle] = useState("Dashboard");
  const pathName = usePathname();

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

  const generateTitle = (path) => {
    if (!path) return "Dashboard"; // Default title

    const parts = path.split("/").filter(Boolean); // Remove empty parts

    // If there's only one part (e.g., /stuff), return it directly
    if (parts.length === 1) {
      return parts[0]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (match) => match.toUpperCase());
    }

    // If there are multiple parts, return only the last part
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1];
      return lastPart
        .replace(/-/g, " ")
        .replace(/\b\w/g, (match) => match.toUpperCase());
    }

    return "Dashboard"; // Default title
  };

  useEffect(() => {
    const title = generateTitle(pathName);
    setHeaderTitle(title);
  }, [pathName]);

  return (
    <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0 z-10 shadow-md flex justify-between items-center ">
      <div>
        <p className="text-xl font-bold">{headerTitle}</p>
      </div>
      <div className="flex items-center gap-5">
        <div className="bg-[#f0f5f9] w-8 h-8  flex justify-center relative rounded-full object-contain p-1">
          <IoNotificationsOutline className="w-full h-full " />
          <div className="bg-[#F94144] rounded-full absolute top-1.5 right-2 w-1.5 h-1.5"></div>
        </div>
        <div className="flex items-end gap-2">
          <div className="flex flex-col items-end gap-0">
            <p className="font-bold text-xs">
              {user?.school_admin?.first_name +
                " " +
                user?.school_admin?.surname}
            </p>
            <p className="text-[0.6rem]">School Admin</p>
          </div>
          <div className="w-8 h-8 object-contain">
            <img src="/female2.png" alt="" className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
