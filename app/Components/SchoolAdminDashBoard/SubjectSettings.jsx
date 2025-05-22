"use client";
import {
  createSubject,
  getSubject,
  UpdateSubject,
} from "@/Service/schoolConfig";
import React, { useEffect, useState } from "react";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

const SubjectSettings = () => {
  const [subjectList, setsubjectList] = useState([]);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const [selectedSubject, setselectedSubject] = useState(null);
  const [editsubjectVisible, setEditsubjectVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [selectedSubjectDelete, setSelectedSubjectDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data, error } = await getSubject();
      if (data) setsubjectList(data);
      else setMessage(error || "Failed to load subjects");
    };
    fetchSubjects();
  }, []);

  const paginatedData = subjectList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(subjectList.length / itemsPerPage);
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = editsubjectVisible
      ? selectedSubject?.name?.trim()
      : formData.name?.trim();

    if (!trimmedName) {
      setMessage("Subject Name is required.");
      setMessageType("error");
      return;
    }

    const existingSubject = subjectList.find(
      (item) => item.name?.toLowerCase() === trimmedName.toLowerCase()
    );

    if (!editsubjectVisible && existingSubject) {
      setMessage("Subject already exists.");
      setMessageType("error");
      return;
    }

    if (editsubjectVisible && selectedSubject) {
      try {
        const updatedSubject = {
          ...selectedSubject,
          name: selectedSubject.name,
        };
        const { data, error } = await UpdateSubject(
          selectedSubject.subject_id,
          updatedSubject
        );
        if (error) {
          setMessage(error || "Failed to update subject.");
          setMessageType("error");
          return;
        }
        const updatedList = subjectList.map((item) =>
          item.subject_id === selectedSubject.subject_id ? data : item
        );
        setsubjectList(updatedList);
        setMessage("Subject updated successfully.");
        setMessageType("success");
        setEditsubjectVisible(false);
        setselectedSubject(null);
      } catch (error) {
        setMessage("An error occurred while updating.");
        setMessageType("error");
      }
    } else {
      try {
        const createPayload = {
          name: formData.name,
        };

        const { data, error } = await createSubject(createPayload);

        if (error) {
          setMessage(error || "Failed to add subject.");
          setMessageType("error");
        } else {
          setsubjectList((prev) => [...prev, data]);
          setMessage("Subject added successfully.");
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
    setEditsubjectVisible(true);
    setselectedSubject({ ...term });
  };

  const openDeleteModal = (term) => {
    setSelectedSubjectDelete(term);
    setDeleteModalVisible(true);
  };

  // Function to close delete modal
  const closeDeleteModal = () => {
    setSelectedSubjectDelete(null);
    setDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedSubjectDelete?.subject_id) {
      try {
        const response = await deleteClassArm(selectedSubjectDelete.subject_id);
        if (response?.status === 204) {
          setMessage("Subject deleted successfully.");
          setMessageType("success");
          closeDeleteModal();
        } else {
          setMessage("Failed to delete Subject.");
          setMessageType("error");
          closeDeleteModal();
        }
      } catch (error) {
        setMessageType("error");
        setMessage("Failed to delete Subject.");
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
      {deleteModalVisible && selectedSubjectDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg min-w-75 z-50 p-8">
            <p className="font-bold text-center text-lg">Delete Subject</p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete the subject
              </p>
              <p className="text-base text-[#858383]">
                <span className="font-bold">{selectedSubjectDelete?.name}</span>
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
            {editsubjectVisible ? "Edit Subject" : "Register Subject"}
          </p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            {editsubjectVisible ? "Save" : "Set"}
          </button>
        </div>
        <div className="pl-6 pr-6">
          <div className="flex flex-col gap-2 ">
            <label className="text-[0.88rem] text-[#5E6A72]">Subject:</label>
            <input
              type="text"
              placeholder="Enter Subject"
              value={
                editsubjectVisible ? selectedSubject.name : formData.name || ""
              }
              onChange={(e) => {
                const value = e.target.value;
                editsubjectVisible
                  ? setselectedSubject((prev) => ({
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
          Existing Subject
        </p>
      </div>
      <div className="px-0">
        <div className="overflow-y-auto max-h-[200px] no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-20 bg-[#EDF0F3]">Subjects</th>
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

export default SubjectSettings;
