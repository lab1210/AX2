"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import DashboardHeader from "../DashboardHeader";
import { RiEqualizerLine } from "react-icons/ri";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { getSchools, deleteSchool } from "../../../Service/schoolService"; // Import school service functions

const ITEMS_PER_PAGE = 7; // You can adjust this value

const ManageSchoolsItem = () => {
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");

  // State for all schools data fetched from the API
  const [allSchools, setAllSchools] = useState([]);

  // State for the displayed schools data after filtering and pagination
  const [schoolsData, setSchoolsData] = useState([]);
  const [totalSchools, setTotalSchools] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // State for search
  const [searchTerm, setSearchTerm] = useState("");

  // State to track selected school for details and deletion
  const [selectedschoolDetail, setselectedschoolDetail] = useState(null);
  const [selectedSchoolDelete, setSelectedSchoolDelete] = useState(null);

  // Modal visibility states
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Function to fetch all schools without search parameters
  const fetchAllSchools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSchools({}, currentPage, ITEMS_PER_PAGE);
      if (response?.status === 200) {
        setAllSchools(response.data.results);
        setTotalSchools(response.data.count);
      } else {
        setError(
          `Failed to fetch schools: ${response?.statusText || "Unknown error"}`
        );
      }
    } catch (err) {
      setError(`Error fetching schools: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  // Effect to fetch all schools on initial load and when page changes (for initial data)
  useEffect(() => {
    fetchAllSchools();
  }, [fetchAllSchools]);

  // Function to filter schools based on searchTerm
  const filteredSchools = useMemo(() => {
    if (!searchTerm) {
      return allSchools;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allSchools.filter(
      (school) =>
        school.school_name.toLowerCase().includes(lowerCaseSearchTerm) ||
        school.short_name.toLowerCase().includes(lowerCaseSearchTerm) ||
        school.school_type.toLowerCase().includes(lowerCaseSearchTerm) ||
        (school.registered_by.surname + " " + school.registered_by.first_name)
          .toLowerCase()
          .includes(lowerCaseSearchTerm)
    );
  }, [allSchools, searchTerm]);

  // Update schoolsData whenever filteredSchools changes (for search)
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setSchoolsData(filteredSchools.slice(startIndex, endIndex));
    setTotalSchools(filteredSchools.length);
  }, [filteredSchools, currentPage]);

  // Function to open detail modal
  const openDetailModal = (school) => {
    setselectedschoolDetail(school);
    setDetailModalVisible(true);
  };

  // Function to close detail modal
  const closeDetailModal = () => {
    setselectedschoolDetail(null);
    setDetailModalVisible(false);
  };

  const openDeleteModal = (school) => {
    setSelectedSchoolDelete(school);
    setDeleteModalVisible(true);
  };

  // Function to close delete modal
  const closeDeleteModal = () => {
    setSelectedSchoolDelete(null);
    setDeleteModalVisible(false);
  };

  const handleDeleteSchool = async () => {
    if (selectedSchoolDelete?.id) {
      try {
        const response = await deleteSchool(selectedSchoolDelete.id);
        if (response?.status === 200) {
          console.log("School deleted successfully:", response.data);
          closeDeleteModal();
          fetchAllSchools();
        } else {
          console.error("Error deleting school:", response);
        }
      } catch (error) {
        console.error("Error deleting school:", error);
      }
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const totalPages = Math.ceil(totalSchools / ITEMS_PER_PAGE);

  const renderPaginationButtons = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-4 pb-4">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`mx-1 px-3 py-1 rounded-md ${
              currentPage === number
                ? "bg-[#4084B1] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  return (
    <SuperAdminLayout>
      {/* Delete Modal */}
      {deleteModalVisible && selectedSchoolDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg min-w-75 z-50 p-8">
            <p className="font-bold text-center text-lg">Delete School</p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete the
              </p>
              <p className="text-base text-[#858383]">
                selected School:{" "}
                <span className="font-bold">
                  {selectedSchoolDelete.school_name}
                </span>
                ?
              </p>
            </div>
            <div className="font-bold text-md items-center justify-center pt-3 flex gap-5 ">
              <button
                onClick={handleDeleteSchool}
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

      {/* Details Modal */}
      {detailModalVisible && selectedschoolDetail && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDetailModal}
          ></div>
          <div className="relative pb-5 bg-white rounded-md shadow-lg min-w-165 z-50">
            <div className="bg-[#01427A] rounded-t-md">
              <p className="flex items-center justify-between pl-6 pr-6 pt-4 pb-4 text-white font-bold text-xl">
                School Information
                <span onClick={closeDetailModal} className="cursor-pointer">
                  <IoClose />
                </span>
              </p>
            </div>
            <div className="pl-10 pr-10 pt-8 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">School Name:</p>
                <p className="font-bold text-lg">
                  {selectedschoolDetail.school_name}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">School Short Name:</p>
                <p className="font-bold text-lg">
                  {selectedschoolDetail.short_name}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Email:</p>
                <p className="font-bold text-lg">
                  {selectedschoolDetail.email}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Education Level:</p>
                <p className="font-bold text-lg">
                  {selectedschoolDetail.education_level}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">School Type:</p>
                <p className="font-bold text-lg">
                  {selectedschoolDetail.school_type}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Phone Number:</p>
                <p className="font-bold text-lg">
                  {selectedschoolDetail.phone_number}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Registered By:</p>
                <p className="font-bold text-lg">
                  {selectedschoolDetail.registered_by.surname +
                    " " +
                    selectedschoolDetail.registered_by.first_name}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Address:</p>
                <p className="font-bold text-lg">
                  {selectedschoolDetail.school_address}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Status:</p>
                <p
                  className={`font-bold text-lg ${
                    selectedschoolDetail.status
                      ? " text-[#1BB66E] "
                      : " text-[#F94144] "
                  }`}
                >
                  {selectedschoolDetail.status ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <DashboardHeader />
        <Link
          href={`/Super-Admin/Manage-Existing-Schools/Add-New-School?adminId=${adminId}`}
        >
          <button className="bg-[#07508F] text-white p-2 rounded-lg cursor-pointer">
            Add New School
          </button>
        </Link>
      </div>
      {/* Content */}
      <div className="bg-[#D4D4D4] overflow-auto flex-1 p-4">
        <div className="grid grid-rows-[auto_1fr_auto] gap-3.5">
          {/* Search bar */}
          <div className="bg-[#ffffff] rounded-lg p-4 pr-8 flex justify-end items-center gap-4">
            <div className="flex items-center rounded-4xl border-2 min-w-[320px] border-[#978F8F]">
              <input
                type="text"
                placeholder="Search School"
                className="w-full outline-none bg-transparent text-[#AEAEAE] text-sm p-1 pl-5"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div>
              <RiEqualizerLine size={20} />
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#ffffff] rounded-lg overflow-x-auto">
            {loading ? (
              <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <div className="w-12 h-12 border-4 border-blue-900 border-t-red-500 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center bg-red-200 border border-red-500 text-red-700 px-4 py-2 rounded-md z-50">
                {error}
              </div>
            ) : (
              <table className="min-w-full table-auto">
                <thead className="bg-[#E6EFF5] lg:text-sm sm:text-xs">
                  <tr className="border-b-[#D0D0D0] border-b">
                    <th className="pt-3 pb-3 pl-12 text-left font-bold text-[#333333]">
                      School Name
                    </th>
                    <th className="pt-3 pb-3 text-left font-bold text-[#333333]">
                      School Type
                    </th>
                    <th className="pt-3 pb-3 text-left font-bold text-[#333333]">
                      Short Sch Name
                    </th>
                    <th className="pt-3 pb-3 text-left font-bold text-[#333333]">
                      Registered By
                    </th>
                    <th className="pt-3 pb-3 text-left font-bold text-[#333333]">
                      Status
                    </th>
                    <th className="pt-3 pb-3 text-left font-bold text-[#333333]">
                      Modify
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schoolsData.length > 0 ? (
                    schoolsData.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b-[#D0D0D0] border-b font-semibold text-xs cursor-pointer"
                        onClick={() => openDetailModal(item)}
                      >
                        <td className="pt-3 pb-3 pl-12 text-[#333333]">
                          {item.school_name}
                        </td>
                        <td className="pt-3 pb-3 text-[#333333]">
                          {item.school_type}
                        </td>
                        <td className="pt-3 pb-3 text-[#333333]">
                          {item.short_name}
                        </td>
                        <td className="pt-3 pb-3 text-[#333333]">
                          {item.registered_by.surname +
                            " " +
                            item.registered_by.first_name}
                        </td>
                        <td className="pt-3 pb-3 ">
                          <span
                            className={`${
                              item.status
                                ? "bg-[#E8F8F0] text-[#1BB66E]"
                                : "bg-[#FEECEC] text-[#F94144] "
                            } rounded-2xl py-1 text-sm`}
                            style={{
                              minWidth: "80px",
                              display: "inline-block",
                              textAlign: "center",
                            }}
                          >
                            {item.status ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="pt-3 pb-3 text-[#333333]">
                          <div className="flex gap-4">
                            <Link
                              href={`/Super-Admin/Manage-Existing-Schools/Edit-School?adminId=${adminId}&schoolId=${item.id}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FiEdit3
                                className="text-[#80ADCB] cursor-pointer"
                                size={15}
                              />
                            </Link>
                            <FiTrash2
                              className="text-[#F94144] cursor-pointer"
                              size={15}
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(item);
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-4 text-gray-500"
                      >
                        {loading ? (
                          <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                            <div className="w-12 h-12 border-4 border-blue-900 border-t-red-500 rounded-full animate-spin"></div>
                          </div>
                        ) : error ? (
                          "Error loading Schools."
                        ) : (
                          "No School Found."
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalSchools > ITEMS_PER_PAGE && (
            <div className="bg-[#ffffff] mt-2 rounded-lg p-4 flex justify-center items-center gap-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`mx-1 px-3 py-1 rounded-md ${
                      currentPage === number
                        ? "bg-[#4084B1] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default ManageSchoolsItem;
