"use client";
import React, { useEffect, useState } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import { IoIosNotificationsOutline } from "react-icons/io";
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
import { getMetrics } from "@/Service/SuperAdminService";
import toast from "react-hot-toast";

const SuperAdminDashboardItem = () => {
  const [schoolCount, setSchoolCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [superAdminCount, setSuperAdminCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [activeSchools, setActiveSchools] = useState(0);
  const [inactiveSchools, setInactiveSchools] = useState(0);
  const [monthlyPayments, setMonthlyPayments] = useState([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Transform monthly payments for the chart (sort by month order)
  const getMonthOrder = (month) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.indexOf(month);
  };

  const chartData = monthlyPayments
    .sort((a, b) => getMonthOrder(a.month) - getMonthOrder(b.month))
    .map(payment => ({
      month: payment.month,
      "Full Payment": payment.full_payment,
      "Partial Payment": payment.partial_payment
    }));

  const schoolActivityData = [
    { name: "Active Schools", value: activeSchools, color: "#8B0000" },
    { name: "Inactive Schools", value: inactiveSchools, color: "#FF6666" },
  ];

  const genderData = [
    { name: "Female", value: femaleCount, color: "#228B22" },
    { name: "Male", value: maleCount, color: "#FFA500" },
  ];

  // Fetch data in background after component mounts
  useEffect(() => {
    // Mark that component has rendered
    setDataLoaded(true);
    
    const fetchMetrics = async () => {
      try {
        const response = await getMetrics();
        console.log("Metrics API Response:", response);
        
        if (response.success && response.data) {
          setSchoolCount(response.data.school_count);
          setTeacherCount(response.data.teacher_count);
          setStudentCount(response.data.student_count);
          setSuperAdminCount(response.data.superadmin_count);
          setMaleCount(response.data.student_male);
          setFemaleCount(response.data.student_female);
          setActiveSchools(response.data.active_schools);
          setInactiveSchools(response.data.inactive_schools);
          setMonthlyPayments(response.data.monthly_payments || []);
        } else {
          toast.error(response.message || "Failed to fetch metrics");
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
        toast.error("Failed to fetch metrics");
      } finally {
        setIsLoadingMetrics(false);
      }
    };
    
    // Small delay to let UI render first, then fetch data
    const timer = setTimeout(() => {
      fetchMetrics();
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  const Overview = [
    {
      background: "#390181",
      Title: "No of Schools",
      icon: <MdCoPresent className="w-full h-full" />,
      subtitle: isLoadingMetrics && !dataLoaded ? "..." : schoolCount,
    },
    {
      background: "#00274E",
      Title: "No of Teachers",
      icon: <RiPresentationFill className="w-full h-full" />,
      subtitle: isLoadingMetrics && !dataLoaded ? "..." : teacherCount,
    },
    {
      background: "#0B71B5",
      Title: "No of Students",
      icon: <PiStudentFill className="w-full h-full" />,
      subtitle: isLoadingMetrics && !dataLoaded ? "..." : studentCount,
    },
    {
      background: "#AE2E30",
      Title: "No of Super Admins",
      icon: <FaRegUser className="w-full h-full" />,
      subtitle: isLoadingMetrics && !dataLoaded ? "..." : superAdminCount,
    },
  ];

  return (
    <SuperAdminLayout>
      {/* header */}
      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <DashboardHeader />

        <div className="flex items-center gap-4">
          {/* <div className="flex items-center rounded-4xl border min-w-[350px] border-[#978F8F]">
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
          </div> */}
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
      
      {/* Content - Renders immediately, data loads in background */}
      <div className="bg-[#D4D4D4] overflow-auto flex-1 w-full h-full p-4">
        <div className="grid lg:grid-cols-[auto_1fr] gap-2">
          <div className="grid xl:grid-rows-[130px_auto] lg:grid-rows-[150px_auto] gap-4">
            {/* top card */}
            <div className="bg-[#ffffff] rounded-lg p-4 lg:p-4 grid grid-cols-4 gap-2 text-white">
              {Overview.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="rounded-xl flex flex-col p-3.5 gap-3"
                    style={{ backgroundColor: item.background }}
                  >
                    <div className="flex justify-between items-center">
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
            {/* bottom card - Fee and Payments Chart */}
            <div className="bg-[#ffffff] rounded-lg md:p-6 sm:p-4 flex flex-col gap-3">
              <div className="font-bold">Fee and Payments</div>
              {!isLoadingMetrics && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="month" />
                    <YAxis
                      domain={[0, 'auto']}
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
              ) : !isLoadingMetrics ? (
                <div className="flex justify-center items-center h-64 text-gray-500">
                  No payment data available
                </div>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-pulse text-gray-400">Loading chart...</div>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-rows-2 gap-2">
            {/* Students Gender Chart */}
            <div className="bg-[#ffffff] rounded-md flex flex-col md:p-6 sm:p-4">
              <p className="font-bold">Students</p>
              <div className="text-center">
                {!isLoadingMetrics && (maleCount > 0 || femaleCount > 0) ? (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={[genderData[0]]}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          startAngle={180}
                          endAngle={-180}
                          fill={genderData[0].color}
                          paddingAngle={3}
                        >
                          <Cell key={`cell-female`} fill={genderData[0].color} />
                        </Pie>
                        <Pie
                          data={[genderData[1]]}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          startAngle={180}
                          endAngle={-180}
                          fill={genderData[1].color}
                          paddingAngle={3}
                        >
                          <Cell key={`cell-male`} fill={genderData[1].color} />
                        </Pie>
                        <Tooltip />
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

                    <div
                      style={{
                        display: "flex",
                        gap: 20,
                        justifyContent: "center",
                      }}
                    >
                      {genderData.map((entry, index) => (
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
                  </>
                ) : !isLoadingMetrics ? (
                  <div className="flex justify-center items-center h-48 text-gray-500">
                    No student data available
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-48">
                    <div className="animate-pulse text-gray-400">Loading chart...</div>
                  </div>
                )}
              </div>
            </div>
            
            {/* School Activities Chart */}
            <div className="bg-[#ffffff] rounded-xl flex flex-col gap-3 md:p-6 sm:p-4">
              <p className="font-bold">School Activities</p>
              {!isLoadingMetrics && (activeSchools > 0 || inactiveSchools > 0) ? (
                <ResponsiveContainer width="100%" >
                  <PieChart>
                    <Pie
                      data={schoolActivityData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
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
              ) : !isLoadingMetrics ? (
                <div className="flex justify-center items-center h-48 text-gray-500">
                  No school activity data available
                </div>
              ) : (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-pulse text-gray-400">Loading chart...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboardItem;