"use client";
import React, { useState } from "react";
import Dropdown from "./DropDown";
import MultiDropdown from "./MultiDropDown";

import { FiEdit3, FiTrash2 } from "react-icons/fi";

const SubjectTeacherAssign = () => {
  const [classList, setClassList] = useState([
    {
      Teacher: "Mr. Adam",
      ClassArm: "Joy",
      Subject: ["Mathematics", "Science"],
    },
    {
      Teacher: "Mr. Adam",
      ClassArm: "Joy",
      Subject: ["Mathematics"],
    },
    {
      Teacher: "Mr. Adam",
      ClassArm: "Joy",
      Subject: ["Mathematics"],
    },
    {
      Teacher: "Mr. Adam",
      ClassArm: "Joy",
      Subject: ["Mathematics"],
    },
    {
      Teacher: "Mr. Adam",
      ClassArm: "Joy",
      Subject: ["Mathematics"],
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
      Teacher: "",
      ClassArm: "",
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
      setMessage("Teacher already exists.");
      setMessageType("error");
      return;
    }

    if (editClassVisible && selectedClass) {
      const updatedList = classList.map((item) =>
        item.Class === selectedClass.Teacher ? selectedClass : item
      );
      setClassList(updatedList);
      setMessage("Teacher updated successfully.");
      setMessageType("success");
      setEditClassVisible(false);
      setSelectedClass(null);
    } else {
      setClassList((prev) => [...prev, formData]);
      setMessage("Teacher added successfully.");
      setMessageType("success");
      setFormData({
        Teacher: "",
        ClassArm: "",
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
            Assign Teachers to Subject and Classes
          </p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            {editClassVisible ? "Save" : "Assign"}
          </button>
        </div>
        <div className="pl-6 pr-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-x-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Teacher:</label>
              <Dropdown
                label={
                  editClassVisible
                    ? selectedClass.Teacher
                    : formData.Teacher || "Select Teacher"
                }
                items={[
                  {
                    label: "Mrs. Jane",
                    onClick: () =>
                      editClassVisible
                        ? setSelectedClass((prev) => ({
                            ...prev,
                            Teacher: "Mrs. Jane",
                          }))
                        : setFormData((prev) => ({
                            ...prev,
                            Teacher: "Mrs. Jane",
                          })) || "",
                  },
                  {
                    label: "Mr. Joe",
                    onClick: () =>
                      editClassVisible
                        ? setSelectedClass((prev) => ({
                            ...prev,
                            Teacher: "Mr. Joe",
                          }))
                        : setFormData((prev) => ({
                            ...prev,
                            Teacher: "Mr. Joe",
                          })) || "",
                  },
                ]}
              />
            </div>

            <div className="flex flex-col gap-x-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Class Arm:
              </label>
              <Dropdown
                label={
                  editClassVisible
                    ? selectedClass.ClassArm
                    : formData.ClassArm || "Select Class Arm"
                }
                items={[
                  {
                    label: "Joy",
                    onClick: () =>
                      editClassVisible
                        ? setSelectedClass((prev) => ({
                            ...prev,
                            ClassArm: "Joy",
                          }))
                        : setFormData((prev) => ({
                            ...prev,
                            ClassArm: "Joy",
                          })) || "",
                  },

                  {
                    label: "Peace",
                    onClick: () =>
                      editClassVisible
                        ? setSelectedClass((prev) => ({
                            ...prev,
                            ClassArm: "Peace",
                          }))
                        : setFormData((prev) => ({
                            ...prev,
                            ClassArm: "Peace",
                          })) || "",
                  },
                ]}
              />
            </div>
            <div className="flex flex-col gap-x-2 ">
              <label className="text-[0.88rem] text-[#5E6A72]">Subject:</label>
              <MultiDropdown
                label="Select Subjects"
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
          </div>
        </div>
      </form>
      <hr className="mt-10" />

      <div className="flex-shrink-0 mb-2">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Assigned to Teachers Subject and Classes
        </p>
      </div>
      <div className="px-0">
        <div className="overflow-y-auto max-h-[200px] no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-12 bg-[#EDF0F3]">Teachers</th>
                  <th className="p-2 bg-[#EDF0F3]">Subject</th>
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
                    No Assigned Teacher's to Subject Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={index}>
                    <td className="p-2 pl-12">{item.Teacher}</td>
                    <td>{item.Subject?.join("- ")}</td>
                    <td className="p-2">{item.ClassArm}</td>
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

export default SubjectTeacherAssign;
