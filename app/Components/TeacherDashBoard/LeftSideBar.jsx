"use client";
import React, { useEffect, useState } from "react";
import getSchoolById from "../../Service/schoolService";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  ListChecks,
  TrendingUp,
  MessageCircle,
  MessageCircleMore,
  Library,
} from "lucide-react";

import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

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

const LeftSidebar = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [school, setSchool] = useState(null);
  const schoolId = user?.teacher?.school_id;

  // useEffect(() => {
  //   const fetchSchool = async () => {
  //     if (!schoolId) {
  //       console.error("No school ID found");
  //       return;
  //     }
  //     try {
  //       const response = await getSchoolById(schoolId);
  //       setSchool(response.data);
  //       console.log(response.data);
  //       console.log(schoolId);
  //     } catch (error) {
  //       console.log(schoolId);

  //       toast.error("Error fetching school data");
  //       setSchool(null);
  //     }
  //   };
  //   if (schoolId) {
  //     fetchSchool();
  //   }
  // }, [schoolId]);

  return (
    <div className=" flex flex-col h-screen bg-white shadow-lg border-r border-gray-200 overflow-hidden no-scrollbar">
      {/* Top section with logo */}
      <div className="flex items-center justify-center p-2 flex-col text-white">
        <img src="/logo.svg" alt="Foursquare Logo" className="h-13 w-13" />
        <div className="xl:text-lg text-base">
          <p className="text-[#004080]  font-bold text-center ">
            {/* {school?.school_name} */}
            Foursquare
          </p>
          <p className="text-[#004080]  font-bold text-center ">
            Student Portal
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1">
        <ul className="flex flex-col gap-0.5 p-2">
          {sidebarItems.map((item) => (
            <li
              key={item.label}
              onClick={() => router.push(item.route)}
              className={`flex items-center gap-2 w-full p-2 transition-colors duration-200 rounded-lg font-medium cursor-pointer ${
                pathname === item.route
                  ? "bg-[#e6ecf2] text-[#004080]"
                  : "text-[#004080] hover:bg-[#e6ecf2]"
              }`}
            >
              <span>{item.icon}</span>
              <span className="text-left">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Section */}
      <div className="p-4 flex flex-col items-center">
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
