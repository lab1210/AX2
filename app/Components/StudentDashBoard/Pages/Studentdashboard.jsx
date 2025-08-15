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
import { getStudents } from "../../../Service/studentService";
import { getNotifications } from "../../../Service/NotificationService";
import { getAcademicYears, getTerms } from "../../../Service/schoolConfig";
import toast from "react-hot-toast";

export default function Studentdashboard() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [currentAcademicYear, setCurrentAcademicYear] = useState(null);
  const [currentTerm, setCurrentTerm] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        const userData = getUserDetails();
        setUser(userData);
        
        // Fetch academic year and term data
        try {
          const [academicYearsResult, termsResult] = await Promise.all([
            getAcademicYears(),
            getTerms()
          ]);

          if (academicYearsResult?.data) {
            const activeYear = academicYearsResult.data.find(year => year.status === true) || academicYearsResult.data[0];
            setCurrentAcademicYear(activeYear);
          }

          if (termsResult?.data) {
            const activeTerm = termsResult.data.find(term => term.status === true) || termsResult.data[0];
            setCurrentTerm(activeTerm);
          }
        } catch (err) {
          console.error("Error fetching academic data:", err);
        }
        
        if (userData?.student?.id) {
          await fetchStudentData(userData.student.id);
        }
        setEvents([]);
        try {
          const { data: notificationData } = await getNotifications();
          if (notificationData && notificationData.length > 0) {
            const transformedNotifications = notificationData.map(notification => ({
              day: new Date(notification.created_at).toLocaleDateString('en-US', { weekday: 'short' }),
              date: new Date(notification.created_at).getDate().toString(),
              title: notification.title,
              description: notification.content,
              type: notification.notification_type?.toLowerCase() || 'general'
            }));
            setNotifications(transformedNotifications);
          } else {
            setNotifications([]);
          }
        } catch (notificationErr) {
          console.error("Error fetching notifications:", notificationErr);
          toast.error("Failed to load notifications");
          setNotifications([]);
        }

      } catch (error) {
        console.error("Error initializing dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const fetchStudentData = async (studentId) => {
    try {
      const { data } = await getStudents();
      if (data) {
        const currentStudent = data.find(student => 
          student.id === studentId || student.user?.id === studentId
        );
        if (currentStudent) {
          setStudentData(currentStudent);
          console.log("Student data loaded:", currentStudent);
        }
      } else {
        console.error("Failed to fetch student data:", error);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

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
      <Layout>
        <div className="absolute inset-0 flex flex-col justify-center items-center z-50 bg-white/50 backdrop-blur-sm">
          <div className="border-4 border-[rgba(0,64,128,1)] border-t-[rgba(249,65,68,1)] rounded-full w-12 h-12 animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  const name = user?.student?.first_name || studentData?.first_name;
  const schoolName = user?.student?.school || studentData?.school;
  const studentClass = studentData?.class_year || user?.student?.class_year || "";
  const studentArm = studentData?.class_arm || user?.student?.class_arm || "";

  return (
    <Layout>
      <div className="hidden lg:block">
        <div className=" rounded-lg bg-[#e9e9e9] p-10 pl-3 pr-3 flex flex-col gap-5 items-center">
          <div className="w-full bg-[#004080] rounded-lg shadow  flex flex-row justify-between items-center text-white ">
            <div className="p-4">
              <h2 className="text-4xl font-bold mb-3">Hi, {name}</h2>
              <p className="text-sm">
                Welcome to the official {schoolName} student portal.
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
                View your registered subjects for {currentAcademicYear?.name || "current"} session
              </p>
              <div>
                <Link
                  href="/Student/Timetable"
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
            {events.length > 0 ? (
              events.map((event, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 flex flex-col">
                    <h4 className="text-md font-semibold text-[#004080] mb-1">
                      {event.title}
                    </h4>
                    <p className="text-xs text-[#242424]">{event.description}</p>
                  </div>
                  <div className="ml-4 w-8 h-8 rounded-full bg-[#F94144] flex items-center justify-center">
                    <BiChevronRight
                      size={16}
                      className="text-[#000000] font-bold"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">No events available</p>
              </div>
            )}
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
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
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
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">No notifications available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
