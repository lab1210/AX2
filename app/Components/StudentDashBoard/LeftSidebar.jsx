"use client";
import React from "react"; 
import { TbDashboard, TbLogout } from "react-icons/tb";
import { IoWalletOutline } from "react-icons/io5";
import { LuNotepadText } from "react-icons/lu";
import { BiPieChartAlt2 } from "react-icons/bi";
import { RiBookShelfLine } from "react-icons/ri";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { LiaHeartbeatSolid } from "react-icons/lia";
import { FaRegUser } from "react-icons/fa6";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LeftSidebar = ({ setUser }) => {
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
      <div className="h-screen bg-white flex flex-col">
        <div className="flex flex-col mb-3 px-4 pt-4"> 
          <div className="max-w-[60px] w-full">
            <img src="/logo.svg" alt="logo" className="w-full object-cover" />
          </div>
          <div className="font-bold text-lg">
            <p>Foursquare</p>
            <p>Student Portal</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col text-center overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"> 
          <ul className="list-none flex flex-col md:mb-[20px] xl:mb-0.5 px-2"> 
            {StudentLeft.map((item, index) => (
              <li
                key={index}
                className="md:p-[11px] p-2.5 hover:text-gray-400 rounded-lg transition-colors"
              >
                <Link
                  href={`${item.route}?schoolid=${schoolId}&userid=${userId}`}
                  className="max-w-5 flex items-center gap-1 text-base font-normal text-left"
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
          <button
            onClick={handleLogout}
            className="w-full bg-[#F94144] text-white rounded-lg px-3 py-2.5 font-bold text-base flex items-center justify-center gap-2.5 hover:bg-[#D81A2D] transition-colors cursor-pointer"
          >
            <TbLogout className="text-xl" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;