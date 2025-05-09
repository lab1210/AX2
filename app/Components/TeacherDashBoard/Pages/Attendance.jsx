"use client";
import React, { useState } from "react";
import Layout from "../../Teacherlayout";
import RightSidebar from "../RightSideBar";
import { Search, Download } from "lucide-react";

const AttendancePage = () => {
  const [activeTab, setActiveTab] = useState("mark");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const students = [
    { id: 1, name: "Babalola Ife Adeshewa", status: "Present" },
    { id: 2, name: "Babalola Ife Adeshewa", status: "Absent" },
    { id: 3, name: "Babalola Ife Adeshewa", status: "Present" },
    { id: 4, name: "Babalola Ife Adeshewa", status: "Present" },
    { id: 5, name: "Babalola Ife Adeshewa", status: "Absent" },
    { id: 6, name: "Babalola Ife Adeshewa", status: "Present" },
    { id: 7, name: "Babalola Ife Adeshewa", status: "Present" },
    { id: 8, name: "Babalola Ife Adeshewa", status: "Absent" },
  ];

  const renderHeaderContent = () => {
    switch (activeTab) {
      case "mark":
        return (
          <>
            <h1 className="text-2xl font-bold">
              Attendance /{" "}
              <span className="text-gray-200">Mark Attendance</span>
            </h1>
            <div className="flex items-center space-x-4">
              <label htmlFor="searchDate" className="text-sm font-medium">
                Search Date:
              </label>
              <input
                type="date"
                id="searchDate"
                className="border border-gray-200 bg-gray-200 rounded px-2 py-1"
              />
              <button
                className="bg-[#07508F] text-white px-4 py-3 rounded"
                onClick={() => setIsModalOpen(true)}
              >
                Upload Attendance File
              </button>
            </div>
          </>
        );
      case "view":
        return (
          <>
            <h1 className="text-2xl font-bold">
              Attendance /{" "}
              <span className="text-gray-200">View Attendance</span>
            </h1>
            <div className="flex items-center space-x-4">
              <label htmlFor="viewDate" className="text-sm font-medium">
                Date:
              </label>
              <input
                type="date"
                id="viewDate"
                className="border border-gray-200 bg-gray-200 rounded px-2 py-1"
              />
              <div className="relative">
                <button className="bg-[#07508F] text-white px-6 py-3 rounded flex items-center space-x-2">
                  <span className="flex flex-row">Download</span>
                  <span className="text-right">
                    <Download className="w-4 h-4 font-semibold" />
                  </span>
                </button>
              </div>
            </div>
          </>
        );
      case "summary":
        return (
          <>
            <h1 className="text-2xl font-bold">
              Attendance / <span className="text-gray-200">Summary</span>
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search student name"
                  className="border border-gray-500 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#07508F] w-[250px]"
                />
                <span className="absolute right-3 top-3.5 text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
              </div>
              <div className="relative">
                <button className="bg-[#07508F] text-white px-6 py-3 rounded flex items-center space-x-2">
                  <span className="flex flex-row">Download</span>
                  <span className="text-right">
                    <Download className="w-4 h-4 font-semibold" />
                  </span>
                </button>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-[#F7F8FA]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header Section */}
          <div className="flex items-center justify-between bg-white p-4 shadow w-full z-10">
            {renderHeaderContent()}
          </div>

          {/* Content Section */}
          <div className="flex flex-1 p-6">
            <div className="flex-1 flex flex-col bg-white rounded-lg shadow p-4">
              {/* Tab Navigation Inside Content */}
              <div className="flex items-center border-b border-gray-200 mb-4 space-x-8">
                <button
                  className={`px-4 py-1 ${
                    activeTab === "mark"
                      ? "border-b-3 border-[#96B1CB] text-black"
                      : "text-gray-200"
                  }`}
                  onClick={() => setActiveTab("mark")}
                >
                  Mark Attendance
                </button>
                <button
                  className={`px-1 py-1 ${
                    activeTab === "view"
                      ? "border-b-3 border-[#96B1CB] text-black"
                      : "text-gray-200"
                  }`}
                  onClick={() => setActiveTab("view")}
                >
                  View Attendance
                </button>
                <button
                  className={`px-3 py-1 ${
                    activeTab === "summary"
                      ? "border-b-3 border-[#96B1CB] text-black"
                      : "text-gray-200"
                  }`}
                  onClick={() => setActiveTab("summary")}
                >
                  Summary Attendance
                </button>
              </div>

              {activeTab === "mark" && (
                <div>
                  {/* Mark Attendance Content */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="selectAll" />
                      <label
                        htmlFor="selectAll"
                        className="text-sm font-medium"
                      >
                        Select All
                      </label>
                    </div>
                    <input
                      type="date"
                      className="border border-gray-200 rounded px-2 py-1"
                    />
                    <button className="bg-[#07508F] text-white px-4 py-3 rounded">
                      Save
                    </button>
                  </div>

                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#6B90B5] text-white">
                        <th className="border-b border-gray-200 px-4 py-3 text-left">
                          Action
                        </th>
                        <th className="border-b border-gray-200 px-4 py-3 text-center mx-auto">
                          Students Name
                        </th>
                        <th className="border-b border-gray-200 px-4 py-3 text-right">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="border-b border-gray-200 px-4 py-3 text-left">
                            <input type="checkbox" className="text-green-500" />
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3 text-center font-semibold">
                            {student.name}
                          </td>
                          <td
                            className={`border-b border-gray-200 px-4 py-3 text-right font-semibold ${
                              student.status === "Present"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {student.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "view" && (
                <div>
                  {/* View Attendance Content */}
                  <table className="w-full border-collapse mx-auto">
                    <thead>
                      <tr className="bg-[#6B90B5] text-white">
                        <th className="border-b border-gray-200 px-4 py-3 text-left">
                          S/N
                        </th>
                        <th className="border-b border-gray-200 px-4 py-3 text-left">
                          Students Name
                        </th>
                        <th className="border-b border-gray-200 px-4 py-3 text-center mx-auto">
                          Attendance Mark
                        </th>
                        <th className="border-b border-gray-200 px-4 py-3 text-right">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <tr key={student.id}>
                          <td className="border-b border-gray-200 px-4 py-3">
                            {index + 1}
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3">
                            {student.name}
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3 text-center mx-auto">
                            {student.status === "Present" ? 1 : 0}
                          </td>
                          <td
                            className={`border-b border-gray-200 px-4 py-3 text-right font-semibold ${
                              student.status === "Present"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {student.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "summary" && (
                  <div className="flex flex-col">
                    <div className="flex-1">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-[#6B90B5] text-white">
                            <th className="border-b border-gray-200 px-4 py-3 text-left">
                              Student Name
                            </th>
                            <th className="border-b border-gray-200 px-4 py-3 text-center">
                              No. of Time Present
                            </th>
                            <th className="border-b border-gray-200 px-4 py-3 text-center">
                              % Present
                            </th>
                            <th className="border-b border-gray-200 px-4 py-3 text-center">
                              No. of Time Absent
                            </th>
                            <th className="border-b border-gray-200 px-4 py-3 text-center">
                              % Absent
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student, index) => (
                            <tr key={index}>
                              <td className="border-b border-gray-200 px-4 py-3">
                                {student.name}
                              </td>
                              <td className="border-b border-gray-200 px-4 py-3 text-center">
                                100
                              </td>
                              <td className="border-b border-gray-200 px-4 py-3 text-center">
                                80%
                              </td>
                              <td className="border-b border-gray-200 px-4 py-3 text-center">
                                20
                              </td>
                              <td className="border-b border-gray-200 px-4 py-3 text-center">
                                20%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
              )}
            </div>

            {/* Right Sidebar */}
            <RightSidebar />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-[1743px] h-[990px]">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upload Exam</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="mb-4 flex">
              <label htmlFor="uploadDate" className="block text-sm font-medium">
                Select Date:
              </label>
              <input
                type="date"
                id="uploadDate"
                className="border border-gray-200 rounded px-4 py-3 w-md"
              />
            </div>
            <div className="border-dashed border-2 border-gray-200 rounded-lg p-6 text-center text-gray-500 ">
              <p>Drag and Drop CSV File</p>
            </div>
            <div className="mt-4 text-sm text-red-500">
              <a href="#" className="underline">
                Download Sample here
              </a>
            </div>
            <button className="bg-[#07508F] text-white px-6 py-3 rounded w-full mt-4 max-w-md">
              Save
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AttendancePage;