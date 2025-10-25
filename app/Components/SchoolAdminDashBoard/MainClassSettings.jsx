"use client";

import React, { useEffect, useState } from "react";
import Dropdown from "./DropDown";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import {
  createClass,
  deleteClass,
  getAcademicYears,
  getClass,
  UpdateClass,
} from "@/Service/schoolConfig";

const MainClassSettings = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [selectedClass, setSelectedClass] = useState(null);
  const [editClassVisible, setEditClassVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [years, setYears] = useState([]);
  const [classList, setClassList] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedClassDelete, setSelectedClassDelete] = useState(null);

  const [formData, setFormData] = useState({
    year: "",
    class_name: "",
  });

  const paginatedData = classList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(classList.length / itemsPerPage);
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  useEffect(() => {
    const fetchClass = async () => {
      const { data, error } = await getClass();
      if (data) setClassList(data);
      else setMessage(error || "Failed to load classes");
    };
    fetchClass();
    fetchYears();
  }, []);

  const fetchYears = async () => {
    const { data, error } = await getAcademicYears();
    if (data) {
      setYears(data);
    } else {
      setMessage(error || "Failed to load academic years");
    }
  };

  const getYearName = (yearid) => {
    const year = years.find((item) => item.year_id === yearid);
    return year?.name;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = editClassVisible
      ? selectedClass?.class_name?.trim()
      : formData.class_name?.trim();

    if (!trimmedName) {
      setMessage("Class name is required.");
      setMessageType("error");
      return;
    }

    const existingClass = classList.find(
      (item) => item.class_name?.toLowerCase() === trimmedName.toLowerCase()
    );

    if (!editClassVisible && existingClass) {
      setMessage("Class already exists.");
      setMessageType("error");
      return;
    }

    if (editClassVisible && selectedClass) {
      try {
        const updatedClass = {
          ...selectedClass,
          year: selectedClass.year,
          class_name: selectedClass.class_name,
        };
        const { data, error } = await UpdateClass(
          selectedClass.class_year_id,
          updatedClass
        );
        if (error) {
          setMessage(error || "Failed to update class.");
          setMessageType("error");
          return;
        }
        const updatedList = classList.map((item) =>
          item.class_year_id === selectedClass.class_year_id ? data : item
        );
        setClassList(updatedList);
        setMessage("Class updated successfully.");
        setMessageType("success");
        setEditClassVisible(false);
        setSelectedClass(null);
      } catch (error) {
        setMessage("An error occurred while updating.");
        setMessageType("error");
      }
    } else {
      try {
        const createPayload = {
          year: formData.year,
          class_name: formData.class_name,
        };

        const { data, error } = await createClass(createPayload);

        if (error) {
          setMessage(error || "Failed to add class.");
          setMessageType("error");
        } else {
          setClassList((prev) => [...prev, data]);
          setFormData({
            year: "",
            class_name: "",
          });
          setMessage("Class added successfully.");
          setMessageType("success");
        }
      } catch (err) {
        setMessage("An error occurred while adding.");
        setMessageType("error");
      }
    }
    setFormData({
      year: "",
      class_name: "",
    });

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleEdit = (Class) => {
    setEditClassVisible(true);
    setSelectedClass({ ...Class });
  };
  const openDeleteModal = (term) => {
    setSelectedClassDelete(term);
    setDeleteModalVisible(true);
  };

  // Function to close delete modal
  const closeDeleteModal = () => {
    setSelectedClassDelete(null);
    setDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedClassDelete?.class_year_id) {
      try {
        const response = await deleteClass(selectedClassDelete.class_year_id);
        if (response?.status === 204) {
          setMessage("Class deleted successfully.");
          setMessageType("success");
          closeDeleteModal();
        } else {
          setMessage("Failed to delete Class.");
          setMessageType("error");
          closeDeleteModal();
        }
      } catch (error) {
        setMessageType("error");
        setMessage("Failed to delete Class.");
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

      {deleteModalVisible && selectedClassDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg min-w-75 z-50 p-8">
            <p className="font-bold text-center text-lg">Delete Class</p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete the class
              </p>
              <p className="text-base text-[#858383]">
                <span className="font-bold">
                  {selectedClassDelete?.class_name}
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
            {editClassVisible
              ? "Edit Class Management"
              : "Set Class Management"}
          </p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            {editClassVisible ? "Save" : "Set"}
          </button>
        </div>
        <div className="pl-6 pr-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Class:</label>
              <input
                type="text"
                placeholder="Enter Class"
                value={
                  editClassVisible
                    ? selectedClass.class_name
                    : formData.class_name || ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  editClassVisible
                    ? setSelectedClass((prev) => ({
                        ...prev,
                        class_name: value,
                      }))
                    : setFormData((prev) => ({
                        ...prev,
                        class_name: value,
                      }));
                }}
                className="focus:outline-[#0071E3] sm:placeholder:text-xs sm:text-xs lg:placeholder:text-sm placeholder:text-[#B6B6B6] border-2 p-1.5 lg:text-sm rounded-sm border-[#B6B6B6]"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Academic Session:
              </label>
              <Dropdown
                label={
                  (editClassVisible
                    ? getYearName(selectedClass.year)
                    : getYearName(formData.year)) || "Select Academic Session"
                }
                items={years.map((year) => ({
                  label: year.name,
                  onClick: () =>
                    editClassVisible
                      ? setSelectedClass((prev) => ({
                          ...prev,
                          year: year.year_id,
                        }))
                      : setFormData({
                          ...formData,
                          year: year.year_id,
                        }),
                }))}
              />
            </div>
          </div>
        </div>
      </form>
      <hr />
      <div className="flex-shrink-0">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Classes
        </p>
      </div>
      <div className="px-0">
        <div className="overflow-y-auto max-h-[200px] no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-12 bg-[#EDF0F3]">Class</th>
                  <th className="p-2 bg-[#EDF0F3]">Academic Session</th>
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
                    No Classes Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={index}>
                    <td className="p-2 pl-12">{item.class_name}</td>
                    <td className="p-2">{getYearName(item.year)}</td>
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

export default MainClassSettings;
