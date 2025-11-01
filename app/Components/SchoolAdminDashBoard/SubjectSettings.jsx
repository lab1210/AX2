"use client";
import {
  createSubject,
  deleteSubject,
  getSubject,
  UpdateSubject,
} from "@/Service/schoolConfig";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

const SubjectSettings = () => {
  const [subjectList, setsubjectList] = useState([]);

  const [selectedSubject, setselectedSubject] = useState(null);
  const [editsubjectVisible, setEditsubjectVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedSubjectDelete, setSelectedSubjectDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await getSubject();
      setsubjectList(data);
    } catch (error) {
      toast.error("Failed to fetch subjects.");
    }
  };
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
      toast.error("Subject Name is required.");
      return;
    }

    const existingSubject = subjectList.find(
      (item) => item.name?.toLowerCase() === trimmedName.toLowerCase()
    );

    if (!editsubjectVisible && existingSubject) {
      toast.error("Subject already exists.");
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
          toast.error(error || "Failed to update subject.");
          return;
        }
        const updatedList = subjectList.map((item) =>
          item.subject_id === selectedSubject.subject_id ? data : item
        );
        setsubjectList(updatedList);
        toast.success("Subject updated successfully.");
        setEditsubjectVisible(false);
        setselectedSubject(null);
      } catch (error) {
        toast.error("An error occurred while updating.");
      }
    } else {
      try {
        const createPayload = {
          name: formData.name,
        };

        const { data, error } = await createSubject(createPayload);

        if (error) {
          toast.error(error || "Failed to add subject.");
        } else {
          setsubjectList((prev) => [...prev, data]);
          toast.success("Subject added successfully.");
        }
      } catch (err) {
        toast.error("An error occurred while adding.");
      }
    }
    setFormData({
      name: "",
    });
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
        const response = await deleteSubject(selectedSubjectDelete.subject_id);
        toast.success("Subject deleted successfully.");
        fetchSubjects();
        closeDeleteModal();
      } catch (error) {
        toast.error("Failed to delete Subject.");
      }
    }
  };
  return (
    <div>
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
              className={`text-base  ${
                formData.name !== ""
                  ? "border-[#0071E3]  border-2"
                  : "border-[#AEAEAE] border-[1.5px]"
              }   rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm  p-2  placeholder:text-[#d4d4d4] placeholder:font-normal font-bold `}
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
        <div className="overflow-y-auto  no-scrollbar">
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
