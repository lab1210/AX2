"use client";
import React, { useState, useCallback, useEffect } from "react";
import Layout from "../../Teacherlayout";
import RightSidebar from "../RightSideBar";
import { Search, Download, CloudUpload } from "lucide-react";
import { useDropzone } from "react-dropzone";

const AttendancePage = () => {
  const [activeTab, setActiveTab] = useState("mark");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    if (isModalOpen) {
      setIsAnimating(true);
    }
  }, [isModalOpen]);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles && rejectedFiles.length > 0) {
        setError("Please upload only Excel files (.xlsx, .csv)");
        return;
      }

      const uploadedFile = acceptedFiles[0];
      setFile(uploadedFile);
      setError("");
    },
    [setFile, setError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    multiple: false,
  });

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
              <span className="text-[#7E7E7E]">Mark Attendance</span>
            </h1>
            <div className="flex items-center space-x-4">
              <label htmlFor="searchDate" className="text-sm font-medium">
                Search Date:
              </label>
              <input
                type="date"
                id="searchDate"
                className="border border-gray-100 bg-gray-200 rounded px-2 py-1"
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
              <span className="text-[#7E7E7E]">View Attendance</span>
            </h1>
            <div className="flex items-center space-x-4">
              <label htmlFor="viewDate" className="text-sm font-medium">
                Date:
              </label>
              <input
                type="date"
                id="viewDate"
                className="border border-gray-100 bg-gray-200 rounded px-2 py-1"
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
              Attendance / <span className="text-[#7E7E7E]">Summary</span>
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

  const renderDropzone = () => (
    <div
      {...getRootProps()}
      className={`border-dashed border-2 bg-[#f5f7fa] ${
        isDragActive ? "border-[#07508F]" : "border-gray-400"
      } rounded-lg p-6 text-center text-black max-h-xl flex items-center justify-center min-h-[200px] cursor-pointer hover:border-[#07508F] transition-colors duration-200`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center space-y-4">
        <CloudUpload className="w-12 h-12 text-[#07508F]" />
        <div className="space-y-2">
          <p className="text-black text-md">
            {file
              ? `Selected file: ${file.name}`
              : isDragActive
              ? "Drop the CSV file here"
              : "Drag and drop CSV File"}
          </p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(students.map((s) => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleStudentSelect = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-[#F7F8FA]">
        <div className="flex-1 flex flex-col">
          <div className="fixed top-0 z-30 flex items-center justify-between bg-white p-4 w-[83%]">
            {renderHeaderContent()}
          </div>

          {/* Content Section */}
          <div className="flex flex-1 p-6 w-full pt-24">
            <div className="flex-1 flex flex-col bg-white rounded-lg shadow p-4 w-[85%] mx-auto">
              <div className="flex items-center border-b border-gray-100 mb-4 space-x-8">
                <button
                  className={`px-4 py-1 ${
                    activeTab === "mark"
                      ? "border-b-3 border-[#96B1CB] text-black"
                      : "text-[#A8A8A8]"
                  }`}
                  onClick={() => setActiveTab("mark")}
                >
                  Mark Attendance
                </button>
                <button
                  className={`px-1 py-1 ${
                    activeTab === "view"
                      ? "border-b-3 border-[#96B1CB] text-black"
                      : "text-[#A8A8A8]"
                  }`}
                  onClick={() => setActiveTab("view")}
                >
                  View Attendance
                </button>
                <button
                  className={`px-3 py-1 ${
                    activeTab === "summary"
                      ? "border-b-3 border-[#96B1CB] text-black"
                      : "text-[#A8A8A8]"
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
                      <input
                        type="checkbox"
                        id="selectAll"
                        checked={selectedStudents.length === students.length}
                        onChange={handleSelectAll}
                        className="accent-green-600 w-5 h-5"
                      />
                      <label
                        htmlFor="selectAll"
                        className="text-sm font-medium"
                      >
                        Select All
                      </label>
                    </div>
                    <input
                      type="date"
                      className="border border-gray-100 rounded px-2 py-1"
                    />
                    <button className="bg-[#07508F] text-white px-4 py-3 rounded">
                      Save
                    </button>
                  </div>

                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#6B90B5] text-white">
                        <th className="border-b border-gray-100 px-4 py-3 text-left">
                          Action
                        </th>
                        <th className="border-b border-gray-100 px-4 py-3 text-center mx-auto">
                          Students Name
                        </th>
                        <th className="border-b border-gray-100 px-4 py-3 text-right">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="border-b border-gray-100 px-4 py-3 text-left">
                            <input
                              type="checkbox"
                              className="text-green-500 accent-green-600 w-5 h-5"
                              checked={selectedStudents.includes(student.id)}
                              onChange={() => handleStudentSelect(student.id)}
                            />
                          </td>
                          <td className="border-b border-gray-100 px-4 py-3 text-center font-semibold">
                            {student.name}
                          </td>
                          <td
                            className={`border-b border-gray-100 px-4 py-3 text-right font-semibold ${
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
                        <th className="border-b border-gray-100 px-4 py-3 text-left">
                          S/N
                        </th>
                        <th className="border-b border-gray-100 px-4 py-3 text-left">
                          Students Name
                        </th>
                        <th className="border-b border-gray-100 px-4 py-3 text-center mx-auto">
                          Attendance Mark
                        </th>
                        <th className="border-b border-gray-100 px-4 py-3 text-right">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <tr key={student.id}>
                          <td className="border-b border-gray-100 px-4 py-3">
                            {index + 1}
                          </td>
                          <td className="border-b border-gray-100 px-4 py-3">
                            {student.name}
                          </td>
                          <td className="border-b border-gray-100 px-4 py-3 text-center mx-auto">
                            {student.status === "Present" ? 1 : 0}
                          </td>
                          <td
                            className={`border-b border-gray-100 px-4 py-3 text-right font-semibold ${
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
                          <th className="border-b border-gray-100 px-4 py-3 text-left">
                            Student Name
                          </th>
                          <th className="border-b border-gray-100 px-4 py-3 text-center">
                            No. of Time Present
                          </th>
                          <th className="border-b border-gray-100 px-4 py-3 text-center">
                            % Present
                          </th>
                          <th className="border-b border-gray-100 px-4 py-3 text-center">
                            No. of Time Absent
                          </th>
                          <th className="border-b border-gray-100 px-4 py-3 text-center">
                            % Absent
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student, index) => (
                          <tr key={index}>
                            <td className="border-b border-gray-100 px-4 py-3">
                              {student.name}
                            </td>
                            <td className="border-b border-gray-100 px-4 py-3 text-center">
                              100
                            </td>
                            <td className="border-b border-gray-100 px-4 py-3 text-center">
                              80%
                            </td>
                            <td className="border-b border-gray-100 px-4 py-3 text-center">
                              20
                            </td>
                            <td className="border-b border-gray-100 px-4 py-3 text-center">
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
            <div className="hidden lg:block w-[25%] mx-auto">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="bg-black/70 fixed inset-0 z-40">
          <div
            className={`fixed inset-y-0 left-0 z-50 bg-white rounded-lg shadow-lg  inset-0 w-[90%] h-[80%] mx-auto mt-15 transform transition-transform duration-500 ease-in-out ${
              isAnimating ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="w-full h-full p-20">
              <div className="flex items-center justify-between mb-4">
                <div className="mx-auto">
                  <h2 className="text-3xl font-bold text-center">
                    Upload Exam
                  </h2>
                </div>
                <div className="float-right">
                  <button
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                    onClick={() => {
                      setIsAnimating(false);
                      setTimeout(() => setIsModalOpen(false), 300);
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="mb-4 flex space-x-3 items-center">
                <label
                  htmlFor="uploadDate"
                  className="block text-sm font-medium mb-2"
                >
                  Select Date:
                </label>
                <input
                  type="date"
                  id="uploadDate"
                  className="border-2 border-gray-100 rounded p-2 max-w-sm bg-gray-200"
                />
              </div>

              {renderDropzone()}

              <div className="mt-4 text-sm text-red-500 flex flex-row space-x-1 items-center font-semibold">
                <a href="#" className="underline">
                  Download Sample here
                </a>
                <p>
                  <Download className="w-4 h-4" />
                </p>
              </div>
              <button className="bg-[#07508F] text-white px-6 py-3 rounded-md w-full mt-4 cursor-pointer font-semibold">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AttendancePage;
