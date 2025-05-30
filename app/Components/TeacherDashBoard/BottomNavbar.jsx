"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { Table, Sheet } from 'lucide-react';
import { FaRegCommentDots, FaCommentDots } from "react-icons/fa6";
import { IoCalendarOutline, IoCalendarSharp } from "react-icons/io5";

const BottomNavBar = ({ setUser, user }) => {
  const pathname = usePathname();

  const dashboardRoute = "/Teacher/DashBoard";
  const commentRoute = "/Teacher/Comments";
  const timetableRoute = "/Teacher/Timetable";
  const attendanceRoute = "/Teacher/Attendance";

  const navItems = [
    {
      id: "dashboard",
      href: dashboardRoute,
      icon: AiOutlineHome,
      activeIcon: AiFillHome,
    },
    {
      id: "attendance",
      href: attendanceRoute,
      icon: IoCalendarOutline,
      activeIcon: IoCalendarSharp,
    },
    {
      id: "timetable",
      href: timetableRoute,
      icon: Table,
      activeIcon: Sheet,
    },
    { id: "comment", href: commentRoute, icon: FaRegCommentDots, activeIcon: FaCommentDots },
  ];

  const buildHref = (baseHref) => {
    return `${baseHref}?studentId=${user?.student?.student_id}`;
  };

  const isActive = (itemHref) => pathname === itemHref;

  const isSpecialActive = !isActive(dashboardRoute) && !isActive(commentRoute);

  return (
    <div className="block lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-md z-50 print:hidden">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => {
          const currentHref = buildHref(item.href);
          let itemIsActive = false;

          if (item.id === "dashboard") {
            itemIsActive = isActive(item.href);
          } else if (item.id === "attendance") {
            itemIsActive = isActive(item.href);
          } else if (item.id === "comment" || item.id === "timetable") {
            itemIsActive = isSpecialActive && isActive(item.href);
          }

          const IconComponent = itemIsActive ? item.activeIcon : item.icon;
          const textColor = itemIsActive ? "text-[#4169E1]" : "text-gray-500";

          return (
            <Link href={currentHref} key={item.id} legacyBehavior>
              <a
                className={`flex flex-col items-center justify-center w-full ${textColor} hover:text-[rgba(0,64,128,0.8)] transition-colors`}
              >
                <IconComponent size={24} />
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavBar;
