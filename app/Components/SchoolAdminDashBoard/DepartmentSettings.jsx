"use client";
import {
  createDepartment,
  getDepartment,
  UpdateDepartment,
} from "@/Service/schoolConfig";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

const DepartmentSettings = () => {
  const [departmentList, setDepartmentList] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [editDepartmentVisible, setEditDepartmentVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [selectedDepartmentDelete, setSelectedDepartmentDelete] =
    useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartment();
        setDepartmentList(data);
      } catch (error) {
        toast.error(error || "Failed to fetch departments");
      }
    };
    fetchDepartments();
  }, []);

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
      setMessage("Department Name is required.");
      setMessageType("error");
      return;
    }

    const existingdepartment = departmentList.find(
      (item) => item.name?.toLowerCase() === trimmedName.toLowerCase()
    );

    if (!editDepartmentVisible && existingdepartment) {
      setMessage("Department already exists.");
      setMessageType("error");
      return;
    }

    if (editDepartmentVisible && selectedClass) {
      try {
        const updatedClass = {
          ...selectedDepartment,
          name: selectedDepartment.name,
        };
        const { data, error } = await UpdateDepartment(
          selectedDepartment.department_id,
          updatedClass
        );
        if (error) {
          setMessage(error || "Failed to update department.");
          setMessageType("error");
          return;
        }
        const updatedList = departmentList.map((item) =>
          item.department_id === selectedDepartment.department_id ? data : item
        );
        setDepartmentList(updatedList);
        setMessage("Department updated successfully.");
        setMessageType("success");
        setEditDepartmentVisible(false);
        setSelectedDepartment(null);
      } catch (error) {
        setMessage("An error occurred while updating.");
        setMessageType("error");
      }
    } else {
      try {
        const createPayload = {
          name: formData.name,
        };

        const { data, error } = await createDepartment(createPayload);

        if (error) {
          setMessage(error || "Failed to add department.");
          setMessageType("error");
        } else {
          setDepartmentList((prev) => [...prev, data]);
          setMessage("Department added successfully.");
          setMessageType("success");
        }
      } catch (err) {
        setMessage("An error occurred while adding.");
        setMessageType("error");
      }
    }
    setFormData({
      name: "",
    });

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleEdit = (term) => {
    setEditDepartmentVisible(true);
    setSelectedDepartment({ ...term });
  };

  const openDeleteModal = (term) => {
    setSelectedDepartmentDelete(term);
    setDeleteModalVisible(true);
  };

  // Function to close delete modal
  const closeDeleteModal = () => {
    setSelectedDepartmentDelete(null);
    setDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedDepartmentDelete?.department_id) {
      try {
        const response = await deleteClassArm(
          selectedDepartmentDelete.department_id
        );
        if (response?.status === 204) {
          setMessage("Department deleted successfully.");
          setMessageType("success");
          closeDeleteModal();
        } else {
          setMessage("Failed to delete Department.");
          setMessageType("error");
          closeDeleteModal();
        }
      } catch (error) {
        setMessageType("error");
        setMessage("Failed to delete Department.");
      }
    }
  };
  return (
    <div>
      {message && (
        <div
          className={`mx-6 mb-3 text-sm px-4 py-2 rounded-sm font-semibold ${
            messageType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

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
                <span className="font-bold">
                  {selectedDepartmentDelete?.name}
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
            {editDepartmentVisible
              ? "Edit Department"
              : "Register New Department"}
          </p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            {editDepartmentVisible ? "Save" : "Set"}
          </button>
        </div>
        <div className="pl-6 pr-6">
          <div className="flex flex-col gap-2 ">
            <label className="text-[0.88rem] text-[#5E6A72]">Department:</label>
            <input
              type="text"
              placeholder="Enter Department"
              value={
                editDepartmentVisible
                  ? selectedDepartment.name
                  : formData.name || ""
              }
              onChange={(e) => {
                const value = e.target.value;
                editDepartmentVisible
                  ? setSelectedDepartment((prev) => ({
                      ...prev,
                      name: value,
                    }))
                  : setFormData((prev) => ({
                      ...prev,
                      name: value,
                    }));
              }}
              className="focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-2 p-1.5 text-sm rounded-sm border-[#B6B6B6]"
              required
            />
          </div>
        </div>
      </form>
      <hr className="mt-8" />
      <div className="flex-shrink-0">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Department
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

export default DepartmentSettings;
