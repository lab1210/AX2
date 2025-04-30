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
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

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

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white shadow-lg transition-all duration-300 ease-in-out",
        "border-r border-gray-200",
        isCollapsed ? "w-20" : "w-[20%]"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between p-4 border-b border-gray-200 transition-all duration-300",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        <AnimatePresence>
          {!isCollapsed && (
            <motion.img
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              src="/logo.png"
              alt="Foursquare Logo"
              className="h-8"
            />
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="text-gray-600 hover:text-blue-500"
        >
          <ChevronLeft
            className={cn(
              "w-5 h-5 transition-transform duration-300",
              isCollapsed ? "rotate-180" : "rotate-0"
            )}
          />
        </Button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col space-y-2 p-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className={cn(
                "flex items-center justify-start gap-2 w-full h-12 px-4 py-3",
                "text-gray-700 hover:bg-gray-100 hover:text-blue-600",
                "transition-colors duration-200 rounded-md",
                "font-medium",
                isCollapsed ? "justify-center" : "justify-start"
              )}
              onClick={() => {
                console.log(`Navigating to ${item.route}`);
              }}
            >
              <span className="transition-all duration-300">{item.icon}</span>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="transition-all duration-300"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          ))}
        </nav>
      </div>

      {/* Bottom Section - Powered By */}
      <div
        className={cn(
          "p-4 border-t border-gray-200 text-center transition-all duration-300",
          isCollapsed ? "hidden" : "block"
        )}
      >
        <p className="text-xs text-gray-500">Powered by:</p>
        <img
          src="/AlgorithmX.png"
          alt="AlgorithmX Logo"
          className="h-6 mx-auto mt-1"
        />
      </div>
    </div>
  );
};

export default LeftSidebar;
