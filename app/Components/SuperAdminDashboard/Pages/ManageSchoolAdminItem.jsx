"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import DashboardHeader from "../DashboardHeader";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IoClose } from "react-icons/io5";
import schoolAdminService from "@/Service/SchoolAdminService";
import { FaUserPlus } from "react-icons/fa6";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 7;

const ManageSchoolAdminItem = () => {
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");

  // State to store the fetched school admins
  const [allSchoolAdmins, setAllSchoolAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // State for the displayed school admins after filtering and pagination
  const [schoolAdminsData, setSchoolAdminsData] = useState([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // State for search
  const [searchTerm, setSearchTerm] = useState("");

  // State to track selected school admin for modal actions
  const [selectedSchoolAdmin, setSelectedSchoolAdmin] = useState(null);
  const [selectedSchoolAdminDetail, setSelectedSchoolAdminDetail] = useState(null);
  const [selectedSchoolDelete, setSelectedSchoolDelete] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Modal visibility states
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [modalTransform, setModalTransform] = useState("translateX(-100%)");
  const [modalOpacity, setModalOpacity] = useState(0);

  // Function to fetch all school admins
  const fetchAllSchoolAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await schoolAdminService.getAllSchoolAdmins(searchTerm);
      console.log("School admins response:", response);
      
      if (response.success) {
        setAllSchoolAdmins(response.data || []);
      } else {
        setError(response.message || "Failed to fetch school admins");
        toast.error(response.message || "Failed to fetch school admins");
      }
    } catch (err) {
      setError(`Error fetching school admins: ${err.message}`);
      toast.error(`Error fetching school admins: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Effect to fetch all school admins on initial load and when search changes
  useEffect(() => {
    fetchAllSchoolAdmins();
  }, [fetchAllSchoolAdmins]);

  // Function to filter school admins based on searchTerm (client-side filtering)
  const filteredSchoolAdmins = useMemo(() => {
    if (!searchTerm) {
      return allSchoolAdmins;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allSchoolAdmins.filter(
      (admin) =>
        (admin.firstName && admin.firstName.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (admin.surname && admin.surname.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (admin.schoolName && admin.schoolName.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (admin.designation && admin.designation.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (admin.phoneNumber && admin.phoneNumber.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (admin.email && admin.email.toLowerCase().includes(lowerCaseSearchTerm))
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

  // Function to open detail modal - fetch full details using getSchoolAdminById
  const openDetailModal = async (schoolAdmin) => {
    setDetailLoading(true);
    setSelectedSchoolAdmin(schoolAdmin);
    setDetailModalVisible(true);
    
    try {
      const response = await schoolAdminService.getSchoolAdminById(schoolAdmin.userId);
      console.log("Full school admin details:", response);
      
      if (response.success && response.data) {
        setSelectedSchoolAdminDetail(response.data);
      } else {
        toast.error(response.message || "Failed to fetch school admin details");
        setSelectedSchoolAdminDetail(schoolAdmin);
      }
    } catch (error) {
      console.error("Error fetching school admin details:", error);
      toast.error("Error fetching school admin details");
      setSelectedSchoolAdminDetail(schoolAdmin);
    } finally {
      setDetailLoading(false);
    }
  };

  // Function to close detail modal
  const closeDetailModal = () => {
    setSelectedSchoolAdmin(null);
    setSelectedSchoolAdminDetail(null);
    setDetailModalVisible(false);
  };

  const openDeleteModal = (schoolAdmin) => {
    setDeleteSuccess(false);
    setDeleteError(null);
    setSelectedSchoolDelete(schoolAdmin);
    setDeleteModalVisible(true);
    setTimeout(() => {
      setModalTransform("translateX(0)");
      setModalOpacity(1);
    }, 0);
  };

  // Function to close delete modal
  const closeDeleteModal = () => {
    setModalTransform("translateX(-100%)");
    setModalOpacity(0);
    setTimeout(() => {
      setSelectedSchoolDelete(null);
      setDeleteModalVisible(false);
    }, 300);
  };

  const handleDeleteSchoolAdmin = async () => {
    if (selectedSchoolDelete?.userId) {
      setDeleteLoading(true);
      setDeleteError(null);
      setDeleteSuccess(false);
      try {
        const response = await schoolAdminService.deleteSchoolAdmin(selectedSchoolDelete.userId);
        console.log("Delete response:", response);
        
        if (response.success) {
          toast.success(response.message || "School Admin deleted successfully");
          setDeleteSuccess(true);
          setTimeout(() => {
            closeDeleteModal();
            fetchAllSchoolAdmins();
          }, 1500);
        } else {
          setDeleteError(response.message || "Failed to delete school admin");
          toast.error(response.message || "Failed to delete school admin");
        }
      } catch (err) {
        setDeleteError(`Error deleting school admin: ${err.message}`);
        toast.error(`Error deleting school admin: ${err.message}`);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredSchoolAdmins.length / ITEMS_PER_PAGE);

  // Get the data to display in detail modal
  const displayData = selectedSchoolAdminDetail || selectedSchoolAdmin;

  if (loading && allSchoolAdmins.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && allSchoolAdmins.length === 0) {
    return (
      <SuperAdminLayout>
        <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
          <DashboardHeader />
        </div>
        <div className="bg-[#D4D4D4] overflow-auto flex-1 p-4">
          <div className="text-center bg-red-200 border border-red-500 text-red-700 px-4 py-2 rounded-md">
            {error}
          </div>
        </div>
      </SuperAdminLayout>
    );
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
          <div
            className="relative bg-white rounded-xl shadow-lg min-w-75 z-50 transition-transform pt-10 pb-10 duration-600 ease-in-out"
            style={{ transform: modalTransform, opacity: modalOpacity }}
          >
            <p className="font-bold text-center text-lg">Delete School Admin</p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure you want to delete
              </p>
              <p className="text-base text-[#858383] font-semibold">
                {selectedSchoolDelete.firstName} {selectedSchoolDelete.surname}?
              </p>
              {deleteError && (
                <p className="text-red-500 mt-2">{deleteError}</p>
              )}
              {deleteSuccess && (
                <p className="text-green-500 mt-2">
                  School Admin deleted successfully!
                </p>
              )}
            </div>
            <div className="font-bold text-md items-center justify-center pt-3 flex gap-5">
              <button
                onClick={handleDeleteSchoolAdmin}
                className="cursor-pointer text-white bg-[#F94144] rounded-md pl-4 pr-4 py-2"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
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

      {/* Details Modal - with getSchoolAdminById data */}
      {detailModalVisible && displayData && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDetailModal}
          ></div>
          <div className="relative pb-5 bg-white no-scrollbar rounded-md shadow-lg w-[500px] max-w-[90vw] z-50">
            <div className="bg-[#01427A] rounded-t-md sticky top-0">
              <p className="flex items-center justify-between pl-6 pr-6 pt-4 pb-4 text-white font-bold text-xl">
                Administrative Information
                {detailLoading && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span onClick={closeDetailModal} className="cursor-pointer">
                  <IoClose />
                </span>
              </p>
            </div>
            <div className="pl-10 no-scrollbar pr-10 pt-8 pb-4 max-h-[70vh] overflow-y-auto">
              {detailLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="w-8 h-8 border-4 border-blue-900 border-t-red-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <p className="font-semibold text-sm text-gray-600">First Name:</p>
                    <p className="font-bold text-lg text-gray-800">
                      {displayData.firstName || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <p className="font-semibold text-sm text-gray-600">Middle Name:</p>
                    <p className="font-bold text-lg text-gray-800">
                      {displayData.middleName || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <p className="font-semibold text-sm text-gray-600">Surname:</p>
                    <p className="font-bold text-lg text-gray-800">
                      {displayData.surname || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <p className="font-semibold text-sm text-gray-600">Email:</p>
                    <p className="font-bold text-lg text-gray-800 break-all">
                      {displayData.email || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <p className="font-semibold text-sm text-gray-600">Username:</p>
                    <p className="font-bold text-lg text-gray-800">
                      {displayData.username || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <p className="font-semibold text-sm text-gray-600">Phone Number:</p>
                    <p className="font-bold text-lg text-gray-800">
                      {displayData.phoneNumber || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <p className="font-semibold text-sm text-gray-600">School Name:</p>
                    <p className="font-bold text-lg text-gray-800">
                      {displayData.schoolName || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <p className="font-semibold text-sm text-gray-600">User Role:</p>
                    <p className="font-bold text-lg text-gray-800">School Admin</p>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <p className="font-semibold text-sm text-gray-600">Designation:</p>
                    <p className="font-bold text-lg text-gray-800">
                      {displayData.designation || "N/A"}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <p className="font-semibold text-sm text-gray-600">City:</p>
                    <p className="font-bold text-lg text-gray-800">
                      {displayData.city || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <p className="font-semibold text-sm text-gray-600">State:</p>
                    <p className="font-bold text-lg text-gray-800">
                      {displayData.state || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <p className="font-semibold text-sm text-gray-600">Country:</p>
                    <p className="font-bold text-lg text-gray-800">
                      {displayData.country || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <p className="font-semibold text-sm text-gray-600">Email Confirmed:</p>
                    <p className={`font-bold text-lg ${displayData.emailConfirmed ? "text-green-600" : "text-red-600"}`}>
                      {displayData.emailConfirmed ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <p className="font-semibold text-sm text-gray-600">Must Change Password:</p>
                    <p className={`font-bold text-lg ${displayData.mustChangePassword ? "text-yellow-600" : "text-green-600"}`}>
                      {displayData.mustChangePassword ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <p className="font-semibold text-sm text-gray-600">Created At:</p>
                    <p className="font-bold text-lg text-gray-800">
                      {displayData.createdAt ? new Date(displayData.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <p className="font-semibold text-sm text-gray-600">Created By:</p>
                    <p className="font-bold text-lg text-gray-800">
                      {displayData.createdBy }
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <p className="font-semibold text-sm text-gray-600">Updated Last:</p>
                    <p className="font-bold text-lg text-gray-800">
                      {displayData.updatedAt ? new Date(displayData.updatedAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <p className="font-semibold text-sm text-gray-600">Updated By:</p>
                    <p className="font-bold text-lg text-gray-800">
                      {displayData.updatedBy }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <DashboardHeader />

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-4xl border lg:min-w-[300px] border-[#D0D0D0]">
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
          <table className="min-w-full table-auto">
            <thead className="bg-[#E6EFF5] lg:text-sm sm:text-xs">
              <tr className="border-b-[#D0D0D0] border-b">
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
                    key={item.userId || index}
                    className="cursor-pointer border-b-[#D0D0D0] border-b font-semibold text-xs"
                  >
                    <td className="pt-3 pb-3 pl-12 text-[#333333]">
                      {item.fullName || `${item.firstName} ${item.surname}`}
                    </td>
                    <td className="pt-3 pb-3 text-[#333333]">
                      {item.schoolName}
                    </td>
                    <td className="pt-3 pb-3 text-[#333333]">
                      {item.designation || "N/A"}
                    </td>
                    <td className="pt-3 pb-3 text-[#333333]">
                      {item.phoneNumber || "N/A"}
                    </td>
                    <td className="pt-3 pb-3 text-[#333333]">{item.email}</td>
                    <td className="pt-3 pb-3 text-[#333333]">
                      <div className="flex gap-4">
                        <Link
                          href={`/Super-Admin/Manage-School-Admin/Edit-School-Admin?adminId=${adminId}&schoolAdminId=${item.userId}`}
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
                    {loading ? "Loading..." : "No School Admins Found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredSchoolAdmins.length > ITEMS_PER_PAGE && (
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
    </SuperAdminLayout>
  );
};

export default ManageSchoolAdminItem;