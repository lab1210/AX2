"use client";
import React, { useEffect, useState } from "react";
import Dropdown from "./DropDown";
import { FiEdit3, FiTrash2, FiSearch, FiFilter, FiX, FiCheck, FiUser, FiMail, FiPhone, FiMapPin, FiBookOpen } from "react-icons/fi";
import { IoFilter } from "react-icons/io5";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import studentService from "@/Service/studentService";
import classService from "@/Service/ClassService";
import toast from "react-hot-toast";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editStudentVisible, setEditStudentVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("name");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedStudentDelete, setSelectedStudentDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [classYears, setClassYears] = useState([]);
  const [classArms, setClassArms] = useState([]);
  const [filteredArms, setFilteredArms] = useState([]);

  const itemsPerPage = 10;

  const [editFormData, setEditFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    status: "Active",
    parentFirstName: "",
    parentLastName: "",
    parentContactInfo: "",
    parentOccupation: "",
    parentRelationship: "",
    classYearId: "",
    classArmId: "",
  });

  useEffect(() => {
    fetchStudents();
    fetchClassData();
  }, []);

  useEffect(() => {
    if (editFormData.classYearId) {
      const arms = classArms.filter(arm => arm.classYearId === editFormData.classYearId);
      setFilteredArms(arms);
    } else {
      setFilteredArms([]);
    }
  }, [editFormData.classYearId, classArms]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const result = await studentService.getAllStudents();
      if (result.success) {
        setStudents(result.data);
      } else {
        toast.error(result.message || "Failed to fetch students");
      }
    } catch (error) {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const fetchClassData = async () => {
    try {
      const [yearsRes, armsRes] = await Promise.all([
        classService.getAllClassYears(),
        classService.getAllClassArms(),
      ]);
      if (yearsRes.success) setClassYears(yearsRes.data);
      if (armsRes.success) setClassArms(armsRes.data);
    } catch (error) {
      console.error("Failed to fetch class data:", error);
    }
  };

  // Filter students based on search
  const filteredStudents = students.filter((student) => {
    if (!searchText.trim()) return true;
    
    const searchLower = searchText.toLowerCase();
    if (filterType === "name") {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      return fullName.includes(searchLower);
    } else if (filterType === "admission") {
      return (student.admissionNumber || "").toLowerCase().includes(searchLower);
    } else if (filterType === "email") {
      return (student.email || "").toLowerCase().includes(searchLower);
    }
    return true;
  });

  const paginatedData = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleEdit = (student) => {
    setEditStudentVisible(true);
    setSelectedStudent(student);
    setEditFormData({
      firstName: student.firstName || "",
      middleName: student.middleName || "",
      lastName: student.lastName || "",
      email: student.email || "",
      phoneNumber: student.phoneNumber || "",
      address: student.address || "",
      status: student.status || "Active",
      parentFirstName: student.parentFirstName || "",
      parentLastName: student.parentLastName || "",
      parentContactInfo: student.parentContactInfo || "",
      parentOccupation: student.parentOccupation || "",
      parentRelationship: student.parentRelationship || "",
      classYearId: student.classYearId || "",
      classArmId: student.classArmId || "",
    });
  };

  const handleCancelEdit = () => {
    setEditStudentVisible(false);
    setSelectedStudent(null);
    setEditFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      status: "Active",
      parentFirstName: "",
      parentLastName: "",
      parentContactInfo: "",
      parentOccupation: "",
      parentRelationship: "",
      classYearId: "",
      classArmId: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editStudentVisible && selectedStudent) {
      try {
        const updateData = {
          firstName: editFormData.firstName,
          middleName: editFormData.middleName,
          lastName: editFormData.lastName,
          email: editFormData.email,
          phoneNumber: editFormData.phoneNumber,
          address: editFormData.address,
          status: editFormData.status,
          parentFirstName: editFormData.parentFirstName,
          parentLastName: editFormData.parentLastName,
          parentContactInfo: editFormData.parentContactInfo,
          parentOccupation: editFormData.parentOccupation,
          parentRelationship: editFormData.parentRelationship,
          classYearId: editFormData.classYearId || null,
          classArmId: editFormData.classArmId || null,
        };
        
        const result = await studentService.updateStudent(selectedStudent.userId, updateData);
        
        if (result.success) {
          await fetchStudents();
          toast.success("Student updated successfully.");
          handleCancelEdit();
        } else {
          toast.error(result.message || "Failed to update student.");
        }
      } catch (error) {
        toast.error("An error occurred while updating.");
      }
    }
  };

  const openDeleteModal = (student) => {
    setSelectedStudentDelete(student);
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setSelectedStudentDelete(null);
    setDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedStudentDelete?.userId) {
      try {
        const result = await studentService.deleteStudent(selectedStudentDelete.userId);
        if (result.success) {
          toast.success("Student deleted successfully.");
          await fetchStudents();
          closeDeleteModal();
        } else {
          toast.error(result.message || "Failed to delete student.");
        }
      } catch (error) {
        toast.error("Failed to delete student.");
      }
    }
  };

  const filterOptions = [
    { value: "name", label: "Name" },
    { value: "admission", label: "Admission Number" },
    { value: "email", label: "Email" },
  ];

  const getCurrentFilterLabel = () => {
    const option = filterOptions.find(opt => opt.value === filterType);
    return option ? option.label : filterType;
  };

  const getClassName = (classYearId) => {
    const classYear = classYears.find(cy => cy.id === classYearId);
    return classYear?.className || "";
  };

  const getClassArmName = (classArmId) => {
    const classArm = classArms.find(ca => ca.id === classArmId);
    return classArm?.armName || "";
  };

  return (
    <div>
      {/* Delete Modal */}
      {deleteModalVisible && selectedStudentDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg min-w-75 z-50 p-8">
            <p className="font-bold text-center text-lg">Delete Student</p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete the student
              </p>
              <p className="text-base text-[#858383]">
                <span className="font-bold">
                  {selectedStudentDelete?.firstName} {selectedStudentDelete?.lastName}
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

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="mb-3 flex-shrink-0">
        <div className="flex pt-3 pl-6 pr-6 justify-between mb-2">
          <p className="font-bold text-[#07508F]">
            {editStudentVisible ? "Edit Student" : "Student Information"}
          </p>
          <div className="flex gap-2">
            {editStudentVisible && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
              >
                Cancel
              </button>
            )}
            {editStudentVisible && (
              <button
                type="submit"
                className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
              >
                Save
              </button>
            )}
          </div>
        </div>
        
        {editStudentVisible && (
          <div className="pl-6 pr-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">First Name:</label>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  value={editFormData.firstName}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Middle Name:</label>
                <input
                  type="text"
                  placeholder="Enter Middle Name"
                  value={editFormData.middleName}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, middleName: e.target.value }))}
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Last Name:</label>
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  value={editFormData.lastName}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Email:</label>
                <input
                  type="email"
                  placeholder="student@school.com"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Phone Number:</label>
                <input
                  type="text"
                  placeholder="+1234567890"
                  value={editFormData.phoneNumber}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Address:</label>
                <input
                  type="text"
                  placeholder="Enter Address"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Status:</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Class Year:</label>
                <select
                  value={editFormData.classYearId}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, classYearId: e.target.value, classArmId: "" }))}
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                >
                  <option value="">Select Class Year</option>
                  {classYears.map((year) => (
                    <option key={year.id} value={year.id}>{year.className}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Class Arm:</label>
                <select
                  value={editFormData.classArmId}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, classArmId: e.target.value }))}
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                  disabled={!editFormData.classYearId}
                >
                  <option value="">Select Class Arm</option>
                  {filteredArms.map((arm) => (
                    <option key={arm.id} value={arm.id}>{arm.armName}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <p className="font-bold text-[#07508F] mt-4 mb-2">Parent/Guardian Information</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Parent First Name:</label>
                <input
                  type="text"
                  placeholder="Parent First Name"
                  value={editFormData.parentFirstName}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, parentFirstName: e.target.value }))}
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Parent Last Name:</label>
                <input
                  type="text"
                  placeholder="Parent Last Name"
                  value={editFormData.parentLastName}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, parentLastName: e.target.value }))}
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Parent Contact Info:</label>
                <input
                  type="text"
                  placeholder="Phone number"
                  value={editFormData.parentContactInfo}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, parentContactInfo: e.target.value }))}
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Parent Occupation:</label>
                <input
                  type="text"
                  placeholder="Occupation"
                  value={editFormData.parentOccupation}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, parentOccupation: e.target.value }))}
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Parent Relationship:</label>
                <input
                  type="text"
                  placeholder="Father, Mother, Guardian"
                  value={editFormData.parentRelationship}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, parentRelationship: e.target.value }))}
                  className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2"
                />
              </div>
            </div>
          </div>
        )}
      </form>

      <hr className="mt-10" />

      {/* Search and Filter */}
      <div className="flex justify-between items-center gap-5 pt-5 pl-6 pr-6">
        <div className="flex items-center gap-10 relative">
          <div>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center text-[#01427A] hover:text-white hover:bg-[#01427A] cursor-pointer text-sm gap-2 border-[1.5px] rounded-full border-[#01427A] py-1 px-3"
            >
              <span className="hidden xl:block">Filter by </span>
              <IoFilter size={18} />
            </button>
            {showFilterDropdown && (
              <div className="absolute mt-1 left-0 top-full bg-white border rounded shadow-lg z-10 w-48">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilterType(option.value);
                      setShowFilterDropdown(false);
                    }}
                    className="border-b flex items-center gap-3 px-4 py-2 text-sm hover:bg-[#01427A]/40 cursor-pointer w-full text-left"
                  >
                    <RxLetterCaseCapitalize />
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="relative w-full">
              <FiSearch className="text-[#AEAEAE] absolute right-3 top-1/2 transform -translate-y-1/2" size={18} />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                type="text"
                className="placeholder:text-[#AEAEAE] xl:placeholder:text-sm placeholder:text-xs rounded-full py-1 pl-5 pr-10 border-[1.5px] w-64"
                placeholder={`Filter by ${getCurrentFilterLabel()}`}
              />
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Total: {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Students Table */}
      <div className="flex-shrink-0 mt-4">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Students
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
                  <th className="p-2 bg-[#EDF0F3]">Admission No</th>
                  <th className="p-2 bg-[#EDF0F3]">Email</th>
                  <th className="p-2 bg-[#EDF0F3]">Class</th>
                  <th className="p-2 bg-[#EDF0F3]">Parent Contact</th>
                  <th className="p-2 bg-[#EDF0F3]">Status</th>
                  <th className="p-2 bg-[#EDF0F3]">Actions</th>
                </tr>
              </thead>
            )}
            <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-5 text-center border text-gray-500">
                    No Students Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={item.userId || index}>
                    <td className="p-2 pl-12">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-2">
                      {item.firstName} {item.lastName}
                    </td>
                    <td className="p-2">{item.admissionNumber || "-"} </td>
                    <td className="p-2">{item.email || "-"} </td>
                    <td className="p-2">
                      {item.classYearName} {item.classArmName}
                    </td>
                    <td className="p-2">{item.parentContactInfo || "-"} </td>
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

export default StudentList;