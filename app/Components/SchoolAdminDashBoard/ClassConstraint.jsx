"use client";
import React, { use, useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import Dropdown from "./DropDown";
import { getClass } from "@/Service/schoolConfig";

const ClassConstraint = ({ itemsperpage }) => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [currentPage, setCurrentPage] = useState(1);
  const [classYear, setClassYear] = useState([]);
  const [formData, setFormData] = useState({
    class: "",
    days: "",
    period: "",
    reason: "",
  });

  const Global = [
    {
      id: 1,
      class: "jss1",
      days: "Monday",
      period: "1",
      reason: "No Class",
    },
    {
      id: 2,
      class: "jss2",
      days: "Tuesday",
      period: "2",
      reason: "No Class",
    },
    {
      id: 3,
      class: "jss3",
      days: "Wednesday",
      period: "3",
      reason: "No Class",
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

  useEffect(() => {
    const fetchClass = async () => {
      const { data, error } = await getClass();
      if (data) {
        setClassYear(data);
      } else {
        setMessage(error || "Failed to load Class years");
      }
    };
    fetchClass();
  }, []);

  const getClassYearName = (yearid) => {
    const year = classYear.find((item) => item.class_year_id === yearid);
    return year?.class_name;
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
          <p className="font-bold text-[#07508F]">Set Class Constraint</p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            Set
          </button>
        </div>
        <div className="pl-6 pr-6 mt-6 grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2 mb-2">
            <label className="text-[0.88rem] text-[#5E6A72]">Class:</label>
            <Dropdown
              label={getClassYearName(formData.class) || "Select Class"}
              items={classYear.map((t) => ({
                label: t.class_name,
                onClick: () =>
                  setFormData({
                    ...formData,
                    class: t.class_year_id,
                  }),
              }))}
            />
          </div>
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
          <div className="flex flex-col gap-2 mb-2">
            <label className="text-[0.88rem] text-[#5E6A72]">Reason:</label>
            <input
              type="text"
              name="reason"
              placeholder="State Reason"
              value={formData.reason}
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  reason: value,
                }));
              }}
              className={`${
                formData.reason !== "" ? "border-[#0071E3]" : "border-[#B6B6B6]"
              } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-2 p-1.5 text-sm rounded-sm `}
              required
            />
          </div>
        </div>
      </form>
      <hr className="mt-5  text-[#A7B9CC]/50" />
      <div className="flex-shrink-0">
        <p className="font-semibold flex justify-center mb-5 p-3 text-[#333333]">
          Existing Class Constraints
        </p>
      </div>
      <div className="px-0">
        <div className="overflow-y-auto  no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-center sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 bg-[#EDF0F3]">Class</th>
                  <th className="p-2 bg-[#EDF0F3]">Day(s)</th>
                  <th className="p-2 bg-[#EDF0F3]">Period</th>
                  <th className="p-2 bg-[#EDF0F3]">Reason</th>
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
                    <td className="p-2 text-center ">{item.class}</td>
                    <td className="p-2 text-center ">{item.days}</td>
                    <td className="p-2 text-center ">
                      {getPeriodRange(item.period)}
                    </td>
                    <td className="p-2 text-center ">{item.reason}</td>

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

export default ClassConstraint;
