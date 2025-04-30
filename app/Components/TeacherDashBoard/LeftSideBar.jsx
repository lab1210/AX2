"use client";
import React, { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  ListChecks,
  TrendingUp,
  MessageCircle,
  ChevronLeft,
} from "lucide-react";

import { useRouter, usePathname } from "next/navigation";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    route: "/Teacher/dashboard",
  },
  {
    label: "Attendance",
    icon: <Calendar className="w-4 h-4" />,
    route: "/Teacher/attendance",
  },
  {
    label: "Academic Record",
    icon: <BookOpen className="w-4 h-4" />,
    route: "/Teacher/record",
  },
  {
    label: "Timetable",
    icon: <ListChecks className="w-4 h-4" />,
    route: "/Teacher/timetable",
  },
  {
    label: "Performance Analysis",
    icon: <TrendingUp className="w-4 h-4" />,
    route: "/Teacher/analysis",
  },
  {
    label: "Message",
    icon: <MessageCircle className="w-4 h-4" />,
    route: "/Teacher/message",
  },
];

const LeftSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-[20%]"
      )}
    >
      {/* Top section with logo and toggle */}
      <div
        className={cn(
          "flex items-center p-4 border-b border-gray-200 transition-all duration-300",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed && (
          <img src="/logo.png" alt="Foursquare Logo" className="h-8" />
        )}
        <button
          onClick={toggleCollapse}
          className="text-gray-600 hover:text-blue-500"
        >
          <ChevronLeft
            className={cn(
              "w-5 h-5 transition-transform duration-300",
              isCollapsed ? "rotate-180" : "rotate-0"
            )}
          />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col space-y-2 p-2">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.route)}
              className={cn(
                "flex items-center gap-2 w-full h-12 px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 rounded-md font-medium",
                isCollapsed ? "justify-center" : "justify-start",
                pathname === item.route ? "bg-blue-100 text-blue-700" : ""
              )}
            >
              <span>{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">Powered by:</p>
          <img
            src="/AlgorithmX.png"
            alt="AlgorithmX Logo"
            className="h-6 mx-auto mt-1"
          />
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
