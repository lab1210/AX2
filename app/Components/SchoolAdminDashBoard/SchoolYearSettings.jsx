"use client";
import React, { useState } from "react";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import Dropdown from "./DropDown";
const SchoolYearSettings = () => {
  const [schoolYearList, setSchoolYearList] = useState([
    {
      "Academic Session": "2023/2024 Academic Year",
      "Start Date": "2023-01-01",
      "End Date": "2023-12-31",
      Status: "Active",
    },
    {
      "Academic Session": "2022/2023 Academic Year",
      "Start Date": "2022-01-01",
      "End Date": "2022-12-31",
      Status: "Inactive",
    },
    {
      "Academic Session": "2021/2022 Academic Year",
      "Start Date": "2021-01-01",
      "End Date": "2021-12-31",
      Status: "Inactive",
    },
  ]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const [selectedYear, setSelectedYear] = useState(null);
  const [editYearVisible, setEditYearVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const [formData, setFormData] = useState({
    "Academic Session": "",
    "Start Date": "",
    "End Date": "",
    Status: "",
  });

  const paginatedData = schoolYearList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(schoolYearList.length / itemsPerPage);
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingSession = schoolYearList.find(
      (item) => item["Academic Session"] === formData["Academic Session"]
    );

    if (!editYearVisible && existingSession) {
      setMessage("Academic session already exists.");
      setMessageType("error");
      return;
    }

    if (editYearVisible && selectedYear) {
      const updatedList = schoolYearList.map((item) =>
        item["Academic Session"] === selectedYear["Academic Session"]
          ? selectedYear
          : item
      );
      setSchoolYearList(updatedList);
      setMessage("Academic year updated successfully.");
      setMessageType("success");
      setEditYearVisible(false);
      setSelectedYear(null);
    } else {
      setSchoolYearList((prev) => [...prev, formData]);
      setMessage("Academic year added successfully.");
      setMessageType("success");
      setFormData({
        "Academic Session": "",
        "Start Date": "",
        "End Date": "",
        Status: "",
      });
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleEdit = (year) => {
    setEditYearVisible(true);
    setSelectedYear({ ...year });
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

      <form onSubmit={handleSubmit} className="mb-3 flex-shrink-0">
        <div className="flex pt-3 pl-6 pr-6 justify-between mb-2 ">
          <p className="font-bold text-[#07508F]">
            {editYearVisible ? "Edit Academic Year" : "Set New Academic Year"}
          </p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            {editYearVisible ? "Save" : "Set"}
          </button>
        </div>
        <div className="pl-6 pr-6">
          <div className={`${editYearVisible ? "grid grid-cols-2 gap-6" : ""}`}>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Academic Session:
              </label>
              <input
                type="text"
                placeholder="Enter Academic Session"
                value={
                  editYearVisible
                    ? selectedYear["Academic Session"]
                    : formData["Academic Session"] || ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  editYearVisible
                    ? setSelectedYear((prev) => ({
                        ...prev,
                        "Academic Session": value,
                      }))
                    : setFormData((prev) => ({
                        ...prev,
                        "Academic Session": value,
                      }));
                }}
                className="focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-2 p-1.5 text-sm rounded-sm border-[#B6B6B6]"
                required
              />
            </div>
            {editYearVisible && (
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Status:</label>
                <Dropdown
                  label={selectedYear.Status}
                  items={[
                    {
                      label: "Active",
                      onClick: () =>
                        setSelectedYear(
                          { ...selectedYear, Status: "Active" } || ""
                        ),
                    },
                    {
                      label: "Inactive",
                      onClick: () =>
                        setSelectedYear(
                          {
                            ...selectedYear,
                            Status: "Inactive",
                          } || ""
                        ),
                    },
                  ]}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Start Date:
              </label>
              <input
                type="date"
                placeholder="Start Date"
                value={
                  editYearVisible
                    ? selectedYear["Start Date"]
                    : formData["Start Date"] || ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  editYearVisible
                    ? setSelectedYear((prev) => ({
                        ...prev,
                        "Start Date": value,
                      }))
                    : setFormData((prev) => ({ ...prev, "Start Date": value }));
                }}
                className="text-sm text-[#B6B6B6] border-2 p-1.5 rounded-sm border-[#B6B6B6] focus:outline-[#0071E3]"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.88rem] text-[#5E6A72]">End Date:</label>
              <input
                type="date"
                placeholder="End Date"
                value={
                  editYearVisible
                    ? selectedYear["End Date"]
                    : formData["End Date"] || ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  editYearVisible
                    ? setSelectedYear((prev) => ({
                        ...prev,
                        "End Date": value,
                      }))
                    : setFormData((prev) => ({ ...prev, "End Date": value }));
                }}
                className="text-sm text-[#B6B6B6] border-2 p-1.5 rounded-sm border-[#B6B6B6] focus:outline-[#0071E3]"
                required
              />
            </div>
          </div>
        </div>
      </form>
      <hr />
      <div className="flex-shrink-0">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Academic Year
        </p>
      </div>
      <div className="px-0">
        <div className="overflow-y-auto max-h-[200px] no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData.length === 0 && (
              <thead className="bg-[#EDF0F3] text-left sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-6 bg-[#EDF0F3]">Academic Session</th>
                  <th className="p-2 bg-[#EDF0F3]">Start Date</th>
                  <th className="p-2 bg-[#EDF0F3]">End Date</th>
                  <th className="p-2 bg-[#EDF0F3]">Status</th>
                  <th className="p-2 bg-[#EDF0F3]">Actions</th>
                </tr>
              </thead>
            )}
            <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="p-5  text-center border text-gray-500"
                  >
                    No Classes Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={index}>
                    <td className="p-2 pl-6">{item["Academic Session"]}</td>
                    <td className="p-2">{item["Start Date"]}</td>
                    <td className="p-2">{item["End Date"]}</td>
                    <td className="p-2">
                      <span
                        className={`${
                          item.Status === "Active"
                            ? "bg-[#E8F8F0] text-[#1BB66E]"
                            : "bg-[#FEECEC] text-[#F94144]"
                        } rounded-2xl py-1 font-bold`}
                        style={{
                          minWidth: "70px",
                          display: "inline-block",
                          textAlign: "center",
                        }}
                      >
                        {item.Status}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-4">
                        <FiEdit3
                          onClick={() => handleEdit(item)}
                          className="text-[#80ADCB] cursor-pointer"
                          size={15}
                        />
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
        </div>

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
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#EDF0F3]"
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolYearSettings;
