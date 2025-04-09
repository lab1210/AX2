"use client";
import React from "react";
import Layout from "../../../Components/Studentlayout"; 
import { useUser } from "../context/UserProvider";

export default function TimetablePage() {
  // Example time slots
  const times = [
    "09:00",
    "09:40",
    "10:20",
    "11:00",
    "11:15",
    "11:55",
    "12:35",
    "13:15",
    "14:00",
    "14:40",
    "15:20",
  ];

  const schedule = {
    Monday: ["ENG LANG", "MATH", "BREAK", "PHYSICS", "BIOLOGY", "LUNCH", "GOVT", "GEO", "CHEMISTRY", "FUR MATH", "LIT"],
    Tuesday: ["HIST", "FUR MATH", "BREAK", "CHEMISTRY", "CIVIC", "LUNCH", "ECONS", "DATA PROCESSING", "FUR MATH", "LIT", "MATH"],
    Wednesday: ["MATH", "ENG LIT", "BREAK", "FRENCH", "GEO", "LUNCH", "BIO PRACT", "CHEM PRACT", "PHYS PRACT", "CHEM PRACT", "BIO PRACT"],
    Thursday: ["FUR MATH", "BIO PRACT", "BREAK", "CHEM PRACT", "PHYS PRACT", "LUNCH", "ENG LANG", "MATH", "GOVT", "GEO", "CHEMISTRY"],
    Friday: ["GEO PRACT", "CHEM TUTORIAL", "BREAK", "FREE STUDY", "PHYS TUTORIAL", "LUNCH", "CLASS FINAL"],
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-full z-[1000]">
        <div className="border-4 border-[rgba(0,64,128,1)] border-t-[rgba(249,65,68,1)] rounded-full w-[50px] h-[50px] animate-spin"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="h-screen bg-gray-100 p-4 flex flex-col items-center">
        {/* Header Card */}
        <div className="w-full max-w-4xl bg-white rounded-md p-6 mb-6 shadow">
          <h1 className="text-lg lg:text-2xl md:text-xl font-bold text-gray-800">
            2023/2024 SS1 1st Term Timetable
          </h1>
        </div>

        {/* Timetable Container */}
        <div className="w-full max-w-4xl overflow-x-auto">
          <div className=" p-2 rounded-md shadow">
            <table className="w-full table-auto text-md text-gray-800">
              <thead>
                <tr>
                  {/* Empty corner cell */}
                  <th className="py-2 px-4 bg-[#69577d] text-white font-semibold"></th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="py-2 px-4  bg-[#69577d] text-white font-semibold"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {times.map((time, rowIndex) => (
                  <tr key={rowIndex}>

                    <td className="py-2 px-4 text-white bg-[#69577d] font-bold items-center">
                      {time}
                    </td>
                    {/* Day columns */}
                    {days.map((day) => (
                      <td
                        key={`${day}-${rowIndex}`}
                        className="py-2 px-4 border border-gray-300 bg-white text-center border-l"
                      >
                        {schedule[day][rowIndex]}
                      </td>
                    ))}
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
