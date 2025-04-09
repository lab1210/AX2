"use client";
import React, { useState } from "react";
import { TbDashboard, TbLogout } from "react-icons/tb";
import { IoWalletOutline } from "react-icons/io5";
import { LuNotepadText } from "react-icons/lu";
import { BiPieChartAlt2 } from "react-icons/bi";
import { RiBookShelfLine } from "react-icons/ri";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { LiaHeartbeatSolid } from "react-icons/lia";
import { FaRegUser } from "react-icons/fa6";
import { HiMenu } from "react-icons/hi"; 
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LeftSidebar = ({ setUser, showMobileSidebar, setShowMobileSidebar }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const schoolId = searchParams.get("schoolid");
  const userId = searchParams.get("userid");
  const pathname = usePathname();

  const handleLogout = () => {
    router.push("/");
    setUser(null);
  };

  const StudentLeft = [
    {
      Name: "Dashboard",
      icon: <TbDashboard />,
      route: "/Student/DashBoard",
    },
    {
      Name: "Fees Payment",
      icon: <IoWalletOutline />,
      route: "/Student/Fees-Payment",
    },
    {
      Name: "Attendance",
      icon: <BiPieChartAlt2 />,
      route: "/Student/Attendance",
    },
    {
      Name: "Subject Registration",
      icon: <RiBookShelfLine />,
      route: "/Student/Subject-Registration/Register",
    },
    {
      Name: "Timetable",
      icon: <MdOutlineCalendarMonth />,
      route: "/Student/Timetable",
    },
    {
      Name: "Result",
      icon: <LuNotepadText />,
      route: "/Student/Result",
    },
    {
      Name: "Health Record",
      icon: <LiaHeartbeatSolid />,
      route: "/Student/Health-Record/Record",
    },
    {
      Name: "Profile",
      icon: <FaRegUser />,
      route: "/Student/Profile",
    },
  ];

  return (
    <>
    <div className="lg:hidden fixed top-4 left-4 z-10">
    <button
      onClick={() => setShowMobileSidebar(true)}
      className="mobile-menu-button"
    >
      <HiMenu className="w-6 h-6 text-gray-800" />
    </button>
  </div>

      <div className="hidden lg:flex h-screen bg-white flex-col w-[300px]">
        <div className="flex flex-col mb-3 px-4">
          <div className="max-w-[60px] w-full">
            <img src="/logo.svg" alt="logo" className="w-full object-cover" />
          </div>
          <div className="font-bold text-lg">
            <p>Foursquare</p>
            <p>Student Portal</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 flex flex-col text-center">
          <ul className="list-none flex flex-col md:mb-[20px] xl:mb-0.5">
            {StudentLeft.map((item, index) => (
              <li
                key={index}
                className="md:p-[11px] p-2.5 hover:text-gray-400 rounded-lg transition-colors"
              >
                <Link
                  href={`${item.route}?schoolid=${schoolId}&userid=${userId}`}
                  className=" max-w-5 flex items-center gap-1 text-base font-normal text-left"
                >
                  <span
                    className={`text-3xl ${
                      pathname === item.route
                        ? "text-[#F94144]"
                        : "text-gray-700 hover:text-gray-400"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`${
                      pathname === item.route
                        ? "text-[#F94144]"
                        : "text-gray-700 hover:text-gray-300 "
                    }`}
                  >
                    {item.Name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <div className="mb-4">
            <button
              onClick={handleLogout}
              className="w-35 bg-[#F94144] text-white rounded-lg px-5 py-2.5 font-bold text-base flex items-center justify-center gap-2.5 hover:bg-[#D81A2D] transition-colors cursor-pointer"
            >
              <TbLogout className="text-xl" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {showMobileSidebar && (
        <div className="fixed inset-0 z-999 flex lg:hidden">
          <div className="w-[30%] max-w-sm bg-white h-full p-4 rounded-lg shadow-lg items-center">
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowMobileSidebar(false)}>✕</button>
            </div>
            <div className="flex flex-col items-center mb-3 px-4">
              <div className="max-w-[60px] w-full">
                <img src="/logo.svg" alt="logo" className="w-full object-cover" />
              </div>
              <div className="font-bold text-lg text-center">
                <p>Foursquare</p>
                <p>Student Portal</p>
              </div>
            </div>
            <ul className="list-none flex flex-col gap-3">
              {StudentLeft.map((item, index) => (
                <li key={index} className="p-2 hover:bg-gray-200 rounded transition-colors">
                  <Link
                    href={`${item.route}?schoolid=${schoolId}&userid=${userId}`}
                    onClick={() => setShowMobileSidebar(false)} // close overlay on navigation
                    className="flex items-center gap-2 text-base font-normal"
                  >
                    <span className="text-2xl text-gray-700">{item.icon}</span>
                    <span className="text-gray-700">{item.Name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {/* Logout Button */}  
            <div className="mb-1">
              <button
                onClick={handleLogout}
                className="w-[60%] bg-[#F94144] text-white rounded-lg px-5 py-2.5 font-bold text-base flex items-center justify-center gap-2.5 hover:bg-[#D81A2D] transition-colors"
              >
                <TbLogout className="text-xl" />
                Logout
              </button>
            </div>
          </div> 
          <div className="flex-1" onClick={() => setShowMobileSidebar(false)}></div>
        </div>
      )}
    </>
  );
};

export default LeftSidebar;
