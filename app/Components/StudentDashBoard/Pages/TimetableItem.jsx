"use client";
import React, { useState } from "react";
import Layout from "../../../Components/Studentlayout";
import { useUser } from "../context/UserProvider";
import lunchImg from "@/public/LunchImg.png";

export default function TimetablePage() {
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
    Monday: [
      "ENG LANG",
      "MATH",
      "BREAK",
      "PHYSICS",
      "BIOLOGY",
      "LUNCH",
      "GOVT",
      "GEO",
      "CHEMISTRY",
      "FUR MATH",
      "LIT",
    ],
    Tuesday: [
      "HIST",
      "FUR MATH",
      "BREAK",
      "CHEMISTRY",
      "CIVIC",
      "LUNCH",
      "ECONS",
      "DATA PROCESSING",
      "FUR MATH",
      "LIT",
      "MATH",
    ],
    Wednesday: [
      "MATH",
      "ENG LIT",
      "BREAK",
      "FRENCH",
      "GEO",
      "LUNCH",
      "BIO PRACT",
      "CHEM PRACT",
      "PHYS PRACT",
      "CHEM PRACT",
      "BIO PRACT",
    ],
    Thursday: [
      "FUR MATH",
      "BIO PRACT",
      "BREAK",
      "CHEM PRACT",
      "PHYS PRACT",
      "LUNCH",
      "ENG LANG",
      "MATH",
      "GOVT",
      "GEO",
      "CHEMISTRY",
    ],
    Friday: [
      "GEO PRACT",
      "CHEM TUTORIAL",
      "BREAK",
      "FREE STUDY",
      "PHYS TUTORIAL",
      "LUNCH",
      "CLASS FINAL",
    ],
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [activeIndex, setActiveIndex] = useState(0);
  const teachers = {
    Monday: [
      "Mr A",
      "Mrs B",
      "",
      "Mr D",
      "Ms E",
      "",
      "Mr G",
      "Ms H",
      "Mr I",
      "Ms J",
      "Mr K",
    ],
    Tuesday: [
      "Ms L",
      "Mr M",
      "",
      "Ms O",
      "Mr P",
      "",
      "Ms R",
      "Mr S",
      "Mr T",
      "Ms U",
      "Mr V",
    ],
    Wednesday: [
      "Mr W",
      "Ms X",
      "",
      "Mr Z",
      "Ms A",
      "",
      "Mr C",
      "Ms D",
      "Mr E",
      "Ms F",
      "Mr G",
    ],
    Thursday: [
      "Ms H",
      "Mr I",
      "",
      "Ms K",
      "Mr L",
      "",
      "Ms N",
      "Mr O",
      "Ms P",
      "Ms Q",
      "Ms R",
    ],
    Friday: ["Mr S", "Ms T", "", "", "Mr V", "", "", "", "", ""],
  };
  const locations = {
    Monday: [
      "Rm 101",
      "Rm 102",
      "",
      "Lab 1",
      "Rm 103",
      "",
      "Rm 104",
      "Rm 105",
      "Rm 106",
      "Rm 107",
      "Rm 108",
    ],
    Tuesday: [
      "Rm 201",
      "Rm 202",
      "",
      "Lab 2",
      "Rm 203",
      "",
      "Rm 204",
      "Rm 205",
      "Rm 206",
      "Rm 207",
      "Rm 208",
    ],
    Wednesday: [
      "Rm 301",
      "Rm 302",
      "",
      "Lab 3",
      "Rm 303",
      "",
      "Rm 304",
      "Rm 305",
      "Rm 306",
      "Rm 307",
      "Rm 308",
    ],
    Thursday: [
      "Rm 401",
      "Rm 402",
      "",
      "Lab 4",
      "Rm 403",
      "",
      "Rm 404",
      "Rm 405",
      "Rm 406",
      "Rm 407",
      "Rm 408",
    ],
    Friday: ["Rm 501", "Rm 502", "", "", "Rm 503", "", "", "", "", "", ""],
  };
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
      <div className="hidden lg:block min-h-screen bg-gray-100 p-4 pr-10 pl-6 flex-col rounded-lg">
        {/* Header Card */}
        <div className=" bg-white rounded-lg p-6 pt-3 pb-3 mb-6 shadow xl:w-fit min-w-full">
          <h1 className="text-lg  md:text-xl font-bold text-gray-800">
            2023/2024 SS1 1st Term Timetable
          </h1>
        </div>

        <div className="w-full no-scrollbar">
          <table className="w-full table-fixed text-gray-800">
            <thead>
              <tr>
                <th className="py-1 px-1 bg-[#69577d] text-white font-semibold"></th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="py-1 px-1  bg-[#69577d] text-white font-semibold"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="py-1 px-4 text-white bg-[#69577d] font-bold items-center text-center ">
                    {time}
                  </td>
                  {days.map((day) => {
                    const content = schedule[day][rowIndex];
                    const isNoContent = !content || content.trim() === "";
                    const cellClassName = `py-1 px-1  text-center text-xs font-semibold  ${
                      isNoContent
                        ? "bg-[#69577d] border-0"
                        : "bg-white border-[1.3px] border-black/80 border-l"
                    }`;
                    return (
                      <td key={`${day}-${rowIndex}`} className={cellClassName}>
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── mobile/tablet only ─── */}
      <div className="block lg:hidden p-4 bg-white rounded-lg">
        <div className="relative mb-4 h-10 rounded-full overflow-hidden border border-black">
          <div
            className="absolute top-0 left-0 h-full w-1/5 bg-[#4169E1] rounded-full transition-transform duration-300"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
          <div className="relative z-10 flex h-full">
            {days.map((d, idx) => (
              <button
                key={d}
                onClick={() => setActiveIndex(idx)}
                className={`
                  flex-1 
                  text-xs 
                  md:text-sm
                  font-semibold 
                  transition-colors 
                  ${activeIndex === idx ? "text-white" : "text-gray-700"}
                 `}
              >
                {d.slice(0, 3).toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {schedule[days[activeIndex]].map((subject, i) => {
            const start = times[i];
            const end = times[i + 1] || "";

            const isLunch = subject.toLowerCase().includes("lunch");
            const status = isLunch
              ? ""
              : i === 0
              ? "ongoing"
              : Math.random() < 0.1
              ? "cancelled"
              : "";

            let baseClasses = "rounded-lg p-4 flex justify-between items-start";
            if (status === "cancelled") baseClasses += " ring-1 ring-red-400";
            else if (status === "ongoing")
              baseClasses += " bg-[#004080] text-white";
            else baseClasses += " bg-[#F9F9F9] border border-[#EBEBEB]";

            return (
              <div key={i} className={baseClasses}>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3
                      className={`font-bold ${
                        status === "ongoing" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {subject}
                    </h3>
                    <div className="flex flex-col items-end">
                      {!isLunch && (
                        <p className="text-gray-400 text-xs md:text-sm font-semibold">
                          {locations[days[activeIndex]][i]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* time and status side-by-side */}
                  <div className="flex justify-between items-center mt-1">
                    <span
                      className={`${
                        status === "ongoing" ? "text-white" : "text-black"
                      } text-xs md:text-sm`}
                    >
                      {start} - {end}
                    </span>
                    {status && (
                      <span
                        className={`text-xs md:text-sm font-semibold ${
                          status === "cancelled"
                            ? "text-red-500"
                            : "text-blue-200"
                        }`}
                      >
                        {status}
                      </span>
                    )}
                  </div>

                  {/* full-width border-top section for teacher & period */}
                  {!isLunch && (
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-gray-400 text-xs md:text-sm">
                        Teacher: {teachers[days[activeIndex]][i]}
                      </span>
                      <span className="text-gray-400 text-xs md:text-sm">
                        Period {i + 1}
                      </span>
                    </div>
                  )}
                  {/* RIGHT: location or lunch image */}
                  <div className="flex flex-col items-end">
                    {isLunch && (
                      <img
                        src={lunchImg.src}
                        alt="Lunch"
                        className="w-20 h-20 object-contain"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
