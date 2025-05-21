import React from "react";
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
  Legend,
  ResponsiveContainer,
} from "recharts";
import Layout from "../../Teacherlayout";

const PerformanceAnalysis = () => {
  // Sample Data
  const performanceData = [
    { week: "WK1", attendance: 60, performance: 50 },
    { week: "WK2", attendance: 70, performance: 60 },
    { week: "WK3", attendance: 80, performance: 70 },
    { week: "WK4", attendance: 60, performance: 65 },
    { week: "WK5", attendance: 75, performance: 80 },
    { week: "WK6", attendance: 85, performance: 90 },
    { week: "WK7", attendance: 90, performance: 95 },
    { week: "WK8", attendance: 95, performance: 100 },
    { week: "WK9", attendance: 85, performance: 90 },
    { week: "WK10", attendance: 80, performance: 85 },
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

  const genderPerformance = [
    { name: "Passed", value: 70 },
    { name: "Failed", value: 30 },
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
        <div className="flex flex-row space-x-3 mb-6 w-full">
          {/* Subject Statistics */}
          <div className="grid grid-cols-3 gap-6 rounded-lg p-4 w-[60%]">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Average Score</p>
              <h2 className="text-2xl font-bold">60%</h2>
              <button className="text-blue-600 text-sm mt-2">
                View Report
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Highest Score</p>
              <h2 className="text-2xl font-bold">80%</h2>
              <button className="text-blue-600 text-sm mt-2">
                View Report
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Lowest Score</p>
              <h2 className="text-2xl font-bold">40%</h2>
              <button className="text-blue-600 text-sm mt-2">
                View Report
              </button>
            </div>
          </div>

          {/* Score Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
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
                  // fill="#8884d8"
                >
                  {scoreDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Performance vs Attendance */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-4">
                Performance vs Attendance
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="attendance" stroke="#8884d8" />
                  <Line
                    type="monotone"
                    dataKey="performance"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Grade Distribution */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-4">Grade Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Gender Performance Distribution */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-4">
                Gender Performance Distribution
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={genderPerformance}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#82ca9d"
                  >
                    {genderPerformance.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Overall Performance Distribution across classes
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={overallPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="passed" stackId="a" fill="#82ca9d" />
              <Bar dataKey="failed" stackId="a" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
};

export default PerformanceAnalysis;
