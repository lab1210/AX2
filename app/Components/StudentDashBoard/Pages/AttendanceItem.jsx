"use client";
import React, { useState } from "react";
import Layout from "../../../Components/Studentlayout";
import { useUser } from "../../../context/UserProvider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import WeeklyReportCard from "../WeeklyReportCard";

export default function AttendancePage() {
  // Example data
  const classAttendance = [
    {
      id: 1,
      subject: "Physics",
      noOfClasses: 12,
      timesPresent: 11,
      percentage: "91.7%",
    },
    {
      id: 2,
      subject: "Mathematics",
      noOfClasses: 13,
      timesPresent: 12,
      percentage: "92.3%",
    },
    {
      id: 3,
      subject: "English",
      noOfClasses: 10,
      timesPresent: 9,
      percentage: "90%",
    },
    {
      id: 4,
      subject: "Chemistry",
      noOfClasses: 12,
      timesPresent: 10,
      percentage: "83.3%",
    },
    {
      id: 5,
      subject: "Biology",
      noOfClasses: 12,
      timesPresent: 7,
      percentage: "58.3%",
    },
    {
      id: 6,
      subject: "Chemistry",
      noOfClasses: 12,
      timesPresent: 7,
      percentage: "60%",
    },
    {
      id: 7,
      subject: "Civic Education",
      noOfClasses: 12,
      timesPresent: 7,
      percentage: "68.3%",
    },
    {
      id: 8,
      subject: "Home Economics",
      noOfClasses: 12,
      timesPresent: 11,
      percentage: "98.3%",
    },
    {
      id: 9,
      subject: "Basic Science",
      noOfClasses: 12,
      timesPresent: 4,
      percentage: "38.3%",
    },
    {
      id: 10,
      subject: "Business Studies",
      noOfClasses: 12,
      timesPresent: 7,
      percentage: "58.3%",
    },
    {
      id: 11,
      subject: "Commerce",
      noOfClasses: 12,
      timesPresent: 7,
      percentage: "68.3%",
    },
    {
      id: 12,
      subject: "Government",
      noOfClasses: 12,
      timesPresent: 7,
      percentage: "58.3%",
    },
    {
      id: 13,
      subject: "Yoruba",
      noOfClasses: 12,
      timesPresent: 10,
      percentage: "78.3%",
    },
    {
      id: 14,
      subject: "French",
      noOfClasses: 12,
      timesPresent: 7,
      percentage: "58.3%",
    },
    {
      id: 15,
      subject: "Cultural and Creative Arts",
      noOfClasses: 12,
      timesPresent: 7,
      percentage: "68.3%",
    },
  ];

  const { isLoading } = useUser();
  const [activeTab, setActiveTab] = useState ("calendar");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(classAttendance.length / itemsPerPage);
  const paginatedAttendance = classAttendance.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageChange = (page) => setCurrentPage(page);

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex justify-center items-center z-[1000]">
        <div className="border-4 border-[rgba(0,64,128,1)] border-t-[rgba(249,65,68,1)] rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <Layout>
      {/* Desktop View */}
      <div className="hidden lg:block min-h-screen bg-gray-100 p-8 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Assembly Calendar */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-center text-lg font-semibold text-gray-800 mb-4">
              Assembly Attendance Summary
            </h2>
            <div className="border border-gray-300 mb-4">
              <div className="flex justify-center items-center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateCalendar"]}>
                  <DemoItem>
                    <DateCalendar readOnly />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
              </div>
            </div>
            <div className="text-sm font-semibold space-y-2 text-black">
              <p>
                <span className="inline-block w-3 h-3 rounded bg-red-500 mr-2" />
                Missed Classes
              </p>
              <p>
                <span className="inline-block w-3 h-3 rounded bg-gray-800 mr-2" />
                Absent
              </p>
            </div>
          </div>

          {/* Attendance Overview & Eligibility */}
          <div className="bg-[#d9d9d9] rounded-lg p-6 flex flex-col items-center gap-6">
            <p className="text-2xl font-bold text-center">
              Attendance Overview
            </p>
            <div className="flex gap-6 w-full">
              <div className="flex-1 bg-white rounded-2xl shadow p-6 text-center">
                <p className="text-5xl font-bold text-[#390181]">3</p>
                <h3 className="text-sm font-medium text-black">
                  Assembly Days Missed
                </h3>
              </div>
              <div className="flex-1 bg-white rounded-2xl shadow p-6 text-center">
                <p className="text-5xl font-bold text-[#F94144]">4</p>
                <h3 className="text-sm font-medium text-black">
                  Class Days Missed
                </h3>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 text-center w-full">
              <h3 className="text-sm font-medium text-black mb-2">You are</h3>
              <div className="text-5xl font-bold text-green-600 mb-1">70%</div>
              <p className="text-lg font-semibold text-gray-800">
                eligible for the midterm test
              </p>
            </div>
          </div>
        </div>

        {/* Class Attendance Table */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-center text-lg font-semibold text-gray-800 mb-4">
            Class Attendance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-black border-collapse">
              <thead className="bg-[#80ADCB] text-white">
                <tr>
                  <th className="py-2 px-4">S/N</th>
                  <th className="py-2 px-4">Subject</th>
                  <th className="py-2 px-4">No. of Classes</th>
                  <th className="py-2 px-4">Times Present</th>
                  <th className="py-2 px-4">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAttendance.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="py-2 px-4">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="py-2 px-4">{item.subject}</td>
                    <td className="py-2 px-4">{item.noOfClasses}</td>
                    <td className="py-2 px-4">{item.timesPresent}</td>
                    <td className="py-2 px-4">{item.percentage}</td>
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
      </div>

      {/* Mobile/Tablet Version */}
      <div className="block lg:hidden bg-white h-full overflow-auto">
        {/* Attendance Overview Card */}
        <div>
          <WeeklyReportCard
            eligibility={70}
            missedAssembly={3}
            missedClass={4}
          />
        </div>

        {/* Tabs */}
        <div className="flex justify-center mt-6 mb-2 space-x-8">
          <button
            className={`text-sm font-bold pb-1 border-b-2 ${
              activeTab === "calendar"
                ? "border-[#FFA500] text-[#01427A]"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("calendar")}
          >
            Calendar
          </button>
          <button
            className={`text-sm font-bold pb-1 border-b-2 ${
              activeTab === "table"
                ? "border-[#FFA500] text-[#01427A]"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("table")}
          >
            Table
          </button>
        </div>

        {/* Calendar View */}
        {activeTab === "calendar" && (
          <div className="p-4">
            <div className="bg-white rounded-xl shadow p-4 flex justify-center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateCalendar"]}>
                  <DemoItem>
                    <DateCalendar readOnly />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </div>
            {/* Legend */}
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2 bg-[#F94144]/10 border border-[#F94144] rounded px-2 py-1">
                <span className="w-3 h-3 bg-[#F94144] rounded-full"></span>
                <span className="text-xs font-semibold text-[#F94144]">
                  Absent
                </span>
                <span className="ml-auto text-xs font-bold text-[#F94144]">
                  02
                </span>
              </div>
              <div className="flex items-center gap-2 bg-[#008000]/10 border border-[#008000] rounded px-2 py-1">
                <span className="w-3 h-3 bg-[#008000] rounded-full"></span>
                <span className="text-xs font-semibold text-[#008000]">
                  Festival & Holidays
                </span>
                <span className="ml-auto text-xs font-bold text-[#008000]">
                  01
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Table View */}
        {activeTab === "table" && (
          <div className="bg-[#01427A] rounded-xl shadow p-4 mx-4 mt-4">
            <div className="text-center text-white font-semibold mb-3">
              Class Attendance
            </div>
            <div className="bg-white rounded-xl p-2 overflow-x-auto mb-6">
              <table className="w-full text-left text-xs text-black border-collapse">
                <thead className="bg-[#EDF0F3] text-[#01427A]">
                  <tr>
                    <th className="py-2 px-2">Subject</th>
                    <th className="py-2 px-2">No. of Classes</th>
                    <th className="py-2 px-2">Times Present</th>
                    <th className="py-2 px-2">%</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAttendance.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 px-2">{item.subject}</td>
                      <td className="py-2 px-2">{item.noOfClasses}</td>
                      <td className="py-2 px-2">{item.timesPresent}</td>
                      <td className="py-2 px-2">{item.percentage}</td>
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
        )}
      </div>
    </Layout>
  );
}
