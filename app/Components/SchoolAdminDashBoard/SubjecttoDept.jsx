"use client";
import React, { useEffect, useState } from "react";
import Dropdown from "./DropDown2";
import { FiEdit3, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import subjectDepartmentService from "@/Service/SubjectDeptService";
import academicEntityService from "@/Service/AcademicEntityService";

const SubjecttoDept = () => {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subjectDepartmentList, setSubjectDepartmentList] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedAssignmentDelete, setSelectedAssignmentDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const itemsPerPage = 10;
  
  // For create mode - can assign multiple subjects to one department
  const [createFormData, setCreateFormData] = useState({
    subjectIds: [],
    departmentId: "",
  });

  // For edit mode - single mapping update
  const [editFormData, setEditFormData] = useState({
    departmentId: "",
    subjectId: "",
    mappingId: "",
  });

  useEffect(() => {
    fetchSubjects();
    fetchDepartments();
    fetchSubjectDepartmentList();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await academicEntityService.getAllSubjects();
      if (response.success) {
        setSubjects(response.data);
      } else {
        toast.error(response.message || "Failed to fetch subjects.");
      }
    } catch (error) {
      toast.error("Failed to fetch subjects.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await academicEntityService.getAllDepartments();
      if (response.success) {
        setDepartments(response.data);
      } else {
        toast.error(response.message || "Failed to fetch departments.");
      }
    } catch (error) {
      toast.error("Failed to fetch departments.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjectDepartmentList = async () => {
    try {
      setLoading(true);
      const response = await subjectDepartmentService.getAllMappings();
      if (response.success) {
        setSubjectDepartmentList(response.data);
      } else {
        toast.error(response.message || "Failed to fetch subject-department relationships.");
      }
    } catch (error) {
      toast.error("Failed to fetch subject-department relationships.");
    } finally {
      setLoading(false);
    }
  };

  const paginatedData = subjectDepartmentList?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(subjectDepartmentList?.length / itemsPerPage);
  
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const resetForm = () => {
    setCreateFormData({
      subjectIds: [],
      departmentId: "",
    });
    setEditFormData({
      departmentId: "",
      subjectId: "",
      mappingId: "",
    });
    setEditMode(false);
    setSelectedAssignment(null);
  };

  const getDepartmentName = (id) => {
    const dept = departments.find((d) => d.id === id);
    return dept?.name || "Unknown";
  };

  const getSubjectName = (id) => {
    const subject = subjects.find((s) => s.id === id);
    return subject?.name || "Unknown";
  };

  // Add a new subject field in create mode
  const addSubjectField = () => {
    setCreateFormData((prev) => ({
      ...prev,
      subjectIds: [...prev.subjectIds, ""],
    }));
  };

  // Remove a subject field in create mode
  const removeSubjectField = (index) => {
    if (createFormData.subjectIds.length <= 1) return;
    setCreateFormData((prev) => ({
      ...prev,
      subjectIds: prev.subjectIds.filter((_, i) => i !== index),
    }));
  };

  // Update a specific subject field
  const updateCreateSubjectField = (index, value) => {
    setCreateFormData((prev) => {
      const updatedSubjectIds = [...prev.subjectIds];
      updatedSubjectIds[index] = value;
      return { ...prev, subjectIds: updatedSubjectIds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editMode) {
      // EDIT MODE
      if (!editFormData.departmentId && !editFormData.subjectId) {
        toast.error("Please select at least one field to update");
        return;
      }

      try {
        setLoading(true);
        const updateData = {};
        if (editFormData.departmentId) updateData.departmentId = editFormData.departmentId;
        if (editFormData.subjectId) updateData.subjectId = editFormData.subjectId;
        
        const result = await subjectDepartmentService.updateMapping(
          editFormData.mappingId,
          updateData
        );
        
        if (result.success) {
          toast.success("Assignment updated successfully");
          await fetchSubjectDepartmentList();
          resetForm();
        } else {
          toast.error(result.message || "Failed to update assignment");
          if (result.errors && result.errors.length > 0) {
            result.errors.forEach(err => toast.error(err));
          }
        }
      } catch (error) {
        toast.error(error.message || "Failed to update assignment");
        console.error("Update error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      // CREATE MODE
      if (!createFormData.departmentId || createFormData.subjectIds.length === 0) {
        toast.error("Please select a department and at least one subject");
        return;
      }

      const validSubjects = createFormData.subjectIds.filter(id => id);
      if (validSubjects.length === 0) {
        toast.error("Please select at least one valid subject");
        return;
      }

      try {
        setLoading(true);
        const createData = {
          subjectIds: validSubjects,
          departmentId: createFormData.departmentId,
        };
        
        const result = await subjectDepartmentService.createMappings(createData);
        
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
              toast.success(`${result.data.successful} assignment(s) created successfully`);
            }
          } else {
            toast.success(result.message || "Assignments created successfully");
          }
          await fetchSubjectDepartmentList();
          resetForm();
        } else {
          toast.error(result.message || "Failed to create assignments");
          if (result.errors && result.errors.length > 0) {
            result.errors.forEach(err => toast.error(err));
          }
        }
      } catch (error) {
        toast.error(error.message || "Failed to create assignments");
        console.error("Create error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (assignment) => {
    setEditMode(true);
    setSelectedAssignment(assignment);
    setEditFormData({
      departmentId: assignment.departmentId,
      subjectId: assignment.subjectId,
      mappingId: assignment.id,
    });
  };

  const openDeleteModal = (term) => {
    setSelectedAssignmentDelete(term);
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setSelectedAssignmentDelete(null);
    setDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedAssignmentDelete?.id) {
      try {
        setLoading(true);
        const result = await subjectDepartmentService.deleteMapping(selectedAssignmentDelete.id);
        if (result.success) {
          toast.success("Subject Department Assignment deleted successfully.");
          closeDeleteModal();
          await fetchSubjectDepartmentList();
        } else {
          toast.error(result.message || "Failed to delete Subject Department Assignment.");
        }
      } catch (error) {
        toast.error(error.message || "Failed to delete Subject Department Assignment.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      {deleteModalVisible && selectedAssignmentDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg min-w-75 z-50 p-8">
            <p className="font-bold text-center text-lg">
              Delete Subject Department Relationship
            </p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete
              </p>
              <p className="text-base text-[#858383]">
                <span className="font-bold">
                  {getSubjectName(selectedAssignmentDelete?.subjectId)} from{" "}
                  {getDepartmentName(selectedAssignmentDelete?.departmentId)}
                </span>
                ?
              </p>
            </div>
            <div className="font-bold text-md items-center justify-center pt-3 flex gap-5">
              <button
                onClick={handleDelete}
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
            Assign Subject to Department
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
              {editMode ? "Save" : "Assign"}
            </button>
          </div>
        </div>
        
        <div className="pl-6 pr-6">
          {editMode ? (
            // EDIT MODE - Single mapping update
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Subject:</label>
                <Dropdown
                  label={
                    editFormData.subjectId
                      ? getSubjectName(editFormData.subjectId)
                      : "Select Subject"
                  }
                  items={subjects.map((subject) => ({
                    label: subject.name,
                    onClick: () =>
                      setEditFormData((prev) => ({
                        ...prev,
                        subjectId: subject.id,
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
                  items={departments.map((dept) => ({
                    label: dept.name,
                    onClick: () =>
                      setEditFormData((prev) => ({
                        ...prev,
                        departmentId: dept.id,
                      })),
                  }))}
                />
              </div>
            </div>
          ) : (
            // CREATE MODE - Multiple subjects to one department
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
                    items={departments.map((dept) => ({
                      label: dept.name,
                      onClick: () =>
                        setCreateFormData((prev) => ({
                          ...prev,
                          departmentId: dept.id,
                        })),
                    }))}
                  />
                </div>
              </div>
              
              <div className="mb-2">
                <label className="text-[0.88rem] text-[#5E6A72] block mb-2">Subjects:</label>
                {createFormData.subjectIds.map((subjectId, index) => (
                  <div key={index} className="grid grid-cols-2 gap-6 mb-4 relative">
                    {createFormData.subjectIds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubjectField(index)}
                        className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-red-500"
                      >
                        <FiX size={18} />
                      </button>
                    )}
                    <div className="flex flex-col gap-2">
                      <label className="text-[0.88rem] text-[#5E6A72]">Subject {index + 1}:</label>
                      <Dropdown
                        label={subjectId ? getSubjectName(subjectId) : "Select Subject"}
                        items={subjects.map((subject) => ({
                          label: subject.name,
                          onClick: () => updateCreateSubjectField(index, subject.id),
                        }))}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSubjectField}
                  className="flex items-center gap-2 text-[#07508F] text-sm font-medium mb-4"
                >
                  <FiPlus /> Add another subject
                </button>
              </div>
            </>
          )}
        </div>
      </form>
      
      <hr className="mt-10" />
      
      <div className="flex-shrink-0">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Assigned Subject(s) to Department
        </p>
      </div>
      
      <div className="px-0">
        <div className="overflow-y-auto max-h-[200px] no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData?.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-16 bg-[#EDF0F3]">Subject</th>
                  <th className="p-2 bg-[#EDF0F3]">Department</th>
                  <th className="p-2 bg-[#EDF0F3]">Actions</th>
                </tr>
              </thead>
            )}
            <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
              {paginatedData?.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-5 text-center border text-gray-500">
                    No Data Available
                  </td>
                </tr>
              ) : (
                paginatedData?.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={item.id || index}>
                    <td className="p-2 pl-16">{item.subjectName}</td>
                    <td>{item.departmentName}</td>
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

export default SubjecttoDept;