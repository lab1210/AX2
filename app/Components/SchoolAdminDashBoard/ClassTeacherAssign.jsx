import React, { useState, useEffect } from "react";
import { FiEdit3, FiTrash2, FiPlus, FiX } from "react-icons/fi";
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
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedClassDelete, setSelectedClassDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [createFormData, setCreateFormData] = useState({
    assignments: [{ teacher_id: "", class_id: "" }],
  });

  const [editFormData, setEditFormData] = useState({
    teacher_id: "",
    class_id: "",
    relationship_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [relationships, teachersRes, classArmsRes] = await Promise.all([
        getTeacherClassRelationships(),
        getTeachers(),
        getClassArm(),
      ]);

      setClassTeacherRelationships(relationships);
      setTeachers(teachersRes);
      setClassArms(classArmsRes.data || classArmsRes);
    } catch (error) {
      toast.error(
        "Failed to fetch data: " + (error.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const itemsPerPage = 10;
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

  const addAssignmentField = () => {
    setCreateFormData((prev) => ({
      ...prev,
      assignments: [...prev.assignments, { teacher_id: "", class_id: "" }],
    }));
  };

  const removeAssignmentField = (index) => {
    if (createFormData.assignments.length <= 1) return;
    setCreateFormData((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((_, i) => i !== index),
    }));
  };

  const updateCreateAssignmentField = (index, field, value) => {
    setCreateFormData((prev) => {
      const updatedAssignments = [...prev.assignments];
      updatedAssignments[index] = {
        ...updatedAssignments[index],
        [field]: value,
      };
      return { ...prev, assignments: updatedAssignments };
    });
  };

  const updateEditFormData = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editMode) {
      // EDIT MODE VALIDATION
      if (!editFormData.teacher_id || !editFormData.class_id) {
        toast.error("Please select both a teacher and class arm");
        return;
      }

      try {
        // Create a clean payload without relationship_id
        const updatePayload = {
          class_assigned: editFormData.class_id,
          teacher: editFormData.teacher_id,
        };

        const response = await updateTeacherClassRelationship(
          editFormData.relationship_id,
          updatePayload
        );

        if (response.error) throw new Error(response.error);
        toast.success("Assignment updated successfully");
        await fetchData();
        resetForm();
      } catch (error) {
        toast.error(error.message || "Failed to update assignment");
      }
    } else {
      // CREATE MODE VALIDATION
      const invalidAssignments = createFormData.assignments.filter(
        (assignment) => !assignment.teacher_id || !assignment.class_id
      );

      if (invalidAssignments.length > 0) {
        toast.error(
          "Please ensure all assignments have both a teacher and class arm selected"
        );
        return;
      }

      try {
        const response = await createTeachertoClassRelationship(createFormData);
        if (response.error) throw new Error(response.error);
        toast.success("Teachers assigned successfully");
        await fetchData();
        resetForm();
      } catch (error) {
        toast.error(error.message || "Failed to save assignment");
      }
    }
  };

  const handleEdit = (relationship) => {
    setEditFormData({
      teacher_id: relationship.teacher,
      class_id: relationship.class_assigned,
      relationship_id: relationship.class_teacher_id,
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
    if (selectedClassDelete?.class_teacher_id) {
      try {
        const response = await deleteTeacherClassRelationship(
          selectedClassDelete?.class_teacher_id
        );
        toast.success("Relationship deleted successfully");
        closeDeleteModal();
        await fetchData();
      } catch (error) {
        toast.error(
          "Failed to delete relationship: " + (error.message || "Unknown error")
        );
      }
    }
  };

  const resetForm = () => {
    setCreateFormData({ assignments: [{ teacher_id: "", class_id: "" }] });
    setEditFormData({ teacher_id: "", class_id: "", relationship_id: "" });
    setEditMode(false);
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
              Delete Class Teacher
            </p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete the class teacher
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
        <div className="flex pt-3 pl-6 pr-6 justify-between mb-2 ">
          <p className="font-bold text-[#07508F]">
            {editMode ? "Edit" : "Assign"} Teacher to Class Arm
          </p>
          <div className="flex gap-2">
            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white font-bold text-sm px-4 py-2 rounded-sm cursor-pointer hover:opacity-90"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-[#07508F] text-white font-bold text-sm px-4 py-2 rounded-sm cursor-pointer hover:opacity-90"
            >
              {editMode ? "Save Changes" : "Assign"}
            </button>
          </div>
        </div>

        <div className="pl-6 pr-6">
          {editMode ? (
            // EDIT MODE FORM - SINGLE ASSIGNMENT
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">
                  Teacher:
                </label>
                <select
                  value={editFormData.teacher_id}
                  onChange={(e) =>
                    updateEditFormData("teacher_id", e.target.value)
                  }
                  className=" border-[1.5px] sm:text-xs lg:text-sm text-[#808080] border-[#B6B6B6] rounded-sm p-1.5 focus:outline-none  focus:border-[#1F619A] focus:border-2"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.teacher_id} value={teacher.teacher_id}>
                      {teacher.first_name} {teacher.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">
                  Class Arm:
                </label>
                <select
                  value={editFormData.class_id}
                  onChange={(e) =>
                    updateEditFormData("class_id", e.target.value)
                  }
                  className="border-[1.5px] sm:text-xs lg:text-sm   text-[#808080] border-[#B6B6B6] rounded-sm p-1.5 focus:outline-none  focus:border-[#1F619A] focus:border-2"
                >
                  <option value="">Select Class Arm</option>
                  {classArms.map((classArm) => (
                    <option key={classArm.class_id} value={classArm.class_id}>
                      {classArm.class_year_name} ({classArm.arm_name})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            // CREATE MODE FORM - MULTIPLE ASSIGNMENTS
            <>
              {createFormData.assignments.map((assignment, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-6 mb-4 relative"
                >
                  {createFormData.assignments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAssignmentField(index)}
                      className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-red-500"
                    >
                      <FiX size={18} />
                    </button>
                  )}
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.88rem] text-[#5E6A72]">
                      Teacher:
                    </label>
                    <select
                      value={assignment.teacher_id}
                      onChange={(e) =>
                        updateCreateAssignmentField(
                          index,
                          "teacher_id",
                          e.target.value
                        )
                      }
                      className=" border-[1.5px] sm:text-xs lg:text-sm  text-[#808080] border-[#B6B6B6] rounded-sm p-1.5 focus:outline-none  focus:border-[#1F619A] focus:border-2"
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map((teacher) => (
                        <option
                          key={teacher.teacher_id}
                          value={teacher.teacher_id}
                        >
                          {teacher.first_name} {teacher.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.88rem] text-[#5E6A72]">
                      Class Arm:
                    </label>
                    <select
                      value={assignment.class_id}
                      onChange={(e) =>
                        updateCreateAssignmentField(
                          index,
                          "class_id",
                          e.target.value
                        )
                      }
                      className=" border-[1.5px] sm:text-xs lg:text-sm  text-[#808080] border-[#B6B6B6] rounded-sm p-1.5 focus:outline-none  focus:border-[#1F619A] focus:border-2"
                    >
                      <option value="">Select Class Arm</option>
                      {classArms.map((classArm) => (
                        <option
                          key={classArm.class_id}
                          value={classArm.class_id}
                        >
                          {classArm.class_year_name} ({classArm.arm_name})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addAssignmentField}
                className="flex items-center gap-2 text-[#07508F] text-sm font-medium mb-4"
              >
                <FiPlus /> Add Another Assignment
              </button>
            </>
          )}
        </div>
      </form>
      <hr className="mt-10" />

      <div className="flex-shrink-0 mb-2">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Assigned Teachers to Class Arms
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#07508F]"></div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default ClassTeacherAssign;
