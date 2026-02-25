"use client";
import React, { useState, useEffect } from "react";
import { IoFilter, IoSearch } from "react-icons/io5";
import MultiDropdown from "@/Components/SchoolAdminDashBoard/MultiDropDown";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { Bell } from "lucide-react";
import Layout from "../TeacherWrapper";
import { getSubject } from "@/Service/schoolConfig";
import {
  getStudentSubjectRegistrations,
  registerStudentSubject,
  updateStudentSubject,
} from "@/Service/StudentSubjectReg";
import toast from "react-hot-toast";
import {
  getClassDepartmentAssignments,
  getStudenttoClassRelationship,
} from "@/Service/SchoolAdminAssignmentService";

const StudentToSubject = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [allclassdept, setAllclassdept] = useState([]);
  const [studentSubjectList, setStudentSubjectList] = useState([]);
  const [selectedSubjectAssignment, setSelectedSubjectAssignment] =
    useState(null);
  const [editSubjectAssignmentVisible, setEditSubjectAssignmentVisible] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("name");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    student_classes: [],
    subject_classes: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      let studentsRes, subjectsRes, registrationsRes, classdept;

      try {
        studentsRes = await getStudenttoClassRelationship();
      } catch (error) {
        console.error("❌ getStudenttoClassRelationship failed:", error);
        console.error("❌ Error message:", error.message);
        console.error("❌ Error stack:", error.stack);
        studentsRes = { error: error.message };
      }

      try {
        console.log("📡 Calling getSubject...");
        subjectsRes = await getSubject();
        console.log("✅ Subjects data:", subjectsRes);
        console.log("✅ Subjects data type:", typeof subjectsRes);
        console.log("✅ Subjects results:", subjectsRes?.results);
      } catch (error) {
        console.error("❌ getSubject failed:", error);
        console.error("❌ Error message:", error.message);
        subjectsRes = { error: error.message };
      }

      try {
        console.log("📡 Calling getClassDepartmentAssignments...");
        classdept = await getClassDepartmentAssignments();
        console.log("✅ Class Dept data:", classdept);
        console.log("✅ Class Dept data type:", typeof classdept);
        console.log("✅ Class Dept results:", classdept?.results);
      } catch (error) {
        console.error("❌ getClassDepartmentAssignments failed:", error);
        console.error("❌ Error message:", error.message);
        classdept = { error: error.message };
      }

      try {
        console.log("📡 Calling getStudentSubjectRegistrations...");
        registrationsRes = await getStudentSubjectRegistrations();
        console.log("✅ Registrations data:", registrationsRes);
        console.log("✅ Registrations data type:", typeof registrationsRes);
        console.log("✅ Registrations results:", registrationsRes?.results);
      } catch (error) {
        console.error("❌ getStudentSubjectRegistrations failed:", error);
        console.error("❌ Error message:", error.message);
        registrationsRes = { error: error.message };
      }

      // Process responses
      console.log("🔄 Processing responses...");

      if (!studentsRes?.error) {
        setAllStudents(studentsRes);
        console.log(`📊 Set ${studentsRes?.length} students`);
      } else {
        console.log("❌ Students data has error:", studentsRes.error);
        setAllStudents([]);
      }

      if (!subjectsRes?.error) {
        const subjectsData = subjectsRes.results || subjectsRes;
        setAllSubjects(subjectsData);
        console.log(`📚 Set ${subjectsData?.length} subjects`);
      } else {
        console.log("❌ Subjects data has error:", subjectsRes.error);
        setAllSubjects([]);
      }

      if (!registrationsRes?.error) {
        const registrationsData = registrationsRes.results || registrationsRes;
        setStudentSubjectList(registrationsData);
        console.log(`📋 Set ${registrationsData?.length} registrations`);
      } else {
        console.log("❌ Registrations data has error:", registrationsRes.error);
        setStudentSubjectList([]);
      }

      if (!classdept?.error) {
        const classdeptData = classdept.results || classdept;
        setAllclassdept(classdeptData);
        console.log(`🏫 Set ${classdeptData?.length} class departments`);
      } else {
        console.log("❌ Class dept data has error:", classdept.error);
        setAllclassdept([]);
      }

      console.log("✅ All data processing completed");
    } catch (error) {
      console.error("❌ Outer catch block - Unexpected error:", error);
      console.error("Error stack:", error.stack);
      toast.error("Failed to load data");
    } finally {
      console.log("🏁 fetchData completed - setting loading to false");
      setLoading(false);
    }
  };

  const getFilteredSubjects = () => {
    // Return all subjects without any filtering
    return allSubjects.map((subject) => ({
      label: subject.name,
      value: subject.subject_id,
      original: subject,
    }));
  };

  const studentOptions = allStudents.map((student) => {
    const studentName = student.student_name;
    return {
      label: studentName,
      value: student.student_class_id,
      original: student,
    };
  });

  const filteredStudents =
    searchText.trim() === ""
      ? studentOptions
      : studentOptions.filter((student) =>
          student.label.toLowerCase().includes(searchText.toLowerCase())
        );

  const paginatedData = studentSubjectList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(studentSubjectList.length / itemsPerPage);
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Handle student selection - reset subjects when student changes
  const handleStudentSelect = (selectedStudents) => {
    console.log("Student selected:", selectedStudents);
    setFormData({
      student_classes: selectedStudents,
      subject_classes: [], // Reset subjects when student changes
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any student or subject is selected
    if (
      formData.student_classes.length === 0 ||
      formData.subject_classes.length === 0
    ) {
      toast.error("Please select at least one student and one subject");
      return;
    }

    try {
      if (editSubjectAssignmentVisible && selectedSubjectAssignment) {
        // For editing, we assume single student and subject (as per typical API design)
        const updateData = {
          student_class:
            formData.student_classes[0]?.value || formData.student_classes[0],
          subject_class:
            formData.subject_classes[0]?.value || formData.subject_classes[0],
        };

        const response = await updateStudentSubject(
          selectedSubjectAssignment.id,
          updateData
        );

        if (response.error) {
          throw new Error(response.error);
        }

        setStudentSubjectList((prev) =>
          prev.map((item) =>
            item.id === selectedSubjectAssignment.id ? response : item
          )
        );
        toast.success("Subject Registration updated successfully.");
        setEditSubjectAssignmentVisible(false);
        setSelectedSubjectAssignment(null);
        setFormData({ student_classes: [], subject_classes: [] });
      } else {
        // For new registrations, create one registration per student-subject combination
        const promises = [];

        formData.student_classes.forEach((student) => {
          formData.subject_classes.forEach((subject) => {
            const studentId = student.value || student;
            const subjectId = subject.value || subject;

            // Check if this combination already exists
            const exists = studentSubjectList.some(
              (item) =>
                item.student_class?.id === studentId &&
                item.subject_class?.id === subjectId
            );

            if (!exists) {
              promises.push(
                registerStudentSubject({
                  student_class: studentId,
                  subject_class: subjectId,
                })
              );
            }
          });
        });

        if (promises.length === 0) {
          toast.error(
            "All selected student-subject combinations already exist"
          );
          return;
        }

        const results = await Promise.all(promises);
        const newRegistrations = results.filter((res) => !res.error);

        if (newRegistrations.length > 0) {
          setStudentSubjectList((prev) => [...prev, ...newRegistrations]);
          toast.success(
            `${newRegistrations.length} registration(s) created successfully.`
          );
        }

        if (results.length > newRegistrations.length) {
          toast.error(
            `${
              results.length - newRegistrations.length
            } registration(s) failed.`
          );
        }

        setFormData({ student_classes: [], subject_classes: [] });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error.message || "Registration failed");
    }
  };

  const handleEdit = async (assignment) => {
    try {
      // Fetch the full assignment data by ID
      const response = await getStudentSubjectById(assignment.id);

      if (response.error) {
        throw new Error(response.error);
      }

      setEditSubjectAssignmentVisible(true);
      setSelectedSubjectAssignment(response);

      // Format data for MultiDropdown
      setFormData({
        student_classes: [
          {
            label: `${response.student_class?.student?.first_name} ${response.student_class?.student?.last_name}`,
            value: response.student_class?.student_class_id,
          },
        ],
        subject_classes: [
          {
            label: response.subject_class?.subject?.name,
            value: response.subject_class?.subject_id,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch assignment:", error);
      toast.error("Failed to load assignment data");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) {
      return;
    }

    try {
      const response = await deleteStudentSubject(id);

      if (response.error) {
        throw new Error(response.error);
      }

      setStudentSubjectList((prev) => prev.filter((item) => item.id !== id));
      toast.success("Student subject registration deleted successfully");
    } catch (error) {
      console.error("Deletion failed:", error);
      toast.error("Failed to delete registration");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-[#F7F8FA] min-h-screen">
        {/* Content Container */}
        <div className="p-2">
          <div className="bg-white p-4  overflow-y-hidden h-full xl:h-[95vh] 2xl:fixed w-full 2xl:w-[64%]">
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
                        <IoSearch />
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
                  className="bg-[#07508F] text-white px-6 py-1 rounded font-semibold hover:opacity-90"
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
                    items={filteredStudents}
                    selectedItems={formData.student_classes}
                    onSelect={handleStudentSelect}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#5E6A72] mb-1">
                    Subject:
                  </label>
                  <MultiDropdown
                    label="Select Subject(s)"
                    items={getFilteredSubjects()}
                    selectedItems={formData.subject_classes}
                    onSelect={(selected) =>
                      setFormData({ ...formData, subject_classes: selected })
                    }
                    disabled={formData.student_classes.length === 0}
                  />
                  {formData.student_classes.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Please select a student first to see available subjects
                    </p>
                  )}
                </div>
              </div>
            </form>

            <hr className="mb-4" />
            <p className="text-center text-[#333333] mb-4">
              Existing Assigned Students to Subjects
            </p>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-[#EDF0F3]">
                  <tr>
                    <th className="p-2 text-center font-normal">Student</th>
                    <th className="p-2 text-center font-normal">Subject</th>
                    <th className="p-2 text-left font-normal">Actions</th>
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
                    paginatedData.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="p-2 text-center">
                          {item.student_class?.student?.first_name}{" "}
                          {item.student_class?.student?.last_name}
                        </td>
                        <td className="p-2 text-center">
                          {item.subject_class?.subject?.name}
                        </td>
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
                              onClick={() => handleDelete(item.id)}
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
