"use client";
import React, { Suspense, useEffect, useState } from "react";
import LeftSidebar from "./StudentDashBoard/LeftSidebar";
import { usePathname } from "next/navigation";
import RightSidebar from "./StudentDashBoard/RightSidebar";
import { useUser } from "./StudentDashBoard/context/UserProvider";
import { HiMenu } from "react-icons/hi";

const Layout = ({ children }) => {
  const { user, isLoading, checkUser, setUser } = useUser();
  const [headerTitle, setHeaderTitle] = useState("Dashboard");
  const pathName = usePathname();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

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
    if (!checkUser()) return;
  }, [user, isLoading, checkUser]);

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

  return (
    <div className="w-full h-screen grid md:grid-cols-[70%_30%] xl:grid-cols-[160px_1fr_300px] p-3 pt-[15px]">
        <Suspense>
          <LeftSidebar 
          setUser={setUser}
          showMobileSidebar={showMobileSidebar} 
          setShowMobileSidebar={setShowMobileSidebar}
           />
        </Suspense>

      <div className="grid grid-rows-[61px_1fr] h-screen">
        <div className="bg-white sticky top-0 z-10 p-4 flex items-center gap-4">
          <button 
            className="lg:hidden text-2xl ml-2"
            onClick={() => setShowMobileSidebar(true)}
          >
            <HiMenu className="w-6 h-6 text-gray-800" />
          </button>
          
          {typeof headerTitle === "object" ? (
            <h2 className="text-xl font-bold">
              <span className="text-gray-500">{headerTitle.firstPart}</span>
              {" / "}{headerTitle.restParts}
            </h2>
          ) : (
            <h2 className="text-xl font-bold">{headerTitle}</h2>
          )}
        </div>
        <div className="rounded-lg overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </div>
      </div>

      <div className="bg-white h-screen md:px-3 xl:pl-6">
        <RightSidebar user={user} />
      </div>
    </div>
  );
};

export default Layout;