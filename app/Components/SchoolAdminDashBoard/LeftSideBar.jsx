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
  const [settingsClicked, setSettingsClicked] = useState(false);

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
      Name: "Manage User",
      icon: <MdOutlineDashboard size={20} />,
      Link: "#",
    },
    {
      Name: "Assignment",
      icon: <MdOutlineDashboard size={20} />,
      Link: "/School-Admin/Subject-Assignment",
    },
    {
      Name: "Result Management",
      icon: <MdOutlineDashboard size={20} />,
      Link: "#",
    },
    {
      Name: "School Fee Management",
      icon: <MdOutlineDashboard size={20} />,
      Link: "#",
    },
    {
      Name: "Timetable Management",
      icon: <MdOutlineDashboard size={20} />,
      Link: "#",
    },
  ];

  return (
    <div className="h-full w-full grid grid-rows-[100px_1fr_auto] pt-8">
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="object-contain max-w-[50px] max-h-[50px]">
          <img className="w-full h-full" src={"/logo.svg"} alt="logo" />
        </div>
        <div className="text-white ">
          <p className="font-bold">{user?.school_admin?.school_name}</p>
          <p className="font-bold">Student Portal</p>
        </div>
      </div>
      <ul className="pt-6 text-white pl-4 pr-4 flex flex-col gap-2">
        {DashboardLinks.map((item, index) => {
          const isSchoolSettings = item.Name === "School Settings";
          return (
            <li
              className={`${
                !isSchoolSettings && "hover:bg-[#ABBED2]  hover:text-[#01427A]"
              } relative max-w-50 cursor-pointer rounded-sm p-1 ${
                !isSchoolSettings && pathname.includes(item.Link)
                  ? "bg-[#f5f5f5] text-[#01427A]"
                  : ""
              }
              `}
              key={index}
              onClick={
                isSchoolSettings ? () => setSettingsClicked(true) : undefined
              }
            >
              {/* Items without Link */}
              {isSchoolSettings && (
                <>
                  <div
                    className={`flex items-center gap-4 sm:text-[0.94rem] xl:text-base hover:bg-[#ABBED2]  hover:text-[#01427A] rounded-sm p-1 ${
                      pathname.includes("Configure")
                        ? "bg-[#f5f5f5] text-[#01427A]"
                        : ""
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.Name}
                  </div>
                  <SchoolAdminSettingsPopup
                    settingsClicked={settingsClicked}
                    setSettingsClicked={setSettingsClicked}
                  />
                </>
              )}

              {/* Items with Link */}

              {item.Link && (
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
        <div className="object-contain  max-w-[100px] max-h-[65px] pb-2">
          <img src="/whitelogo.png" alt="" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminLeft;
