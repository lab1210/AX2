"use client";
import React, { useEffect, useState } from "react";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import Dropdown from "./DropDown2";
import academicPeriodService from "@/Service/AcademicPeriodService";
import toast from "react-hot-toast";

const SchoolTermSettings = () => {
  const [terms, setTerms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [editTermVisible, setEditTermVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTermDelete, setSelectedTermDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    yearId: "",
  });

  useEffect(() => {
    fetchTerms();
    fetchSessions();
  }, []);

  const fetchTerms = async () => {
    const result = await academicPeriodService.getAllTerms(null, true, false);
    if (result.success) {
      setTerms(result.data);
    } else {
      toast.error(result.message || "Failed to load terms");
    }
  };

  const fetchSessions = async () => {
    const result = await academicPeriodService.getAllSessions(true, false);
    if (result.success) {
      setSessions(result.data);
    } else {
      toast.error(result.message || "Failed to load academic years");
    }
  };

  const getSessionName = (sessionId) => {
    const session = sessions.find((item) => item.id === sessionId);
    return session?.name;
  };

  const paginatedData = Array.isArray(terms)
    ? terms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const totalPages = Math.ceil(terms.length / itemsPerPage);
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
      toast.error("Term name is required.");
      return;
    }

    if (editTermVisible && selectedTerm) {
      try {
        const updateData = {
          name: selectedTerm.name,
          startDate: selectedTerm.startDate,
          endDate: selectedTerm.endDate,
          yearId: selectedTerm.yearId,
          status: selectedTerm.status,
        };

        const result = await academicPeriodService.updateTerm(selectedTerm.id, updateData);

        if (result.success) {
          await fetchTerms();
          toast.success("Term updated successfully.");
          setEditTermVisible(false);
          setSelectedTerm(null);
          setFormData({
            name: "",
            startDate: "",
            endDate: "",
            yearId: "",
          });
        } else {
          toast.error(result.message || "Failed to update term.");
        }
      } catch (error) {
        toast.error("An error occurred while updating.");
      }
    } else {
      try {
        const createData = {
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
          yearId: formData.yearId,
          status: false,
        };

        const result = await academicPeriodService.createTerm(createData);

        if (result.success) {
          await fetchTerms();
          toast.success("Term added successfully.");
        } else {
          toast.error(result.message || "Failed to add term.");
        }
      } catch (err) {
        toast.error("An error occurred while adding.");
      }
    }

    setFormData({
      name: "",
      startDate: "",
      endDate: "",
      yearId: "",
    });
  };

  const handleEdit = (term) => {
    setEditTermVisible(true);
    setSelectedTerm({ ...term });
  };

  const openDeleteModal = (term) => {
    setSelectedTermDelete(term);
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setSelectedTermDelete(null);
    setDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedTermDelete?.id) {
      try {
        const result = await academicPeriodService.deleteTerm(selectedTermDelete.id);
        if (result.success) {
          toast.success("Term deleted successfully.");
          await fetchTerms();
          closeDeleteModal();
        } else {
          toast.error(result.message || "Failed to delete term.");
        }
      } catch (error) {
        toast.error("Failed to delete term.");
      }
    }
  };

  const handleSetActiveTerm = async (termId) => {
    try {
      const result = await academicPeriodService.setActiveTerm(termId);
      if (result.success) {
        toast.success(result.message || "Term set as active");
        await fetchTerms();
      } else {
        toast.error(result.message || "Failed to set active term");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div>
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
                value={editTermVisible ? selectedTerm?.name || "" : formData.name}
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
                className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                {editTermVisible ? "Status:" : "Academic Session:"}
              </label>
              {editTermVisible ? (
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTerm?.status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedTerm?.status ? "Active" : "Inactive"}
                  </span>
                  {!selectedTerm?.status && (
                    <button
                      type="button"
                      onClick={() => handleSetActiveTerm(selectedTerm.id)}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Set as Active
                    </button>
                  )}
                </div>
              ) : (
                <Dropdown
                  label={getSessionName(formData.yearId) || "Select Academic Session"}
                  items={[
                    {
                      label: "Select Academic Session",
                      onClick: () => {},
                      disabled: true,
                    },
                    ...sessions.map((session) => ({
                      label: session.name,
                      onClick: () =>
                        setFormData({
                          ...formData,
                          yearId: session.id,
                        }),
                    })),
                  ]}
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
                    ? selectedTerm?.startDate?.split("T")[0] || ""
                    : formData.startDate
                }
                onChange={(e) => {
                  const value = e.target.value;
                  editTermVisible
                    ? setSelectedTerm((prev) => ({
                        ...prev,
                        startDate: value,
                      }))
                    : setFormData((prev) => ({ ...prev, startDate: value }));
                }}
                className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
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
                    ? selectedTerm?.endDate?.split("T")[0] || ""
                    : formData.endDate
                }
                onChange={(e) => {
                  const value = e.target.value;
                  editTermVisible
                    ? setSelectedTerm((prev) => ({
                        ...prev,
                        endDate: value,
                      }))
                    : setFormData((prev) => ({ ...prev, endDate: value }));
                }}
                className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                required
              />
            </div>
          </div>
        </div>
      </form>

      <hr className="mt-10" />

      <div className="flex-shrink-0 mb-2">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Terms
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
                  <td colSpan="6" className="p-5 text-center border text-gray-500">
                    No Data Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={item.id || index}>
                    <td className="p-2 pl-6">{item.name}</td>
                    <td className="p-2">{getSessionName(item.yearId)}</td>
                    <td className="p-2">{item.startDate?.split("T")[0]}</td>
                    <td className="p-2">{item.endDate?.split("T")[0]}</td>
                    <td className="p-2">
                      <span
                        className={`${
                          item.status
                            ? "bg-[#E8F8F0] text-[#1BB66E]"
                            : "bg-[#FEECEC] text-[#F94144]"
                        } rounded-2xl py-1 font-bold px-3`}
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

export default SchoolTermSettings;