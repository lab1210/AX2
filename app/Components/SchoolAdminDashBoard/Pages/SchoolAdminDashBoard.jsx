"use client";
import React, { useState } from "react";
import SchoolAdminLayout from "../SchoolAdminLayout";
import { useInitializeUser } from "@/Components/hooks/InitializeUser";
import { MdPeople, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { FaFemale, FaMale } from "react-icons/fa";
const SchoolAdminDashBoard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useInitializeUser(setUser, setIsLoading);
  const Genderdata = [
    { name: "Female", value: 457234, color: "#FF2E79" },
    { name: "Male", value: 457234, color: "#01427A" },
  ];
  const userDistributionData = [
    { name: "Teacher", value: 30, color: "#FF2E79" },
    { name: "Student", value: 70, color: "#01427A" },
  ];

  const academicYearData = [
    { year: "2024", value: 40 },
    { year: "2025", value: 60 },
    { year: "2026", value: 35 },
    { year: "2027", value: 85, active: true },
  ];

  const termData = [
    { month: "Jan", value: 10, active: false },
    { month: "Feb", value: 18, active: false },
    { month: "Mar", value: 20, active: false },
    { month: "Apr", value: 60, active: true },
    { month: "May", value: 22, active: false },
    { month: "Jun", value: 16, active: false },
    { month: "Jul", value: 12, active: false },
  ];
  const cards = [
    { title: "Total NO of Users", value: 2, icon: <MdPeople size={50} /> },
    {
      title: "Total NO of Students",
      value: 2,
      icon: <PiStudentFill size={50} />,
    },
    { title: "Total NO of Teachers", value: 2, icon: <GiTeacher size={50} /> },
  ];

  // Custom Calendar Component
  const CustomCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1));
    const [selectedDate, setSelectedDate] = useState(null);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayNames = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

    const getDaysInMonth = (year, month) => {
      return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
      return new Date(year, month, 1).getDay();
    };

    const changeMonth = (direction) => {
      setCurrentDate((prevDate) => {
        const newDate = new Date(prevDate);
        newDate.setMonth(
          direction === "prev" ? newDate.getMonth() - 1 : newDate.getMonth() + 1
        );
        return newDate;
      });
    };

    const handleDateClick = (day) => {
      if (day) {
        const newDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day
        );
        setSelectedDate(newDate);
      }
    };

    const generateCalendar = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const firstDayOfMonth = getFirstDayOfMonth(year, month);

      const days = [];

      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
      }

      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }

      const weeks = [];
      for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
      }

      return weeks.map((week) => {
        while (week.length < 7) {
          week.push(null);
        }
        return week;
      });
    };

    const calendarWeeks = generateCalendar();
    const today = new Date();

    return (
      <div className="bg-white shadow-lg border rounded-lg p-2">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => changeMonth("prev")}
            className="p-1 rounded hover:bg-gray-100"
          >
            <MdChevronLeft className="text-gray-600" />
          </button>
          <h3 className="text-sm font-bold text-center">
            {monthNames[currentDate.getMonth()]},{currentDate.getFullYear()}
          </h3>
          <button
            onClick={() => changeMonth("next")}
            className="p-1 rounded hover:bg-gray-100"
          >
            <MdChevronRight className="text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
          {dayNames.map((day, index) => (
            <div key={index} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {calendarWeeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-x-1 text-center">
            {week.map((day, dayIndex) => {
              const isSelected =
                selectedDate &&
                day === selectedDate.getDate() &&
                currentDate.getMonth() === selectedDate.getMonth() &&
                currentDate.getFullYear() === selectedDate.getFullYear();

              const isToday =
                day === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear();

              return (
                <div
                  key={dayIndex}
                  className={`p-2 rounded-full cursor-pointer text-xs w-5 h-5 flex items-center justify-center ${
                    isSelected ? "bg-pink-500 text-white" : ""
                  } ${isToday ? "border border-blue-500" : ""} ${
                    day ? "hover:bg-gray-100" : "text-gray-300"
                  }`}
                  onClick={() => handleDateClick(day)}
                >
                  {day || ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const AcademicYearBarChart = () => {
    const ACTIVE = "#10B981";
    const INACTIVE = "#EF4444";

    return (
      <div className="bg-white shadow-lg border rounded-lg p-4">
        <h2 className="text-sm font-bold mb-4 text-left">
          Active Academic Year
        </h2>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={termData}
              margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
              barCategoryGap={12}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fillOpacity: 0.08 }}
                formatter={(v) => [v, "Value"]}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={28}>
                {termData.map((e, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={e.active ? ACTIVE : INACTIVE}
                    stroke={e.active ? "#059669" : "transparent"}
                    strokeWidth={e.active ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-3">
          <p className="text-sm font-semibold text-center">
            January 2 - April 15, 2027
          </p>
        </div>
      </div>
    );
  };

  return (
    <SchoolAdminLayout>
      <div className="p-3 h-full flex flex-col overflow-hidden">
        <div className="bg-[#004080] p-5 py-0 w-full rounded-lg flex justify-between items-center mb-5">
          <div className="text-white font-bold flex flex-col gap-3">
            <p className="text-3xl">
              Hi,{" "}
              {user?.school_admin?.surname?.charAt(0).toUpperCase() +
                user?.school_admin?.surname?.slice(1)}
            </p>
            <p className="text-xs">Welcome to My School Dashboard</p>
          </div>
          <div className="w-50 h-30">
            <img src="/male.png" className="w-full h-full" />
          </div>
        </div>

        <div className="flex flex-1 gap-5 overflow-hidden">
          {/* Left Side - Scrollable */}
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto no-scrollbar pr-2">
            <div className="grid grid-cols-3 gap-5">
              {cards.map((card, index) => (
                <div
                  className="bg-white shadow-lg border rounded-lg p-3"
                  key={index}
                >
                  <p className="text-sm font-medium">{card.title}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-2xl">{card.value}</p>
                    <p>{card.icon}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="bg-white shadow-lg border rounded-lg p-4">
                <h2 className="text-sm font-bold mb-2 text-left">
                  User Distribution
                </h2>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={100}
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={0}
                        dataKey="value"
                        label={false}
                        labelLine={false}
                        stroke="#FFFFFF"
                        strokeWidth={6}
                        cornerRadius={0}
                      >
                        {userDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value}%`, name]}
                        contentStyle={{ borderRadius: 8 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-5 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#FF2E79] w-3 h-3"></div>
                    <p className="text-xs">Student</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-[#01427A] w-3 h-3"></div>
                    <p className="text-xs">Teacher</p>
                  </div>
                </div>
              </div>

              <AcademicYearBarChart />
            </div>
          </div>

          {/* Right Side - Scrollable */}
          <div className="w-70 flex flex-col gap-2 overflow-y-auto no-scrollbar">
            <CustomCalendar />

            <div className="bg-white rounded-md border flex flex-col p-4">
              <p className="font-bold text-sm mb-4">Students</p>
              <div className="text-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[Genderdata[0]]}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={180}
                      endAngle={-180}
                      fill={Genderdata[0].color}
                      paddingAngle={3}
                    >
                      <Cell key={`cell-female`} fill={Genderdata[0].color} />
                    </Pie>

                    <Pie
                      data={[Genderdata[1]]}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      startAngle={180}
                      endAngle={-180}
                      fill={Genderdata[1].color}
                      paddingAngle={3}
                    >
                      <Cell key={`cell-male`} fill={Genderdata[1].color} />
                    </Pie>

                    <Tooltip />

                    <foreignObject x="40%" y="40%" width="80" height="80">
                      <div className="flex justify-center items-center text-sm">
                        <FaFemale color="#FF2E79" size={20} />
                        <FaMale color="#01427A" size={20} />
                      </div>
                    </foreignObject>
                  </PieChart>
                </ResponsiveContainer>

                <div className="flex gap-5 items-center justify-between mt-4">
                  {Genderdata.map((entry, index) => (
                    <div key={index} className="flex flex-col items-start">
                      <div
                        className="w-4 h-4 rounded-sm"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <div className="text-base font-bold mt-1">
                        {entry.value.toLocaleString()}
                      </div>
                      <div className="font-bold text-gray-600 text-sm">
                        {entry.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SchoolAdminLayout>
  );
};

export default SchoolAdminDashBoard;
