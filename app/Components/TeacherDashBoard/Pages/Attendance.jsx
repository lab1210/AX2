"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Search, Download, CloudUpload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { ChevronLeft, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import TeacherLayoutEmpty from "../Teacherlayout";
import { getStudents } from "../../../Service/studentService";
import RightSide from "../RightSideBar";
import toast from "react-hot-toast";
const AttendancePage = () => {
  const [activeTab, setActiveTab] = useState("mark");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [Students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const router = useRouter();

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
    { id: 9, name: "Babalola Ife Adeshewa", status: "Present" },
    { id: 10, name: "Babalola Ife Adeshewa", status: "Absent" },
    { id: 11, name: "Babalola Ife Adeshewa", status: "Absent" },
    { id: 12, name: "Babalola Ife Adeshewa", status: "Absent" },
    { id: 13, name: "Babalola Ife Adeshewa", status: "Present" },
    { id: 14, name: "Babalola Ife Adeshewa", status: "Present" },
    { id: 15, name: "Babalola Ife Adeshewa", status: "Present" },
    { id: 16, name: "Babalola Ife Adeshewa", status: "Absent" },
    { id: 17, name: "Babalola Ife Adeshewa", status: "Absent" },
    { id: 18, name: "Babalola Ife Adeshewa", status: "Absent" },
    { id: 19, name: "Babalola Ife Adeshewa", status: "Present" },
    { id: 20, name: "Babalola Ife Adeshewa", status: "Present" },
  ];

  // useEffect(() => {
  //   const fetchStudents = async () => {
  //     try {
  //       setLoading(true);
  //       const studentData = await getStudents();
  //       const formattedStudents = studentData.map((student, index) => ({
  //         id: student.student_id,
  //         name: `${student.first_name} ${student.last_name}`,
  //       }));
  //       setStudents(formattedStudents);
  //     } catch (error) {
  //       toast.error("Error fetching students");
  //     }
  //   };
  //   fetchStudents();
  // }, []);

  const renderHeaderContent = () => {
    switch (activeTab) {
      case "mark":
        return (
          <>
            <p className="text-xl font-bold">
              Attendance /{" "}
              <span className="text-[#7E7E7E]">Mark Attendance</span>
            </p>
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
            <h1 className="text-xl font-bold">
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
            <h1 className="text-xl font-bold">
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
                <button className="bg-[#07508F] text-white px-6 py-2 rounded flex items-center space-x-2">
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

  const totalPages = Math.ceil(students.length / itemsPerPage);
  const paginatedStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //FIRST TAB
  const totalPages1 = Math.ceil(Students.length / itemsPerPage);
  const paginatedStudents1 = Students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <>
      <TeacherLayoutEmpty>
        {/* Desktop View */}
        <div className="hidden bg-[#F7F8FA] overflow-hidden h-full w-full lg:block">
          <div className="grid grid-rows-[auto_1fr] w-full">
            <div className="bg-[#ffffff] pl-4 py-2 pr-4 sticky top-0 z-10  flex justify-between items-center ">
              {renderHeaderContent()}
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-[1fr_300px] p-3 xl:p-4  gap-2  bg-[#F7F8FA]">
              <div className="flex-1 flex flex-col bg-white rounded-lg shadow px-4 py-1 ">
                {/* Fixed Tabs Section */}
                <div className="border-b border-gray-200 mb-4">
                  <div className="flex items-center space-x-8">
                    <button
                      className={`px-4 py-3 text-sm ${
                        activeTab === "mark"
                          ? "border-b-4 border-[#07508F] text-black"
                          : "text-gray-400"
                      }`}
                      onClick={() => setActiveTab("mark")}
                    >
                      Mark Attendance
                    </button>
                    <button
                      className={`px-4 py-3 text-sm ${
                        activeTab === "view"
                          ? "border-b-4 border-[#07508F] text-black"
                          : "text-gray-400"
                      }`}
                      onClick={() => setActiveTab("view")}
                    >
                      View Attendance
                    </button>
                    <button
                      className={`px-4 py-3 text-sm ${
                        activeTab === "summary"
                          ? "border-b-4 border-[#07508F] text-black"
                          : "text-gray-400"
                      }`}
                      onClick={() => setActiveTab("summary")}
                    >
                      Summary Attendance
                    </button>
                  </div>
                </div>

                {/* Scrollable Content for all tabs */}
                <div className="overflow-y-auto max-h-[calc(100vh-220px)] no-scrollbar">
                  {activeTab === "mark" && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="selectAll"
                            checked={
                              selectedStudents.length === students.length
                            }
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
                        <div className="flex items-center gap-2">
                          <p className="text-sm">Select Date:</p>
                          <input
                            type="date"
                            className="border border-gray-100 rounded px-2 py-0"
                          />
                        </div>
                        <button className="bg-[#07508F] text-white px-4 py-0 rounded font-medium">
                          Save
                        </button>
                      </div>

                      <table className="w-full border-collapse ">
                        <thead className="">
                          <tr className="bg-[#6B90B5] text-white">
                            <th className="border-b border-gray-300 px-4 py-3  text-left">
                              Action
                            </th>
                            <th className="border-b border-gray-300 px-4 py-3 text-center">
                              Students Name
                            </th>
                            <th className="border-b border-gray-300 px-4 py-3 text-right">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedStudents.map((student) => (
                            <tr key={student.id} className="text-sm">
                              <td className="border-b border-gray-300 px-4 py-3 text-left">
                                <input
                                  type="checkbox"
                                  className="accent-green-600 w-5 h-5"
                                  checked={selectedStudents.includes(
                                    student.id
                                  )}
                                  onChange={() =>
                                    handleStudentSelect(student.id)
                                  }
                                />
                              </td>
                              <td className="border-b border-gray-300 px-4 py-3 text-center font-semibold">
                                {student.name}
                              </td>
                              <td
                                className={`border-b border-gray-300 px-4 py-3 text-right font-semibold ${
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
                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex justify-end items-center gap-2 mt-4">
                          <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-[#E6ECF2] rounded disabled:opacity-50"
                          >
                            &lt;
                          </button>
                          {Array.from({ length: totalPages }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => handlePageChange(i + 1)}
                              className={`px-3 py-1 rounded ${
                                currentPage === i + 1
                                  ? "bg-[#07508F] text-white"
                                  : "bg-[#FAFAFA] hover:bg-[#EDF0F3]"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-[#E6ECF2] rounded disabled:opacity-50"
                          >
                            &gt;
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "view" && (
                    <div>
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-[#6B90B5] text-white">
                            <th className="border-b border-gray-300 px-4 py-3 text-left">
                              S/N
                            </th>
                            <th className="border-b border-gray-300 px-4 py-3 text-left">
                              Students Name
                            </th>
                            <th className="border-b border-gray-300 px-4 py-3 text-center">
                              Attendance Mark
                            </th>
                            <th className="border-b border-gray-300 px-4 py-3 text-right">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedStudents.map((student, index) => (
                            <tr key={student.id} className="text-sm">
                              <td className="border-b border-gray-300 px-4 py-3">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td className="border-b border-gray-300 px-4 py-3">
                                {student.name}
                              </td>
                              <td className="border-b border-gray-300 px-4 py-3 text-center">
                                {student.status === "Present" ? 1 : 0}
                              </td>
                              <td
                                className={`border-b border-gray-300 px-4 py-3 text-right font-semibold ${
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
                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex justify-end items-center gap-2 mt-4">
                          <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-[#E6ECF2] rounded disabled:opacity-50"
                          >
                            &lt;
                          </button>
                          {Array.from({ length: totalPages }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => handlePageChange(i + 1)}
                              className={`px-3 py-1 rounded ${
                                currentPage === i + 1
                                  ? "bg-[#07508F] text-white"
                                  : "bg-[#FAFAFA] hover:bg-[#EDF0F3]"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-[#E6ECF2] rounded disabled:opacity-50"
                          >
                            &gt;
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "summary" && (
                    <div>
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-[#6B90B5] text-white text-sm">
                            <th className="border-b border-gray-300 px-4 py-3 text-left">
                              Student Name
                            </th>
                            <th className="border-b border-gray-300 px-4 py-3 text-center">
                              No. of Time Present
                            </th>
                            <th className="border-b border-gray-300 px-4 py-3 text-center">
                              % Present
                            </th>
                            <th className="border-b border-gray-300 px-4 py-3 text-center">
                              No. of Time Absent
                            </th>
                            <th className="border-b border-gray-300 px-4 py-3 text-center">
                              % Absent
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedStudents.map((student, index) => (
                            <tr key={index} className="text-sm">
                              <td className="border-b border-gray-300 px-4 py-3">
                                {student.name}
                              </td>
                              <td className="border-b border-gray-300 px-4 py-3 text-center">
                                100
                              </td>
                              <td className="border-b border-gray-300 px-4 py-3 text-center">
                                80%
                              </td>
                              <td className="border-b border-gray-300 px-4 py-3 text-center">
                                20
                              </td>
                              <td className="border-b border-gray-300 px-4 py-3 text-center">
                                20%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex justify-end items-center gap-2 mt-4">
                          <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-[#E6ECF2] rounded disabled:opacity-50"
                          >
                            &lt;
                          </button>
                          {Array.from({ length: totalPages }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => handlePageChange(i + 1)}
                              className={`px-3 py-1 rounded ${
                                currentPage === i + 1
                                  ? "bg-[#07508F] text-white"
                                  : "bg-[#FAFAFA] hover:bg-[#EDF0F3]"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-[#E6ECF2] rounded disabled:opacity-50"
                          >
                            &gt;
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <RightSide />
            </div>
          </div>
        </div>

        {/* Mobile/Tablet view */}
        <div className="block lg:hidden w-full min-h-screen bg-[#F7F8FA]">
          <div className="sticky top-0 z-20 bg-white border-b flex items-center justify-between px-4 py-3">
            <button className="text-xl">
              <ChevronLeft onClick={() => router.back()} />
            </button>
            <span className="font-semibold text-base">Mark Attendance</span>
            <button className="bg-[#07508F] rounded-full p-2">
              <Upload
                className="text-white w-5 h-5"
                onClick={() => setIsModalOpen(true)}
              />
            </button>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-3 items-center space-x-5 px-4 py-2 bg-white border-b">
            <label className="flex flex-row items-center gap-1 text-xs">
              <input
                type="checkbox"
                checked={selectedStudents.length === students.length}
                onChange={handleSelectAll}
                className="accent-green-600 w-5 h-5"
              />
              Select All
            </label>
            <div className="flex flex-row items-center gap-2">
              <span className="text-xs">Select Date:</span>
              <select className="border rounded px-2 py-1 text-xs">
                <option>2023/2024</option>
                <option>2024/2025</option>
                <option>2025/2026</option>
              </select>
            </div>
            <button className="bg-[#07508F] text-white px-3 py-2 rounded text-xs ml-auto">
              Save
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto px-2 pb-20">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-[#6B90B5] text-white">
                  <th className="px-2 py-2 text-left">Action</th>
                  <th className="px-2 py-2 text-center">Students Name</th>
                  <th className="px-2 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((student) => (
                  <tr key={student.id} className="border-b">
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        className="accent-green-600 w-5 h-5"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleStudentSelect(student.id)}
                      />
                    </td>
                    <td className="px-2 py-2 text-center">{student.name}</td>
                    <td
                      className={`px-2 py-2 font-semibold text-right ${
                        student.status === "Present"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {student.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-end items-center gap-2 mt-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-[#E6ECF2] rounded disabled:opacity-50"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-[#07508F] text-white"
                        : "bg-[#FAFAFA] hover:bg-[#EDF0F3]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-[#E6ECF2] rounded disabled:opacity-50"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="bg-black/70 fixed inset-0 z-40">
            <div
              className={`fixed inset-y-0 left-0 z-50 bg-white rounded-lg shadow-lg  inset-0 h-[65vh] w-[90%] lg:w-[90%] lg:h-[85vh] mx-auto mt-15 transform transition-transform duration-500 ease-in-out flex items-center ${
                isAnimating ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="w-full p-10 lg:p-15">
                <div className="flex items-center justify-between mb-4">
                  <div className="mx-auto">
                    <h2 className="text-xl lg:text-3xl font-bold text-center">
                      Upload Attendance
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
      </TeacherLayoutEmpty>
    </>
  );
};

export default AttendancePage;
