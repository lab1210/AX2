"use client";
import React from "react";
import Layout from "../../../Components/Studentlayout";
import { useUser } from "../context/UserProvider";
import { IoWalletOutline } from "react-icons/io5";
import { LuNotepadText } from "react-icons/lu";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { RiBookShelfLine } from "react-icons/ri";
import { BiPieChart } from "react-icons/bi";
import { LiaHeartbeatSolid } from "react-icons/lia";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Studentdashboard = () => {
  const { user, isLoading } = useUser();
  const searchParams = useSearchParams();
  const schoolId = searchParams.get("schoolid");
  const userId = searchParams.get("userid");

  const overview = [
    {
      id: "Fees",
      icon: <IoWalletOutline size={40} />,
      title: "School Fees Payment",
      description: "Pay fees seamlessly",
      Link: "/Student/Fees-Payment",
    },
    {
      id: "result",
      icon: <LuNotepadText size={40} />,
      title: "Result",
      description: "View continuous assessment",
      Link: "/Student/Result",
    },
    {
      id: "attendance",
      icon: <BiPieChart size={40} />,
      title: "Attendance",
      description: "View class and event attendance",
      Link: "/Student/Attendance",
    },
    {
      id: "Registration",
      icon: <RiBookShelfLine size={40} />,
      title: "Subject Registration",
      description: "Register subjects for the session",
      Link: "/Student/Subject-Registration/Register",
    },
    {
      id: "timetable",
      icon: <MdOutlineCalendarMonth size={40} />,
      title: "Timetable",
      description: "Be on track with every class",
      Link: "/Student/Timetable",
    },
    {
      id: "health",
      icon: <LiaHeartbeatSolid size={40} />,
      title: "Health Record",
      description: "Document your medical history",
      Link: "/Student/Health-Record/Record",
    },
  ];

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex justify-center items-center z-[1000]">
        <div className="border-4 border-[rgba(0,64,128,1)] border-t-[rgba(249,65,68,1)] rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  const name = user?.username?.split(" ")[0] || "User";

  // Card background color mapping
  const cardBg = {
    Fees: "bg-[rgba(11,113,181,1)]",
    result: "bg-[rgba(249,65,68,1)]",
    attendance: "bg-[rgba(256,165,0)]",
    Registration: "bg-[rgba(255,46,121,1)]",
    timetable: "bg-[rgba(57,1,129,1)]",
    health: "bg-[rgba(0,128,0,1)]",
  };

  // Icon container color mapping
  const iconBg = {
    Fees: "bg-[rgba(128,173,203,1)]",
    result: "bg-[rgba(242,100,92,1)]",
    attendance: "bg-[rgba(255,232,112,1)]",
    Registration: "bg-[rgba(254,109,161,1)]",
    timetable: "bg-[rgba(103,57,163,1)]",
    health: "bg-[rgba(107,181,107,1)]",
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#e9e9e9] p-4 md:p-6 flex flex-col items-center">
        <div className="w-full max-w-5xl bg-[#004080] rounded-md shadow p-6 md:p-8 flex flex-col md:flex-row justify-between items-center text-white mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Hi, {name}</h2>
            <p className="text-base">
              Welcome to the official Foursquare student portal.
            </p>
          </div>
          <div className="max-w-[180px] w-full">
            <img
              src="/female_teacher.svg"
              alt="Teacher illustration"
              className="object-contain w-full"
            />
          </div>
        </div>

        {/* Overview Section */}
        <div className="w-full max-w-5xl bg-white rounded-md shadow p-6 md:p-4 font-bold">
          <h2 className="text-2xl mb-4 text-gray-800">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {overview.map((item, index) => (
              <Link
                key={index}
                href={`${item.Link}?schoolid=${schoolId}&userid=${userId}`}
                className={`relative ${
                  cardBg[item.id]
                } rounded-md p-6 text-white flex items-center gap-4 hover:opacity-90 transition`}
              >
                <div
                  className={`w-12 h-12 ${
                    iconBg[item.id]
                  } rounded-md flex items-center justify-center text-white`}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-md md:text-md lg:text-lg font-bold mb-1 text-white">{item.title}</h4>
                  <p className="text-sm text-white">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Studentdashboard;
