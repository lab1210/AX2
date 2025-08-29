"use client";
import React, { useEffect, useState } from "react";
import Dropdown from "./DropDown";
import { getDepartment, getSubject } from "@/Service/schoolConfig";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  createSubjectDepartmentRelationship,
  deleteSubjectDepartmentRelationship,
  getSubjectDepartmentRelationships,
  updateSubjectDepartmentRelationship,
} from "@/Service/SchoolAdminAssignmentService";
import MultiDropdown from "./MultiDropdown";

const SubjecttoDept = () => {
  const [Subjects, setSubjects] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [SubjectDepartmentList, setSubjectDepartmentList] = useState([]);
  const [selectAssignment, setselectAssignment] = useState(null);
  const [Edit, setEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAssignmentDelete, setselectedAssignmentDelete] =
    useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const itemsPerPage = 10;
  const [formData, setFormData] = useState([
    {
      department: "",
      subject: [],
    },
  ]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getSubject();
        setSubjects(response);
      } catch (error) {
        toast.error("Failed to fetch subjects.");
      }
    };
    const fetchDepartments = async () => {
      try {
        const response = await getDepartment();
        setDepartment(response);
      } catch (error) {
        toast.error("Failed to fetch departments.");
      }
    };

    fetchSubjects();
    fetchDepartments();
    fetchSubjectDepartmentList();
  }, []);

  const fetchSubjectDepartmentList = async () => {
    try {
      const response = await getSubjectDepartmentRelationships();
      setSubjectDepartmentList(response);
    } catch (error) {
      toast.error("Failed to fetch subject-department relationships.");
    }
  };
  const paginatedData = SubjectDepartmentList?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(SubjectDepartmentList?.length / itemsPerPage);
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const resetForm = () => {
    setFormData({
      department: "",
      subject: [],
    });
    setEdit(false);
    setselectAssignment(null);
  };
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const getDepartmentName = (id) => {
    const dept = Department.find((d) => d.department_id === id);
    return dept?.name || "Unknown";
  };

  const getSubjectName = (id) => {
    const subject = Subjects.find((s) => s.subject_id === id);
    return subject?.name || "Unknown";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.department || formData.subject.length === 0) {
      toast.error("Please select both department and at least one subject");
      return;
    }

    try {
      if (Edit && selectAssignment) {
        const updatedData = {
          department: formData.department,
          subject: formData.subject[0], // Take first subject in array
        };

        await updateSubjectDepartmentRelationship(
          selectAssignment.subject_class_id,
          updatedData
        );
        toast.success("Assignment updated successfully");
      } else {
        const assignments = formData.subject.map((subject_id) => ({
          department: formData.department,
          subject: subject_id,
        }));

        await Promise.all(
          assignments.map((assignment) =>
            createSubjectDepartmentRelationship(assignment)
          )
        );
        toast.success(`${assignments.length} assignments created successfully`);
      }

      // Refresh data
      const relationshipsRes = await getSubjectDepartmentRelationships();
      setSubjectDepartmentList(relationshipsRes || []);
      resetForm();
    } catch (error) {
      toast.error(error.message || "Failed to save assignment");
    }
  };

  const handleEdit = (assignment) => {
    setEdit(true);
    setselectAssignment(assignment);
    setFormData({
      department: assignment.department,
      subject: [assignment.subject], // Convert to array for MultiDropdown
    });
  };
  const openDeleteModal = (term) => {
    setselectedAssignmentDelete(term);
    setDeleteModalVisible(true);
  };

  // Function to close delete modal
  const closeDeleteModal = () => {
    setselectedAssignmentDelete(null);
    setDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedAssignmentDelete?.subject_class_id) {
      try {
        const response = await deleteSubjectDepartmentRelationship(
          selectedAssignmentDelete.subject_class_id
        );
        toast.success("Subject Department Assignment deleted successfully.");
        closeDeleteModal();
        fetchSubjectDepartmentList();
      } catch (error) {
        toast.error(error || "Failed to delete Subject Department Assignment.");
      }
    }
  };

  const departmentOptions = Department.map((dept) => ({
    label: dept.name,
    value: dept.department_id,
  }));

  const subjectOptions = Subjects.map((subject) => ({
    label: subject.name,
    value: subject.subject_id,
  }));

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
                  {getSubjectName(selectedAssignmentDelete?.subject)} from {""}
                  {getDepartmentName(selectedAssignmentDelete?.department)}
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
            Assign Subject to Department
          </p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            {Edit ? "Save" : "Assign"}
          </button>
        </div>
        <div className="pl-6 pr-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-x-2 ">
              <label className="text-[0.88rem] text-[#5E6A72]">Subject:</label>
              <MultiDropdown
                label="Select Subject(s)"
                items={Subjects.map((subject) => ({
                  label: subject.name,
                  value: subject.subject_id,
                }))}
                selectedItems={formData.subject?.map((id) =>
                  getSubjectName(id)
                )}
                onSelect={(selectedLabels) => {
                  const selectedIds = selectedLabels
                    .map((label) => {
                      const subject = Subjects.find((s) => s.name === label);
                      return subject?.subject_id;
                    })
                    .filter(Boolean);

                  setFormData((prev) => ({
                    ...prev,
                    subject: selectedIds,
                  }));
                }}
              />
            </div>

            <div className="flex flex-col gap-x-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Department:
              </label>
              <Dropdown
                label={
                  formData.department
                    ? getDepartmentName(formData.department)
                    : "Select Department"
                }
                items={Department.map((dept) => ({
                  label: dept.name,
                  onClick: () =>
                    setFormData((prev) => ({
                      ...prev,
                      department: dept.department_id,
                    })),
                }))}
              />
            </div>
          </div>
        </div>
      </form>
      <hr />
      <div className="flex-shrink-0">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Assigned Subject (s) to Department.
        </p>
      </div>
      <div className="px-0">
        <div className="overflow-y-auto max-h-[200px] no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData?.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-16 bg-[#EDF0F3]">Subject (s)</th>
                  <th className="p-2 bg-[#EDF0F3]">Department</th>
                  <th className="p-2 bg-[#EDF0F3]">Actions</th>
                </tr>
              </thead>
            )}
            <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
              {paginatedData?.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="p-5  text-center border text-gray-500"
                  >
                    No Data Available
                  </td>
                </tr>
              ) : (
                paginatedData?.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={index}>
                    <td className="p-2 pl-16">{item.subject_name}</td>
                    <td>{item.department_name}</td>
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
      </div>
    </div>
  );
};

export default SubjecttoDept;
