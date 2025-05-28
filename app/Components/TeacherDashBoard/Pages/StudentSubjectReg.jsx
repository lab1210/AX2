"use client";
import React, { useState } from "react";
import { IoFilter, IoSearch } from "react-icons/io5";
import MultiDropdown from "../MultiDropDown";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { Bell } from "lucide-react";
import Layout from "../Teacherlayout";

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
  const [filterType, setFilterType] = useState("name");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");

  const itemsPerPage = 5;
  const [formData, setFormData] = useState({ Student: [], Subject: [] });

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
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedStudents = Array.isArray(formData.Student)
      ? formData.Student
      : [formData.Student];
    const duplicateStudent = selectedStudents.find((student) =>
      StudentSubjectList.some((item) => item.Student === student)
    );

    if (!editSubjectAssignmentVisible && duplicateStudent) {
      setMessage(`Student "${duplicateStudent}" has already been registered.`);
      setMessageType("error");
      return;
    }

    if (editSubjectAssignmentVisible && selectedSubjectAssignment) {
      setStudentSubjectList((prev) =>
        prev.map((item) =>
          item.Student === selectedSubjectAssignment.Student
            ? selectedSubjectAssignment
            : item
        )
      );
      setMessage("Subject Registration updated successfully.");
      setMessageType("success");
      seteditSubjectAssignmentVisible(false);
      setselectedSubjectAssignment(null);
    } else {
      const newEntries = selectedStudents.map((student) => ({
        Student: student,
        Subject: formData.Subject,
      }));
      setStudentSubjectList((prev) => [...prev, ...newEntries]);
      setMessage("Student Subject Registration successful.");
      setMessageType("success");
      setFormData({ Student: [], Subject: [] });
    }

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleEdit = (assignment) => {
    seteditSubjectAssignmentVisible(true);
    setselectedSubjectAssignment({
      ...assignment,
      Student: Array.isArray(assignment.Student)
        ? assignment.Student
        : [assignment.Student],
    });
  };

  return (
    <Layout>
      <div className="bg-[#F7F8FA] min-h-screen">
        {/* Header */}
        <div className="fixed bg-white px-6 py-4 flex items-center justify-between mb-3 rounded w-[85%] z-20">
          <h1 className="text-2xl font-bold text-[#01427A]">
            Student Subject Registration
          </h1>
          <div className="flex items-center">
            <button className="relative mr-4">
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full" />
              <Bell className="text-[#01427A]" />
            </button>
            <div className="flex items-center space-x-2">
              <img
                src="/female2.png"
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-sm">Joshua Daniel</p>
                <p className="text-xs text-gray-500">Teacher</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-2">
        <div className="bg-white p-4 mt-20 overflow-y-hidden h-[95vh] fixed w-[64%]">
          {message && (
            <div
              className={`mb-4 text-sm px-4 py-2 rounded font-semibold ${
                messageType === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {" "}
              {message}{" "}
            </div>
          )}

          {/* Filter/Search */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown((prev) => !prev)}
                className="flex items-center text-[#01427A] border border-[#01427A] rounded-full py-2 px-3 gap-2 hover:bg-[#01427A] hover:text-white text-sm"
              >
                <span className="hidden xl:block">Filter by</span>{" "}
                <IoFilter size={18} />
              </button>
              {showFilterDropdown && (
                <div className="absolute bg-white border rounded shadow mt-2 z-10">
                  {["name"].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(type);
                        setShowFilterDropdown(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[#01427A]/20"
                    >
                      <IoSearch/>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative flex-1">
              <IoSearch
                className="absolute top-2 right-3 text-[#AEAEAE]"
                size={18}
              />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={`Type here to filter by ${filterType}`}
                className="w-full border rounded-full pl-4 pr-12 py-2 placeholder-[#AEAEAE]"
              />
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-[#07508F]">
                Register Students Subject
              </p>
              <button
                type="submit"
                className="bg-[#07508F] text-white px-6 py-2 rounded font-semibold hover:opacity-90"
              >
                {editSubjectAssignmentVisible ? "Save" : "Assign"}
              </button>
            </div>
            <div className="flex flex-col space-y-3">
              <div>
                <label className="block text-sm text-[#5E6A72] mb-1">
                  Student:
                </label>
                <MultiDropdown
                  label="Select Student(s)"
                  items={filteredStudents.map((s) => ({ label: s.name }))}
                  selectedItems={
                    editSubjectAssignmentVisible
                      ? selectedSubjectAssignment.Student || []
                      : formData.Student
                  }
                  onSelect={(sel) => {
                    if (editSubjectAssignmentVisible) {
                      setselectedSubjectAssignment((prev) => ({
                        ...prev,
                        Student: sel,
                      }));
                    } else {
                      setFormData((prev) => ({ ...prev, Student: sel }));
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm text-[#5E6A72] mb-1">
                  Subject:
                </label>
                <MultiDropdown
                  label="Select Subject(s)"
                  items={[
                    { label: "Mathematics" },
                    { label: "Science" },
                    { label: "History" },
                    { label: "Geography" },
                    { label: "CRS" },
                  ]}
                  selectedItems={
                    editSubjectAssignmentVisible
                      ? selectedSubjectAssignment.Subject || []
                      : formData.Subject
                  }
                  onSelect={(sel) => {
                    if (editSubjectAssignmentVisible) {
                      setselectedSubjectAssignment((prev) => ({
                        ...prev,
                        Subject: sel,
                      }));
                    } else {
                      setFormData((prev) => ({ ...prev, Subject: sel }));
                    }
                  }}
                />
              </div>
            </div>
          </form>

          <hr className="mb-4" />
          <p className="font-semibold text-center text-[#333333] mb-4">
            Existing Assigned Students to Subjects
          </p>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-[#EDF0F3]">
                <tr>
                  <th className="p-2 text-left">Student</th>
                  <th className="p-2 text-left">Subjects</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">
                      No Data Available
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{item.Student}</td>
                      <td className="p-2">{item.Subject.join(", ")}</td>
                      <td className="p-2">
                        <div className="flex gap-4">
                          <FiEdit3
                            className="text-[#80ADCB] cursor-pointer"
                            onClick={() => handleEdit(item)}
                            size={16}
                          />
                          <FiTrash2
                            className="text-[#F94144] cursor-pointer"
                            size={16}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 mt-4">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-[#E6ECF2] rounded disabled:opacity-50"
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-[#07508F] text-white"
                    : "bg-[#FAFAFA] hover:bg-[#EDF0F3]"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-[#E6ECF2] rounded disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentToSubject;
