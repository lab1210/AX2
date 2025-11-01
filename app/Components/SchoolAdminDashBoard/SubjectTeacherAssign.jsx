"use client";
import React, { useState, useEffect } from "react";
import Dropdown from "./DropDown2";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import {
  createSubjectTeacherAssignment,
  updateSubjectTeacherAssignment,
  deleteSubjectTeacherAssignment,
  getSubjectDepartmentRelationships,
  getSubjectTeacherAssignments,
  getClassDepartmentAssignments,
} from "../../Service/SchoolAdminAssignmentService";
import { getTeachers } from "../../Service/teacherService";
import toast from "react-hot-toast";

const SubjectTeacherAssign = () => {
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classArms, setClassArms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    teacher: "",
    subject_class: "",
    class_department_assigned: "",
  });
  const [selectedClassDelete, setSelectedClassDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsRes, teachersRes, classdeptres, subjectsRes] =
        await Promise.all([
          getSubjectTeacherAssignments(),
          getTeachers(),
          getClassDepartmentAssignments(),
          getSubjectDepartmentRelationships(),
        ]);

      setAssignments(assignmentsRes || []);
      setTeachers(teachersRes);
      setClassArms(classdeptres);
      setSubjects(subjectsRes);
    } catch (error) {
      toast.error(
        "Failed to fetch data: " + (error.message || "Unknown error")
      );
    }
  };

  const paginatedData = assignments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(assignments.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.teacher ||
      !formData.subject_class ||
      !formData.class_department_assigned
    ) {
      toast.error("Please select teacher, subject, and class arm");
      return;
    }

    try {
      if (editMode && selectedAssignment) {
        await updateSubjectTeacherAssignment(
          selectedAssignment.teacher_subject_id,
          formData
        );
        toast.success("Assignment updated successfully");
      } else {
        await createSubjectTeacherAssignment(formData);
        toast.success("Assignment created successfully");
      }

      await fetchData();
      resetForm();
    } catch (error) {
      toast.error(error.message || "Failed to save assignment");
      console.error("Submission error:", error);
    }
  };

  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      teacher: assignment.teacher,
      subject_class: assignment.subject_class,
      class_department_assigned: assignment.class_department_assigned,
    });
    setEditMode(true);
  };
  const openDeleteModal = (term) => {
    setSelectedClassDelete(term);
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setSelectedClassDelete(null);
    setDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedClassDelete?.teacher_subject_id) {
      try {
        const response = await deleteSubjectTeacherAssignment(
          selectedClassDelete?.teacher_subject_id
        );
        toast.success("Relationship deleted successfully");
        fetchData();
        closeDeleteModal();
      } catch (error) {
        toast.error(
          "Failed to delete relationship: " + (error.message || "Unknown error")
        );
      }
    }
  };

  const resetForm = () => {
    setFormData({
      teacher: "",
      subject_class: "",
      class_department_assigned: "",
    });
    setEditMode(false);
    setSelectedAssignment(null);
  };

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find((t) => t.teacher_id === teacherId);
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : "Unknown";
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s.subject_class_id === subjectId);
    return subject ? subject.subject_name : "Unknown";
  };

  return (
    <div>
      {deleteModalVisible && selectedClassDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg min-w-75 z-50 p-8">
            <p className="font-bold text-center text-lg">
              Delete Subject Teacher
            </p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete the subject teacher
              </p>
              <p className="text-base text-[#858383]">
                <span className="font-bold">
                  {selectedClassDelete?.teacher_name +
                    " " +
                    selectedClassDelete?.teacher_lastname}
                </span>
                ?
              </p>
            </div>
            <div className="font-bold text-md items-center justify-center pt-3 flex gap-5 ">
              <button
                onClick={handleDelete}
                className="cursor-pointer text-white bg-[#F94144] rounded-md pl-4 pr-4"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="cursor-pointer text-[#333333] bg-[#EBEBEB] rounded-md pl-4 pr-4"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="mb-3 flex-shrink-0">
        <div className="flex pt-3 pl-6 pr-6 justify-between mb-2">
          <p className="font-bold text-[#07508F]">
            Assign Teachers to Subject and Classes
          </p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            {editMode ? "Save" : "Assign"}
          </button>
        </div>
        <div className="pl-6 pr-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Teacher:</label>
              <Dropdown
                label={
                  editMode
                    ? getTeacherName(formData.teacher)
                    : formData.teacher || "Select Teacher"
                }
                items={teachers?.map((teacher) => ({
                  label: `${teacher.first_name} ${teacher.last_name}`,
                  onClick: () =>
                    setFormData((prev) => ({
                      ...prev,
                      teacher: teacher.teacher_id,
                    })),
                }))}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Subject:</label>
              <Dropdown
                label={
                  formData.subject_class
                    ? getSubjectName(formData.subject_class)
                    : "Select Subject"
                }
                items={subjects.map((subject) => ({
                  label: subject.subject_name,
                  onClick: () =>
                    setFormData((prev) => ({
                      ...prev,
                      subject_class: subject.subject_class_id,
                    })),
                }))}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Class Arm:
              </label>
              <Dropdown
                label={
                  formData.class_department_assigned
                    ? formData.class_department_assigned
                    : "Select Class Arm"
                }
                items={classArms.map((classArm) => ({
                  label: `${
                    classArm.class_year_name + " " + classArm.class_arm_name
                  }`,
                  onClick: () =>
                    setFormData((prev) => ({
                      ...prev,
                      class_department_assigned: classArm.subject_class_id,
                    })),
                }))}
              />
            </div>
          </div>
        </div>
      </form>
      <hr className="mt-10" />

      <div className="flex-shrink-0 mb-2">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Subject Teacher Assignments
        </p>
      </div>
      <div className="px-0">
        <div className="overflow-y-auto max-h-[200px] no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-12 bg-[#EDF0F3]">Teacher</th>
                  <th className="p-2 bg-[#EDF0F3]">Subject</th>
                  <th className="p-2 bg-[#EDF0F3]">Class</th>
                  <th className="p-2 bg-[#EDF0F3]">Actions</th>
                </tr>
              </thead>
            )}
            <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-5 text-center border text-gray-500"
                  >
                    No Subject Teacher Assignments Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={index}>
                    <td className="p-2 pl-12">
                      {item.teacher_name} {item.teacher_lastname}
                    </td>
                    <td className="p-2">{item.subject_name}</td>
                    <td className="p-2">
                      {item.class_year_name + " " + item.class_name}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-4">
                        <FiEdit3
                          onClick={() => handleEdit(item)}
                          className="text-[#80ADCB] cursor-pointer"
                          size={15}
                        />
                        <FiTrash2
                          onClick={() => openDeleteModal(item)}
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
            className={`px-2 py-1 bg-[#E6ECF2] border ${
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
              className={`px-2 py-1 text-xs ${
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
            className={`px-2 py-1 border bg-[#E6ECF2] ${
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
