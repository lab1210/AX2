"use client";
import academicEntityService from "@/Service/AcademicEntityService";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

const DepartmentSettings = () => {
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [editDepartmentVisible, setEditDepartmentVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [selectedDepartmentDelete, setSelectedDepartmentDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const result = await academicEntityService.getAllDepartments();
      if (result.success) {
        setDepartmentList(result.data);
      } else {
        toast.error(result.message || "Failed to fetch departments");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch departments");
    }
  };

  const paginatedData = departmentList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(departmentList.length / itemsPerPage);
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = editDepartmentVisible
      ? selectedDepartment?.name?.trim()
      : formData.name?.trim();

    if (!trimmedName) {
      toast.error("Department Name is required.");
      return;
    }

    const existingDepartment = departmentList.find(
      (item) => item.name?.toLowerCase() === trimmedName.toLowerCase()
    );

    if (!editDepartmentVisible && existingDepartment) {
      toast.error("Department already exists.");
      return;
    }

    if (editDepartmentVisible && selectedDepartment) {
      try {
        const updateData = {
          name: selectedDepartment.name,
        };
        const result = await academicEntityService.updateDepartment(selectedDepartment.id, updateData);
        
        if (result.success) {
          await fetchDepartments();
          toast.success("Department updated successfully.");
          setEditDepartmentVisible(false);
          setSelectedDepartment(null);
          setFormData({ name: "" });
        } else {
          toast.error(result.message || "Failed to update department.");
        }
      } catch (error) {
        toast.error("An error occurred while updating.");
      }
    } else {
      try {
        const createData = {
          name: formData.name,
        };
        const result = await academicEntityService.createDepartment(createData);

        if (result.success) {
          await fetchDepartments();
          setFormData({ name: "" });
          toast.success("Department added successfully.");
        } else {
          toast.error(result.message || "Failed to add department.");
        }
      } catch (err) {
        toast.error("An error occurred while adding.");
      }
    }
  };

  const handleEdit = (department) => {
    setEditDepartmentVisible(true);
    setSelectedDepartment({ ...department });
  };

  const openDeleteModal = (department) => {
    setSelectedDepartmentDelete(department);
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setSelectedDepartmentDelete(null);
    setDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedDepartmentDelete?.id) {
      try {
        const result = await academicEntityService.deleteDepartment(selectedDepartmentDelete.id);
        if (result.success) {
          toast.success("Department deleted successfully.");
          await fetchDepartments();
          closeDeleteModal();
        } else {
          toast.error(result.message || "Failed to delete department.");
        }
      } catch (error) {
        toast.error("Failed to delete department.");
      }
    }
  };

  return (
    <div>
      {deleteModalVisible && selectedDepartmentDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg min-w-75 z-50 p-8">
            <p className="font-bold text-center text-lg">Delete Department</p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete the department
              </p>
              <p className="text-base text-[#858383]">
                <span className="font-bold">{selectedDepartmentDelete?.name}</span>?
              </p>
            </div>
            <div className="font-bold text-md items-center justify-center pt-3 flex gap-5">
              <button
                onClick={handleDelete}
                className="cursor-pointer text-white bg-[#F94144] rounded-md pl-4 pr-4 py-2"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="cursor-pointer text-[#333333] bg-[#EBEBEB] rounded-md pl-4 pr-4 py-2"
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
            {editDepartmentVisible ? "Edit Department" : "Register New Department"}
          </p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            {editDepartmentVisible ? "Save" : "Set"}
          </button>
        </div>
        <div className="pl-6 pr-6">
          <div className="flex flex-col gap-2">
            <label className="text-[0.88rem] text-[#5E6A72]">Department:</label>
            <input
              type="text"
              placeholder="Enter Department"
              value={editDepartmentVisible ? selectedDepartment?.name || "" : formData.name}
              onChange={(e) => {
                const value = e.target.value;
                editDepartmentVisible
                  ? setSelectedDepartment((prev) => ({ ...prev, name: value }))
                  : setFormData((prev) => ({ ...prev, name: value }));
              }}
              className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
              required
            />
          </div>
        </div>
      </form>

      <hr className="mt-8" />

      <div className="flex-shrink-0">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Departments
        </p>
      </div>

      <div className="px-0">
        <div className="overflow-y-auto max-h-[200px] no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-20 bg-[#EDF0F3]">Departments</th>
                  <th className="p-2 bg-[#EDF0F3]">Actions</th>
                </tr>
              </thead>
            )}
            <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="2" className="p-5 text-center border text-gray-500">
                    No Data Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={item.id || index}>
                    <td className="p-2 pl-20">{item.name}</td>
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

export default DepartmentSettings;