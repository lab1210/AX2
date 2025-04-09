import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { FaRegUser } from "react-icons/fa6";
import { LuFileChartLine, LuLogOut, LuSchool } from "react-icons/lu";
import { TbDashboard } from "react-icons/tb";
import { AiOutlineFileProtect } from "react-icons/ai";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { LiaUserShieldSolid } from "react-icons/lia";
import { logout } from "@/app/Service/AuthService";

const LeftSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");
  const pathname = usePathname();
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const SuperAdminLeft = [
    {
      Name: "Dashboard",
      icon: <TbDashboard />,
      route: "/Super-Admin/DashBoard",
    },
    {
      Name: "Manage Schools",
      icon: <LuSchool />,
      route: "/Super-Admin/Manage-Existing-Schools",
    },
    {
      Name: "Manage School Admin",
      icon: <LiaUserShieldSolid />,
      route: "/Super-Admin/Manage-School-Admin",
    },
    {
      Name: "Manage User",
      icon: <FaRegUser />,
      route: "/Super-Admin/Manage-User",
    },
    {
      Name: "Monitor Subscription",
      icon: <LuFileChartLine />,
      route: "/Super-Admin/Monitor-Subscription",
    },
    {
      Name: "Compliance & Security",
      icon: <AiOutlineFileProtect />,
      route: "/Super-Admin/Compliance-Document-Upload",
    },
    {
      Name: "Communicate",
      icon: <IoChatboxEllipsesOutline />,
      route: "/Super-Admin/Algorithmx-Multischool-Chat",
    },
  ];

  return (
    <div className="h-full w-full justify-between grid grid-rows-[100px_1fr_auto] pt-8">
      <div className="flex flex-col items-center gap-2  w-full ">
        <div className="object-contain max-w-[50px] max-h-[50px]">
          <img className="w-full h-full" src={"/logo.svg"} alt="logo" />
        </div>
        <div className="text-white ">
          <p className="font-bold">Foursquare</p>
          <p className="font-bold">Student Portal</p>
        </div>
        <hr className="w-full border-t border-[#80ADCB] mt-2" />
      </div>
      <div>
        <ul className="mt-8 text-white flex flex-col  ">
          {SuperAdminLeft.map((item, index) => (
            <li
              key={index}
              className={`${
                pathname.includes(item.route) ? "bg-[#0B71B5]" : ""
              } pt-2 pb-2 hover:bg-[#025A9A]  `}
            >
              <Link
                href={`${item.route}${adminId ? `?adminId=${adminId}` : ""}`}
                className="flex flex-row items-center gap-3 sm:pl-2 md:pl-2 xl:pl-3 xl:pr-2  md:text-sm lg:text-[0.95rem]  hover:scale-105"
              >
                <span>{item.icon}</span>
                <span>{item.Name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <hr className="w-full border-t border-[#80ADCB] md:mt-15 xl:mt-2" />
      <div className="text-white flex flex-col pt-5 sm:pl-2 xl:pl-5 md:pl-2 md:text-sm xl:text-[0.94rem]   cursor-pointer">
        <div
          onClick={handleLogout}
          className="flex flex-row items-center gap-2 sm:pb-2.5 xl:pb-1"
        >
          <span>
            <LuLogOut />
          </span>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
