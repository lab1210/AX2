"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import DashboardHeader from "../DashboardHeader";
import { RiEqualizerLine } from "react-icons/ri";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { getSchoolAdmin } from "@/app/Service/schoolAdminService"; // Adjust import path if needed
import styles from "../../../Super-Admin/css/spinner.module.css";
import { FaUserPlus } from "react-icons/fa6";

const ITEMS_PER_PAGE = 10; // You can adjust this value

const ManageSchoolAdminItem = () => {
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");

  // State to store the fetched school admins
  const [allSchoolAdmins, setAllSchoolAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the displayed school admins after filtering and pagination
  const [schoolAdminsData, setSchoolAdminsData] = useState([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // State for search
  const [searchTerm, setSearchTerm] = useState("");

  // State to track selected school admin for modal actions
  const [selectedSchoolAdmin, setSelectedSchoolAdmin] = useState(null);
  const [selectedSchoolDelete, setSelectedSchoolDelete] = useState(null);

  // Modal visibility states
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Function to fetch all school admins
  const fetchAllSchoolAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSchoolAdmin();
      if (response?.status === 200) {
        setAllSchoolAdmins(response.data);
      } else {
        setError(
          `Failed to fetch school admins: ${
            response?.statusText || "Unknown error"
          }`
        );
      }
    } catch (err) {
      setError(`Error fetching school admins: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to fetch all school admins on initial load
  useEffect(() => {
    fetchAllSchoolAdmins();
  }, [fetchAllSchoolAdmins]);

  // Function to filter school admins based on searchTerm
  const filteredSchoolAdmins = useMemo(() => {
    if (!searchTerm) {
      return allSchoolAdmins;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allSchoolAdmins.filter(
      (admin) =>
        admin.first_name.toLowerCase().includes(lowerCaseSearchTerm) ||
        admin.surname.toLowerCase().includes(lowerCaseSearchTerm) ||
        admin.school_name.toLowerCase().includes(lowerCaseSearchTerm) ||
        admin.designation.toLowerCase().includes(lowerCaseSearchTerm) ||
        admin.phone_number.toLowerCase().includes(lowerCaseSearchTerm) ||
        admin.email.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [allSchoolAdmins, searchTerm]);

  // Calculate pagination values
  const startIndex = useMemo(
    () => (currentPage - 1) * ITEMS_PER_PAGE,
    [currentPage]
  );
  const endIndex = useMemo(() => startIndex + ITEMS_PER_PAGE, [startIndex]);

  // Function to paginate the filtered school admins
  const paginatedSchoolAdmins = useMemo(() => {
    return filteredSchoolAdmins.slice(startIndex, endIndex);
  }, [filteredSchoolAdmins, startIndex, endIndex]);

  // Update schoolAdminsData whenever paginatedSchoolAdmins changes
  useEffect(() => {
    setSchoolAdminsData(paginatedSchoolAdmins);
  }, [paginatedSchoolAdmins]);

  // Function to open detail modal
  const openDetailModal = (school) => {
    setSelectedSchoolAdmin(school);
    setDetailModalVisible(true);
  };

  // Function to close detail modal
  const closeDetailModal = () => {
    setSelectedSchoolAdmin(null);
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

  // Placeholder for delete functionality
  const handleDeleteSchoolAdmin = () => {
    if (selectedSchoolDelete?.id) {
      console.log("Deleting school admin with ID:", selectedSchoolDelete.id);
      // Implement your delete API call here
      closeDeleteModal();
      fetchAllSchoolAdmins(); // Refresh the list after deletion
      // Optionally show a success/error message
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const totalPages = Math.ceil(filteredSchoolAdmins.length / ITEMS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading School Admins: {error}</div>;
  }

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
            <p className="font-bold text-center text-lg">Delete School Admin</p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete the
              </p>
              <p className="text-base text-[#858383]">
                selected School Admin:{" "}
                <span className="font-bold">
                  {selectedSchoolDelete.first_name}{" "}
                  {selectedSchoolDelete.surname}
                </span>
                ?
              </p>
            </div>
            <div className="font-bold text-md items-center justify-center pt-3 flex gap-5 ">
              <button
                onClick={handleDeleteSchoolAdmin}
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
      {detailModalVisible && selectedSchoolAdmin && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDetailModal}
          ></div>
          <div className="relative pb-5 bg-white rounded-md shadow-lg min-w-165 z-50">
            <div className="bg-[#01427A] rounded-t-md">
              <p className="flex items-center justify-between pl-6 pr-6 pt-4 pb-4 text-white font-bold text-xl">
                Administrative Information
                <span onClick={closeDetailModal} className="cursor-pointer">
                  <IoClose />
                </span>
              </p>
            </div>
            <div className="pl-10 pr-10 pt-8 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">First Name:</p>
                <p className="font-bold text-lg">
                  {selectedSchoolAdmin.first_name}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Last Name:</p>
                <p className="font-bold text-lg">
                  {selectedSchoolAdmin.surname}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Email:</p>
                <p className="font-bold text-lg">{selectedSchoolAdmin.email}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Phone Number:</p>
                <p className="font-bold text-lg">
                  {selectedSchoolAdmin.phone_number}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">School Name:</p>
                <p className="font-bold text-lg">
                  {selectedSchoolAdmin.school_name}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Designation:</p>
                <p className="font-bold text-lg">
                  {selectedSchoolAdmin.designation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0 z-10 shadow-md flex justify-between items-center ">
        <DashboardHeader />

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-4xl border lg:min-w-[300px] border-[#978F8F] ">
            <input
              type="text"
              placeholder="Search School Admin"
              className="w-full outline-none bg-transparent text-[#AEAEAE] text-sm p-2 pl-5"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 192.904 192.904"
              width="16px"
              className="fill-[#B09A9A] stroke-[#D9D9D9] mr-4"
            >
              <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
            </svg>
          </div>
          <Link
            href={`/Super-Admin/Manage-School-Admin/Add-School-Admin?adminId=${adminId}`}
          >
            <div className="bg-[#E6EFF5] rounded-full flex items-center p-3 cursor-pointer">
              <FaUserPlus className="text-[#01427A]" size={20} />
            </div>
          </Link>
        </div>
      </div>
      <div className="bg-[#D4D4D4] overflow-auto flex-1 p-4">
        <div className="bg-[#ffffff] rounded-lg overflow-x-auto">
          <table className="min-w-full table-auto ">
            <thead className="bg-[#E6EFF5] lg:text-sm sm:text-xs ">
              <tr className="border-b-[#978F8F] border-b">
                <th className="pt-3 pb-3 pl-12 text-left font-bold text-[#333333]">
                  School Admin Name
                </th>
                <th className="pt-3 pb-3 text-left font-bold text-[#333333]">
                  School Name
                </th>
                <th className="pt-3 pb-3 text-left font-bold text-[#333333]">
                  Designation
                </th>
                <th className="pt-3 pb-3 text-left font-bold text-[#333333]">
                  Phone Number
                </th>
                <th className="pt-3 pb-3 text-left font-bold text-[#333333]">
                  Email Address
                </th>
                <th className="pt-3 pb-3 text-left font-bold text-[#333333]">
                  Modify
                </th>
              </tr>
            </thead>
            <tbody>
              {schoolAdminsData.length > 0 ? (
                schoolAdminsData.map((item, index) => (
                  <tr
                    onClick={() => openDetailModal(item)}
                    key={index}
                    className="cursor-pointer border-b-[#978F8F] border-b font-semibold text-xs"
                  >
                    <td className="pt-2 pb-2 pl-12 text-[#333333]">
                      {item.first_name + " " + item.surname}
                    </td>
                    <td className="pt-2 pb-2 text-[#333333]">
                      {item.school_name}
                    </td>
                    <td className="pt-2 pb-2 text-[#333333]">
                      {item.designation}
                    </td>
                    <td className="pt-2 pb-2 text-[#333333]">
                      {item.phone_number}
                    </td>
                    <td className="pt-2 pb-2 text-[#333333]">{item.email}</td>
                    <td className="pt-2 pb-2 text-[#333333]">
                      <div className="flex gap-4">
                        <Link
                          href={`/Super-Admin/Manage-School-Admin/Edit-School-Admin?adminId=<span class="math-inline">\{adminId\}&schoolAdminId\=</span>{item.id}`} // Assuming your edit route needs an ID
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
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    {loading
                      ? "Loading School Admins..."
                      : error
                      ? "Error loading School Admins."
                      : "No School Admins Found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredSchoolAdmins.length > 0 && (
          <div className="bg-[#ffffff] mt-2 rounded-lg p-4 flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPreviousPage}
              className="px-3 py-1 rounded-md bg-[#E6EFF5] text-[#333333] disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage}
              className="px-3 py-1 rounded-md bg-[#E6EFF5] text-[#333333] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
};

export default ManageSchoolAdminItem;
