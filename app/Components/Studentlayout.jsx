// Layout.jsx
"use client";
import React, { Suspense, useEffect, useState } from "react";
import LeftSidebar from "./StudentDashBoard/LeftSidebar"; 
import { usePathname } from "next/navigation";
import RightSidebar from "./StudentDashBoard/RightSidebar"; 
import { useUser } from "./StudentDashBoard/context/UserProvider"; 
import BottomNavBar from "./StudentDashBoard/BottomNavBar"; 

const Layout = ({ children }) => {
  const { user, isLoading, checkUser, setUser } = useUser();
  const [headerTitle, setHeaderTitle] = useState("Dashboard");
  const pathName = usePathname();

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
    <>
      <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-[15%_60%_25%] xl:grid-cols-[10%_70%_20%] overflow-hidden bg-gray-100">

        <div className="hidden lg:block">
            <Suspense>
                <LeftSidebar setUser={setUser} />
            </Suspense>
        </div>

        <div className="grid grid-rows-[auto_1fr] overflow-hidden h-full">
          <div className="bg-white sticky top-0 z-10 p-4 flex items-center gap-4 lg:rounded-t-lg">
            {typeof headerTitle === "object" ? (
              <h2 className="text-xl font-bold">
                <span className="text-gray-500">{headerTitle.firstPart}</span>
                {" / "}
                {headerTitle.restParts}
              </h2>
            ) : (
              <h2 className="text-xl font-bold">{headerTitle}</h2>
            )}
          </div>
          <div className="bg-white p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-16 lg:pb-4 lg:rounded-b-lg">
            {children}
          </div>
        </div>
        <div className="hidden lg:block bg-white h-full rounded-lg px-6 xl:pl-6 overflow-hidden">
          <RightSidebar user={user} />
        </div>
      </div>
       <BottomNavBar />
    </>
  );
};

export default Layout;