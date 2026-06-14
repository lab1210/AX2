"use client";
import React, { useState, useEffect } from "react";
import Dropdown from "./DropDown2";
import { FiEdit3, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import classArmDepartmentService from "@/Service/ClassDeptService";
import academicEntityService from "@/Service/AcademicEntityService";
import classService from "@/Service/ClassService";
import toast from "react-hot-toast";

const ClasstoDept = () => {
  const [assignments, setAssignments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // For create mode - can assign multiple class arms to one department
  const [createFormData, setCreateFormData] = useState({
    classArmIds: [],
    departmentId: "",
  });

  // For edit mode - single mapping update
  const [editFormData, setEditFormData] = useState({
    departmentId: "",
    classArmId: "",
    mappingId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [assignmentsRes, departmentsRes, classesRes] = await Promise.all([
        classArmDepartmentService.getAllMappings(),
        academicEntityService.getAllDepartments(),
        classService.getAllClassArms(),
      ]);

      if (assignmentsRes.success) {
        setAssignments(assignmentsRes.data);
      } else {
        toast.error(assignmentsRes.message || "Failed to fetch assignments");
      }
      
      if (departmentsRes.success) {
        setDepartments(departmentsRes.data);
      } else {
        toast.error(departmentsRes.message || "Failed to fetch departments");
      }
      
      if (classesRes.success) {
        setClasses(classesRes.data);
      } else {
        toast.error(classesRes.message || "Failed to fetch classes");
      }
    } catch (error) {
      toast.error(
        "Failed to fetch data: " + (error.message || "Unknown error")
      );
    } finally {
      setLoading(false);
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

  // Add a new class arm field in create mode
  const addClassArmField = () => {
    setCreateFormData((prev) => ({
      ...prev,
      classArmIds: [...prev.classArmIds, ""],
    }));
  };

  // Remove a class arm field in create mode
  const removeClassArmField = (index) => {
    if (createFormData.classArmIds.length <= 1) return;
    setCreateFormData((prev) => ({
      ...prev,
      classArmIds: prev.classArmIds.filter((_, i) => i !== index),
    }));
  };

  // Update a specific class arm field
  const updateCreateClassArmField = (index, value) => {
    setCreateFormData((prev) => {
      const updatedClassArmIds = [...prev.classArmIds];
      updatedClassArmIds[index] = value;
      return { ...prev, classArmIds: updatedClassArmIds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editMode) {
      // EDIT MODE
      if (!editFormData.departmentId && !editFormData.classArmId) {
        toast.error("Please select at least one field to update");
        return;
      }

      try {
        setLoading(true);
        const updateData = {};
        if (editFormData.departmentId) updateData.departmentId = editFormData.departmentId;
        if (editFormData.classArmId) updateData.classArmId = editFormData.classArmId;
        
        const result = await classArmDepartmentService.updateMapping(
          editFormData.mappingId,
          updateData
        );
        
        if (result.success) {
          toast.success("Assignment updated successfully");
          await fetchData();
          resetForm();
        } else {
          // Display error message from API
          toast.error(result.message || "Failed to update assignment");
          // If there are specific errors, show them
          if (result.errors && result.errors.length > 0) {
            result.errors.forEach(err => toast.error(err));
          }
        }
      } catch (error) {
        toast.error(error.message || "Failed to update assignment");
      } finally {
        setLoading(false);
      }
    } else {
      // CREATE MODE
      if (!createFormData.departmentId || createFormData.classArmIds.length === 0) {
        toast.error("Please select a department and at least one class arm");
        return;
      }

      const validClassArms = createFormData.classArmIds.filter(id => id);
      if (validClassArms.length === 0) {
        toast.error("Please select at least one valid class arm");
        return;
      }

      try {
        setLoading(true);
        const createData = {
          classArmIds: validClassArms,
          departmentId: createFormData.departmentId,
        };
        
        const result = await classArmDepartmentService.createMappings(createData);
        
        if (result.success) {
          // Check if there were any failures
          if (result.data && result.data.failed > 0) {
            // Show summary message
            toast.error(result.data.message || `${result.data.failed} mapping(s) failed`);
            // Show each specific error
            if (result.data.errors && result.data.errors.length > 0) {
              result.data.errors.forEach(err => toast.error(err));
            }
            // Show success message for successful ones
            if (result.data.successful > 0) {
              toast.success(`${result.data.successful} mapping(s) created successfully`);
            }
          } else {
            toast.success(result.message || "Assignments created successfully");
          }
          await fetchData();
          resetForm();
        } else {
          // Display error message from API
          toast.error(result.message || "Failed to create assignments");
          // If there are specific errors, show them
          if (result.errors && result.errors.length > 0) {
            result.errors.forEach(err => toast.error(err));
          }
        }
      } catch (error) {
        toast.error(error.message || "Failed to create assignments");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = async (assignment) => {
    setEditFormData({
      departmentId: assignment.departmentId,
      classArmId: assignment.classArmId,
      mappingId: assignment.id,
    });
    setEditMode(true);
  };

  const handleDelete = async (mappingId) => {
    try {
      setLoading(true);
      const result = await classArmDepartmentService.deleteMapping(mappingId);
      if (result.success) {
        toast.success("Assignment deleted successfully");
        await fetchData();
        closeDeleteModal();
      } else {
        toast.error(result.message || "Failed to delete assignment");
      }
    } catch (error) {
      toast.error("Failed to delete assignment: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (classDept) => {
    setSelectedAssignment(classDept);
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setSelectedAssignment(null);
    setDeleteModalVisible(false);
  };

  const resetForm = () => {
    setCreateFormData({
      classArmIds: [],
      departmentId: "",
    });
    setEditFormData({
      departmentId: "",
      classArmId: "",
      mappingId: "",
    });
    setEditMode(false);
    setSelectedAssignment(null);
  };

  const getClassName = (classId) => {
    const classItem = classes.find((c) => c.id === classId);
    return classItem ? `${classItem.classYearName || classItem.class_year_name} (${classItem.armName || classItem.arm_name})` : "Unknown";
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find((d) => d.id === departmentId);
    return department ? department.name : "Unknown";
  };

  return (
    <div>
      {deleteModalVisible && selectedAssignment && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg min-w-75 z-50 p-8">
            <p className="font-bold text-center text-lg">
              Delete Class Department Relationship
            </p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete
              </p>
              <p className="text-base text-[#858383]">
                <span className="font-bold">
                  {selectedAssignment.classArmName} from{" "}
                  {selectedAssignment.departmentName}
                </span>
                ?
              </p>
            </div>
            <div className="font-bold text-md items-center justify-center pt-3 flex gap-5">
              <button
                onClick={() => handleDelete(selectedAssignment.id)}
                disabled={loading}
                className="cursor-pointer text-white bg-[#F94144] rounded-md pl-4 pr-4 py-1"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="cursor-pointer text-[#333333] bg-[#EBEBEB] rounded-md pl-4 pr-4 py-1"
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
            Assign Classes to Departments
          </p>
          <div className="flex gap-2">
            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white font-bold text-sm px-4 py-1 rounded-sm cursor-pointer hover:opacity-90"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#07508F] text-white font-bold text-sm px-4 py-1 rounded-sm cursor-pointer hover:opacity-90 disabled:opacity-50"
            >
              {editMode ? "Update" : "Assign"}
            </button>
          </div>
        </div>
        
        <div className="pl-6 pr-6">
          {editMode ? (
            // EDIT MODE - Single mapping update
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Class:</label>
                <Dropdown
                  label={
                    editFormData.classArmId
                      ? getClassName(editFormData.classArmId)
                      : "Select Class"
                  }
                  items={classes.map((classItem) => ({
                    label: `${classItem.classYearName || classItem.class_year_name} ${classItem.armName || classItem.arm_name}`,
                    onClick: () =>
                      setEditFormData((prev) => ({
                        ...prev,
                        classArmId: classItem.id,
                      })),
                  }))}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">
                  Department:
                </label>
                <Dropdown
                  label={
                    editFormData.departmentId
                      ? getDepartmentName(editFormData.departmentId)
                      : "Select Department"
                  }
                  items={departments.map((department) => ({
                    label: department.name,
                    onClick: () =>
                      setEditFormData((prev) => ({
                        ...prev,
                        departmentId: department.id,
                      })),
                  }))}
                />
              </div>
            </div>
          ) : (
            // CREATE MODE - Multiple class arms to one department
            <>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.88rem] text-[#5E6A72]">Department:</label>
                  <Dropdown
                    label={
                      createFormData.departmentId
                        ? getDepartmentName(createFormData.departmentId)
                        : "Select Department"
                    }
                    items={departments.map((department) => ({
                      label: department.name,
                      onClick: () =>
                        setCreateFormData((prev) => ({
                          ...prev,
                          departmentId: department.id,
                        })),
                    }))}
                  />
                </div>
              </div>
              
              <div className="mb-2">
                <label className="text-[0.88rem] text-[#5E6A72] block mb-2">Class Arms:</label>
                {createFormData.classArmIds.map((classArmId, index) => (
                  <div key={index} className="grid grid-cols-2 gap-6 mb-4 relative">
                    {createFormData.classArmIds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeClassArmField(index)}
                        className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-red-500"
                      >
                        <FiX size={18} />
                      </button>
                    )}
                    <div className="flex flex-col gap-2">
                      <label className="text-[0.88rem] text-[#5E6A72]">Class Arm {index + 1}:</label>
                      <Dropdown
                        label={classArmId ? getClassName(classArmId) : "Select Class Arm"}
                        items={classes.map((classItem) => ({
                          label: `${classItem.classYearName || classItem.class_year_name} (${classItem.armName || classItem.arm_name})`,
                          onClick: () => updateCreateClassArmField(index, classItem.id),
                        }))}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addClassArmField}
                  className="flex items-center gap-2 text-[#07508F] text-sm font-medium mb-4"
                >
                  <FiPlus /> Add another class arm
                </button>
              </div>
            </>
          )}
        </div>
      </form>
      
      <hr className="mt-10" />

      <div className="flex-shrink-0 mb-2">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Class to Department Assignments
        </p>
      </div>
      
      <div className="px-0">
        <div className="overflow-y-auto max-h-[200px] no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-12 bg-[#EDF0F3]">Class Year</th>
                  <th className="p-2 bg-[#EDF0F3]">Class Arm</th>
                  <th className="p-2 bg-[#EDF0F3]">Department</th>
                  <th className="p-2 bg-[#EDF0F3]">School</th>
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
                    No Class to Department Assignments Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={item.id || index}>
                    <td className="p-2 pl-12">{item.classYearName}</td>
                    <td className="p-2">{item.classArmName}</td>
                    <td className="p-2">{item.departmentName}</td>
                    <td className="p-2">{item.schoolName || "N/A"}</td>
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
          <div className="flex justify-end pr-6 items-center gap-2 mt-3 text-sm text-[#01427A] font-semibold">
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

export default ClasstoDept;