"use client";
import React from "react";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  ListChecks,
  TrendingUp,
  MessageCircle,
  MessageCircleMore,
  Library
} from "lucide-react";

import { useRouter, usePathname } from "next/navigation";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    route: "/Teacher/DashBoard",
  },
  {
    label: "Attendance",
    icon: <Calendar className="w-4 h-4" />,
    route: "/Teacher/Attendance",
  },
  {
    label: "Academic Record",
    icon: <BookOpen className="w-4 h-4" />,
    route: "/Teacher/Record",
  },
  {
    label: "Performance Analysis",
    icon: <TrendingUp className="w-4 h-4" />,
    route: "/Teacher/Analysis",
  },
  
  {
    label: "Timetable",
    icon: <ListChecks className="w-4 h-4" />,
    route: "/Teacher/Timetable",
  },
  {
    label: "Message",
    icon: <MessageCircle className="w-4 h-4" />,
    route: "/Teacher/Message",
  },
  {
    label: "Teacher's Comment",
    icon: <MessageCircleMore className="w-4 h-4" />,
    route: "/Teacher/Comments",
  },
  {
    label: "Subject Registration",
    icon: <Library className="w-4 h-4" />,
    route: "/Teacher/SubjectReg",
  },
];

const SchoolName = "Foursquare Student Portal";

const LeftSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed w-[20%] xl:w-[15%] flex flex-col h-screen bg-white shadow-lg border-r border-gray-200 overflow-hidden no-scrollbar">
      {/* Top section with logo */}
      <div className="flex items-center justify-center p-2 flex-col text-white">
        <img src="/logo.svg" alt="Foursquare Logo" className="h-13 w-13" />
        <h2 className="text-[#004080] text-lg font-semibold text-center p-2">
          {SchoolName}
        </h2>
      </div>

      {/* Navigation Links */}
      <div className="flex-1">
        <nav className="flex flex-col gap-0.5 p-2">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.route)}
              className={`flex items-center gap-2 w-full h-12 px-4 py-3 transition-colors duration-200 rounded-lg font-medium cursor-pointer ${
                pathname === item.route
                  ? "bg-[#e6ecf2] text-[#004080]" 
                  : "text-[#004080] hover:bg-[#e6ecf2]"
              }`}
            >
              <span>{item.icon}</span>
              <span className="text-left">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 text-center">
        <p className="text-xs text-gray-500">Powered by:</p>
        <img
          src="/AlgorithmX.png"
          alt="AlgorithmX Logo"
          className="h-8 mx-auto mt-1"
        />
      </div>
    </div>
  );
};

export default LeftSidebar;