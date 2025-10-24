"use client";
import React, { useState } from "react";
import { useInitializeUser } from "../hooks/InitializeUser";
import { MdOutlineAssignment, MdOutlineDashboard } from "react-icons/md";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CiLogout, CiSettings } from "react-icons/ci";
import SchoolAdminSettingsPopup from "../SchoolAdminSettingsPopup";
import { FiCalendar, FiUserPlus } from "react-icons/fi";
import { IoDocumentTextOutline, IoNotificationsOutline } from "react-icons/io5";
import { FaCalendar } from "react-icons/fa";
import { logout } from "@/Service/AuthService";
import toast from "react-hot-toast";

const SchoolAdminLeft = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const schooladminId = searchParams.get("schooladminId");
  const pathname = usePathname();
  const router = useRouter();
  useInitializeUser(setUser, setIsLoading);

  const [activePopup, setActivePopup] = useState(null);

  const DashboardLinks = [
    {
      Name: "Dashboard",
      icon: <MdOutlineDashboard size={20} />,
      Link: "/School-Admin/DashBoard",
    },
    {
      Name: "School Settings",
      icon: <CiSettings size={20} />,
    },

    {
      Name: "Assignment",
      icon: <MdOutlineAssignment size={20} />,
    },
    {
      Name: "Registration",
      icon: <FiUserPlus size={20} />,
      Link: "/School-Admin/Registration",
    },
    {
      Name: "Result Management",
      icon: <IoDocumentTextOutline size={20} />,
      Link: "/School-Admin/Result-Management",
    },
    {
      Name: "Time Table Management",
      icon: <FiCalendar size={20} />,
      Link: "/School-Admin/Time-Table-Management",
    },
    {
      Name: "Notification",
      icon: <IoNotificationsOutline size={20} />,
      Link: "/School-Admin/Notification",
    },
  ];

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await logout();
      toast.success(response.message);
      router.push("/");
    } catch (error) {
      toast.error("Logout failed. Please try again." || error.message);
    }
  };
  const isSpecialRouteActive = (name) => {
    if (name === "School Settings") {
      return pathname.includes("Configure");
    }
    if (name === "Assignment") {
      return pathname.includes("Assign");
    }
    return false;
  };

  return (
    <div className="h-full w-full grid grid-rows-[100px_1fr_auto] pt-8">
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="object-contain max-w-[50px] max-h-[50px]">
          <img className="w-full h-full" src={"/logo.svg"} alt="logo" />
        </div>
        <div className="text-white">
          <p className="font-bold lg:text-base text-sm">
            {user?.school_admin?.school_name}
          </p>
          <p className="font-bold text-center">Student Portal</p>
        </div>
      </div>

      <ul className="pt-6 text-white pl-4 pr-4 flex flex-col gap-2 w-full ">
        {DashboardLinks.map((item, index) => {
          const isSpecial =
            item.Name === "School Settings" || item.Name === "Assignment";
          const isActive = isSpecial
            ? isSpecialRouteActive(item.Name)
            : pathname.includes(item.Link);

          return (
            <li
              key={index}
              className={`relative  cursor-pointer rounded-sm p-1 w-full ${
                isActive
                  ? "bg-[#f5f5f5] text-[#01427A] "
                  : "hover:bg-[#ABBED2] hover:text-[#01427A]"
              }`}
              onClick={isSpecial ? () => setActivePopup(item.Name) : undefined}
            >
              {isSpecial ? (
                <>
                  <div
                    className={`flex items-center gap-4 sm:text-[0.94rem] xl:text-base  `}
                  >
                    <span>{item.icon}</span>
                    {item.Name}
                  </div>
                  <SchoolAdminSettingsPopup
                    Name={item.Name}
                    settingsClicked={activePopup === item.Name}
                    setSettingsClicked={() => setActivePopup(null)}
                  />
                </>
              ) : (
                <Link
                  className="flex items-center gap-4 sm:text-[0.94rem] xl:text-base"
                  href={`${item.Link}${
                    schooladminId ? `?schooladminId=${schooladminId}` : ""
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.Name}
                </Link>
              )}
            </li>
          );
        })}
        <li
          onClick={handleLogout}
          className={`relative  cursor-pointer rounded-sm p-1 w-full bg-[#F94144] text-white]
          `}
        >
          <div
            className={`flex items-center gap-4 sm:text-[0.94rem] xl:text-base  `}
          >
            <span>
              <CiLogout size={20} />
            </span>
            Logout
          </div>
        </li>
      </ul>

      <div className="flex justify-center">
        <div className="object-contain max-w-[100px] max-h-[65px] pb-2">
          <img src="/whitelogo.png" alt="logo" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminLeft;
