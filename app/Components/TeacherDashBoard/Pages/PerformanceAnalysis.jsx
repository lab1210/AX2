"Use client";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import Layout from "../../Teacherlayout";
import { FaFemale, FaMale } from "react-icons/fa";

const PerformanceAnalysis = () => {
  const [activeTab, setActiveTab] = useState("Subject Teacher");
  const [schoolType, setSchoolType] = useState("Jnr Sch");

  // Sample Data
  const performanceData = [
    { week: "WK1", attendance: 0, performance: 50 },
    { week: "WK2", attendance: 50, performance: 60 },
    { week: "WK3", attendance: 30, performance: 70 },
    { week: "WK4", attendance: 20, performance: 65 },
    { week: "WK5", attendance: 45, performance: 80 },
    { week: "WK6", attendance: 50, performance: 90 },
    { week: "WK7", attendance: 70, performance: 95 },
    { week: "WK8", attendance: 60, performance: 100 },
    { week: "WK9", attendance: 40, performance: 90 },
    { week: "WK10", attendance: 56, performance: 85 },
  ];

  const gradeDistribution = [
    { grade: "A", percentage: 90 },
    { grade: "B", percentage: 80 },
    { grade: "C", percentage: 70 },
    { grade: "D", percentage: 60 },
    { grade: "E", percentage: 50 },
  ];

  const scoreDistribution = [
    { range: "70-100", value: 52 },
    { range: "60-69", value: 32 },
    { range: "40-59", value: 10 },
    { range: "0-39", value: 6 },
  ];

  const Genderdata = [
    { name: "Female", value: 60, color: "#2F62D2" },
    { name: "Male", value: 40, color: "#8BB1F9" },
  ];

  const overallPerformance = [
    { class: "JSS1", passed: 80, failed: 20 },
    { class: "JSS2", passed: 85, failed: 15 },
    { class: "JSS3", passed: 90, failed: 10 },
    { class: "SS1", passed: 70, failed: 30 },
    { class: "SS2", passed: 75, failed: 25 },
    { class: "SS3", passed: 80, failed: 20 },
  ];

  const COLORS = ["#2F62D2", "#8BB1F9", "#A7BFEB", "#D6E1EB"];

  return (
    <Layout>
      <div className="bg-[#F7F8FA] min-h-screen">
        {/* Header */}
        {activeTab === "Subject Teacher" && (
          <div className="flex items-center justify-between mb-6 bg-white p-4">
            <h1 className="text-2xl font-bold">Performance Analysis</h1>
            <div className="flex items-center space-x-4">
              <select className="border border-gray-300 rounded px-3 py-2">
                <option>2023/2024</option>
                <option>2024/2025</option>
                <option>2025/2026</option>
              </select>
              <select className="border border-gray-300 rounded px-3 py-2">
                <option>1st Term</option>
                <option>2nd Term</option>
                <option>3rd Term</option>
              </select>
              <select className="border border-gray-300 rounded px-3 py-2">
                <option>JSS1</option>
                <option>JSS2</option>
                <option>JSS3</option>
              </select>
              <select className="border border-gray-300 rounded px-3 py-2">
                <option>Maths</option>
                <option>English</option>
                <option>Civic Education</option>
              </select>
              <div className="flex items-center space-x-2">
                <img
                  src="/female2.png"
                  alt="Teacher Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-medium">Joshua Daniel</p>
                  <p className="text-xs text-gray-500">Teacher</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Class Teacher" && (
          <div className="flex items-center justify-between mb-6 bg-white p-4">
            <h1 className="text-2xl font-bold">Performance Analysis</h1>
            <div className="flex items-center space-x-4">
              <select className="border border-gray-300 rounded px-3 py-2">
                <option>2023/2024</option>
                <option>2024/2025</option>
                <option>2025/2026</option>
              </select>
              <select
                className="border border-gray-300 rounded px-3 py-2"
                onChange={(e) => setSchoolType(e.target.value)}
              >
                <option>Jnr Sch</option>
                <option>Snr Sch</option>
              </select>
              <select className="border border-gray-300 rounded px-3 py-2">
                <option>1st Term</option>
                <option>2nd Term</option>
                <option>3rd Term</option>
              </select>
              <button className="bg-[#01427A] text-white px-4 py-2 rounded">
                Download Broadsheet
              </button>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "Subject Teacher" && (
          <div>
            {/* Current Content */}
            <div className="flex flex-row space-x-3 w-full mb-3 p-3">
              {/* Subject Statistics */}
              <div className="w-[65%] bg-white p-3 shadow-xl rounded-md">
                {/* Tabs */}
                <div className="flex space-x-6 mb-6">
                  <button
                    className={`pb-2 text-md font-medium ${
                      activeTab === "Subject Teacher"
                        ? "text-[#01427A] border-b-3 border-[#96B1CB]"
                        : "text-[#9C9C9C]"
                    }`}
                    onClick={() => setActiveTab("Subject Teacher")}
                  >
                    Subject Teacher
                  </button>
                  <button
                    className={`pb-2 text-md font-medium ${
                      activeTab === "Class Teacher"
                        ? "text-[#01427A] border-b-3 border-[#96B1CB]"
                        : "text-[#9C9C9C]"
                    }`}
                    onClick={() => setActiveTab("Class Teacher")}
                  >
                    Class Teacher
                  </button>
                </div>
                <h2 className="mb-2 text-xl font-semibold">
                  Subject Statistics
                </h2>
                <div className="grid grid-cols-3 gap-6 mb-6 rounded- items-center">
                  {/* Average Score */}
                  <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-400 flex flex-col justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center mr-4">
                        <img
                          src="/AverageScore.png"
                          alt="Average Score Icon"
                          className="w-12 h-12 "
                        />
                      </div>
                      <div className="text-[#01427A]">
                        <p className="text-sm">Average Score</p>
                        <h2 className="text-2xl font-bold">60%</h2>
                      </div>
                    </div>
                    <button className="text-[#6B90B5] text-sm mt-auto text-right">
                      View Report
                    </button>
                  </div>

                  {/* Highest Score */}
                  <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-400 flex flex-col justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center mr-4">
                        <img
                          src="/HighestScore.png"
                          alt="Highest Score Icon"
                          className="w-12 h-12 "
                        />
                      </div>
                      <div className="text-[#01427A]">
                        <p className="text-sm">Highest Score</p>
                        <h2 className="text-2xl font-bold">80%</h2>
                      </div>
                    </div>
                    <button className="text-[#6B90B5] text-sm mt-auto text-right">
                      View Report
                    </button>
                  </div>

                  {/* Lowest Score */}
                  <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-400 flex flex-col justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center mr-4">
                        <img
                          src="/LowestScore.png"
                          alt="Lowest Score Icon"
                          className="w-12 h-12 "
                        />
                      </div>
                      <div className="text-[#01427A]">
                        <p className="text-sm">Lowest Score</p>
                        <h2 className="text-2xl font-bold">40%</h2>
                      </div>
                    </div>
                    <button className="text-[#6B90B5] text-sm mt-auto text-right">
                      View Report
                    </button>
                  </div>
                </div>
              </div>
              {/* Score Distribution */}
              <div className="bg-white rounded-lg shadow-xl p-4 w-[35%] flex">
                <div className="w-[60%]">
                  <h3 className="text-lg font-semibold mb-4">
                    Score Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={scoreDistribution}
                        dataKey="value"
                        nameKey="range"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                      >
                        {scoreDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-[40%] space-y-3 flex flex-col justify-center">
                  {scoreDistribution.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                      <div className="flex flex-row space-x-6">
                        <p className="text-sm text-black">{entry.range}</p>
                        <p className="text-center text-sm text-black font-semibold justify-center">
                          {entry.value}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-[60%_40%] space-x-3 p-3">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Performance vs Attendance */}
                <div className="flex flex-col space-y-6">
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold mb-4">
                      Performance vs Attendance
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div
                                  style={{
                                    backgroundColor: "#01427A",
                                    color: "#fff",
                                    padding: "5px 10px",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <p>{`${payload[0].value}% Attendance`}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        {/* Shaded Area */}
                        <Area
                          dataKey="attendance"
                          fill="#e2e8fb"
                          stroke="none"
                        />
                        {/* Line Chart */}
                        <Line
                          dataKey="attendance"
                          stroke="#064582"
                          strokeWidth={2.5}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full flex flex-row justify-between space-x-3">
                    {/* Grade Distribution */}
                    <div className="bg-white rounded-lg shadow p-4 w-[55%]">
                      <h3 className="text-lg font-semibold mb-4">
                        Grade Distribution
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={gradeDistribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="grade"
                            label={{
                              value: "(Grades)",
                              position: "insideBottom",
                              offset: -5,
                              style: {
                                textAnchor: "middle",
                                fill: "#000",
                                padding: 10,
                              },
                            }}
                          />
                          <YAxis
                            label={{
                              value: "(Average Percentage %)",
                              angle: -90,
                              position: "insideLeft",
                              offset: 10,
                              style: { textAnchor: "middle", fill: "#000" },
                            }}
                          />
                          <Tooltip />
                          <Bar
                            dataKey="percentage"
                            fill="#2F62D2"
                            barSize={20}
                            radius={[10, 10, 0, 0]}
                          />
                          {/* Line Chart */}
                          <Line
                            type="monotone"
                            dataKey="percentage"
                            stroke="#01427A"
                            strokeWidth={2}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Gender Performance Distribution */}
                    <div className="bg-white rounded-md flex flex-col w-[45%] shadow-lg">
                      <p className="font-bold text-lg text-center">
                        Gender Performance Distribution
                      </p>
                      <div className="text-center">
                        <ResponsiveContainer width="100%" height={280}>
                          <PieChart>
                            {/* Outer Donut (Female) */}
                            <Pie
                              data={[
                                {
                                  name: "Female",
                                  value: Genderdata[0].value,
                                  color: Genderdata[0].color,
                                },
                                {
                                  name: "Remaining",
                                  value: 100 - Genderdata[0].value,
                                  color: "#E4E4E4",
                                },
                              ]}
                              dataKey="value"
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              startAngle={90}
                              endAngle={450} // Full circle
                              paddingAngle={0}
                            >
                              <Cell key="female" fill={Genderdata[0].color} />
                              <Cell key="remaining" fill="#E4E4E4" />
                            </Pie>

                            {/* Inner Donut (Male) */}
                            <Pie
                              data={[
                                {
                                  name: "Male",
                                  value: Genderdata[1].value,
                                  color: Genderdata[1].color,
                                },
                                {
                                  name: "Remaining",
                                  value: 100 - Genderdata[1].value,
                                  color: "#E4E4E4",
                                },
                              ]}
                              dataKey="value"
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={60}
                              startAngle={300}
                              endAngle={720}
                              paddingAngle={0}
                              borderRadius={30}
                            >
                              <Cell key="male" fill={Genderdata[1].color} />
                              <Cell key="remaining" fill="#E4E4E4" />
                            </Pie>

                            <Tooltip />

                            {/* Custom Center Content */}
                            <foreignObject
                              x="36%"
                              y="47%"
                              width="80"
                              height="80"
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  fontSize: "14px",
                                }}
                              >
                                <FaFemale color="#2F62D2" size={20} />
                                <FaMale color="#8BB1F9" size={20} />
                              </div>
                            </foreignObject>
                          </PieChart>
                        </ResponsiveContainer>
                        {/* Custom Legend */}
                        <div
                          style={{
                            display: "flex",
                            gap: 20,
                            justifyContent: "center",
                          }}
                        >
                          {Genderdata.map((entry, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                textAlign: "center",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 5,
                              }}
                            >
                              <div
                                style={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: 50,
                                  backgroundColor: entry.color,
                                }}
                              ></div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {entry.value.toLocaleString()}%
                              </div>
                              <div
                                style={{
                                  fontWeight: "bold",
                                  color: "#777474",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
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

              {/* Right Column */}
              <div className="bg-white rounded-lg shadow p-4 mt-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold w-[60%]">
                    Overall Performance Distribution across classes
                  </h3>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: "#2F62D2" }}
                      ></div>
                      <span className="text-md font-semibold text-black">
                        % Passed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: "#8BB1F9" }}
                      ></div>
                      <span className="text-md font-semibold text-black">
                        % Failed
                      </span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={630}>
                  <BarChart data={overallPerformance} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="class"
                      label={{
                        value: "(Classes)",
                        position: "insideBottom",
                        offset: -5,
                        style: { textAnchor: "middle", fill: "#000" },
                      }}
                    />
                    <YAxis
                      label={{
                        value: "(Performance Distribution)",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle", fill: "#000" },
                      }}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="passed"
                      stackId="a"
                      fill="#2F62D2"
                      name="% Passed"
                    />
                    <Bar
                      dataKey="failed"
                      stackId="a"
                      fill="#8BB1F9"
                      radius={[10, 10, 0, 0]}
                      name="% Failed"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Class Teacher" && schoolType === "Jnr Sch" && (
          <div>
            {/* Quick Stats Section */}
            <div className="flex flex-row space-x-3 w-full mb-3 p-3">
              <div className="w-[65%] bg-white p-3 shadow-xl rounded-md">
                {/* Tabs */}
                <div className="flex space-x-6 mb-6">
                  <button
                    className={`pb-2 text-md font-medium ${
                      activeTab === "Subject Teacher"
                        ? "text-[#01427A] border-b-3 border-[#96B1CB]"
                        : "text-[#9C9C9C]"
                    }`}
                    onClick={() => setActiveTab("Subject Teacher")}
                  >
                    Subject Teacher
                  </button>
                  <button
                    className={`pb-2 text-md font-medium ${
                      activeTab === "Class Teacher"
                        ? "text-[#01427A] border-b-3 border-[#96B1CB]"
                        : "text-[#9C9C9C]"
                    }`}
                    onClick={() => setActiveTab("Class Teacher")}
                  >
                    Class Teacher
                  </button>
                </div>
                <h2 className="mb-2 text-xl font-semibold">
                  Subject Statistics
                </h2>
                <div className="grid grid-cols-3 gap-6 mb-6 rounded- items-center">
                  {/* First Position */}
                  <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-400">
                    <div className="flex flex-row items-center">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center mr-4">
                          <img
                            src="/firstPosition.png"
                            alt="First Position"
                            className="w-12 h-12 "
                          />
                        </div>
                        <div className="bg-white rounded-lg flex flex-col items-center">
                          <div className="flex flex-row">
                            <div>
                              <h3 className="text-4xl text-[#01427A] font-medium">
                                1
                              </h3>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex flex-row justify-between space-x-9">
                                <h3 className="text-md font-bold text-[#01427A]">
                                st
                              </h3>
                              <button className="text-[#6B90B5] text-sm mt-auto text-right">
                                View Report
                              </button>
                              </div>
                              <h3 className="text-md text-[#01427A]">
                                {" "}
                                Position
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Second Position */}
                  <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-400">
                    <div className="flex flex-row items-center">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center mr-4">
                          <img
                            src="/secondPosition.png"
                            alt="Second Position"
                            className="w-12 h-12 "
                          />
                        </div>
                        <div className="bg-white rounded-lg flex flex-col items-center">
                          <div className="flex flex-row gap-1">
                            <div className="">
                              <h3 className="text-4xl text-[#01427A] font-medium">
                                2
                              </h3>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex flex-row justify-between space-x-6">
                                <h3 className="text-md font-bold text-[#01427A]">
                                nd
                              </h3>
                              <button className="text-[#6B90B5] text-sm mt-auto text-right">
                                View Report
                              </button>
                              </div>
                              <h3 className="text-md text-[#01427A]">
                                {" "}
                                Position
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* First Position */}
                  <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-400">
                    <div className="flex flex-row items-center">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center mr-4">
                          <img
                            src="/thirdPosition.png"
                            alt="Third Position"
                            className="w-12 h-12 "
                          />
                        </div>
                        <div className="bg-white rounded-lg flex flex-col items-center">
                          <div className="flex flex-row gap-1">
                            <div>
                              <h3 className="text-4xl text-[#01427A] font-medium">
                                3
                              </h3>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex flex-row justify-between space-x-8">
                                <h3 className="text-md font-bold text-[#01427A]">
                                rd
                              </h3>
                              <button className="text-[#6B90B5] text-sm mt-auto text-right">
                                View Report
                              </button>
                              </div>
                              <h3 className="text-md text-[#01427A]">
                                {" "}
                                Position
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Score Distribution */}
              <div className="bg-white rounded-lg shadow-xl p-4 w-[35%] flex">
                <div className="w-[60%]">
                  <h3 className="text-lg font-semibold mb-4">
                    Percentage Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={scoreDistribution}
                        dataKey="value"
                        nameKey="range"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                      >
                        {scoreDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-[40%] space-y-3 flex flex-col justify-center">
                  {scoreDistribution.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                      <div className="flex flex-row space-x-6">
                        <p className="text-sm text-black">{entry.range}</p>
                        <p className="text-center text-sm text-black font-semibold justify-center">
                          {entry.value}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[60%_40%] space-x-3 p-3">
              <div className="space-y-6">
                {/* Performance vs Attendance Section */}
                <div className="bg-white rounded-lg shadow-xl p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Performance vs Attendance
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div
                                style={{
                                  backgroundColor: "#01427A",
                                  color: "#fff",
                                  padding: "5px 10px",
                                  borderRadius: "5px",
                                }}
                              >
                                <p>{`${payload[0].value}% Attendance`}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        dataKey="attendance"
                        fill="#01427A"
                        fillOpacity={0.1}
                        stroke="none"
                      />
                      <Line
                        dataKey="attendance"
                        stroke="#01427A"
                        strokeWidth={2}
                        activeDot={{ r: 8, fill: "#01427A" }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                {/* Best in All Subjects */}
                <div className="bg-white rounded-lg shadow p-4 mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Best in all subjects
                  </h3>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#E6ECF2]/50 rounded-t-xl">
                        <th className="p-2 border-b">Student's Name</th>
                        <th className="p-2 border-b">Gender</th>
                        <th className="p-2 border-b">Subject</th>
                        <th className="p-2 border-b">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-md">
                        <td className="p-2 border-b flex items-center space-x-2">
                          <img
                            src="/female2.png"
                            alt="Profile"
                            className="w-6 h-6 rounded-full"
                          />
                          <span>George Elijah David</span>
                        </td>
                        <td className="p-2 border-b">M</td>
                        <td className="p-2 border-b">Mathematics</td>
                        <td className="p-2 border-b">70/100</td>
                      </tr>
                      <tr className="text-md">
                        <td className="p-2 border-b flex items-center space-x-2">
                          <img
                            src="/female2.png"
                            alt="Profile"
                            className="w-6 h-6 rounded-full"
                          />
                          <span>George Elijah David</span>
                        </td>
                        <td className="p-2 border-b">M</td>
                        <td className="p-2 border-b">Mathematics</td>
                        <td className="p-2 border-b">70/100</td>
                      </tr>
                      <tr className="text-md">
                        <td className="p-2 border-b flex items-center space-x-2">
                          <img
                            src="/female2.png"
                            alt="Profile"
                            className="w-6 h-6 rounded-full"
                          />
                          <span>George Elijah David</span>
                        </td>
                        <td className="p-2 border-b">M</td>
                        <td className="p-2 border-b">Mathematics</td>
                        <td className="p-2 border-b">70/100</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Overall Performance Distribution
                </h3>
                <ResponsiveContainer width="100%" height={500}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Percentage of Student Passed",
                          value: 70,
                          color: "#01427A",
                        },
                        {
                          name: "Percentage of Student Failed",
                          value: 30,
                          color: "#4169E1",
                        },
                      ]}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={180}
                      paddingAngle={2}
                      startAngle={90}
                      endAngle={450}
                    >
                      <Cell key="passed" fill="#01427A" />
                      <Cell key="failed" fill="#4169E1" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center mt-4">
                  <div className="flex items-center space-x-2 mx-2">
                    <div className="w-3 h-3 rounded-full bg-[#01427A]"></div>
                    <p className="text-sm">Percentage of Student Passed</p>
                  </div>
                  <div className="flex items-center space-x-2 mx-2">
                    <div className="w-3 h-3 rounded-full bg-[#4169E1]"></div>
                    <p className="text-sm">Percentage of Student Failed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Class Teacher" && schoolType === "Snr Sch" && (
          <div>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex space-x-6 mb-6 border-b border-gray-200">
                  <button
                    className={`pb-2 text-md font-medium ${
                      activeTab === "Subject Teacher"
                        ? "text-[#01427A] border-b-3 border-[#96B1CB]"
                        : "text-[#9C9C9C]"
                    }`}
                    onClick={() => setActiveTab("Subject Teacher")}
                  >
                    Subject Teacher
                  </button>
                  <button
                    className={`pb-2 text-md font-medium ${
                      activeTab === "Class Teacher"
                        ? "text-[#01427A] border-b-3 border-[#96B1CB]"
                        : "text-[#9C9C9C]"
                    }`}
                    onClick={() => setActiveTab("Class Teacher")}
                  >
                    Class Teacher
                  </button>
                </div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Performance Distribution
                  </h3>
                  <button className="bg-[#07508F] p-2 text-white rounded-md">
                    Set Distribution
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Percentage of Student Passed",
                          value: 70,
                          color: "#01427A",
                        },
                        {
                          name: "Percentage of Student Failed",
                          value: 30,
                          color: "#4169E1",
                        },
                      ]}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={150}
                      paddingAngle={2}
                      startAngle={90}
                      endAngle={450}
                    >
                      <Cell key="passed" fill="#01427A" />
                      <Cell key="failed" fill="#4169E1" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-y-3 flex-col">
                  <div className="flex items-center space-x-2 mx-2">
                    <div className="w-3 h-3 rounded-full bg-[#01427A]"></div>
                    <p className="text-sm">Percentage of Student Passed</p>
                  </div>
                  <div className="flex items-center space-x-2 mx-2">
                    <div className="w-3 h-3 rounded-full bg-[#4169E1]"></div>
                    <p className="text-sm">Percentage of Student Failed</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Quick Stat</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Stat Card 1 */}
                    <div className="flex flex-row items-center justify-center border border-gray-300 rounded-lg p-4">
                      <div className="flex flex-col mb-2">
                        <img
                          src="/quickStats.png"
                          alt="Profile"
                          className="w-5 h-5"
                        />
                        <span className="flex items-center text-[#01427A] text-sm font-medium">
                          Improvement Overtime
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold text-[#01427A]">68%</h2>
                    </div>
                    {/* Stat Card 2 */}
                    <div className="flex flex-row items-center justify-center border border-gray-300 rounded-lg p-4">
                      <div className="flex flex-col mb-2">
                        <img
                          src="/quickStats.png"
                          alt="Profile"
                          className="w-5 h-5"
                        />
                        <span className="flex items-center text-[#01427A] text-sm font-medium">
                          Improvement Overtime
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold text-[#01427A]">68%</h2>
                    </div>
                    {/* Stat Card 3 */}
                    <div className="flex flex-row items-center justify-center border border-gray-300 rounded-lg p-4">
                      <div className="flex flex-col mb-2">
                        <img
                          src="/quickStats.png"
                          alt="Profile"
                          className="w-5 h-5"
                        />
                        <span className="flex items-center text-[#01427A] text-sm font-medium">
                          Improvement Overtime
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold text-[#01427A]">68%</h2>
                    </div>
                  </div>
                </div>

                {/* Performance vs Attendance */}
                <div className="bg-white rounded-lg shadow-xl p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Performance vs Attendance
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div
                                style={{
                                  backgroundColor: "#01427A",
                                  color: "#fff",
                                  padding: "5px 10px",
                                  borderRadius: "5px",
                                }}
                              >
                                <p>{`${payload[0].value}% Attendance`}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        dataKey="attendance"
                        fill="#01427A"
                        fillOpacity={0.1}
                        stroke="none"
                      />
                      <Line
                        dataKey="attendance"
                        stroke="#01427A"
                        strokeWidth={2}
                        activeDot={{ r: 8, fill: "#01427A" }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Grade Distribution */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Grade Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={gradeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="grade"
                      label={{
                        value: "(Grades)",
                        position: "insideBottom",
                        offset: -5,
                        style: {
                          textAnchor: "middle",
                          fill: "#000",
                          padding: 10,
                        },
                      }}
                    />
                    <YAxis
                      label={{
                        value: "(Average Percentage %)",
                        angle: -90,
                        position: "insideLeft",
                        offset: 10,
                        style: { textAnchor: "middle", fill: "#000" },
                      }}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="percentage"
                      fill="#2F62D2"
                      barSize={20}
                      radius={[10, 10, 0, 0]}
                    />
                    {/* Line Chart */}
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      stroke="#01427A"
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Best in All Subjects */}
              <div className="bg-white rounded-lg shadow p-4 mt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Best in all subjects
                </h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#E6ECF2]/50 rounded-t-xl">
                      <th className="p-2 border-b">Student's Name</th>
                      <th className="p-2 border-b">Gender</th>
                      <th className="p-2 border-b">Subject</th>
                      <th className="p-2 border-b">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-md">
                      <td className="p-2 border-b flex items-center space-x-2">
                        <img
                          src="/female2.png"
                          alt="Profile"
                          className="w-6 h-6 rounded-full"
                        />
                        <span>George Elijah David</span>
                      </td>
                      <td className="p-2 border-b">M</td>
                      <td className="p-2 border-b">Mathematics</td>
                      <td className="p-2 border-b">70/100</td>
                    </tr>
                    <tr className="text-md">
                      <td className="p-2 border-b flex items-center space-x-2">
                        <img
                          src="/female2.png"
                          alt="Profile"
                          className="w-6 h-6 rounded-full"
                        />
                        <span>George Elijah David</span>
                      </td>
                      <td className="p-2 border-b">M</td>
                      <td className="p-2 border-b">Mathematics</td>
                      <td className="p-2 border-b">70/100</td>
                    </tr>
                    <tr className="text-md">
                      <td className="p-2 border-b flex items-center space-x-2">
                        <img
                          src="/female2.png"
                          alt="Profile"
                          className="w-6 h-6 rounded-full"
                        />
                        <span>George Elijah David</span>
                      </td>
                      <td className="p-2 border-b">M</td>
                      <td className="p-2 border-b">Mathematics</td>
                      <td className="p-2 border-b">70/100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PerformanceAnalysis;
