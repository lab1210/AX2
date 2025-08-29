"use client";
import React, { useState, useEffect } from "react";
import Dropdown2 from "./DropDown2";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import {
  createTeachertoClassRelationship,
  deleteTeacherClassRelationship,
  getTeacherClassRelationships,
  updateTeacherClassRelationship,
} from "../../Service/SchoolAdminAssignmentService";
import { getTeachers } from "../../Service/teacherService";
import { getClassArm } from "../../Service/schoolConfig";
import toast from "react-hot-toast";

const ClassTeacherAssign = () => {
  const [classTeacherRelationships, setClassTeacherRelationships] = useState(
    []
  );
  const [teachers, setTeachers] = useState([]);
  const [classArms, setClassArms] = useState([]);
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeacherName, setSelectedTeacherName] = useState("");
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    teacher_id: "",
    class_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [relationships, teachersRes, classArmsRes] = await Promise.all([
        getTeacherClassRelationships(),
        getTeachers(),
        getClassArm(),
      ]);

      setClassTeacherRelationships(relationships);
      setTeachers(teachersRes);
      setClassArms(classArmsRes.data);
    } catch (error) {
      toast.error(
        "Failed to fetch data: " + (error.message || "Unknown error")
      );
    }
  };

  const paginatedData = classTeacherRelationships.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(classTeacherRelationships.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.teacher_id || !formData.class_id) {
      toast.error("Please select a teacher and a class arm");
      return;
    }

    try {
      if (editMode && selectedRelationship) {
        const response = await updateTeacherClassRelationship(
          selectedRelationship.class_teacher_id,
          {
            teacher: formData.teacher_id,
            class_assigned: formData.class_id,
          }
        );

        if (response.error) {
          throw new Error(response.error);
        }

        toast.success("Assignment updated successfully");
      } else {
        const payload = {
          teacher_id: formData.teacher_id,
          class_id: formData.class_id,
        };

        const response = await createTeachertoClassRelationship(payload);
        if (response.error) {
          throw new Error(response.error);
        }

        toast.success("Teacher assigned successfully");
      }

      await fetchData();
      resetForm();
    } catch (error) {
      toast.error(error.message || "Failed to save assignment");
      console.error("Submission error:", error);
    }
  };

  const handleEdit = (relationship) => {
    setSelectedRelationship(relationship);

    // Set the teacher name and ID for display in the dropdown
    const teacher = teachers.find((t) => t.teacher_id === relationship.teacher);
    if (teacher) {
      const teacherName = `${teacher.first_name} ${teacher.last_name}`;
      setSelectedTeacherName(teacherName);
      setFormData({
        teacher_id: relationship.teacher,
        class_id: relationship.class_assigned,
      });
    }

    setEditMode(true);
  };

  const handleDelete = async (relationshipId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) {
      return;
    }

    try {
      await deleteTeacherClassRelationship(relationshipId);
      toast.success("Relationship deleted successfully");
      await fetchData();
    } catch (error) {
      toast.error(
        "Failed to delete relationship: " + (error.message || "Unknown error")
      );
    }
  };

  const resetForm = () => {
    setFormData({
      teacher_id: "",
      class_id: "",
    });
    setSelectedTeacherName("");
    setEditMode(false);
    setSelectedRelationship(null);
  };

  const getClassArmDisplayName = (classId) => {
    if (editMode && selectedRelationship) {
      return selectedRelationship.class_assigned_name;
    }
    const classArm = classArms.find((c) => c.class_id === classId);
    return classArm
      ? `${classArm.class_year_name} (${classArm.arm_name})`
      : "Select Class Arm";
  };

  const getTeacherDisplayName = () => {
    if (editMode && selectedRelationship) {
      return selectedTeacherName;
    }

    const teacher = teachers.find((t) => t.teacher_id === formData.teacher_id);
    return teacher
      ? `${teacher.first_name} ${teacher.last_name}`
      : "Select Teacher";
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-3 flex-shrink-0">
        <div className="flex pt-3 pl-6 pr-6 justify-between mb-2 ">
          <p className="font-bold text-[#07508F]">
            {editMode ? "Edit" : "Assign"} Teacher to Class Arm
          </p>
          <div className="flex gap-2">
            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
            >
              {editMode ? "Save Changes" : "Assign"}
            </button>
          </div>
        </div>
        <div className="pl-6 pr-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Teacher:</label>
              <Dropdown2
                label="Select Teacher"
                selected={getTeacherDisplayName()}
                items={teachers?.map((teacher) => ({
                  label: `${teacher.first_name} ${teacher.last_name}`,
                  onClick: () => {
                    setFormData((prev) => ({
                      ...prev,
                      teacher_id: teacher.teacher_id,
                    }));
                  },
                }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Class Arm:
              </label>
              <Dropdown2
                label="Select Class Arm"
                selected={getClassArmDisplayName(formData.class_id)}
                items={classArms.map((classArm) => ({
                  label: `${classArm.class_year_name} (${classArm.arm_name})`,
                  onClick: () =>
                    setFormData((prev) => ({
                      ...prev,
                      class_id: classArm.class_id,
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
          Existing Assigned Teachers to Class Arms
        </p>
      </div>
      <div className="px-0">
        <div className="overflow-y-auto max-h-[200px] no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-12 bg-[#EDF0F3]">Teachers</th>
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
                    colSpan="4"
                    className="p-5  text-center border text-gray-500"
                  >
                    No Assigned Teachers to Class Arms Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={index}>
                    <td className="p-2 pl-12">
                      {item.teacher_name + " " + item.teacher_lastname}
                    </td>
                    <td className="p-2">{item.class_assigned_name}</td>
                    <td className="p-2">{item.class_assigned_arm}</td>
                    <td className="p-2">
                      <div className="flex gap-4">
                        <FiEdit3
                          onClick={() => handleEdit(item)}
                          className="text-[#80ADCB] cursor-pointer"
                          size={15}
                        />
                        <FiTrash2
                          onClick={() => handleDelete(item.class_teacher_id)}
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
        )}
      </div>
    </div>
  );
};

export default ClassTeacherAssign;
