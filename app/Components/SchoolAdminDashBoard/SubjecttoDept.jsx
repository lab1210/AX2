"use client";
import React, { useState } from "react";
import Dropdown from "./DropDown";
import MultiDropdown from "./MultiDropDown";

import { FiEdit3, FiTrash2 } from "react-icons/fi";

const SubjecttoDept = () => {
  const [classList, setClassList] = useState([
    {
      Department: "Department 1",
      Subject: ["Mathematics", "Science"],
    },
    {
      Department: "Department 2",
      Subject: ["English", "History"],
    },
    {
      Department: "Department 3",
      Subject: ["Science", "Art"],
    },
  ]);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [selectedClass, setSelectedClass] = useState(null);
  const [editClassVisible, setEditClassVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [formData, setFormData] = useState([
    {
      Department: "",
      Subject: [],
    },
  ]);

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
      (item) => item.Teacher === formData.Teacher
    );

    if (!editClassVisible && existingClass) {
      setMessage("Department Assignment already exists.");
      setMessageType("error");
      return;
    }

    if (editClassVisible && selectedClass) {
      const updatedList = classList.map((item) =>
        item.Class === selectedClass.Teacher ? selectedClass : item
      );
      setMessage("Department Assignment updated successfully.");
      setMessageType("success");
      setEditClassVisible(false);
      setSelectedClass(null);
    } else {
      setClassList((prev) => [...prev, formData]);
      setMessage("Department Assignment added successfully.");
      setMessageType("success");
      setFormData({
        Department: "",
        Subject: [],
      });
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleEdit = (Teacher) => {
    setEditClassVisible(true);
    setSelectedClass({ ...Teacher });
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
            Assign Subject to Department
          </p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            {editClassVisible ? "Save" : "Assign"}
          </button>
        </div>
        <div className="pl-6 pr-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-x-2 ">
              <label className="text-[0.88rem] text-[#5E6A72]">Subject:</label>
              <MultiDropdown
                label="Select Subject (s)"
                selectedItems={
                  editClassVisible
                    ? selectedClass.Subject || []
                    : formData.Subject
                }
                onSelect={(selected) =>
                  editClassVisible
                    ? setSelectedClass((prev) => ({
                        ...prev,
                        Subject: selected,
                      }))
                    : setFormData((prev) => ({
                        ...prev,
                        Subject: selected,
                      }))
                }
                items={[
                  { label: "Mathematics" },
                  { label: "English" },
                  { label: "Science" },
                  { label: "Art" },
                  { label: "History" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-x-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Department:
              </label>
              <Dropdown
                label={
                  editClassVisible
                    ? selectedClass.Department
                    : formData.Department || "Select Department"
                }
                items={[
                  {
                    label: "Department 1",
                    onClick: () =>
                      editClassVisible
                        ? setSelectedClass((prev) => ({
                            ...prev,
                            Department: "Department 1",
                          }))
                        : setFormData((prev) => ({
                            ...prev,
                            Department: "Department 1",
                          })) || "",
                  },

                  {
                    label: "Department 2",
                    onClick: () =>
                      editClassVisible
                        ? setSelectedClass((prev) => ({
                            ...prev,
                            Department: "Department 2",
                          }))
                        : setFormData((prev) => ({
                            ...prev,
                            Department: "Department 2",
                          })) || "",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </form>
      <hr />
      <div className="flex-shrink-0">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Assigned Subject (s) to Department.
        </p>
      </div>
      <div className="px-0">
        <div className="overflow-y-auto max-h-[200px] no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-16 bg-[#EDF0F3]">Subject (s)</th>
                  <th className="p-2 bg-[#EDF0F3]">Department</th>
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
                    No Data Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={index}>
                    <td className="p-2 pl-16">{item.Subject?.join(",")}</td>
                    <td>{item.Department}</td>
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

export default SubjecttoDept;
