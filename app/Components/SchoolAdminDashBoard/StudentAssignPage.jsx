"use client";
import React, { useState, useEffect } from "react";
import { FiDownload, FiEdit3 } from "react-icons/fi";
import { IoFilter, IoSearch } from "react-icons/io5";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import Dropdown from "./DropDown2";
import studentService from "@/Service/studentService";
import classService from "@/Service/ClassService";
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
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    studentId: "",
    classYearId: "",
    classArmId: "",
  });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!formData.classYearId) {
      setFilteredArms([]);
      return;
    }
    const arms = (classArms || []).filter(
      (a) => a.classYearId === formData.classYearId || a.class_year_id === formData.classYearId
    );
    setFilteredArms(arms);

    if (
      formData.classArmId &&
      !arms.some((a) => a.id === formData.classArmId || a.class_id === formData.classArmId)
    ) {
      setFormData((prev) => ({ ...prev, classArmId: "" }));
    }
  }, [formData.classYearId, classArms]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, classYearsRes, classArmsRes] = await Promise.all([
        studentService.getAllStudents(),
        classService.getAllClassYears(),
        classService.getAllClassArms(),
      ]);

      if (studentsRes.success) {
        setStudents(studentsRes.data);
      } else {
        toast.error(studentsRes.message || "Failed to fetch students");
      }

      if (classYearsRes.success) {
        setClassYears(classYearsRes.data);
      } else {
        toast.error(classYearsRes.message || "Failed to fetch class years");
      }

      if (classArmsRes.success) {
        setClassArms(classArmsRes.data);
      } else {
        toast.error(classArmsRes.message || "Failed to fetch class arms");
      }
    } catch (error) {
      toast.error("Failed to fetch data: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Filtering
  const filteredResults = students.filter((student) => {
    if (searchText.trim() === "") return true;

    const searchValue = searchText.toLowerCase();
    switch (filterType) {
      case "student_name":
        return student.fullName?.toLowerCase().includes(searchValue) ||
               student.firstName?.toLowerCase().includes(searchValue) ||
               student.lastName?.toLowerCase().includes(searchValue);
      case "class_year":
        return student.classYearName?.toLowerCase().includes(searchValue);
      case "class_arm":
        return student.classArmName?.toLowerCase().includes(searchValue);
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

  const handleEdit = (student) => {
    setEditingId(student.userId);
    setFormData({
      studentId: student.userId,
      classYearId: student.classYearId || "",
      classArmId: student.classArmId || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      studentId: "",
      classYearId: "",
      classArmId: "",
    });
  };

  const handleSaveEdit = async (studentId) => {
    try {
      if (!formData.classYearId || !formData.classArmId) {
        toast.error("Please select both class year and class arm");
        return;
      }

      setLoading(true);
      
      const updateData = {
        classYearId: formData.classYearId,
        classArmId: formData.classArmId,
      };

      const result = await studentService.updateStudent(studentId, updateData);
      
      if (result.success) {
        toast.success("Student class updated successfully");
        setEditingId(null);
        await fetchData();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update student class: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      if (field === "classYearId") {
        return { ...prev, classYearId: value, classArmId: "" };
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
    const headers = ["Student Name", "Admission Number", "Class Year", "Class Arm"];
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
          escapeCell(r.fullName || `${r.firstName} ${r.lastName}`),
          escapeCell(r.admissionNumber),
          escapeCell(r.classYearName),
          escapeCell(r.classArmName),
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

    const ts = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 8);
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
    <div className="h-full flex flex-col">
      {/* Filter and Search Section - Sticky at top */}
      <div className="flex-shrink-0">
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
      </div>

      {/* Table Section - No overflow hidden, allows dropdown to expand */}
      <div className="flex-1 mt-10 overflow-visible px-0">
        <div className="overflow-visible">
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-center lg:text-base text-xs sticky top-0 z-10">
                <tr>
                  <th className="p-2 bg-[#EDF0F3]">Student Name</th>
                  <th className="p-2 bg-[#EDF0F3]">Admission No.</th>
                  <th className="p-2 bg-[#EDF0F3]">Class Year</th>
                  <th className="p-2 bg-[#EDF0F3]">Class Arm</th>
                  <th className="p-2 bg-[#EDF0F3]">Actions</th>
                </tr>
              </thead>
            )}
            <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-5 text-center border text-gray-500">
                    No Student to Class Assignments Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((student) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={student.userId}>
                    <td className="p-2 text-center">
                      {student.fullName || `${student.firstName} ${student.lastName}`}
                    </td>
                    <td className="p-2 text-center">
                      {student.admissionNumber}
                    </td>
                    <td className="p-2 text-center relative">
                      {editingId === student.userId ? (
                        <div className="relative">
                          <Dropdown
                            label={formData.classYearId 
                              ? (classYears.find(cy => cy.id === formData.classYearId || cy.class_year_id === formData.classYearId)?.className || "Select Class Year")
                              : "Select Class Year"}
                            items={classYears.map((classYear) => ({
                              label: classYear.className || classYear.class_name,
                              onClick: () =>
                                handleInputChange("classYearId", classYear.id || classYear.class_year_id),
                            }))}
                          />
                        </div>
                      ) : (
                        student.classYearName || "Not Assigned"
                      )}
                    </td>
                    <td className="p-2 text-center relative">
                      {editingId === student.userId ? (
                        <div className="relative">
                          <Dropdown
                            label={formData.classArmId 
                              ? (filteredArms.find(ca => ca.id === formData.classArmId || ca.class_id === formData.classArmId)?.armName || "Select Class Arm")
                              : "Select Class Arm"}
                            items={(filteredArms.length
                              ? filteredArms
                              : [
                                  {
                                    armName: "No arms for selected class",
                                    id: null,
                                  },
                                ]
                            ).map((classArm) => ({
                              label: classArm.id
                                ? (classArm.armName || classArm.arm_name)
                                : "No arms for selected class",
                              onClick: classArm.id
                                ? () =>
                                    handleInputChange("classArmId", classArm.id || classArm.class_id)
                                : undefined,
                            }))}
                          />
                        </div>
                      ) : (
                        student.classArmName || "Not Assigned"
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {editingId === student.userId ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleSaveEdit(student.userId)}
                            disabled={loading}
                            className="bg-[#07508F] text-white px-3 py-1 rounded text-xs hover:opacity-90 cursor-pointer disabled:opacity-50"
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
                          onClick={() => handleEdit(student)}
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
          <div className="flex justify-end pr-6 items-center gap-2 mt-3 text-sm text-[#01427A] font-semibold pb-4">
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
  );
};

export default StudentAssignPage;