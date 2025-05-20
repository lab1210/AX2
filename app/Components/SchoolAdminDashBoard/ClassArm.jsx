"use client";
import React, { useState } from "react";
import Dropdown from "./DropDown";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

const ClassArm = () => {
  const [classList, setClassList] = useState([
    {
      "Class Arm": "Joy",
      Class: "JSS1",
    },
    {
      "Class Arm": "Joy",
      Class: "JSS2",
    },
    {
      "Class Arm": "Joy",
      Class: "JSS3",
    },
    {
      "Class Arm": "Joy",
      Class: "SS1",
    },
  ]);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [selectedClass, setSelectedClass] = useState(null);
  const [editClassVisible, setEditClassVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [formData, setFormData] = useState({
    Class: "",
    "Class Arm": "",
  });

  const paginatedData = classList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(classList.length / itemsPerPage);
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingClass = classList.find(
      (item) => item["Class Arm"] === formData["Class Arm"]
    );

    if (!editClassVisible && existingClass) {
      setMessage("Class Arm already exists.");
      setMessageType("error");
      return;
    }

    if (editClassVisible && selectedClass) {
      const updatedList = classList.map((item) =>
        item.Class === selectedClass.Class ? selectedClass : item
      );
      setClassList(updatedList);
      setMessage("Class Arm updated successfully.");
      setMessageType("success");
      setEditClassVisible(false);
      setSelectedClass(null);
    } else {
      setClassList((prev) => [...prev, formData]);
      setMessage("Class Arm added successfully.");
      setMessageType("success");
      setFormData({
        Class: "",
        "Class Arm": "",
      });
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleEdit = (Class) => {
    setEditClassVisible(true);
    setSelectedClass({ ...Class });
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
            {editClassVisible ? "Edit Class Arm" : "Set Class Arm"}
          </p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            {editClassVisible ? "Save" : "Set"}
          </button>
        </div>
        <div className="pl-6 pr-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Class:</label>
              <Dropdown
                label={
                  editClassVisible
                    ? selectedClass.Class
                    : formData.Class || "Select Class"
                }
                items={[
                  {
                    label: "JSS1",
                    onClick: () =>
                      editClassVisible
                        ? setSelectedClass((prev) => ({
                            ...prev,
                            Class: "JSS1",
                          }))
                        : setFormData((prev) => ({
                            ...prev,
                            Class: "JSS1",
                          })) || "",
                  },

                  {
                    label: "JSS2",
                    onClick: () =>
                      editClassVisible
                        ? setSelectedClass((prev) => ({
                            ...prev,
                            Class: "JSS2",
                          }))
                        : setFormData((prev) => ({
                            ...prev,
                            Class: "JSS2",
                          })) || "",
                  },
                ]}
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Class Arm:
              </label>
              <input
                type="text"
                placeholder="Enter Class Arm"
                value={
                  editClassVisible
                    ? selectedClass["Class Arm"]
                    : formData["Class Arm"] || ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  editClassVisible
                    ? setSelectedClass((prev) => ({
                        ...prev,
                        "Class Arm": value,
                      }))
                    : setFormData((prev) => ({
                        ...prev,
                        "Class Arm": value,
                      }));
                }}
                className="focus:outline-[#0071E3] sm:placeholder:text-xs sm:text-xs lg:placeholder:text-sm placeholder:text-[#B6B6B6] border-2 p-1.5 lg:text-sm rounded-sm border-[#B6B6B6]"
                required
              />
            </div>
          </div>
        </div>
      </form>
      <hr />
      <div className="flex-shrink-0">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Class Arm
        </p>
      </div>
      <div className="px-0">
        <div className="overflow-y-auto max-h-[200px] no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-12 bg-[#EDF0F3]">Class</th>
                  <th className="p-2 bg-[#EDF0F3]">Class Arm</th>
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
                    No Class Arms Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={index}>
                    <td className="p-2 pl-12">{item.Class}</td>
                    <td className="p-2">{item["Class Arm"]}</td>
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

export default ClassArm;
