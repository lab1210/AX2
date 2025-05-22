"use client";
import React, { useEffect, useState } from "react";
import Dropdown from "./DropDown";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import {
  createArm,
  deleteClassArm,
  getClass,
  getClassArm,
  UpdateClassArm,
} from "@/Service/schoolConfig";

const ClassArm = () => {
  const [classList, setClassList] = useState([]);
  const [ClassYear, setClassYear] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [selectedClass, setSelectedClass] = useState(null);
  const [editClassVisible, setEditClassVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [selectedClassDelete, setSelectedClassDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    arm_name: "",
    class_year: "",
  });

  useEffect(() => {
    const fetchClassArms = async () => {
      const { data, error } = await getClassArm();
      if (data) setClassList(data);
      else setMessage(error || "Failed to load class arms");
    };
    fetchClassArms();
    fetchClass();
  }, []);

  const fetchClass = async () => {
    const { data, error } = await getClass();
    if (data) {
      setClassYear(data);
    } else {
      setMessage(error || "Failed to load Class years");
    }
  };

  const getClassYearName = (yearid) => {
    const year = ClassYear.find((item) => item.class_year_id === yearid);
    return year?.class_name;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = editClassVisible
      ? selectedClass?.arm_name?.trim()
      : formData.arm_name?.trim();

    if (!trimmedName) {
      setMessage("Class Arm is required.");
      setMessageType("error");
      return;
    }
    const existingClass = classList.find(
      (item) => item.arm_name?.toLowerCase() === trimmedName.toLowerCase()
    );

    if (!editClassVisible && existingClass) {
      setMessage("Class Arm already exists.");
      setMessageType("error");
      return;
    }

    if (editClassVisible && selectedClass) {
      try {
        const updatedClass = {
          ...selectedClass,
          arm_name: selectedClass.arm_name,
          class_year: selectedClass.class_year,
        };
        const { data, error } = await UpdateClassArm(
          selectedClass.class_id,
          updatedClass
        );
        if (error) {
          setMessage(error || "Failed to update class arm.");
          setMessageType("error");
          return;
        }
        const updatedList = classList.map((item) =>
          item.class_id === selectedClass.class_id ? data : item
        );
        setClassList(updatedList);
        setMessage("Class Arm updated successfully.");
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
          arm_name: formData.arm_name,
          class_year: formData.class_year,
        };

        const { data, error } = await createArm(createPayload);

        if (error) {
          setMessage(error || "Failed to add class arm.");
          setMessageType("error");
        } else {
          setClassList((prev) => [...prev, data]);
          setMessage("Class Arm added successfully.");
          setMessageType("success");
        }
      } catch (err) {
        setMessage("An error occurred while adding.");
        setMessageType("error");
      }
    }
    setFormData({
      arm_name: "",
      class_year: "",
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
    if (selectedClassDelete?.class_id) {
      try {
        const response = await deleteClassArm(selectedClassDelete.class_id);
        if (response?.status === 204) {
          setMessage("Class Arm deleted successfully.");
          setMessageType("success");
          closeDeleteModal();
        } else {
          setMessage("Failed to delete Class Arm.");
          setMessageType("error");
          closeDeleteModal();
        }
      } catch (error) {
        setMessageType("error");
        setMessage("Failed to delete Class Arm.");
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
            <p className="font-bold text-center text-lg">Delete Class Arm</p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete the class arm
              </p>
              <p className="text-base text-[#858383]">
                <span className="font-bold">
                  {selectedClassDelete?.arm_name}
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
            {editClassVisible ? "Edit Class Arm" : "Set Class Arm"}
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
            <div className="flex flex-col gap-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Class:</label>
              <Dropdown
                label={
                  (editClassVisible
                    ? getClassYearName(selectedClass.class_year)
                    : getClassYearName(formData.class_year)) || "Select Class"
                }
                items={ClassYear.map((year) => ({
                  label: year.class_name,
                  onClick: () =>
                    editClassVisible
                      ? setSelectedClass((prev) => ({
                          ...prev,
                          class_year: year.class_year_id,
                        }))
                      : setFormData({
                          ...formData,
                          class_year: year.class_year_id,
                        }),
                }))}
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Class Arm:
              </label>
              <input
                type="text"
                placeholder="Enter Class Arm"
                value={
                  editClassVisible
                    ? selectedClass.arm_name
                    : formData.arm_name || ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  editClassVisible
                    ? setSelectedClass((prev) => ({
                        ...prev,
                        arm_name: value,
                      }))
                    : setFormData((prev) => ({
                        ...prev,
                        arm_name: value,
                      }));
                }}
                className="focus:outline-[#0071E3] sm:placeholder:text-xs sm:text-xs lg:placeholder:text-sm placeholder:text-[#B6B6B6] border-2 p-1.5 lg:text-sm rounded-sm border-[#B6B6B6]"
                required
              />
            </div>
          </div>
        </div>
      </form>
      <hr />
      <div className="flex-shrink-0">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Class Arm
        </p>
      </div>
      <div className="px-0">
        <div className="overflow-y-auto max-h-[200px] no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-12 bg-[#EDF0F3]">Class</th>
                  <th className="p-2 bg-[#EDF0F3]">Class Arm</th>
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
                    No Class Arms Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={index}>
                    <td className="p-2 pl-12">{item.class_year_name}</td>
                    <td className="p-2">{item.arm_name}</td>
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

export default ClassArm;
