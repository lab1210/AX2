"use client";
import React, { useEffect, useState } from "react";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import Dropdown from "./DropDown";
import {
  createAcademicYear,
  deleteAcademicYear,
  getAcademicYears,
  updateAcademicYear,
} from "../../Service/schoolConfig";
const SchoolYearSettings = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [editYearVisible, setEditYearVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedYearDelete, setSelectedYearDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });

  //GET LIST
  useEffect(() => {
    const fetchYears = async () => {
      const { data, error } = await getAcademicYears();
      if (data) setAcademicYears(data);
      else setMessage(error || "Failed to load academic years");
    };
    fetchYears();
  }, []);

  //PAGINATION
  const paginatedData = Array.isArray(academicYears)
    ? academicYears.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const totalPages = Math.ceil(academicYears.length / itemsPerPage);
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = editYearVisible
      ? selectedYear?.name?.trim()
      : formData.name?.trim();

    if (!trimmedName) {
      setMessage("Academic session name is required.");
      setMessageType("error");
      return;
    }

    const existingSession = academicYears.find(
      (item) => item.name?.toLowerCase() === trimmedName.toLowerCase()
    );

    if (!editYearVisible && existingSession) {
      setMessage("Academic session already exists.");
      setMessageType("error");
      return;
    }

    if (editYearVisible && selectedYear) {
      try {
        const updatedData = {
          ...selectedYear,
          name: selectedYear.name,
          start_date: selectedYear.start_date,
          end_date: selectedYear.end_date,
          status: selectedYear.status, // Only during edit
        };

        const { data, error } = await updateAcademicYear(
          selectedYear.year_id,
          updatedData
        );

        if (error) {
          setMessage(error || "Failed to update academic year.");
          setMessageType("error");
          return;
        }

        const updatedList = academicYears.map((item) =>
          item.year_id === selectedYear.year_id ? data : item
        );
        setAcademicYears(updatedList);
        setMessage("Academic year updated successfully.");
        setMessageType("success");
        setEditYearVisible(false);
        setSelectedYear(null);
      } catch (err) {
        setMessage("An error occurred while updating.");
        setMessageType("error");
      }
    } else {
      try {
        const { status, ...createPayload } = formData; // Exclude status
        const { data, error } = await createAcademicYear(createPayload);

        if (error) {
          setMessage(error || "Failed to add academic year.");
          setMessageType("error");
        } else {
          setAcademicYears((prev) => [...prev, data]);
          setMessage("Academic year added successfully.");
          setMessageType("success");
        }
      } catch (err) {
        setMessage("An error occurred while adding.");
        setMessageType("error");
      }
    }

    setFormData({
      name: "",
      start_date: "",
      end_date: "",
    });

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleEdit = (year) => {
    setEditYearVisible(true);
    setSelectedYear({ ...year });
  };

  const openDeleteModal = (school) => {
    setSelectedYearDelete(school);
    setDeleteModalVisible(true);
  };

  // Function to close delete modal
  const closeDeleteModal = () => {
    setSelectedYearDelete(null);
    setDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedYearDelete?.year_id) {
      try {
        const response = await deleteAcademicYear(selectedYearDelete.year_id);
        if (response?.status === 204) {
          setMessage("Academic year deleted successfully.");
          setMessageType("success");
          closeDeleteModal();
        } else {
          setMessage("Failed to delete academic year.");
          setMessageType("error");
          closeDeleteModal();
        }
      } catch (error) {
        setMessageType("error");
        setMessage("Failed to delete academic year.");
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
      {deleteModalVisible && selectedYearDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg min-w-75 z-50 p-8">
            <p className="font-bold text-center text-lg">
              Delete Academic Year
            </p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete the year
              </p>
              <p className="text-base text-[#858383]">
                <span className="font-bold">{selectedYearDelete.name}</span>?
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
            {editYearVisible ? "Edit Academic Year" : "Set New Academic Year"}
          </p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            {editYearVisible ? "Save" : "Set"}
          </button>
        </div>
        <div className="pl-6 pr-6 flex flex-col gap-2">
          <div
            className={`${editYearVisible ? "grid grid-cols-2 gap-6" : "  "}`}
          >
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Academic Session:
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter Academic Session"
                value={editYearVisible ? selectedYear.name : formData.name}
                onChange={(e) => {
                  const value = e.target.value;
                  editYearVisible
                    ? setSelectedYear((prev) => ({
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
            {editYearVisible && selectedYear && (
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Status:</label>
                <Dropdown
                  label={
                    selectedYear.status
                      ? "Active"
                      : "In-Active" || "Select Status"
                  }
                  items={[
                    {
                      label: "Active",
                      onClick: () => {
                        const updated = { ...selectedYear, status: true };
                        setSelectedYear(updated);
                        setFormData((prev) => ({ ...prev, status: true }));
                      },
                    },
                    {
                      label: "Inactive",
                      onClick: () => {
                        const updated = { ...selectedYear, status: false };
                        setSelectedYear(updated);
                        setFormData((prev) => ({
                          ...prev,
                          status: false,
                        }));
                      },
                    },
                  ]}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Start Date:
              </label>
              <input
                type="date"
                name="start_date"
                placeholder="Start Date"
                value={
                  editYearVisible
                    ? selectedYear.start_date
                    : formData.start_date
                }
                onChange={(e) => {
                  const value = e.target.value;
                  editYearVisible
                    ? setSelectedYear((prev) => ({
                        ...prev,
                        start_date: value,
                      }))
                    : setFormData((prev) => ({ ...prev, start_date: value }));
                }}
                className="text-sm text-[#B6B6B6] border-2 p-1.5 rounded-sm border-[#B6B6B6] focus:outline-[#0071E3]"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.88rem] text-[#5E6A72]">End Date:</label>
              <input
                type="date"
                placeholder="End Date"
                value={
                  editYearVisible ? selectedYear.end_date : formData.end_date
                }
                onChange={(e) => {
                  const value = e.target.value;
                  editYearVisible
                    ? setSelectedYear((prev) => ({
                        ...prev,
                        end_date: value,
                      }))
                    : setFormData((prev) => ({ ...prev, end_date: value }));
                }}
                className="text-sm text-[#B6B6B6] border-2 p-1.5 rounded-sm border-[#B6B6B6] focus:outline-[#0071E3]"
                required
              />
            </div>
          </div>
        </div>
      </form>
      <hr className="mt-10" />
      <div className="flex-shrink-0 mb-2">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Academic Year
        </p>
      </div>
      <div className="px-0">
        <div className="overflow-y-auto max-h-[200px] no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-6 bg-[#EDF0F3]">Academic Session</th>
                  <th className="p-2 bg-[#EDF0F3]">Start Date</th>
                  <th className="p-2 bg-[#EDF0F3]">End Date</th>
                  <th className="p-2 bg-[#EDF0F3]">Status</th>
                  <th className="p-2 bg-[#EDF0F3]">Actions</th>
                </tr>
              </thead>
            )}
            <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-5  text-center border text-gray-500"
                  >
                    No Data Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={index}>
                    <td className="p-2 pl-6">{item.name}</td>
                    <td className="p-2">{item.start_date}</td>
                    <td className="p-2">{item.end_date}</td>
                    <td className="p-2">
                      <span
                        className={`${
                          item.status
                            ? "bg-[#E8F8F0] text-[#1BB66E]"
                            : "bg-[#FEECEC] text-[#F94144]"
                        } rounded-2xl py-1 font-bold`}
                        style={{
                          minWidth: "70px",
                          display: "inline-block",
                          textAlign: "center",
                        }}
                      >
                        {item.status ? "Active" : "In-Active"}
                      </span>
                    </td>
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

export default SchoolYearSettings;
