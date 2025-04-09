"use client";
import React, { useEffect, useState } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import { usePathname } from "next/navigation";
import { IoIosNotificationsOutline } from "react-icons/io";
import Image from "next/image";
import { MdCoPresent } from "react-icons/md";
import { RiPresentationFill } from "react-icons/ri";
import { PiStudentFill } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa6";
import {
  Bar,
  BarChart,
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
import DashboardHeader from "../DashboardHeader";

const SuperAdminDashboardItem = () => {
  //Overview Cards

  const Overview = [
    {
      background: "#390181",
      Title: "No of Schools",
      icon: <MdCoPresent className="w-full h-full" />,
      subtitle: 200,
    },
    {
      background: "#00274E",
      Title: "No of Teachers",
      icon: <RiPresentationFill className="w-full h-full" />,
      subtitle: 245,
    },
    {
      background: "#0B71B5",
      Title: "No of Students",
      icon: <PiStudentFill className="w-full h-full" />,
      subtitle: 300,
    },
    {
      background: "#AE2E30",
      Title: "Total No of Users",
      icon: <FaRegUser className="w-full h-full " />,
      subtitle: 545,
    },
  ];

  // Sample data for payments chart
  const data = [
    { month: "Jan", "Full Payment": 30, "Partial Payment": 80 },
    { month: "Feb", "Full Payment": 60, "Partial Payment": 40 },
    { month: "March", "Full Payment": 70, "Partial Payment": 40 },
    { month: "April", "Full Payment": 30, "Partial Payment": 80 },
    { month: "May", "Full Payment": 60, "Partial Payment": 70 },
    { month: "June", "Full Payment": 50, "Partial Payment": 60 },
    { month: "July", "Full Payment": 55, "Partial Payment": 80 },
    { month: "Aug", "Full Payment": 20, "Partial Payment": 70 },
    { month: "Sept", "Full Payment": 10, "Partial Payment": 90 },
    { month: "Oct", "Full Payment": 70, "Partial Payment": 85 },
    { month: "Nov", "Full Payment": 60, "Partial Payment": 40 },
    { month: "Dec", "Full Payment": 10, "Partial Payment": 90 },
  ];

  const Genderdata = [
    { name: "Female", value: 457234, color: "#228B22" }, // Green
    { name: "Male", value: 457234, color: "#FFA500" }, // Orange
  ];

  const schoolActivityData = [
    { name: "Active Schools", value: 75, color: "#8B0000" }, // Dark Red
    { name: "Inactive Schools", value: 25, color: "#FF6666" }, // Light Red
  ];

  return (
    <SuperAdminLayout>
      {/* header */}
      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0  z-10 shadow-md  flex justify-between items-center ">
        <DashboardHeader />

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-4xl border min-w-[350px]  border-[#978F8F] ">
            <input
              type="text"
              placeholder="Search School"
              className="w-full outline-none bg-transparent text-[#AEAEAE] text-sm p-2 pl-5"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 192.904 192.904"
              width="16px"
              className="fill-[#B09A9A] stroke-[#D9D9D9] mr-4"
            >
              <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
            </svg>
          </div>
          <div className="flex flex-row items-center">
            <div className="relative w-8 h-8 object-contain">
              <IoIosNotificationsOutline className="text-[#33363F] w-[100%] h-[100%] cursor-pointer" />
              <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#F94144]"></div>
            </div>
            <div className="w-12 h-12 object-contain">
              <img
                src={"/superadmin.png"}
                alt="admin"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="bg-[#D4D4D4]  overflow-auto flex-1 p-4">
        <div className="grid lg:grid-cols-[2.5fr_1fr]  gap-2">
          <div className="grid xl:grid-rows-[130px_auto] lg:grid-rows-[150px_auto]  gap-4">
            {/* top card */}
            <div className="bg-[#ffffff] rounded-lg p-4 lg:p-4 grid grid-cols-4 gap-2 text-white ">
              {Overview.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={"rounded-xl flex flex-col p-3.5 gap-3"}
                    style={{ backgroundColor: item.background }}
                  >
                    <div className="flex justify-between items-center   ">
                      <p className="md:text-sm sm:text-xs font-bold">
                        {item.Title}
                      </p>
                      <div className="w-[22px] object-contain">{item.icon}</div>
                    </div>
                    <p className="lg:text-4xl sm:text-3xl font-extrabold">
                      {item.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
            {/* bottom card */}
            <div className="bg-[#ffffff] rounded-lg md:p-6 sm:p-4 flex flex-col gap-3">
              <div className="font-bold">Fee and Payments</div>
              <ResponsiveContainer width="100%">
                <BarChart
                  data={data}
                  // margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="month" />
                  <YAxis
                    domain={[0, 90]}
                    ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90]}
                    tick={{ fontSize: 12 }}
                    interval={0}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="Full Payment"
                    fill="#E97232"
                    barSize={15}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Partial Payment"
                    fill="#146083"
                    barSize={15}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-rows-[1fr_1fr]  gap-2 ">
            <div className="bg-[#ffffff] rounded-md flex flex-col md:p-6 sm:p-4  ">
              <p className="font-bold">Students</p>
              <div className="text-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    {/* Outer Donut (Female) */}
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

                    {/* Inner Donut (Male) */}
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

                    {/* Custom Center Content */}
                    <foreignObject x="40%" y="40%" width="80" height="80">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "14px",
                        }}
                      >
                        <FaFemale color="#228B22" size={20} />
                        <FaMale color="#FFA500" size={20} />
                      </div>
                    </foreignObject>
                  </PieChart>
                </ResponsiveContainer>

                {/* Custom Legend */}
                <div
                  style={{
                    display: "flex",
                    gap: 20,
                  }}
                >
                  {Genderdata.map((entry, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        margin: "0 15px",
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 2,
                          backgroundColor: entry.color,
                        }}
                      ></div>
                      <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                        {entry.value.toLocaleString()}
                      </div>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#777474",
                        }}
                      >
                        {entry.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-[#ffffff] rounded-xl flex flex-col gap-3 md:p-6 sm:p-4 ">
              <p className="font-bold">School Activities</p>
              <ResponsiveContainer width="100%">
                <PieChart>
                  <Pie
                    data={schoolActivityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60} // Creates the donut effect
                    outerRadius={90}
                    paddingAngle={5} // Creates the gap effect
                    label
                  >
                    {schoolActivityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend iconType="square" />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboardItem;
