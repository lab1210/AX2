"use client";
import React, { useState, useEffect } from "react";
import Dropdown from "./DropDown2";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import subjectTeacherService from "@/Service/SubjectTeacherService";
import teacherService from "@/Service/TeacherService";
import academicEntityService from "@/Service/AcademicEntityService";
import classService from "@/Service/ClassService";
import academicPeriodService from "@/Service/AcademicPeriodService";
import toast from "react-hot-toast";

const SubjectTeacherAssign = () => {
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classArms, setClassArms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [academicPeriods, setAcademicPeriods] = useState([]);
  const [selectedAcademicPeriod, setSelectedAcademicPeriod] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    teacher_id: "",
    subject_id: "",
    class_arm_id: "",
    academic_period_id: "",
  });
  const [selectedClassDelete, setSelectedClassDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
    fetchAcademicPeriods();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [assignmentsRes, teachersRes, classArmsRes, subjectsRes] = await Promise.all([
        subjectTeacherService.getAllAssignments({ includeDeleted: false }),
        teacherService.getAllTeachers(),
        classService.getAllClassArms(),
        academicEntityService.getAllSubjects(),
      ]);

      if (assignmentsRes.success) {
        setAssignments(assignmentsRes.data);
      }
      
      if (teachersRes.success) {
        setTeachers(teachersRes.data);
      }
      
      if (classArmsRes.success) {
        setClassArms(classArmsRes.data);
      }
      
      if (subjectsRes.success) {
        setSubjects(subjectsRes.data);
      }
    } catch (error) {
      toast.error("Failed to fetch data: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const fetchAcademicPeriods = async () => {
    try {
      const result = await academicPeriodService.getAllTerms();
      if (result.success) {
        setAcademicPeriods(result.data);
        if (result.data.length > 0 && !selectedAcademicPeriod) {
          setSelectedAcademicPeriod(result.data[0].id);
          setFormData(prev => ({ ...prev, academic_period_id: result.data[0].id }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch academic periods:", error);
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

    if (!formData.teacher_id || !formData.subject_id || !formData.academic_period_id) {
      toast.error("Please select teacher, subject, and academic period");
      return;
    }

    try {
      setLoading(true);
      
      if (editMode && selectedAssignment) {
        const updateData = {
          teacherId: formData.teacher_id,
          subjectId: formData.subject_id,
          classArmId: formData.class_arm_id || null,
          academicPeriodId: formData.academic_period_id,
        };
        
        const result = await subjectTeacherService.updateAssignment(
          selectedAssignment.id,
          updateData
        );
        
        if (result.success) {
          toast.success("Assignment updated successfully");
        } else {
          throw new Error(result.message);
        }
      } else {
        const createData = {
          teacherId: formData.teacher_id,
          subjects: [{
            subjectId: formData.subject_id,
            classArmId: formData.class_arm_id || null,
            academicPeriodId: formData.academic_period_id,
          }]
        };
        
        const result = await subjectTeacherService.createAssignments(createData);
        
        if (result.success) {
          toast.success(result.message || "Assignment created successfully");
        } else {
          throw new Error(result.message);
        }
      }

      await fetchData();
      resetForm();
    } catch (error) {
      toast.error(error.message || "Failed to save assignment");
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      teacher_id: assignment.teacherId,
      subject_id: assignment.subjectId,
      class_arm_id: assignment.classArmId || "",
      academic_period_id: assignment.academicPeriodId,
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
    if (selectedClassDelete?.id) {
      try {
        setLoading(true);
        const result = await subjectTeacherService.deleteAssignment(selectedClassDelete.id);
        if (result.success) {
          toast.success("Relationship deleted successfully");
          await fetchData();
          closeDeleteModal();
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        toast.error("Failed to delete relationship: " + (error.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      teacher_id: "",
      subject_id: "",
      class_arm_id: "",
      academic_period_id: academicPeriods[0]?.id || "",
    });
    setEditMode(false);
    setSelectedAssignment(null);
  };

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find((t) => t.userId === teacherId);
    return teacher ? teacher.fullName : "Unknown";
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? subject.name : "Unknown";
  };

  const getClassArmName = (classArmId) => {
    if (!classArmId) return "All Class Arms";
    const classArm = classArms.find((c) => c.id === classArmId);
    return classArm ? `${classArm.classYearName || classArm.class_year_name} (${classArm.armName || classArm.arm_name})` : "Unknown";
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
                  {selectedClassDelete?.teacherName || selectedClassDelete?.teacher_name}
                </span>
                ?
              </p>
            </div>
            <div className="font-bold text-md items-center justify-center pt-3 flex gap-5 ">
              <button
                onClick={handleDelete}
                disabled={loading}
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
            disabled={loading}
            className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90 disabled:opacity-50"
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
                    ? getTeacherName(formData.teacher_id)
                    : formData.teacher_id 
                      ? getTeacherName(formData.teacher_id)
                      : "Select Teacher"
                }
                items={teachers?.map((teacher) => ({
                  label: teacher.fullName,
                  onClick: () =>
                    setFormData((prev) => ({
                      ...prev,
                      teacher_id: teacher.userId,
                    })),
                }))}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Subject:</label>
              <Dropdown
                label={
                  formData.subject_id
                    ? getSubjectName(formData.subject_id)
                    : "Select Subject"
                }
                items={subjects.map((subject) => ({
                  label: subject.name,
                  onClick: () =>
                    setFormData((prev) => ({
                      ...prev,
                      subject_id: subject.id,
                    })),
                }))}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Class Arm (Optional):
              </label>
              <Dropdown
                label={
                  formData.class_arm_id
                    ? getClassArmName(formData.class_arm_id)
                    : "All Class Arms"
                }
                items={[
                  { label: "All Class Arms", onClick: () => setFormData((prev) => ({ ...prev, class_arm_id: "" })) },
                  ...classArms.map((classArm) => ({
                    label: `${classArm.classYearName || classArm.class_year_name} (${classArm.armName || classArm.arm_name})`,
                    onClick: () =>
                      setFormData((prev) => ({
                        ...prev,
                        class_arm_id: classArm.id,
                      })),
                  }))
                ]}
              />
            </div>
          </div>
          
          {/* Academic Period Selection */}
          {academicPeriods.length > 0 && (
            <div className="grid grid-cols-3 gap-6 mt-4">
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Academic Period:</label>
                <Dropdown
                  label={
                    formData.academic_period_id
                      ? academicPeriods.find(p => p.id === formData.academic_period_id)?.name || "Select Period"
                      : "Select Period"
                  }
                  items={academicPeriods.map((period) => ({
                    label: `${period.name} - ${period.yearName || ""}`,
                    onClick: () =>
                      setFormData((prev) => ({
                        ...prev,
                        academic_period_id: period.id,
                      })),
                  }))}
                />
              </div>
            </div>
          )}
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
                  <tr className="border-b-[#D0D0D0] border-b" key={item.id || index}>
                    <td className="p-2 pl-12">
                      {item.teacherName}
                    </td>
                    <td className="p-2">{item.subjectName}</td>
                    <td className="p-2">
                      {item.classArmName ? `${item.classYearName || ""} ${item.classArmName}` : "All Class Arms"}
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
        {totalPages > 1 && (
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
        )}
      </div>
    </div>
  );
};

export default SubjectTeacherAssign;