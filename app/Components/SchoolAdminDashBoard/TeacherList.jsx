"use client";
import React, { useEffect, useState } from "react";
import Dropdown from "./DropDown";
import { FiEdit3, FiTrash2, FiDownload, FiUpload } from "react-icons/fi";
import teacherService from "@/Service/TeacherService";
import toast from "react-hot-toast";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editTeacherVisible, setEditTeacherVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedTeacherDelete, setSelectedTeacherDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newCV, setNewCV] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const result = await teacherService.getAllTeachers();
      if (result.success) {
        setTeachers(result.data);
      } else {
        toast.error(result.message || "Failed to fetch teachers");
      }
    } catch (error) {
      toast.error("Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };

  const paginatedData = teachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(teachers.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleCVChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setNewCV({
          filename: file.name,
          content_type: file.type,
          data: base64String,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editTeacherVisible && selectedTeacher) {
      try {
        const updateData = {
          firstName: selectedTeacher.firstName,
          lastName: selectedTeacher.lastName,
          email: selectedTeacher.email,
          phoneNumber: selectedTeacher.phoneNumber,
          address: selectedTeacher.address,
          qualification: selectedTeacher.qualification,
          specialization: selectedTeacher.specialization,
          status: selectedTeacher.status,
        };
        
        // Add CV if a new one was uploaded
        if (newCV) {
          updateData.cv = newCV.data;
        }
        
        const result = await teacherService.updateTeacher(selectedTeacher.userId, updateData);
        
        if (result.success) {
          await fetchTeachers();
          toast.success("Teacher updated successfully.");
          handleCancelEdit();
        } else {
          toast.error(result.message || "Failed to update teacher.");
        }
      } catch (error) {
        toast.error("An error occurred while updating.");
      }
    } else {
      toast.error("Edit mode only. Use the edit button to modify teacher details.");
    }
  };

  const handleCancelEdit = () => {
    setEditTeacherVisible(false);
    setSelectedTeacher(null);
    setNewCV(null);
  };

  const handleEdit = (teacher) => {
    setEditTeacherVisible(true);
    setSelectedTeacher({ ...teacher });
    setNewCV(null);
  };

  const openDeleteModal = (teacher) => {
    setSelectedTeacherDelete(teacher);
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setSelectedTeacherDelete(null);
    setDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedTeacherDelete?.userId) {
      try {
        const result = await teacherService.deleteTeacher(selectedTeacherDelete.userId);
        if (result.success) {
          toast.success("Teacher deleted successfully.");
          await fetchTeachers();
          closeDeleteModal();
        } else {
          toast.error(result.message || "Failed to delete teacher.");
        }
      } catch (error) {
        toast.error("Failed to delete teacher.");
      }
    }
  };

  const handleDownloadCV = (cvData, fileName) => {
    if (!cvData) {
      toast.error("No CV available for this teacher");
      return;
    }
    
    try {
      const byteCharacters = atob(cvData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "teacher_cv.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Downloading CV...");
    } catch (error) {
      toast.error("Failed to download CV");
    }
  };

  return (
    <div>
      {deleteModalVisible && selectedTeacherDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg min-w-75 z-50 p-8">
            <p className="font-bold text-center text-lg">Delete Teacher</p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete the teacher
              </p>
              <p className="text-base text-[#858383]">
                <span className="font-bold">
                  {selectedTeacherDelete?.firstName} {selectedTeacherDelete?.lastName}
                </span>?
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
            {editTeacherVisible ? "Edit Teacher" : "Teacher Information"}
          </p>
          <div className="flex gap-2">
            {editTeacherVisible && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
              >
                Cancel
              </button>
            )}
            {editTeacherVisible && (
              <button
                type="submit"
                className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
              >
                Save
              </button>
            )}
          </div>
        </div>
        
        {editTeacherVisible && selectedTeacher && (
          <div className="pl-6 pr-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">First Name:</label>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  value={selectedTeacher.firstName || ""}
                  onChange={(e) =>
                    setSelectedTeacher((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Last Name:</label>
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  value={selectedTeacher.lastName || ""}
                  onChange={(e) =>
                    setSelectedTeacher((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Email:</label>
                <input
                  type="email"
                  placeholder="teacher@school.com"
                  value={selectedTeacher.email || ""}
                  onChange={(e) =>
                    setSelectedTeacher((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Phone Number:</label>
                <input
                  type="text"
                  placeholder="+1234567890"
                  value={selectedTeacher.phoneNumber || ""}
                  onChange={(e) =>
                    setSelectedTeacher((prev) => ({ ...prev, phoneNumber: e.target.value }))
                  }
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Qualification:</label>
                <input
                  type="text"
                  placeholder="B.Ed, M.Sc, etc."
                  value={selectedTeacher.qualification || ""}
                  onChange={(e) =>
                    setSelectedTeacher((prev) => ({ ...prev, qualification: e.target.value }))
                  }
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Specialization:</label>
                <input
                  type="text"
                  placeholder="Mathematics, English, etc."
                  value={selectedTeacher.specialization || ""}
                  onChange={(e) =>
                    setSelectedTeacher((prev) => ({ ...prev, specialization: e.target.value }))
                  }
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Address:</label>
                <input
                  type="text"
                  placeholder="Enter Address"
                  value={selectedTeacher.address || ""}
                  onChange={(e) =>
                    setSelectedTeacher((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Status:</label>
                <select
                  value={selectedTeacher.status || "Active"}
                  onChange={(e) =>
                    setSelectedTeacher((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="col-span-2 flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Upload New CV (Optional):</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCVChange}
                    className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2 flex-1"
                  />
                  {selectedTeacher.cv && !newCV && (
                    <span className="text-xs text-green-600">Current CV uploaded</span>
                  )}
                  {newCV && (
                    <span className="text-xs text-blue-600">New CV selected: {newCV.filename}</span>
                  )}
                </div>
                {selectedTeacher.cv && !newCV && (
                  <button
                    type="button"
                    onClick={() => handleDownloadCV(selectedTeacher.cv, `${selectedTeacher.firstName}_${selectedTeacher.lastName}_CV.pdf`)}
                    className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1 mt-1"
                  >
                    <FiDownload size={14} /> Download Current CV
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </form>

      <hr className="mt-10" />

      <div className="flex-shrink-0">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Teachers
        </p>
      </div>

      <div className="px-0">
        <div className="overflow-y-auto max-h-[400px] no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-12 bg-[#EDF0F3]">S/N</th>
                  <th className="p-2 bg-[#EDF0F3]">Name</th>
                  <th className="p-2 bg-[#EDF0F3]">Email</th>
                  <th className="p-2 bg-[#EDF0F3]">Phone</th>
                  <th className="p-2 bg-[#EDF0F3]">Qualification</th>
                  <th className="p-2 bg-[#EDF0F3]">Specialization</th>
                  <th className="p-2 bg-[#EDF0F3]">Status</th>
                  <th className="p-2 bg-[#EDF0F3]">CV</th>
                  <th className="p-2 bg-[#EDF0F3]">Actions</th>
                </tr>
              </thead>
            )}
            <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-5 text-center border text-gray-500">
                    No Teachers Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={item.userId || index}>
                    <td className="p-2 pl-12">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-2">
                      {item.firstName} {item.lastName}
                    </td>
                    <td className="p-2">{item.email || "-"} </td>
                    <td className="p-2">{item.phoneNumber || "-"} </td>
                    <td className="p-2">{item.qualification || "-"}</td>
                    <td className="p-2">{item.specialization || "-"}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status || "Active"}
                      </span>
                    </td>
                    <td className="p-2">
                      {item.cv ? (
                        <button
                          onClick={() => handleDownloadCV(item.cv, `${item.firstName}_${item.lastName}_CV.pdf`)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Download CV"
                        >
                          <FiDownload size={16} />
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
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

export default TeacherList;