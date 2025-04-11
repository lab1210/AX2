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

const ManageSchoolsItem = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const adminId = searchParams.get("adminId");

  // State for all schools data fetched from the API
  const [allSchools, setAllSchools] = useState([]);

  // State for the displayed schools data after filtering and pagination
  const [schoolsData, setSchoolsData] = useState({
    count: 0,
    results: [],
    next: null,
    previous: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // You can make this configurable

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
      const response = await getSchools({}, currentPage, 1000); // Fetch a large number or adjust as needed
      if (response?.status === 200) {
        setAllSchools(response.data.results);
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
        school.school_type.toLowerCase().includes(lowerCaseSearchTerm)
      // (school.reg_date &&
      //   school.reg_date.toLowerCase().includes(lowerCaseSearchTerm)) ||
      // school.status.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [allSchools, searchTerm]);

  // Calculate pagination values
  const startIndex = useMemo(
    () => (currentPage - 1) * pageSize,
    [currentPage, pageSize]
  );
  const endIndex = useMemo(() => startIndex + pageSize, [startIndex, pageSize]);

  // Function to paginate the filtered schools
  const paginatedSchools = useMemo(() => {
    return filteredSchools.slice(startIndex, endIndex);
  }, [filteredSchools, startIndex, endIndex]);

  // Update schoolsData whenever paginatedSchools or filteredSchools changes
  useEffect(() => {
    setSchoolsData({
      count: filteredSchools.length,
      results: paginatedSchools,
      next: endIndex < filteredSchools.length ? true : null,
      previous: startIndex > 0 ? true : null,
    });
  }, [filteredSchools, paginatedSchools, startIndex, endIndex]);

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
          fetchAllSchools(); // Refresh the school list
          // Optionally show a success message to the user
        } else {
          console.error("Error deleting school:", response);
          // Optionally show an error message to the user
        }
      } catch (error) {
        console.error("Error deleting school:", error);
        // Optionally show an error message to the user
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
              {selectedschoolDetail.reg_date && (
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">Reg Date:</p>
                  <p className="font-bold text-lg">
                    {selectedschoolDetail.reg_date}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Address:</p>
                <p className="font-bold text-lg">
                  {selectedschoolDetail.school_address}
                </p>
              </div>
              {selectedschoolDetail.status && (
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">Status:</p>
                  <p
                    className={`font-bold text-lg ${
                      selectedschoolDetail.status === "Active"
                        ? " text-[#1BB66E] "
                        : " text-[#F94144] "
                    }`}
                  >
                    {selectedschoolDetail.status}
                  </p>
                </div>
              )}
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
              <div className="p-8 text-center">Loading schools...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : (
              <table className="min-w-full table-auto">
                <thead className="bg-[#E6EFF5] lg:text-sm sm:text-xs">
                  <tr className="border-b-[#ABABABAB] border-b">
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
                      Reg. Date
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
                  {schoolsData.results.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b-[#ABABABAB] border-b font-semibold text-xs cursor-pointer"
                      onClick={() => openDetailModal(item)}
                    >
                      <td className="pt-2 pb-2 pl-12 text-[#333333]">
                        {item.school_name}
                      </td>
                      <td className="pt-2 pb-2 text-[#333333]">
                        {item.school_type}
                      </td>
                      <td className="pt-2 pb-2 text-[#333333]">
                        {item.short_name}
                      </td>
                      <td className="pt-2 pb-2 text-[#333333]">
                        {item.reg_date || "N/A"}
                      </td>
                      <td className="pt-2 pb-2 ">
                        <span
                          className={`${
                            item.status === "Active"
                              ? "bg-[#E8F8F0] text-[#1BB66E]"
                              : "bg-[#FEECEC] text-[#F94144] "
                          } rounded-2xl py-1 text-sm`}
                          style={{
                            minWidth: "80px",
                            display: "inline-block",
                            textAlign: "center",
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="pt-2 pb-2 text-[#333333]">
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
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {schoolsData.count > 0 && (
            <div className="bg-[#ffffff] rounded-lg p-4 flex justify-center items-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!schoolsData.previous}
                className="px-3 py-1 rounded-md bg-[#E6EFF5] text-[#333333] disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {Math.ceil(schoolsData.count / pageSize)}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!schoolsData.next}
                className="px-3 py-1 rounded-md bg-[#E6EFF5] text-[#333333] disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default ManageSchoolsItem;
