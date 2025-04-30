"use client";
import React, { useEffect, useState } from "react";
import { TbDashboard, TbLogout } from "react-icons/tb";
import { IoWalletOutline } from "react-icons/io5";
import { LuNotepadText } from "react-icons/lu";
import { BiPieChartAlt2 } from "react-icons/bi";
import { RiBookShelfLine } from "react-icons/ri";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { LiaHeartbeatSolid } from "react-icons/lia";
import { FaRegUser } from "react-icons/fa6";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { logout } from "../../../Service/AuthService";

const LeftSidebar = ({ setUser, user }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push("/");
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
    <div className="h-screen bg-white flex flex-col">
      <div className="flex flex-col mb-3 pt-4 items-center justify-center">
        <div className="max-w-[60px] w-full">
          <img src="/logo.svg" alt="logo" className="w-full object-cover" />
        </div>
        <div className="font-bold text-base  ">
          <p>{user.student.school}</p>
          <p>Student Portal</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between text-center overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <ul className="list-none flex flex-col pl-2">
          {StudentLeft.map((item, index) => (
            <li
              key={index}
              className="2xl:p-2.5 xl:p-2 lg:p-2.5 hover:text-gray-400 rounded-lg transition-colors xl:text-md 2xl:text-lg"
            >
              <Link
                href={`${item.route}?studentId=${user?.student?.student_id}`}
                className="flex items-center text-left gap-2"
              >
                <span
                  className={`${
                    pathname.startsWith(item.route)
                      ? "text-[#F94144]"
                      : "text-gray-700 hover:text-gray-400"
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`${
                    pathname.startsWith(item.route)
                      ? "text-[#F94144]"
                      : "text-gray-700 hover:text-gray-300"
                  }`}
                >
                  {item.Name}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex justify-center mb-5">
          <button
            onClick={handleLogout}
            className="bg-[#F94144] p-1.5 pl-3 pr-3 flex items-center text-white rounded-lg font-bold text-base gap-2.5 hover:bg-[#D81A2D] transition-colors cursor-pointer xl:p.2.5 xl:pl-4 xl:pr-4 2xl:p-3"
          >
            <TbLogout className="text-xl" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
