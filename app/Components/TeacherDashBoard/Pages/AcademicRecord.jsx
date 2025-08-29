"use client";
import React, { useState, useEffect, useCallback } from "react";
import { PenLine, Search, Check } from "lucide-react";
import Layout from "../Teacherlayout";
import { useDropzone } from "react-dropzone";
import { CloudUpload, Download } from "lucide-react";

const AcademicRecord = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ca");
  const [students, setStudents] = useState(
    Array.from({ length: 20 }, (_, index) => ({
      name: `Babalola Ife Adeshewa`,
      id: index + 1,
      score: Math.floor(Math.random() * 100),
    }))
  );
  const [editableRow, setEditableRow] = useState(null);
  const [editedScore, setEditedScore] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const handleEditClick = (index, currentScore) => {
    setEditableRow(index);
    setEditedScore(currentScore);
  };

  const handleSaveClick = (index) => {
    const updatedStudents = [...students];
    updatedStudents[index].score = parseInt(editedScore, 10);
    setStudents(updatedStudents);
    setEditableRow(null);
  };

  useEffect(() => {
    if (isModalOpen) {
      setIsAnimating(true);
    }
  }, [isModalOpen]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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

  const totalPages = Math.ceil(students.length / itemsPerPage);
  const paginatedStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <Layout>
      <div className="w-full flex flex-col bg-[#F7F8FA] min-h-screen">
        {/* Header Section */}
        <div className="fixed top-0 z-30 flex items-center justify-between bg-white p-4 mb-6 w-[80%] xl:w-[85%]">
          <h1 className="text-2xl font-bold">Academic Record</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search student name"
                className="border border-gray-100 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-3 text-gray-400">
                <Search className="w-5 h-5" />
              </span>
            </div>
            <button
              className="bg-[#07508F] text-white px-6 py-3 rounded-md"
              onClick={() => setIsModalOpen(true)}
            >
              Upload CSV File
            </button>
          </div>
        </div>

        <div className="flex flex-row gap-2 pt-19 w-[60%] xl:w-[65%] h-screen fixed bg-[#F7F8FA]">
          <div className="flex-1 p-2 xl:p-4 w-full mx-auto">
            {activeTab === "ca" && (
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="bg-white rounded-lg shadow p-4">
                    {/* Tabs - Fixed */}
                    <div className="border-b border-gray-200 mb-4">
                      <div className="flex items-center space-x-8">
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
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto max-h-[calc(100vh-220px)] no-scrollbar">
                      {/* New Record Section */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[#07508F] text-lg font-semibold mb-4">
                          Add New Record
                        </h3>
                        <div className="flex justify-end">
                          <button className="bg-[#07508F] text-white px-5 py-1 rounded-md cursor-pointer font-medium">
                            Save
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        <div className="flex flex-row max-w-md items-center space-x-2">
                          <label className="block text-sm font-medium mb-1">
                            Select Year:
                          </label>
                          <select className="border border-gray-100 rounded-md px-4 py-3 max-w-md bg-gray-200">
                            <option>2023</option>
                            <option>2024</option>
                          </select>
                        </div>
                        <div className="flex flex-row max-w-md items-center space-x-2">
                          <label className="block text-sm font-medium mb-1">
                            Select Term:
                          </label>
                          <select className="border border-gray-100 rounded-md px-4 py-3 max-w-md bg-gray-200">
                            <option>1st Term</option>
                            <option>2nd Term</option>
                            <option>3rd Term</option>
                          </select>
                        </div>
                        <div className="flex flex-row max-w-md items-center space-x-2">
                          <label className="block text-sm font-medium mb-1">
                            Select Class ID:
                          </label>
                          <select className="border border-gray-100 rounded-md px-4 py-3 max-w-md bg-gray-200">
                            <option>JSS1</option>
                            <option>JSS2</option>
                            <option>JSS3</option>
                          </select>
                        </div>
                        <div className="flex flex-row max-w-md items-center space-x-2">
                          <label className="block text-sm font-medium mb-1">
                            Select Subject ID:
                          </label>
                          <select className="border border-gray-100 rounded-md px-4 py-3 max-w-md bg-gray-200">
                            <option>Maths</option>
                            <option>English</option>
                            <option>Science</option>
                          </select>
                        </div>
                        <div className="flex flex-row max-w-sm items-center space-x-2">
                          <label className="block text-sm font-medium mb-1">
                            Select Category:
                          </label>
                          <select className="border border-gray-100 rounded-md px-4 py-3 max-w-md bg-gray-200">
                            <option>Test</option>
                            <option>Assignment</option>
                          </select>
                        </div>
                        <div className="flex flex-row max-w-md items-center space-x-2">
                          <label className="block text-sm font-medium mb-1">
                            Select Instances:
                          </label>
                          <select className="border border-gray-100 rounded-md px-4 py-3 max-w-md bg-gray-200">
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
                            <th className="border-b border-gray-100 px-4 py-3 text-center">
                              S/N
                            </th>
                            <th className="border-b border-gray-100 px-4 py-3 text-center">
                              Student Name
                            </th>
                            <th className="border-b border-gray-100 px-4 py-3 text-center">
                              Student ID
                            </th>
                            <th className="border-b border-gray-100 px-4 py-3 text-center">
                              Score
                            </th>
                            <th className="border-b border-gray-100 px-4 py-3 text-left">
                              Edit
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedStudents.map((student, idx) => {
                            const index = (currentPage - 1) * itemsPerPage + idx;
                            return (
                              <tr key={index}>
                                <td className="border-b border-gray-100 px-4 py-3 text-center">
                                  {index + 1}
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3 text-center">
                                  {student.name}
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3 text-center">
                                  {student.id}
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3 text-center">
                                  {editableRow === index ? (
                                    <input
                                      type="number"
                                      value={editedScore}
                                      onChange={(e) =>
                                        setEditedScore(e.target.value)
                                      }
                                      className="border-b border-gray-100 rounded px-2 py-1 w-16 text-center"
                                    />
                                  ) : (
                                    student.score
                                  )}
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3 text-center cursor-pointer">
                                  {editableRow === index ? (
                                    <Check
                                      className="text-green-500 w-5 h-5"
                                      onClick={() => handleSaveClick(index)}
                                    />
                                  ) : (
                                    <PenLine
                                      className="text-[#80ADCB] w-5 h-5"
                                      onClick={() =>
                                        handleEditClick(index, student.score)
                                      }
                                    />
                                  )}
                                </td>
                              </tr>
                            );
                          })}
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
                </div>
              </div>
            )}

            {activeTab === "exam" && (
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="bg-white rounded-lg shadow p-4">
                    {/* Tabs - Fixed */}
                    <div className="border-b border-gray-200 mb-4">
                      <div className="flex items-center space-x-8">
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
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto max-h-[calc(100vh-220px)] no-scrollbar">
                      {/* New Record Section */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[#07508F] text-lg font-semibold mb-4">
                          Add New Record
                        </h3>
                        <div className="flex justify-end">
                          <button className="bg-[#07508F] text-white px-5 py-1 font-medium rounded-md cursor-pointer">
                            Save
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col xl:flex-row justify-between space-y-2 ">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                          <div className="flex flex-row max-w-md items-center space-x-2">
                            <label className="block text-sm font-medium mb-1">
                              Select Year:
                            </label>
                            <select className="border border-gray-100 rounded-md px-4 py-3 max-w-md bg-gray-200">
                              <option>2023</option>
                              <option>2024</option>
                            </select>
                          </div>
                          <div className="flex flex-row max-w-md items-center space-x-2">
                            <label className="block text-sm font-medium mb-1">
                              Select Term:
                            </label>
                            <select className="border border-gray-100 rounded-md px-4 py-3 max-w-md bg-gray-200">
                              <option>1st Term</option>
                              <option>2nd Term</option>
                              <option>3rd Term</option>
                            </select>
                          </div>
                          <div className="flex flex-row max-w-md items-center space-x-2">
                            <label className="block text-sm font-medium mb-1">
                              Select Class ID:
                            </label>
                            <select className="border border-gray-100 rounded-md px-4 py-3 max-w-md bg-gray-200">
                              <option>JSS1</option>
                              <option>JSS2</option>
                              <option>JSS3</option>
                            </select>
                          </div>
                          <div className="flex flex-row max-w-md items-center space-x-2">
                            <label className="block text-sm font-medium mb-1">
                              Select Subject ID:
                            </label>
                            <select className="border border-gray-100 rounded-md px-4 py-3 max-w-md bg-gray-200">
                              <option>Maths</option>
                              <option>English</option>
                              <option>Science</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex flex-row max-w-md items-center xl:justify-center space-x-2">
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

                      <div className="border-b border-gray-200 p-8 mb-4"></div>

                      {/* Table Section */}
                      <h3 className="text-lg font-semibold text-center mb-4">
                        Foursquare International Secondary School <br />
                        Uploaded Exam Record
                      </h3>
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-[#6B90B5] text-white">
                            <th className="border-b border-gray-100 px-4 py-3 text-center">
                              S/N
                            </th>
                            <th className="border-b border-gray-100 px-4 py-3 text-center">
                              Student Name
                            </th>
                            <th className="border-b border-gray-100 px-4 py-3 text-center">
                              Student ID
                            </th>
                            <th className="border-b border-gray-100 px-4 py-3 text-center">
                              Score
                            </th>
                            <th className="border-b border-gray-100 px-4 py-3 text-left">
                              Edit
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedStudents.map((student, idx) => {
                            const index = (currentPage - 1) * itemsPerPage + idx;
                            return (
                              <tr key={index}>
                                <td className="border-b border-gray-100 px-4 py-3 text-center">
                                  {index + 1}
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3 text-center">
                                  {student.name}
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3 text-center">
                                  {student.id}
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3 text-center">
                                  {editableRow === index ? (
                                    <input
                                      type="number"
                                      value={editedScore}
                                      onChange={(e) =>
                                        setEditedScore(e.target.value)
                                      }
                                      className="border-b border-gray-100 rounded px-2 py-1 w-16 text-center"
                                    />
                                  ) : (
                                    student.score
                                  )}
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3 text-center cursor-pointer">
                                  {editableRow === index ? (
                                    <Check
                                      className="text-green-500 w-5 h-5"
                                      onClick={() => handleSaveClick(index)}
                                    />
                                  ) : (
                                    <PenLine
                                      className="text-[#80ADCB] w-5 h-5"
                                      onClick={() =>
                                        handleEditClick(index, student.score)
                                      }
                                    />
                                  )}
                                </td>
                              </tr>
                            );
                          })}
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
                </div>
              </div>
            )}
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
                    Upload Score
                  </h2>
                </div>
                <div className="float-right">
                  <button
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                    onClick={() => {
                      setIsAnimating(false);
                      setTimeout(() => setIsModalOpen(false), 100);
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
                  className="border-2 border-gray-200 rounded p-2 max-w-sm bg-gray-200"
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

export default AcademicRecord;
