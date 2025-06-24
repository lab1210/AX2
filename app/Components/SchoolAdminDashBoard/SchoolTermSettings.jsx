"use client";
import React, { useEffect, useState } from "react";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import Dropdown from "./DropDown2";
import {
  createTerm,
  deleteTerm,
  getAcademicYears,
  getTerms,
  UpdateTerm,
} from "@/Service/schoolConfig";

const SchoolTermSettings = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [term, setTerm] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [editTermVisible, setEditTermVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTermDelete, setSelectedTermDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    year: "",
    status: true,
  });

  useEffect(() => {
    const fetchTerms = async () => {
      const { data, error } = await getTerms();
      if (data) setTerm(data);
      else setMessage(error || "Failed to load terms");
    };
    fetchTerms();
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

  const paginatedData = Array.isArray(term)
    ? term.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const totalPages = Math.ceil(term.length / itemsPerPage);
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = editTermVisible
      ? selectedTerm?.name?.trim()
      : formData.name?.trim();

    if (!trimmedName) {
      setMessage("Term name is required.");
      setMessageType("error");
      return;
    }
    const existingSession = term.find(
      (item) => item.name?.toLowerCase() === trimmedName.toLowerCase()
    );

    if (!editTermVisible && existingSession) {
      setMessage("Term already exists.");
      setMessageType("error");
      return;
    }

    if (editTermVisible && selectedTerm) {
      try {
        const updatedTerm = {
          ...selectedTerm,
          name: selectedTerm.name,
          start_date: selectedTerm.start_date,
          end_date: selectedTerm.end_date,
          year: selectedTerm.year,
          status: selectedTerm.status,
        };
        const { data, error } = await UpdateTerm(
          selectedTerm.term_id,
          updatedTerm
        );
        if (error) {
          setMessage(error || "Failed to update term.");
          setMessageType("error");
          return;
        }
        const updatedList = term.map((item) =>
          item.term_id === selectedTerm.term_id ? data : item
        );
        setTerm(updatedList);
        setMessage("Term updated successfully.");
        setMessageType("success");
        setEditTermVisible(false);
        setSelectedTerm(null);
      } catch (error) {
        setMessage("An error occurred while updating.");
        setMessageType("error");
      }
    } else {
      try {
        const createPayload = {
          name: formData.name,
          start_date: formData.start_date,
          end_date: formData.end_date,
          year: formData.year,
          status: formData.status,
        };

        const { data, error } = await createTerm(createPayload);

        if (error) {
          setMessage(error || "Failed to add term.");
          setMessageType("error");
        } else {
          setTerm((prev) => [...prev, data]);
          setMessage("Term added successfully.");
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
      year: "",
      status: true,
    });

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleEdit = (term) => {
    setEditTermVisible(true);
    setSelectedTerm({ ...term });
  };

  const openDeleteModal = (term) => {
    setSelectedTermDelete(term);
    setDeleteModalVisible(true);
  };

  // Function to close delete modal
  const closeDeleteModal = () => {
    setSelectedTermDelete(null);
    setDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedTermDelete?.term_id) {
      try {
        const response = await deleteTerm(selectedTermDelete.term_id);
        if (response?.status === 204) {
          setMessage("Term deleted successfully.");
          setMessageType("success");
          closeDeleteModal();
        } else {
          setMessage("Failed to delete Term.");
          setMessageType("error");
          closeDeleteModal();
        }
      } catch (error) {
        setMessageType("error");
        setMessage("Failed to delete term.");
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
      {deleteModalVisible && selectedTermDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg min-w-75 z-50 p-8">
            <p className="font-bold text-center text-lg">Delete Term</p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete the term
              </p>
              <p className="text-base text-[#858383]">
                <span className="font-bold">{selectedTermDelete.name}</span>?
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
            {editTermVisible ? "Edit Term" : "Set New Term"}
          </p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            {editTermVisible ? "Save" : "Set"}
          </button>
        </div>
        <div className="pl-6 pr-6 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Term:</label>
              <input
                type="text"
                placeholder="Enter Term"
                value={
                  editTermVisible ? selectedTerm.name : formData.name || ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  editTermVisible
                    ? setSelectedTerm((prev) => ({
                        ...prev,
                        name: value,
                      }))
                    : setFormData((prev) => ({
                        ...prev,
                        name: value,
                      }));
                }}
                className="focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-[1.5px] p-1.5 text-sm rounded-sm border-[#B6B6B6]"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                {editTermVisible ? "Status:" : "Academic Session:"}
              </label>
              {editTermVisible ? (
                <Dropdown
                  label={selectedTerm.status ? "Active" : "Inactive"}
                  items={[
                    {
                      label: "Active",
                      onClick: () =>
                        setSelectedTerm(
                          { ...selectedTerm, status: true } || ""
                        ),
                    },
                    {
                      label: "Inactive",
                      onClick: () =>
                        setSelectedTerm(
                          {
                            ...selectedTerm,
                            status: false,
                          } || ""
                        ),
                    },
                  ]}
                />
              ) : (
                <Dropdown
                  label={
                    getYearName(formData.year) || "Select Academic Session"
                  }
                  items={years.map((year) => ({
                    label: year.name,
                    onClick: () =>
                      setFormData({
                        ...formData,
                        year: year.year_id,
                      }),
                  }))}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Start Date:
              </label>
              <input
                type="date"
                placeholder="Start Date"
                value={
                  editTermVisible
                    ? selectedTerm.start_date
                    : formData.start_date || ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  editTermVisible
                    ? setSelectedTerm((prev) => ({
                        ...prev,
                        start_date: value,
                      }))
                    : setFormData((prev) => ({ ...prev, start_date: value }));
                }}
                className="text-sm text-[#B6B6B6] border-[1.5px] p-1.5 rounded-sm border-[#B6B6B6] focus:outline-[#0071E3]"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.88rem] text-[#5E6A72]">End Date:</label>
              <input
                type="date"
                placeholder="End Date"
                value={
                  editTermVisible
                    ? selectedTerm.end_date
                    : formData.end_date || ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  editTermVisible
                    ? setSelectedTerm((prev) => ({
                        ...prev,
                        end_date: value,
                      }))
                    : setFormData((prev) => ({ ...prev, end_date: value }));
                }}
                className="text-sm text-[#B6B6B6] border-[1.5px] p-1.5 rounded-sm border-[#B6B6B6] focus:outline-[#0071E3]"
                required
              />
            </div>
          </div>
        </div>
      </form>
      <hr className="mt-10" />

      <div className="flex-shrink-0 mb-2">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Term
        </p>
      </div>
      <div className="px-0">
        <div className="overflow-y-auto max-h-[200px] no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-6 bg-[#EDF0F3]">Term</th>
                  <th className="p-2 bg-[#EDF0F3]">Academic Session</th>
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
                    colSpan="3"
                    className="p-5  text-center border text-gray-500"
                  >
                    No Data Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={index}>
                    <td className="p-2 pl-6">{item.name}</td>
                    <td className="p-2">{getYearName(item.year)}</td>
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
                        {item.status ? "Active" : "Inactive"}
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

export default SchoolTermSettings;
