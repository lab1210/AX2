"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "react-calendar/dist/Calendar.css";
import TeachingProgress from "../TeachingProgress";
import StatCard from "../StatCard";
import BottomNavbar from "../BottomNavbar";
import Layout from "../TeacherWrapper";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Bell } from "lucide-react";
import GroupIcon from "/public/groupOfPeople.png";
import NotePad from "/public/notePad.png";
import Board from "/public/boardChart.png";

export default function TeacherDashboard() {
  const [date, setDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("calendar");
  const attendanceData = [
    { day: "Mon", present: 85, absent: 15 },
    { day: "Tues", present: 80, absent: 20 },
    { day: "Wed", present: 20, absent: 80 },
    { day: "Thurs", present: 75, absent: 25 },
    { day: "Fri", present: 90, absent: 10 },
  ];

  const events = [
    {
      date: 12,
      title: "Send Mr Ayo class Schedule",
      subtitle: "Send Document via email",
      time: "8 A.M",
      status: "today",
    },
    {
      date: 12,
      title: "Meet with Prefects",
      subtitle: "Have a work flow",
      time: "8 A.M",
      status: "due",
    },
    {
      date: 25,
      title: "JSS1B Test",
      subtitle: "Set Question",
      time: "8 A.M",
      status: "upcoming",
    },
    {
      date: 30,
      title: "Send a Doc to Admin",
      subtitle: "Send Document via email",
      time: "10:00 A.M",
      status: "upcoming",
    },
  ];

  // Desktop View
  const DesktopView = () => (
    <Layout>
      <div className="flex h-screen overflow-hidden">
        <div className="bg-[#F7F8FA] w-full">
          <div className="flex-1 flex flex-col h-screen">
            <div className="flex items-center justify-between bg-white px-6 py-4 fixed w-[85%]">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <div className="flex items-center">
                <button className="relative mr-4">
                  <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full" />
                  <Bell />
                </button>
                <div className="flex items-center space-x-2">
                  <img
                    src="/female2.png"
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium">Joshua Daniel</p>
                    <p className="text-xs text-gray-500">Teacher</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 p-6 gap-4 overflow-hidden mt-17 fixed w-[85%]">
              <div className="flex-1 overflow-hidden">
                <div className="w-full bg-[#004080] rounded-lg shadow flex flex-row justify-between items-center text-white mb-6">
                  <div className="p-2">
                    <h2 className="text-4xl font-bold mb-3">Hi, Mr Joshua</h2>
                    <p className="text-sm">
                      Welcome to the official Foursquare student portal.
                    </p>
                  </div>
                  <div className="max-w-[240px] h-full object-contain">
                    <img
                      src="/male.png"
                      alt="Teacher illustration"
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <StatCard
                    label="Total Classes"
                    value={10}
                    icon={GroupIcon}
                    percentage={0.5}
                  />
                  <StatCard
                    label="Total Lessons"
                    value={15}
                    icon={NotePad}
                    percentage={1.2}
                  />
                  <StatCard
                    label="Total Assignments"
                    value={8}
                    icon={Board}
                    percentage={0.8}
                  />
                </div>

                <div className="flex justify-between gap-3">
                  {/* Attendance Chart */}
                  <div className="flex flex-col mb-4 w-[70%] bg-white rounded-lg shadow-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Attendance</h3>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-[#F16960]"></div>
                          <span className="text-sm text-gray-600">
                            Total Present
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-[#065293]"></div>
                          <span className="text-sm text-gray-600">
                            Total Absent
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={attendanceData}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="present"
                          name="Total Present"
                          fill="#F16960"
                          barSize={25}
                          radius={[10, 10, 0, 0]}
                        >
                          {attendanceData.map((_entry, index) => (
                            <Cell key={`cell-present-${index}`} />
                          ))}
                        </Bar>
                        <Bar
                          dataKey="absent"
                          name="Total Absent"
                          fill="#065293"
                          barSize={25}
                          radius={[10, 10, 0, 0]}
                        >
                          {attendanceData.map((_entry, index) => (
                            <Cell key={`cell-absent-${index}`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Teaching Progress */}
                  <div className="w-[30%]">
                    <TeachingProgress />
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="w-[27%] space-y-3 sticky top-6 overflow-y-auto h-screen no-scrollbar">
                {/* Calendar */}
                <div className="bg-white rounded-lg shadow-lg h-[40vh]">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={["DateCalendar", "DateCalendar"]}
                    >
                      <DemoItem>
                        <DateCalendar readOnly />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
                {/* Events */}
                <div className="bg-white rounded-lg shadow-lg p-4 h-[46vh] overflow-y-auto no-scrollbar">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Events</h3>
                    <button className="text-sm text-blue-600">View All</button>
                  </div>
                  <ul className="space-y-3">
                    {events.map((e, idx) => {
                      const bg =
                        e.status === "due"
                          ? "border rounded-lg border-[#5E5D5D] shadow-md"
                          : e.status === "upcoming"
                          ? "border rounded-lg border-[#5E5D5D] shadow-md"
                          : "border rounded-lg border-[#5E5D5D] shadow-md";

                      const dateBgColor =
                        e.status === "due"
                          ? "bg-[#FF0004] text-white"
                          : e.status === "today"
                          ? "bg-[#6191B0] text-white"
                          : e.status === "upcoming"
                          ? "bg-[#F8961E] text-white"
                          : "bg-gray-200 text-black";
                      return (
                        <li
                          key={idx}
                          className={`flex items-center p-3 rounded-lg ${bg}`}
                        >
                          <div
                            className={`w-9 h-10 flex items-center justify-center font-bold text-lg rounded-md ${dateBgColor}`}
                          >
                            {e.date}
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="font-medium text-sm">{e.title}</p>
                            <p className="text-xs text-gray-500">
                              {e.subtitle}
                            </p>
                            <p className="text-sm text-black font-semibold">
                              {e.time}
                            </p>
                          </div>
                          {e.status === "due" && (
                            <div className="flex flex-col items-end">
                              <span className="w-2 h-2 bg-[#FF0004] rounded-full" />
                              <p className="text-sm font-semibold text-[#FF0004]">
                                Due Soon
                              </p>
                            </div>
                          )}
                          {e.status === "today" && (
                            <div className="flex flex-col items-end">
                              <span className="w-2 h-2 bg-[#80ADCB] rounded-full" />
                              <p className="text-sm font-semibold text-[#80ADCB]">
                                Today
                              </p>
                            </div>
                          )}
                          {e.status === "upcoming" && (
                            <div className="flex flex-col items-end">
                              <span className="w-2 h-2 bg-[#F8961E] rounded-full" />
                              <p className="text-sm font-semibold text-[#F8961E]">
                                Upcoming
                              </p>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );

  // Mobile/Tablet View
  const MobileView = () => (
    <div className="flex flex-col h-screen bg-[#F7F8FA]">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-4 py-3">
        <div className="flex items-center space-x-2">
          <img
            src="/female2.png"
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="font-medium">Joshua Daniel</p>
            <p className="text-xs text-gray-500">Teacher</p>
          </div>
        </div>
        <button className="relative">
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full" />
          🔔
        </button>
      </div>

      <div className="p-4">
        <div className="w-full bg-[#004080] rounded-lg flex flex-row justify-between items-center text-white ">
          <div className="p-4">
            <h2 className="text-4xl font-bold mb-3">Hi, Mr Joshua</h2>
            <p className="text-sm">
              Welcome to the official Foursquare student portal.
            </p>
          </div>
          <div className="max-w-[240px] h-full object-contain ">
            <img
              src="/male.png"
              alt="Teacher illustration"
              className=" w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 p-3 mb-4">
        <StatCard
          label="Total Classes"
          value={10}
          icon={GroupIcon}
          percentage={0.5}
        />
        <StatCard
          label="Total Lessons"
          value={15}
          icon={NotePad}
          percentage={1.2}
        />
        <StatCard
          label="Total Assignments"
          value={8}
          icon={Board}
          percentage={0.8}
        />
      </div>

      {/* Tabs */}
      <div className="flex justify-around border-b">
        <button
          className={`flex-1 text-center py-2 font-semibold ${
            activeTab === "calendar"
              ? "text-[#4169E1] border-b-2 border-[#F8961E]"
              : "text-black"
          }`}
          onClick={() => setActiveTab("calendar")}
        >
          Calendar
        </button>
        <button
          className={`flex-1 text-center py-2 font-semibold ${
            activeTab === "events"
              ? "text-[#4169E1] border-b-2 border-[#F8961E]"
              : "text-black"
          }`}
          onClick={() => setActiveTab("events")}
        >
          Events
        </button>
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === "calendar" && (
          <div className="p-4 flex justify-center items-center flex-col w-full">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateCalendar", "DateCalendar"]}>
                <DemoItem>
                  <DateCalendar readOnly />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
            {/* Teaching Progress */}
            <div className="mt-4 bg-white rounded-lg shadow-lg p-4 w-full">
              <TeachingProgress />
            </div>
          </div>
        )}
        {activeTab === "events" && (
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Events</h3>
              <button className="text-sm text-black">View All</button>
            </div>
            <ul className="space-y-3">
              {events.map((e, idx) => {
                const bg =
                  e.status === "due"
                    ? "border rounded-lg border-[#5E5D5D] shadow-md"
                    : e.status === "upcoming"
                    ? "border rounded-lg border-[#5E5D5D] shadow-md"
                    : "border rounded-lg border-[#5E5D5D] shadow-md";

                const dateBgColor =
                  e.status === "due"
                    ? "bg-[#FF0004] text-white"
                    : e.status === "today"
                    ? "bg-[#6191B0] text-white"
                    : e.status === "upcoming"
                    ? "bg-[#F8961E] text-white"
                    : "bg-gray-200 text-black";
                return (
                  <li
                    key={idx}
                    className={`flex items-center p-3 rounded-lg ${bg}`}
                  >
                    <div
                      className={`w-9 h-10 flex items-center justify-center font-bold text-lg rounded-md ${dateBgColor}`}
                    >
                      {e.date}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="font-medium">{e.title}</p>
                      <p className="text-xs text-gray-500">{e.subtitle}</p>
                      <p className="text-sm text-black font-semibold">
                        {e.time}
                      </p>
                    </div>
                    {e.status === "due" && (
                      <div className="flex flex-col items-end">
                        <span className="w-2 h-2 bg-[#FF0004] rounded-full" />
                        <p className="text-sm font-semibold text-[#FF0004]">
                          Due Soon
                        </p>
                      </div>
                    )}
                    {e.status === "today" && (
                      <div className="flex flex-col items-end">
                        <span className="w-2 h-2 bg-[#80ADCB] rounded-full" />
                        <p className="text-sm font-semibold text-[#80ADCB]">
                          Today
                        </p>
                      </div>
                    )}
                    {e.status === "upcoming" && (
                      <div className="flex flex-col items-end">
                        <span className="w-2 h-2 bg-[#F8961E] rounded-full" />
                        <p className="text-sm font-semibold text-[#F8961E]">
                          Upcoming
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <BottomNavbar />
    </div>
  );

  return (
    <>
      <div className="hidden lg:block">{DesktopView()}</div>
      <div className="block lg:hidden">{MobileView()}</div>
    </>
  );
}
