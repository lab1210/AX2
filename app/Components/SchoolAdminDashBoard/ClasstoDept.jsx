import React, { useState, useEffect } from "react";
import Dropdown from "./DropDown2";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import {
  createClassDepartmentAssignment,
  getClassDepartmentAssignments,
  updateClassDepartmentAssignment,
  deleteClassDepartmentAssignment,
  getclassdepartmentbyid,
} from "../../Service/SchoolAdminAssignmentService";
import { getDepartment } from "../../Service/schoolConfig";
import { getClass } from "../../Service/schoolConfig";
import toast from "react-hot-toast";

const ClasstoDept = () => {
  const [assignments, setAssignments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [formData, setFormData] = useState({
    classes: "",
    department: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsRes, departmentsRes, classesRes] = await Promise.all([
        getClassDepartmentAssignments(),
        getDepartment(),
        getClass(),
      ]);

      setAssignments(assignmentsRes || []);
      setDepartments(departmentsRes || []);
      setClasses(classesRes?.data || []);
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

    if (!formData.classes || !formData.department) {
      toast.error("Please select both class and department");
      return;
    }

    try {
      if (editMode && selectedAssignment) {
        await updateClassDepartmentAssignment(
          selectedAssignment.subject_class_id,
          formData
        );
        toast.success("Assignment updated successfully");
      } else {
        await createClassDepartmentAssignment(formData);
        toast.success("Assignment created successfully");
      }

      await fetchData();
      resetForm();
    } catch (error) {
      toast.error(error.message || "Failed to save assignment");
      console.error("Submission error:", error);
    }
  };

  const handleEdit = async (assignment) => {
    try {
      const assignmentDetails = await getclassdepartmentbyid(
        assignment.subject_class_id
      );
      setSelectedAssignment(assignmentDetails);
      setFormData({
        classes: assignmentDetails.classes,
        department: assignmentDetails.department,
      });
      setEditMode(true);
    } catch (error) {
      toast.error("Failed to load assignment details");
    }
  };

  const handleDelete = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) {
      return;
    }

    try {
      await deleteClassDepartmentAssignment(assignmentId);
      toast.success("Assignment deleted successfully");
      await fetchData();
    } catch (error) {
      toast.error("Failed to delete assignment");
    }
  };

  const resetForm = () => {
    setFormData({
      classes: "",
      department: "",
    });
    setEditMode(false);
    setSelectedAssignment(null);
  };

  const getClassName = (classId) => {
    const classItem = classes.find((c) => c.class_year_id === classId);
    return classItem ? classItem.class_name : "Unknown";
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(
      (d) => d.department_id === departmentId
    );
    return department ? department.name : "Unknown";
  };

  return (
    <div>
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
                className="bg-gray-500 text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
            >
              {editMode ? "Update" : "Assign"}
            </button>
          </div>
        </div>
        <div className="pl-6 pr-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Class:</label>
              <Dropdown
                label={
                  formData.classes
                    ? getClassName(formData.classes)
                    : "Select Class"
                }
                items={classes.map((classItem) => ({
                  label: classItem.class_name,
                  onClick: () =>
                    setFormData((prev) => ({
                      ...prev,
                      classes: classItem.class_year_id,
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
                  formData.department
                    ? getDepartmentName(formData.department)
                    : "Select Department"
                }
                items={departments.map((department) => ({
                  label: department.name,
                  onClick: () =>
                    setFormData((prev) => ({
                      ...prev,
                      department: department.department_id,
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
          Existing Class to Department Assignments
        </p>
      </div>
      <div className="px-0">
        <div className="overflow-y-auto max-h-[200px] no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-12 bg-[#EDF0F3]">Class</th>
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
                    colSpan="4"
                    className="p-5 text-center border text-gray-500"
                  >
                    No Class to Department Assignments Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={index}>
                    <td className="p-2 pl-12">
                      {item.class_name || getClassName(item.classes)}
                    </td>
                    <td className="p-2">
                      {item.department_name ||
                        getDepartmentName(item.department)}
                    </td>
                    <td className="p-2">{item.school_name || "N/A"}</td>
                    <td className="p-2">
                      <div className="flex gap-4">
                        <FiEdit3
                          onClick={() => handleEdit(item)}
                          className="text-[#80ADCB] cursor-pointer"
                          size={15}
                        />
                        <FiTrash2
                          onClick={() => handleDelete(item.subject_class_id)}
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
