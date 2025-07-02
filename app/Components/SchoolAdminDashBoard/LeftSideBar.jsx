"use client";
import React, { useState } from "react";
import { useInitializeUser } from "../hooks/InitializeUser";
import { MdOutlineDashboard } from "react-icons/md";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import SchoolAdminSettingsPopup from "../SchoolAdminSettingsPopup";

const SchoolAdminLeft = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const schooladminId = searchParams.get("schooladminId");
  const pathname = usePathname();

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
      icon: <MdOutlineDashboard size={20} />,
    },
    {
      Name: "Registration",
      icon: <MdOutlineDashboard size={20} />,
      Link: "/School-Admin/Registration",
    },
    {
      Name: "Assignment",
      icon: <MdOutlineDashboard size={20} />,
    },
    {
      Name: "Result Management",
      icon: <MdOutlineDashboard size={20} />,
      Link: "/School-Admin/Result-Management",
    },
    {
      Name: "Time Table Management",
      icon: <MdOutlineDashboard size={20} />,
      Link: "/School-Admin/Time-Table-Management",
    },
    {
      Name: "Notification",
      icon: <MdOutlineDashboard size={20} />,
      Link: "/School-Admin/Notification",
    },
  ];

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

      <ul className="pt-6 text-white pl-4 pr-4 flex flex-col gap-2">
        {DashboardLinks.map((item, index) => {
          const isSpecial =
            item.Name === "School Settings" || item.Name === "Assignment";
          const isActive = isSpecial
            ? isSpecialRouteActive(item.Name)
            : pathname.includes(item.Link);

          return (
            <li
              key={index}
              className={`relative max-w-50 cursor-pointer rounded-sm p-1 ${
                isActive
                  ? "bg-[#f5f5f5] text-[#01427A] "
                  : "hover:bg-[#ABBED2] hover:text-[#01427A]"
              }`}
              onClick={isSpecial ? () => setActivePopup(item.Name) : undefined}
            >
              {isSpecial ? (
                <>
                  <div
                    className={`flex items-center gap-4 sm:text-[0.94rem] xl:text-base p-1 `}
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
