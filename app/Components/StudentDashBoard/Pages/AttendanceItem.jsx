"use client";
import React from "react";
import Layout from "../../../Components/Studentlayout";
import { useUser } from "../context/UserProvider";

export default function AttendancePage() {
  // Example data
  const classAttendance = [
    { id: 1, subject: "Physics", noOfClasses: 12, timesPresent: 11, percentage: "91.7%" },
    { id: 2, subject: "Mathematics", noOfClasses: 13, timesPresent: 12, percentage: "92.3%" },
    { id: 3, subject: "English", noOfClasses: 10, timesPresent: 9, percentage: "90%" },
    { id: 4, subject: "Chemistry", noOfClasses: 12, timesPresent: 10, percentage: "83.3%" },
    { id: 5, subject: "Biology", noOfClasses: 12, timesPresent: 7, percentage: "58.3%" },
  ];

  const { isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-full z-[1000]">
        <div className="border-4 border-[rgba(0,64,128,1)] border-t-[rgba(249,65,68,1)] rounded-full w-[50px] h-[50px] animate-spin"></div>
      </div>
    );
  }
  return (
    <Layout>
    <div className="h-screen bg-gray-100 p-4 md:p-8">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">
            Assembly attendance summary
          </h2>
          <div className="border border-gray-300 rounded p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 text-center">
                April 2025
              </h3>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-black">
              <div className="font-semibold">S</div>
              <div className="font-semibold">M</div>
              <div className="font-semibold">T</div>
              <div className="font-semibold">W</div>
              <div className="font-semibold">T</div>
              <div className="font-semibold">F</div>
              <div className="font-semibold">S</div>
              {[...Array(30)].map((_, idx) => (
                <div
                  key={idx}
                  className="w-6 h-6 flex items-center text-center justify-center rounded hover:bg-gray-100 cursor-pointer"
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="text-sm text-black font-semibold space-y-1">
            <p>
              <span className="inline-block w-3 h-3 rounded bg-red-500 mr-2"></span>
              missed classes
            </p>
            <p>
              <span className="inline-block w-3 h-3 rounded bg-gray-800 mr-2"></span>
              absent
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-[#d9d9d9] items-center p-4 rounded-lg">
        <p className="text-2xl font-bold"> Attendance Overview </p> 
          <div className="flex gap-4">
            <div className="flex-1 bg-white rounded-2xl shadow-lg shadow-gray-500/50 p-4 text-center">
            <p className="text-5xl font-bold text-[#390181]">3</p>
              <h3 className="text-sm font-medium text-black">
                Assembly days missed
              </h3>
            </div>
            <div className="flex-1 bg-white rounded-2xl shadow-lg shadow-gray-500/50 p-4 text-center">
            <p className="text-5xl font-bold text-[#F94144]">4</p>
              <h3 className="text-sm font-medium text-black">
                Class days missed
              </h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-500/50 p-4 flex items-center justify-between">
            <div className="text-center">
              <h3 className="text-sm font-medium text-black">You are</h3>
            <div className="text-5xl font-bold text-[#008000]">70%</div>
              <p className="text-lg font-semibold text-gray-800">
                eligible for the midterm test
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg text-center font-semibold text-gray-800 mb-4">
          Class attendance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-black border-collapse">
            <thead className="bg-[#80ADCB] text-white">
              <tr>
                <th className="py-2 px-4 font-medium">S/N</th>
                <th className="py-2 px-4 font-medium">Subject</th>
                <th className="py-2 px-4 font-medium">No. of Classes</th>
                <th className="py-2 px-4 font-medium">Times present</th>
                <th className="py-2 px-4 font-medium">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {classAttendance.map((item, index) => (
                <tr key={item.id}>
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{item.subject}</td>
                  <td className="py-2 px-4">{item.noOfClasses}</td>
                  <td className="py-2 px-4">{item.timesPresent}</td>
                  <td className="py-2 px-4 text-gray-800">
                    {item.percentage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </Layout>
  );
}
