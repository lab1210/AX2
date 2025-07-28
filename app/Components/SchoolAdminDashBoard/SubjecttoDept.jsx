"use client";
import React, { useEffect, useState } from "react";
import Dropdown from "./DropDown";
import MultiDropdown from "./MultiDropDown";
import { getDepartment, getSubject } from "@/Service/schoolConfig";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  createSubjectDepartmentRelationship,
  deleteSubjectDepartmentRelationship,
  getSubjectDepartmentRelationships,
  updateSubjectDepartmentRelationship,
} from "@/Service/SchoolAdminAssignmentService";

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
      subject: "",
    },
  ]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data, error } = await getSubject();
      if (data) setSubjects(data);
      else toast.error(error || "Failed to fetch subjects");
    };
    const fetchDepartments = async () => {
      const { data, error } = await getDepartment();
      if (data) setDepartment(data);
      else toast.error(error || "Failed to fetch departments");
    };
    const fetchSubjectDepartmentList = async () => {
      const { data, error } = await getSubjectDepartmentRelationships();
      if (data) setSubjectDepartmentList(data);
      else toast.error(error || "Failed to fetch List");
    };
    fetchSubjects();
    fetchDepartments();
    fetchSubjectDepartmentList();
  }, []);

  const paginatedData = SubjectDepartmentList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(SubjectDepartmentList.length / itemsPerPage);
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingDepartment = SubjectDepartmentList.find(
      (item) => item.department === formData.department
    );

    if (!Edit && existingDepartment) {
      toast.error("Department Assignment already exists.");
      return;
    }

    if (Edit && selectAssignment) {
      try {
        const updatedAssignment = {
          ...selectAssignment,
          subject: selectAssignment.subject,
          department: selectAssignment.department,
        };
        const { data, error } = await updateSubjectDepartmentRelationship(
          selectAssignment.subject_class_id,
          updatedAssignment
        );
        if (error) {
          toast.error(
            error || "Failed to update Subject Department Assignment"
          );
          return;
        }
        const updatedList = SubjectDepartmentList.map((item) =>
          item.subject_class_id === selectAssignment.subject_class_id
            ? data
            : item
        );
        setSubjectDepartmentList(updatedList);
        toast.success("Subject Department Assignment updated successfully");
        setEdit(false);
        setselectAssignment(null);
      } catch (error) {
        toast.error("Failed to update Subject Department Assignment");
      }
    } else {
      try {
        const { data, error } = await createSubjectDepartmentRelationship(
          formData
        );
        if (error) {
          toast.error(
            error || "Failed to create Subject Department Assignment"
          );
        } else {
          setSubjectDepartmentList((prev) => [...prev, data]);
          toast.success("Subject Department Assignment created successfully");
        }
      } catch (error) {
        toast.error("Failed to create Subject Department Assignment");
      }
    }
    setFormData({
      department: "",
      subject: "",
    });
  };

  const handleEdit = (SubjectDepartment) => {
    setEdit(true);
    setselectAssignment({ ...SubjectDepartment });
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
        if (response?.status === 204) {
          toast.success("Subject Department Assignment deleted successfully.");
          closeDeleteModal();
        } else {
          toast.error("Failed to delete Subject Department Assignment.");
          closeDeleteModal();
        }
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
                  {selectedAssignmentDelete?.department}
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
                label="Select Subject (s)"
                items={subjectOptions}
                selectedItems={
                  Edit ? selectAssignment.subject : formData.subject
                }
                onSelect={(selected) =>
                  Edit
                    ? setselectAssignment((prev) => ({
                        ...prev,
                        subject: selected,
                      }))
                    : setFormData((prev) => ({
                        ...prev,
                        subject: selected,
                      }))
                }
              />
            </div>

            <div className="flex flex-col gap-x-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Department:
              </label>
              <Dropdown
                label={
                  Edit
                    ? Department.find(
                        (d) => d.department_id === selectAssignment?.department
                      )?.name || "Select Department"
                    : Department.find(
                        (d) => d.department_id === formData.department
                      )?.name || "Select Department"
                }
                items={Department.map((dept) => ({
                  label: dept.name,
                  onClick: () =>
                    Edit
                      ? setselectAssignment((prev) => ({
                          ...prev,
                          department: dept.department_id,
                        }))
                      : setFormData((prev) => ({
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
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-16 bg-[#EDF0F3]">Subject (s)</th>
                  <th className="p-2 bg-[#EDF0F3]">Department</th>
                  <th className="p-2 bg-[#EDF0F3]">Actions</th>
                </tr>
              </thead>
            )}
            <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="p-5  text-center border text-gray-500"
                  >
                    No Data Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
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
