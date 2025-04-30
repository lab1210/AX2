"use client";
import React, { useEffect, useState } from "react";
import Layout from "../../../Components/Studentlayout";
import { IoWalletOutline } from "react-icons/io5";
import { LuNotepadText } from "react-icons/lu";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { RiBookShelfLine } from "react-icons/ri";
import { BiChevronRight, BiPieChart } from "react-icons/bi";
import { LiaHeartbeatSolid } from "react-icons/lia";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getUserDetails } from "../../../Service/AuthService";

// Dummy data for events and notifications (replace with API calls)
const dummyevents = [
  {
    title: "Inter-House Sports",
    description:
      "The 2nd term Inter-House sports has been rescheduled for  Thur 15th - Fri 16th October 2023",
  },
  {
    title: "Boarders Meeting",
    description:
      " All JSS1-SS3 boarding school students will be having a meeting by 3pm on Friday 29th October, 2023",
  },

  {
    title: "Spelling Bee",
    description:
      "The international spelling bee competition will hold on the 26th and 27th of October, 2023",
  },
];

const dummyNotifications = [
  {
    day: "Thurs",
    date: "13",
    title: "Upcoming Fees Payment for the 2023/2024 Session",
    description: "Updates on school fees for all junior and senior students",
  },
  {
    day: "Mon",
    date: "25",
    title: "Mid-term Tests",
    description: "Mid term tests will start on Monday 25th October, 2023",
  },
];

export default function Studentdashboard() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = getUserDetails();
    setUser(userData);
    setIsLoading(false);
  }, []);

  // Same overview data
  const overview = [
    {
      id: "Fees",
      icon: <IoWalletOutline />,
      title: "School Fees Payment",
      description: "Pay fees seamlessly",
      Link: "/Student/Fees-Payment",
      bg: "bg-[rgba(11,113,181,1)]",
      iconBg: "bg-[rgba(128,173,203,1)]",
    },
    {
      id: "result",
      icon: <LuNotepadText />,
      title: "Result",
      description: "View continuous assessment",
      Link: "/Student/Result",
      bg: "bg-[rgba(409,65,68,1)]",
      iconBg: "bg-[rgba(402,100,92,1)]",
    },
    {
      id: "attendance",
      icon: <BiPieChart />,
      title: "Attendance",
      description: "View class & event attendance",
      Link: "/Student/Attendance",
      bg: "bg-[rgba(256,165,0)]",
      iconBg: "bg-[rgba(255,232,112,1)]",
    },
    {
      id: "Registration",
      icon: <RiBookShelfLine />,
      title: "Subject Registration",
      description: "Register subjects for the session",
      Link: "/Student/Subject-Registration/Register",
      bg: "bg-[rgba(255,46,121,1)]",
      iconBg: "bg-[rgba(254,109,161,1)]",
    },
    {
      id: "timetable",
      icon: <MdOutlineCalendarMonth />,
      title: "Timetable",
      description: "Be on track with every class",
      Link: "/Student/Timetable",
      bg: "bg-[rgba(57,1,129,1)]",
      iconBg: "bg-[rgba(103,57,163,1)]",
    },
    {
      id: "health",
      icon: <LiaHeartbeatSolid />,
      title: "Health Record",
      description: "Document your medical history",
      Link: "/Student/Health-Record/Record",
      bg: "bg-[rgba(0,128,0,1)]",
      iconBg: "bg-[rgba(107,181,107,1)]",
    },
  ];

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex justify-center items-center z-50 bg-white/50 backdrop-blur-sm">
        <div className="border-4 border-[rgba(0,64,128,1)] border-t-[rgba(249,65,68,1)] rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  const name = user?.student.first_name || "User";

  return (
    <Layout>
      {/*========== Desktop Version (unchanged) ==========*/}
      <div className="hidden lg:block">
        {/* Your existing desktop code goes here */}
        <div className=" rounded-lg bg-[#e9e9e9] p-10 pl-3 pr-3 flex flex-col gap-5 items-center">
          <div className="w-full bg-[#004080] rounded-lg shadow  flex flex-row justify-between items-center text-white ">
            <div className="p-4">
              <h2 className="text-4xl font-bold mb-3">Hi, {name}</h2>
              <p className="text-sm">
                Welcome to the official {user.student.school} student portal.
              </p>
            </div>
            <div className="max-w-[240px] h-full object-contain ">
              <img
                src="/female_teacher.svg"
                alt="Teacher illustration"
                className=" w-full h-full"
              />
            </div>
          </div>

          {/* Overview Section */}
          <div className="w-full bg-white rounded-lg shadow p-6 pl-3 pr-3 font-bold">
            <h2 className="text-2xl mb-4 text-gray-800">Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {overview.map((item, index) => (
                <Link
                  key={index}
                  href={`${item.Link}?studentId=${studentId}`}
                  className={`relative ${item.bg} rounded-lg p-7 pl-3 pr-3 text-white grid xl:grid-cols-[70px_auto] lg:grid-cols-[80px_auto] items-center hover:opacity-90 transition`}
                >
                  <div
                    className={`xl:w-15 lg:w-13 xl:h-15 lg:h-13 pr-2 ${item.iconBg} rounded-lg flex items-center justify-center text-7xl text-white font-extrabold`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-md lg:text-md 2xl:text-xl lg:text-base font-bold mb-1 text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs 2xl:text-md text-white">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/*========== Mobile/Tablet Version ==========*/}
      <div className="block lg:hidden w-full h-screen overflow-y-auto bg-[#FDFDFD]">
        <div className="bg-white w-full flex flex-col items-start">
          <div className="bg-white w-full p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Welcome back, {name}
            </h2>
            <div className="w-16 h-16">
              {" "}
              <img
                src="/female.png"
                alt="female student"
                className="object-contain w-full h-full"
              />
            </div>
          </div>
          <div className="w-full max-w-5xl bg-[#004080] rounded-md shadow p-6 flex items-center justify-between text-white">
            <div className="flex flex-col">
              <p className="text-sm text-white font-semibold mb-5">
                View your registered subjects for 2023/2024 session
              </p>
              <div>
                <Link
                  href={`${overview[0].Link}?studentId=${studentId}`}
                  className="bg-[#F94144] text-white px-3 py-3 rounded-lg text-sm cursor-pointer p-2"
                >
                  View courses
                </Link>
              </div>
            </div>
            <div className="max-w-[180px] w-full">
              <img
                src="/female_teacher.svg"
                alt="Teacher illustration"
                className="object-contain w-full"
              />
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="bg-white w-full mt-3 p-4">
          <h2 className="text-base font-semibold text-gray-700 mb-2">
            Overview
          </h2>
          <div className="relative">
            <div className="flex overflow-x-auto space-x-4 no-scrollbar py-2">
              {overview.map((item, idx) => (
                <div key={idx} className="flex-shrink-0 w-auto">
                  <Link
                    href={`${item.Link}?studentId=${studentId}`}
                    className={`rounded-xl flex flex-col items-start p-3 gap-2 ${item.bg} text-white md:text-3xl`}
                  >
                    <div
                      className={`w-10 h-10 ${item.iconBg} rounded-xl flex items-center justify-center text-white`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex flex-col text-sm md:text-lg md:p-1">
                      <span className="font-semibold text-left text-white">
                        {item.title}
                      </span>
                      <span className="text-xs text-left text-white">
                        {item.description}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="p-4 md:text-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-gray-700">Events</h3>
            <Link href="#" className="text-sm text-blue-600">
              view all
            </Link>
          </div>
          <div className="bg-white rounded p-3 flex flex-col gap-3">
            {" "}
            {dummyevents.map((event, index) => (
              <div key={index} className="flex items-center justify-between">
                {" "}
                <div className="flex-1 flex flex-col">
                  {" "}
                  <h4 className="text-md font-semibold text-[#004080] mb-1">
                    {" "}
                    {event.title}
                  </h4>
                  <p className="text-xs text-[#242424]">{event.description}</p>
                </div>
                <div className="ml-4 w-8 h-8 rounded-full bg-[#F94144] flex items-center justify-center">
                  {" "}
                  <BiChevronRight
                    size={16}
                    className="text-[#000000] font-bold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="p-4 md:text-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-black">
              Notifications
            </h3>
            <Link href="#" className="text-sm text-blue-600">
              view all
            </Link>
          </div>
          <div className="bg-white rounded p-3 flex flex-col gap-3">
            {dummyNotifications.map((notification, index) => (
              <div key={index} className="flex items-center">
                <div className="mr-4 flex flex-col items-center justify-center">
                  <span className="text-md text-black font-semibold">
                    {notification.day}
                  </span>
                  <span className="text-lg text-[#F94144] font-semibold">
                    {notification.date}
                  </span>
                </div>
                <div className="text-md flex-1">
                  <p className="font-semibold text-[#004080]">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    {notification.description}
                  </p>
                </div>
                <div className="mr-3 w-8 h-8 rounded-full bg-[#f9f9f9] flex items-center justify-center">
                  <BiChevronRight
                    size={16}
                    className="text-[#000000] font-bold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
