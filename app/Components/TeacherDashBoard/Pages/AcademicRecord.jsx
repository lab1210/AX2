"use client";
import React, { useState } from "react";
import { PenLine, Search } from "lucide-react";
import Layout from "../../Teacherlayout";
import RightSidebar from "../RightSideBar";

const AcademicRecord = () => {
  const [activeTab, setActiveTab] = useState("ca"); // Active tab state
  const students = Array(10).fill({
    name: "Babalola Ife Adeshewa",
    id: 67,
    score: 90,
  });

  return (
    <Layout>
      <div className="w-full flex flex-col bg-[#F7F8FA]">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-white p-4 shadow rounded-lg mb-6">
          <h1 className="text-2xl font-bold">Academic Record</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search student name"
                className="border border-gray-300 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-3 text-gray-400">
                <Search className="w-5 h-5" />
              </span>
            </div>
            <button className="bg-[#07508F] text-white px-6 py-3 rounded-md">
              Upload CSV File
            </button>
          </div>
        </div>

        <div className="flex flex-row gap-2">
          {/* Main Content */}
          <div className="flex-1 p-4 min-w-[70%]">
            {/* Content Section */}
            {activeTab === "ca" && (
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  {/* Uploaded Test Record Table */}
                  <div className="bg-white rounded-lg shadow p-4">
                    {/* Tabs Section */}
                    <div className="flex items-center border-b border-gray-200 mb-4 space-x-8">
                      <button
                        className={`px-4 py-3 ${
                          activeTab === "ca"
                            ? "border-b-4 border-[#07508F] text-black"
                            : "text-gray-400"
                        }`}
                        onClick={() => setActiveTab("ca")}
                      >
                        C.A
                      </button>
                      <button
                        className={`px-4 py-3 ${
                          activeTab === "exam"
                            ? "border-b-4 border-[#07508F] text-black"
                            : "text-gray-400"
                        }`}
                        onClick={() => setActiveTab("exam")}
                      >
                        Exam Upload
                      </button>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[#07508F] text-lg font-semibold mb-4">
                        Add New Record
                      </h3>
                      <div className="flex justify-end">
                        <button className="bg-[#07508F] text-white px-6 py-3 rounded-md cursor-pointer">
                          Save
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                      <div className="flex flex-row max-w-md items-center space-x-2">
                        <label className="block text-sm font-medium mb-1">
                          Select Year:
                        </label>
                        <select className="border border-gray-300 rounded-md px-4 py-3 max-w-md bg-gray-200">
                          <option>2023</option>
                          <option>2024</option>
                        </select>
                      </div>
                      <div className="flex flex-row max-w-md items-center space-x-2">
                        <label className="block text-sm font-medium mb-1">
                          Select Term:
                        </label>
                        <select className="border border-gray-300 rounded-md px-4 py-3 max-w-md bg-gray-200">
                          <option>1st Term</option>
                          <option>2nd Term</option>
                          <option>3rd Term</option>
                        </select>
                      </div>
                      <div className="flex flex-row max-w-md items-center space-x-2">
                        <label className="block text-sm font-medium mb-1">
                          Select Class ID:
                        </label>
                        <select className="border border-gray-300 rounded-md px-4 py-3 max-w-md bg-gray-200">
                          <option>JSS1</option>
                          <option>JSS2</option>
                          <option>JSS3</option>
                        </select>
                      </div>
                      <div className="flex flex-row max-w-md items-center space-x-2">
                        <label className="block text-sm font-medium mb-1">
                          Select Subject ID:
                        </label>
                        <select className="border border-gray-300 rounded-md px-4 py-3 max-w-md bg-gray-200">
                          <option>Maths</option>
                          <option>English</option>
                          <option>Science</option>
                        </select>
                      </div>
                      <div className="flex flex-row max-w-sm items-center space-x-2">
                        <label className="block text-sm font-medium mb-1">
                          Select Category:
                        </label>
                        <select className="border border-gray-300 rounded-md px-4 py-3 max-w-md bg-gray-200">
                          <option>Test</option>
                          <option>Assignment</option>
                        </select>
                      </div>
                      <div className="flex flex-row max-w-md items-center space-x-2">
                        <label className="block text-sm font-medium mb-1">
                          Select Instances:
                        </label>
                        <select className="border border-gray-300 rounded-md px-4 py-3 max-w-md bg-gray-200">
                          <option>1-50</option>
                          <option>51-100</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-b border-gray-200 p-8 mb-4"></div>

                    <h3 className="text-lg font-semibold text-center mb-4">
                      Foursquare International Secondary School <br />
                      Uploaded Test Record
                    </h3>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#6B90B5] text-white">
                          <th className="border-b border-gray-300 px-4 py-3 text-center">
                            S/N
                          </th>
                          <th className="border-b border-gray-300 px-4 py-3 text-center">
                            Student Name
                          </th>
                          <th className="border-b border-gray-300 px-4 py-3 text-center">
                            Student ID
                          </th>
                          <th className="border-b border-gray-300 px-4 py-3 text-center">
                            Score
                          </th>
                          <th className="border-b border-gray-300 px-4 py-3 text-left">
                            Edit
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student, index) => (
                          <tr key={index}>
                            <td className="border-b border-gray-300 px-4 py-3 text-center">
                              {index + 1}
                            </td>
                            <td className="border-b border-gray-300 px-4 py-3 text-center">
                              {student.name}
                            </td>
                            <td className="border-b border-gray-300 px-4 py-3 text-center">
                              {student.id}
                            </td>
                            <td className="border-b border-gray-300 px-4 py-3 text-center">
                              {student.score}
                            </td>
                            <td className="border-b border-gray-300 px-4 py-3 text-left cursor-pointer">
                              <PenLine className="text-[#80ADCB] w-5 h-5" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "exam" && (
              <div className="h-screen grid grid-rows-3 lg:flex-row gap-6">
                {/* Left Section */}
                <div className="flex-1">
                  <div className="bg-white rounded-lg shadow p-4">
                    {/* Tabs Section */}
                    <div className="flex items-center border-b border-gray-200 mb-4 space-x-8">
                      <button
                        className={`px-4 py-3 ${
                          activeTab === "ca"
                            ? "border-b-4 border-[#07508F] text-black"
                            : "text-gray-400"
                        }`}
                        onClick={() => setActiveTab("ca")}
                      >
                        C.A
                      </button>
                      <button
                        className={`px-4 py-3 ${
                          activeTab === "exam"
                            ? "border-b-4 border-[#07508F] text-black"
                            : "text-gray-400"
                        }`}
                        onClick={() => setActiveTab("exam")}
                      >
                        Exam Upload
                      </button>
                    </div>
                    <div className="bg-white rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg text-[#07508F] font-semibold mb-4">
                          Add New Record
                        </h3>
                        <div className="flex justify-end">
                          <button className="bg-[#07508F] text-white px-6 py-2 rounded-md cursor-pointer">
                            Save
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                          <div className="flex flex-row max-w-md items-center space-x-2">
                            <label className="block text-sm font-medium mb-1">
                              Select Year:
                            </label>
                            <select className="border border-gray-300 rounded-md px-4 py-2 max-w-md bg-gray-200">
                              <option>2023</option>
                              <option>2024</option>
                            </select>
                          </div>
                          <div className="flex flex-row max-w-md items-center space-x-2">
                            <label className="block text-sm font-medium mb-1">
                              Select Term:
                            </label>
                            <select className="border border-gray-300 rounded-md px-4 py-2 max-w-md bg-gray-200">
                              <option>1st Term</option>
                              <option>2nd Term</option>
                              <option>3rd Term</option>
                            </select>
                          </div>
                          <div className="flex flex-row max-w-md items-center space-x-2">
                            <label className="block text-sm font-medium mb-1">
                              Select Class ID:
                            </label>
                            <select className="border border-gray-300 rounded-md px-4 py-2 max-w-md bg-gray-200">
                              <option>JSS1</option>
                              <option>JSS2</option>
                              <option>JSS3</option>
                            </select>
                          </div>
                          <div className="flex flex-row max-w-md items-center space-x-2">
                            <label className="block text-sm font-medium mb-1">
                              Select Subject ID:
                            </label>
                            <select className="border border-gray-300 rounded-md px-4 py-2 max-w-md bg-gray-200">
                              <option>Maths</option>
                              <option>English</option>
                              <option>Science</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex flex-row max-w-md items-center justify-center space-x-2">
                          <label className="block text-sm font-medium mb-1">
                            Score:
                          </label>
                          <input
                            type="number"
                            placeholder="Enter Score"
                            className="border border-gray-400 rounded-full px-4 py-2 max-w-md"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-b border-gray-200 p-8 mb-4"></div>

                    <h3 className="text-lg font-semibold text-center mb-4">
                      Foursquare International Secondary School <br />
                      Uploaded Exam Record
                    </h3>
                    <table className="w-full border-collapse mx-auto">
                      <thead>
                        <tr className="bg-[#6B90B5] text-white">
                          <th className="border-b border-gray-300 px-4 py-2 text-center">
                            S/N
                          </th>
                          <th className="border-b border-gray-300 px-4 py-2 text-center">
                            Student Name
                          </th>
                          <th className="border-b border-gray-300 px-4 py-2 text-center">
                            Student ID
                          </th>
                          <th className="border-b border-gray-300 px-4 py-2 text-center">
                            Score
                          </th>
                          <th className="border-b border-gray-300 px-4 py-2 text-left">
                            Edit
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student, index) => (
                          <tr key={index}>
                            <td className="border-b border-gray-300 px-4 py-2 text-center">
                              {index + 1}
                            </td>
                            <td className="border-b border-gray-300 px-4 py-2 text-center font-semibold">
                              {student.name}
                            </td>
                            <td className="border-b border-gray-300 px-4 py-2 text-center">
                              {student.id}
                            </td>
                            <td className="border-b border-gray-300 px-4 py-2 text-center">
                              {student.score}
                            </td>
                            <td className="border-b border-gray-300 px-4 py-2 text-center mx-auto cursor-pointer">
                              <PenLine className="text-[#80ADCB] w-5 h-5 text-center" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
          <RightSidebar />
        </div>
      </div>
    </Layout>
  );
};

export default AcademicRecord;
