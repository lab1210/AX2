"use client";
import React, { useState } from "react";
import { IoFilter, IoSearch } from "react-icons/io5";
import MultiDropdown from "./MultiDropDown";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import RegControlModal from "./RegControlModal";
import { RxLetterCaseCapitalize } from "react-icons/rx";

const StudentToSubject = () => {
  const allStudents = [
    { name: "Babalola Ifeoluwa", class: "SS1", classArm: "A" },
    { name: "Babalola Joseph", class: "SS1", classArm: "B" },
    { name: "Jane Doe", class: "SS2", classArm: "A" },
    { name: "John Doe", class: "SS2", classArm: "B" },
    { name: "Will Smith", class: "SS3", classArm: "A" },
    { name: "Joseph Adams", class: "SS3", classArm: "C" },
  ];

  const [StudentSubjectList, setStudentSubjectList] = useState([
    {
      Student: "Babalola Ifeoluwa",
      Subject: ["Mathematics", "History", "English"],
    },
    {
      Student: "Babalola Joseph",
      Subject: ["Mathematics", "History", "Geography"],
    },
    {
      Student: "Babalola Ifeoluwa",
      Subject: ["Mathematics", "History", "English"],
    },
    {
      Student: "Babalola Joseph",
      Subject: ["Mathematics", "History", "Geography"],
    },
  ]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [selectedSubjectAssignment, setselectedSubjectAssignment] =
    useState(null);
  const [editSubjectAssignmentVisible, seteditSubjectAssignmentVisible] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState("name");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");

  const itemsPerPage = 5;
  const [formData, setFormData] = useState([
    {
      Student: [],
      Subject: [],
    },
  ]);

  const filteredStudents =
    searchText.trim() === ""
      ? allStudents.map((student) => ({ name: student.name }))
      : allStudents
          .filter((student) =>
            student[filterType]
              ?.toLowerCase()
              .includes(searchText.toLowerCase())
          )
          .map((student) => ({ name: student.name }));

  const paginatedData = StudentSubjectList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(StudentSubjectList.length / itemsPerPage);
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure formData.Student is an array
    const selectedStudents = Array.isArray(formData.Student)
      ? formData.Student
      : [formData.Student];

    // Check if any selected student is already registered
    const duplicateStudent = selectedStudents.find((student) =>
      StudentSubjectList.some((item) => item.Student === student)
    );

    if (!editSubjectAssignmentVisible && duplicateStudent) {
      setMessage(`Student "${duplicateStudent}" has already been registered.`);
      setMessageType("error");
      return;
    }

    if (editSubjectAssignmentVisible && selectedSubjectAssignment) {
      const updatedList = StudentSubjectList.map((item) =>
        item.Student === selectedSubjectAssignment.Student
          ? selectedSubjectAssignment
          : item
      );
      setStudentSubjectList(updatedList);
      setMessage("Subject Registration updated successfully.");
      setMessageType("success");
      seteditSubjectAssignmentVisible(false);
      setselectedSubjectAssignment(null);
    } else {
      // Add each student separately with the selected subjects
      const newEntries = selectedStudents.map((student) => ({
        Student: student,
        Subject: formData.Subject,
      }));

      setStudentSubjectList((prev) => [...prev, ...newEntries]);
      setMessage("Student Subject Registration successful.");
      setMessageType("success");

      // Reset formData
      setFormData({
        Student: [],
        Subject: [],
      });
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleEdit = (Assignment) => {
    seteditSubjectAssignmentVisible(true);
    setselectedSubjectAssignment({
      ...Assignment,
      Student: Array.isArray(Assignment.Student)
        ? Assignment.Student
        : [Assignment.Student], // Make sure Student is an array
    });
  };
  const toggleRegistration = () => {
    if (!registrationEnabled) {
      setShowModal(true);
    } else {
      setRegistrationEnabled(false);
    }
  };

  return (
    <div className="overflow-y-auto no-scrollbar h-full ">
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
      <div className="flex justify-between items-center gap-5 pt-5 pl-6 pr-6 ">
        <div className="flex items-center gap-3 relative w-1/2">
          <div className="">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center text-[#01427A] hover:text-white hover:bg-[#01427A] cursor-pointer text-sm gap-2 border-[1.5px]
             rounded-full border-[#01427A] py-2 px-3 w-full "
            >
              <span className="hidden xl:block">Filter by </span>
              <span>
                <IoFilter size={18} />
              </span>
            </button>
            {showFilterDropdown && (
              <div className="absolute top-full mt-1 left-0 bg-white border rounded shadow-lg z-10">
                {["name", "class", "classArm"].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setFilterType(type);
                      setShowFilterDropdown(false);
                    }}
                    className="border-b flex items-center gap-3 px-4 py-2 text-sm hover:bg-[#01427A]/40 cursor-pointer w-full text-left"
                  >
                    <span>
                      <RxLetterCaseCapitalize />
                    </span>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="relative w-full">
              <IoSearch
                className="text-[#AEAEAE] absolute right-7 top-2.5 ml-3 "
                size={18}
              />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                type="text"
                className="placeholder:text-[#AEAEAE] xl:placeholder:text-sm placeholder:text-xs rounded-full py-1 pl-5 pr-12 border-[1.5px] w-full "
                placeholder={`Type here to filter by ${filterType}`}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label htmlFor="" className="text-sm">
            Set Registration Control:
          </label>
          <button
            onClick={toggleRegistration}
            aria-pressed={registrationEnabled}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none  ${
              registrationEnabled ? "bg-[#1BB66E]" : "bg-[#F94144]"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                registrationEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mb-3 flex-shrink-0 mt-2">
        <div className="flex pt-3 pl-6 pr-6 justify-between mb-2 ">
          <p className="font-bold text-[#07508F]">Register Students Subject</p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            {editSubjectAssignmentVisible ? "Save" : "Assign"}
          </button>
        </div>
        <div className="pl-6 pr-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-x-2 ">
              <label className="text-[0.88rem] text-[#5E6A72]">Student:</label>
              <MultiDropdown
                label="Select Student (s)"
                selectedItems={
                  editSubjectAssignmentVisible
                    ? selectedSubjectAssignment.Student || []
                    : formData.Student
                }
                onSelect={(selected) =>
                  editSubjectAssignmentVisible
                    ? setselectedSubjectAssignment((prev) => ({
                        ...prev,
                        Student: selected,
                      }))
                    : setFormData((prev) => ({
                        ...prev,
                        Student: selected,
                      }))
                }
                items={filteredStudents.map((student) => ({
                  label: student.name,
                }))}
              />
            </div>
            <div className="flex flex-col gap-x-2 ">
              <label className="text-[0.88rem] text-[#5E6A72]">Subject:</label>
              <MultiDropdown
                label="Select Subject (s)"
                selectedItems={
                  editSubjectAssignmentVisible
                    ? selectedSubjectAssignment.Subject || []
                    : formData.Subject
                }
                onSelect={(selected) =>
                  editSubjectAssignmentVisible
                    ? setselectedSubjectAssignment((prev) => ({
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
                  { label: "Science" },
                  { label: "History" },
                  { label: "Geography" },
                  { label: "CRS" },
                ]}
              />
            </div>
          </div>
        </div>
      </form>
      <hr />
      <div className="flex-shrink-0">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Assigned Students to Subjects.
        </p>
      </div>
      <div className="px-0 overflow-y-auto h-full">
        <div>
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left  lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-16 bg-[#EDF0F3]">Students</th>
                  <th className="p-2 bg-[#EDF0F3]">Subjects</th>
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
                    <td className="p-2 pl-16">{item.Student}</td>
                    <td className="p-2 ">{item.Subject?.join(",")}</td>
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
      {showModal && (
        <RegControlModal
          setRegistrationEnabled={setRegistrationEnabled}
          setShowModal={setShowModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default StudentToSubject;
