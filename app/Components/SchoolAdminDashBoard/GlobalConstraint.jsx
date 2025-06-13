"use client";
import React, { use, useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import Dropdown from "./DropDown";

const GlobalConstraint = ({ itemsperpage }) => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [activeTab, setActiveTab] = useState("Break");
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    days: "",
    period: "",
  });

  const Global = [
    {
      id: 1,
      days: "Monday",
      period: "1",
    },
    {
      id: 2,
      days: "Tuesday",
      period: "2",
    },
    {
      id: 3,
      days: "Wednesday",
      period: "3",
    },
    {
      id: 4,
      days: "Thursday",
      period: "4",
    },
    {
      id: 5,
      days: "Friday",
      period: "5",
    },
    {
      id: 6,
      days: "Saturday",
      period: "6",
    },
    {
      id: 7,
      days: "Sunday",
      period: "7",
    },
  ];

  const period = [
    {
      id: 1,
      days: "Monday",
      period: "1st",
      start_time: "08:00",
      end_time: "09:30",
    },
    {
      id: 2,
      days: "Tuesday",
      period: "2nd",
      start_time: "09:30",
      end_time: "11:00",
    },
    {
      id: 3,
      days: "Wednesday",
      period: "3rd",
      start_time: "11:00",
      end_time: "12:30",
    },
    {
      id: 4,
      days: "Thursday",
      period: "4th",
      start_time: "12:30",
      end_time: "14:00",
    },
    {
      id: 5,
      days: "Friday",
      period: "5th",
      start_time: "14:00",
      end_time: "15:30",
    },
    {
      id: 6,
      days: "Saturday",
      period: "6th",
      start_time: "15:30",
      end_time: "17:00",
    },
    {
      id: 7,
      days: "Sunday",
      period: "7th",
      start_time: "17:00",
      end_time: "18:30",
    },
  ];

  //PAGINATION FOR PERIODS
  const paginatedData = Global.slice(
    (currentPage - 1) * itemsperpage,
    currentPage * itemsperpage
  );

  const totalPages = Math.ceil(Global.length / itemsperpage);
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const dayOptions = [
    { label: "Sunday", value: "Sunday" },
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
  ];

  const getPeriodRange = (id) => {
    const matched = period.find((p) => p.id.toString() === id.toString());
    return matched
      ? `${matched.start_time} - ${matched.end_time}`
      : "Not Found";
  };

  return (
    <div>
      {message && (
        <div
          className={`mx-6 mb-3 text-sm px-4 py-2 rounded-sm font-semibold ${
            messageType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
      <form className="mb-3 flex-shrink-0">
        <div className="flex pt-3 pl-6 pr-6  justify-between mb-2 ">
          <p className="font-bold text-[#07508F]">Set Global Constraint</p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            Set
          </button>
        </div>
        <div className="pt-1 mt-8 text-sm flex gap-10 pl-6 pr-2">
          {["Break", "Fellowship"].map((item, index) => {
            return (
              <div
                key={index}
                className="relative pb-1 text-center cursor-pointer "
                onClick={() => setActiveTab(item)}
              >
                <span
                  className={`${
                    activeTab === item ? "text-[#000000]" : "text-[#9C9C9C]"
                  }`}
                >
                  {item}
                </span>
                {activeTab === item && (
                  <span className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-16 h-0.5 bg-[#96B1CB] rounded-full"></span>
                )}
              </div>
            );
          })}
        </div>
        <hr className="mt-0.5" />
        <div className="pl-6 pr-6 mt-6 grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2 mb-2">
            <label className="text-[0.88rem] text-[#5E6A72]">Days:</label>
            <Dropdown
              label={formData.days || "Select Day"}
              items={dayOptions.map((item) => ({
                label: item.label,
                onClick: () =>
                  setFormData({
                    ...formData,
                    days: item.value,
                  }),
              }))}
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="text-[0.88rem] text-[#5E6A72]">Period:</label>
            <Dropdown
              label={formData.period || "Select Period"}
              items={period.map((item) => ({
                label: item.period,
                onClick: () =>
                  setFormData({
                    ...formData,
                    period: item.id,
                  }),
              }))}
            />
          </div>
        </div>
      </form>
      <hr className="mt-5  text-[#A7B9CC]/50" />
      <div className="flex-shrink-0">
        <p className="font-semibold flex justify-center mb-5 p-3 text-[#333333]">
          {activeTab === "Break"
            ? "Existing Break Period(s)"
            : "Existing Fellowship Period(s)"}
        </p>
      </div>
      <div className="px-0">
        <div className="overflow-y-auto  no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-center sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 bg-[#EDF0F3]">Day(s)</th>
                  <th className="p-2 bg-[#EDF0F3]">End Time</th>
                  <th className="p-2 bg-[#EDF0F3]">Actions</th>
                </tr>
              </thead>
            )}
            <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-5  text-center border text-gray-500"
                  >
                    No Data Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0]  border-b" key={index}>
                    <td className="p-2 text-center ">{item.days}</td>
                    <td className="p-2 text-center ">
                      {getPeriodRange(item.period)}
                    </td>

                    <td className="p-2 text-center">
                      <div className="flex items-center justify-center">
                        <FiTrash2
                          className="text-[#F94144] cursor-pointer"
                          size={15}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination controls */}
          <div className="flex justify-self-end pr-6 items-center gap-2 mt-3 text-sm text-[#01427A] font-semibold">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-2 py-1  bg-[#E6ECF2] border ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#EDF0F3]"
              }`}
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-2 py-1   text-xs ${
                  currentPage === index + 1
                    ? "bg-[#07508F] text-white"
                    : "hover:bg-[#EDF0F3] bg-[#FAFAFA]"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-2 py-1  border bg-[#E6ECF2] ${
                totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#EDF0F3]"
              }`}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalConstraint;
