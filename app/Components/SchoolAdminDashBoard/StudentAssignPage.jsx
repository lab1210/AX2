"use client";
import React, { useState, useEffect } from "react";
import { FiDownload, FiEdit3 } from "react-icons/fi";
import { IoFilter, IoSearch } from "react-icons/io5";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import Dropdown from "./DropDown2";
import {
  getStudenttoClassRelationship,
  updateStudenttoClassRelationship,
} from "../../Service/SchoolAdminAssignmentService";
import { getStudents } from "../../Service/studentService";
import { getClass, getClassArm } from "../../Service/schoolConfig";
import toast from "react-hot-toast";

const StudentAssignPage = () => {
  const [filteredArms, setFilteredArms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("student_name");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [students, setStudents] = useState([]);
  const [classYears, setClassYears] = useState([]);
  const [classArms, setClassArms] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [formData, setFormData] = useState({
    student: "",
    class_year: "",
    class_arm: "",
  });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!formData.class_year) {
      setFilteredArms([]);
      return;
    }
    const arms = (classArms || []).filter(
      (a) => a.class_year === formData.class_year
    );
    setFilteredArms(arms);

    if (
      formData.class_arm &&
      !arms.some((a) => a.class_id === formData.class_arm)
    ) {
      setFormData((prev) => ({ ...prev, class_arm: "" }));
    }
  }, [formData.class_year, classArms]);

  const fetchData = async () => {
    try {
      const [assignmentsRes, studentsRes, classYearsRes, classArmsRes] =
        await Promise.all([
          getStudenttoClassRelationship(),
          getStudents(),
          getClass(),
          getClassArm(),
        ]);

      setAssignments(assignmentsRes || []);
      setStudents(studentsRes || []);
      setClassYears(classYearsRes?.data || []);
      setClassArms(classArmsRes?.data || []);
    } catch (error) {
      toast.error(
        "Failed to fetch data: " + (error.message || "Unknown error")
      );
    }
  };

  // Filtering
  const filteredResults = assignments.filter((assignment) => {
    if (searchText.trim() === "") return true;

    const searchValue = searchText.toLowerCase();
    switch (filterType) {
      case "student_name":
        return assignment.student_name?.toLowerCase().includes(searchValue);
      case "class_year":
        return assignment.class_year_name?.toLowerCase().includes(searchValue);
      case "class_arm":
        return assignment.class_arm_name?.toLowerCase().includes(searchValue);
      default:
        return true;
    }
  });

  // Pagination
  const paginatedData = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleEdit = (assignment) => {
    setEditingId(assignment.student_class_id);
    setFormData({
      student: assignment.student,
      class_year: assignment.class_year_name,
      class_arm: assignment.class_arm_name,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      student: "",
      class_year: "",
      class_arm: "",
    });
  };

  const handleSaveEdit = async (assignmentId) => {
    try {
      if (!formData.student || !formData.class_year || !formData.class_arm) {
        toast.error("Please select all fields");
        return;
      }

      await updateStudenttoClassRelationship(assignmentId, formData);
      toast.success("Assignment updated successfully");
      setEditingId(null);
      await fetchData();
    } catch (error) {
      toast.error(
        "Failed to update assignment: " + (error.message || "Unknown error")
      );
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      if (field === "class_year") {
        return { ...prev, class_year: value, class_arm: "" };
      }
      return { ...prev, [field]: value };
    });
  };

  const filterOptions = [
    { value: "student_name", label: "Student Name" },
    { value: "class_year", label: "Class Year" },
    { value: "class_arm", label: "Class Arm" },
  ];

  const getCurrentFilterLabel = () => {
    const option = filterOptions.find((opt) => opt.value === filterType);
    return option ? option.label : filterType;
  };

  const toCSV = (rows) => {
    const headers = ["Student Name", "Class Year", "Class Arm"];
    const escapeCell = (val) => {
      const s = (val ?? "").toString();
      const needsQuotes = /[",\n]/.test(s);
      const escaped = s.replace(/"/g, '""');
      return needsQuotes ? `"${escaped}"` : escaped;
    };

    const lines = [
      headers.join(","),
      ...rows.map((r) =>
        [
          escapeCell(r.student_name),
          escapeCell(r.class_year_name),
          escapeCell(r.class_arm_name),
        ].join(",")
      ),
    ];

    return "\uFEFF" + lines.join("\n");
  };

  const handleDownload = () => {
    if (!filteredResults.length) {
      toast.error("No records to download");
      return;
    }

    const csv = toCSV(filteredResults);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const ts = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 8); // yyyymmddhhmmss
    const filename = `student_class_assignments_${ts}.csv`;

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Download started");
  };

  return (
    <div>
      <div className="overflow-y-auto no-scrollbar h-full">
        <div className="flex justify-between items-center gap-5 pt-5 pl-6 pr-6">
          <div className="flex items-center gap-10 relative">
            <div>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center text-[#01427A] hover:text-white hover:bg-[#01427A] cursor-pointer text-sm gap-2 border-[1.5px] rounded-sm border-[#01427A] py-1 px-2 w-full"
              >
                <span className="hidden xl:block">Filter by </span>
                <span>
                  <IoFilter size={18} />
                </span>
              </button>
              {showFilterDropdown && (
                <div className="absolute mt-1 left-0 top-full bg-white border rounded shadow-lg z-[1000] w-48">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilterType(option.value);
                        setShowFilterDropdown(false);
                      }}
                      className="border-b flex items-center gap-3 px-4 py-2 text-sm hover:bg-[#01427A]/40 cursor-pointer w-full text-left"
                    >
                      <span>
                        <RxLetterCaseCapitalize />
                      </span>
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="relative w-full">
                <IoSearch
                  className="text-[#AEAEAE] absolute right-7 top-2.5 ml-3"
                  size={18}
                />
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  type="text"
                  className="placeholder:text-[#AEAEAE] xl:placeholder:text-sm placeholder:text-xs rounded-sm py-1 pl-5 pr-12 border-[1.5px] w-full"
                  placeholder={`Type here to filter by ${getCurrentFilterLabel()}`}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={handleDownload}
              className="bg-[#07508F] cursor-pointer hover:opacity-90 transition-all ease-in-out duration-300 text-white flex items-center py-1.5 px-4 rounded-sm gap-2"
            >
              Download List
              <FiDownload />
            </button>
          </div>
        </div>

        <div className="px-0 mt-10 overflow-y-auto h-full">
          <div>
            <table className="min-w-full table-auto">
              {paginatedData.length > 0 && (
                <thead className="bg-[#EDF0F3] text-center lg:text-base text-xs">
                  <tr>
                    <th className="p-2 bg-[#EDF0F3]">Student Name</th>
                    <th className="p-2 bg-[#EDF0F3]">Class Year</th>
                    <th className="p-2 bg-[#EDF0F3]">Class Arm</th>
                    <th className="p-2 bg-[#EDF0F3]">Actions</th>
                  </tr>
                </thead>
              )}
              <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-5 text-center border text-gray-500"
                    >
                      No Student to Class Assignments Available
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((assignment) => (
                    <tr
                      className="border-b-[#D0D0D0] border-b"
                      key={assignment.student_class_id}
                    >
                      <td className="p-2 text-center">
                        {assignment.student_name}
                      </td>
                      <td className="p-2 text-center">
                        {editingId === assignment.student_class_id ? (
                          <Dropdown
                            label={formData.class_year || "Select Class Year"}
                            items={classYears.map((classYear) => ({
                              label: classYear.class_name,
                              onClick: () =>
                                handleInputChange(
                                  "class_year",
                                  classYear.class_year_id
                                ),
                            }))}
                          />
                        ) : (
                          assignment.class_year_name
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {editingId === assignment.student_class_id ? (
                          <Dropdown
                            label={formData.class_arm || "Select Class Arm"}
                            items={(filteredArms.length
                              ? filteredArms
                              : [
                                  {
                                    arm_name: "No arms for selected class",
                                    class_id: null,
                                  },
                                ]
                            ).map((classArm) => ({
                              label: classArm.class_id
                                ? classArm.arm_name
                                : "No arms for selected class",
                              onClick: classArm.class_id
                                ? () =>
                                    handleInputChange(
                                      "class_arm",
                                      classArm.class_id
                                    )
                                : undefined,
                            }))}
                          />
                        ) : (
                          assignment.class_arm_name
                        )}
                      </td>

                      <td className="p-2 text-center">
                        {editingId === assignment.student_class_id ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() =>
                                handleSaveEdit(assignment.student_class_id)
                              }
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <FiEdit3
                            onClick={() => handleEdit(assignment)}
                            className="text-[#80ADCB] cursor-pointer mx-auto"
                            size={15}
                          />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-end pr-6 items-center gap-2 mt-3 text-sm text-[#01427A] font-semibold">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-3 py-1 bg-[#E6ECF2] border rounded ${
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
                  className={`px-3 py-1 rounded text-xs ${
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
                className={`px-3 py-1 border bg-[#E6ECF2] rounded ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#EDF0F3]"
                }`}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAssignPage;
