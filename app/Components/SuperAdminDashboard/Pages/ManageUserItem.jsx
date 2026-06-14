"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import DashboardHeader from "../DashboardHeader";
import { FaUserPlus } from "react-icons/fa6";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import AddUser from "../Modals/AddUser";
import EditUser from "../Modals/EditUser";
// Import from the new service
import superAdminMetricsService from "@/Service/SuperAdminService";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;
const ManageUserItem = () => {
  const [modalTransform, setModalTransform] = useState("translateX(-100%)");
  const [modalOpacity, setModalOpacity] = useState(0);
  const [selectedSchoolDelete, setSelectedSchoolDelete] = useState(null);
  const [selectedUserEdit, setSelectedUserEdit] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [usersData, setUsersData] = useState([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // State for search
  const [searchTerm, setSearchTerm] = useState("");

  // Function to fetch all super admins
  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await superAdminMetricsService.getAllSuperAdmins();
      console.log("Get all superadmins response:", response);
      
      if (response.success) {
        setAllUsers(response.data || []);
      } else {
        setError(response.message || "Failed to fetch users");
        toast.error(response.message || "Failed to fetch users");
      }
    } catch (err) {
      setError(`Error fetching users: ${err.message}`);
      toast.error(`Error fetching users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to fetch users on initial load
  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // Function to filter users based on searchTerm
  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      return allUsers;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allUsers.filter(
      (user) =>
        (user.fullName && user.fullName.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (user.firstName && user.firstName.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (user.surName && user.surName.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (user.phoneNumber && user.phoneNumber.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (user.email && user.email.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [allUsers, searchTerm]);

  // Calculate pagination values
  const startIndex = useMemo(
    () => (currentPage - 1) * ITEMS_PER_PAGE,
    [currentPage]
  );
  const endIndex = useMemo(() => startIndex + ITEMS_PER_PAGE, [startIndex]);

  // Function to paginate the filtered users
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, startIndex, endIndex]);

  // Update usersData whenever paginatedUsers changes
  useEffect(() => {
    setUsersData(paginatedUsers);
  }, [paginatedUsers]);

  // Function to open Add modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => {
      setModalTransform("translateX(0)");
      setModalOpacity(1);
    });
  };

  // UPDATED: Fetch full user details when opening edit modal
  const openEditModal = async (user) => {
    setEditError(null);
    setEditSuccess(false);
    setIsEditModalOpen(true);
    
    // Show loading in modal
    setEditLoading(true);
    
    try {
      // Fetch full user details using getSuperAdminById
      const response = await superAdminMetricsService.getSuperAdminById(user.userId);
      console.log("Full user details from getSuperAdminById:", response);
      
      if (response.success && response.data) {
        setSelectedUserEdit(response.data);
        setTimeout(() => {
          setModalTransform("translateX(0)");
          setModalOpacity(1);
        }, 0);
      } else {
        toast.error(response.message || "Failed to load user details");
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Error loading user details");
      setIsEditModalOpen(false);
    } finally {
      setEditLoading(false);
    }
  };

  // Function to close modal
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setModalTransform("translateX(-100%)");
    setModalOpacity(0);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setModalTransform("translateX(-100%)");
    setModalOpacity(0);
    setTimeout(() => {
      setSelectedUserEdit(null);
      setEditError(null);
      setEditSuccess(false);
    }, 300);
  };

  const openDeleteModal = (user) => {
    setDeleteSuccess(false);
    setSelectedSchoolDelete(user);
    setTimeout(() => {
      setModalTransform("translateX(0)");
      setModalOpacity(1);
    }, 0);
  };

  // Function to close modal
  const closeDeleteModal = () => {
    setModalTransform("translateX(-100%)");
    setModalOpacity(0);
    setTimeout(() => {
      setSelectedSchoolDelete(null);
    }, 300);
  };

  const handleDeleteUser = async () => {
    console.log("handleDeleteUser called");
    console.log("selectedSchoolDelete:", selectedSchoolDelete);
    if (selectedSchoolDelete?.userId) {
      setDeleteLoading(true);
      setDeleteError(null);
      setDeleteSuccess(false);
      try {
        const response = await superAdminMetricsService.deleteSuperAdmin(selectedSchoolDelete.userId);
        console.log("Delete response:", response);
        
        if (response.success) {
          toast.success(response.message || "User deleted successfully");
          setDeleteSuccess(true);
          closeDeleteModal();
          fetchAllUsers();
        } else {
          setDeleteError(response.message || "Failed to delete user");
          toast.error(response.message || "Failed to delete user");
        }
      } catch (err) {
        setDeleteError(`Error deleting user: ${err.message}`);
        toast.error(`Error deleting user: ${err.message}`);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleUpdateUser = async (updateData) => {
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(false);
    try {
      if (selectedUserEdit?.userId) {
        const response = await superAdminMetricsService.updateSuperAdmin(
          selectedUserEdit.userId,
          updateData
        );
        console.log("Update response:", response);
        
        if (response.success) {
          toast.success(response.message || "User updated successfully");
          setEditSuccess(true);
          setTimeout(() => {
            closeEditModal();
            fetchAllUsers();
          }, 1500);
        } else {
          setEditError(response.message || "Failed to update user");
          toast.error(response.message || "Failed to update user");
        }
      } else {
        setEditError("No user selected for editing.");
        toast.error("No user selected for editing.");
      }
    } catch (err) {
      setEditError(`Error updating user: ${err.message}`);
      toast.error(`Error updating user: ${err.message}`);
    } finally {
      setEditLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
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
      {selectedSchoolDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>

          <div
            className="relative bg-white rounded-xl shadow-lg min-w-75 z-50 transition-transform pt-10 pb-10 duration-600 ease-in-out"
            style={{ transform: modalTransform, opacity: modalOpacity }}
          >
            <p className="font-bold text-center text-lg">Delete User</p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure you want to delete
              </p>
              <p className="text-base text-[#858383] font-semibold">
                {selectedSchoolDelete.fullName || selectedSchoolDelete.email}?
              </p>
              {deleteError && (
                <p className="text-red-500 mt-2">{deleteError}</p>
              )}
              {deleteSuccess && (
                <p className="text-green-500 mt-2">
                  User deleted successfully!
                </p>
              )}
            </div>
            <div className="font-bold text-md items-center justify-center pt-3 flex gap-5">
              <button
                onClick={handleDeleteUser}
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

      {/* ADD USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeAddModal}
          ></div>
          <div
            className="relative md:pl-6 md:pr-6 pt-4 pb-4 sm:pl-3 sm:pr-3 bg-white rounded-md shadow-lg xl:w-280 lg:w-240 md:w-180 sm:w-150 z-50 transition-transform duration-700 ease-in-out"
            style={{ transform: modalTransform, opacity: modalOpacity }}
          >
            <div className="flex justify-end">
              <span onClick={closeAddModal} className="cursor-pointer">
                <IoClose size={20} />
              </span>
            </div>
            <div className="flex justify-center">
              <p className="font-bold text-lg">ADD NEW SUPER ADMIN</p>
            </div>
            <AddUser onClose={closeAddModal} onUserAdded={fetchAllUsers} />
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeEditModal}
          ></div>
          <div
            className="relative md:pl-6 md:pr-6 pt-4 pb-4 sm:pl-3 sm:pr-3 bg-white rounded-md shadow-lg xl:w-280 lg:w-240 md:w-180 sm:w-150 z-50 transition-transform duration-700 ease-in-out"
            style={{ transform: modalTransform, opacity: modalOpacity }}
          >
            <div className="flex justify-end">
              <span onClick={closeEditModal} className="cursor-pointer">
                <IoClose size={20} />
              </span>
            </div>
            <div className="flex justify-center">
              <p className="font-bold text-lg">EDIT SUPER ADMIN</p>
            </div>
            <EditUser
              onClose={closeEditModal}
              user={selectedUserEdit}
              onUserUpdated={fetchAllUsers}
              loading={editLoading}
              error={editError}
              success={editSuccess}
              onSave={handleUpdateUser}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <DashboardHeader />

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-4xl border lg:min-w-[300px] border-[#D0D0D0]">
            <input
              type="text"
              placeholder="Search Super Admin"
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

          <div className="bg-[#E6EFF5] rounded-full flex items-center p-3 cursor-pointer">
            <FaUserPlus
              onClick={openAddModal}
              className="text-[#01427A]"
              size={20}
            />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-[#D4D4D4] overflow-auto flex-1 p-4">
        <div className="bg-[#ffffff] rounded-lg overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-[#E6EFF5] lg:text-sm sm:text-xs">
              <tr className="border-b-[#D0D0D0] border-b">
                <th className="pt-3 pb-3 pl-12 text-left font-bold text-[#333333]">
                  Name
                </th>
                <th className="pt-3 pb-3 text-left font-bold text-[#333333]">
                  Phone Number
                </th>
                <th className="pt-3 pb-3 text-left font-bold text-[#333333]">
                  Email Address
                </th>
                <th className="pt-3 pb-3 text-left font-bold text-[#333333]">
                  User Role
                </th>
                <th className="pt-3 pb-3 text-left font-bold text-[#333333]">
                  Modify
                </th>
              </tr>
            </thead>
            <tbody>
              {usersData?.length > 0 ? (
                usersData.map((item) => (
                  <tr
                    key={item.userId}
                    className="cursor-pointer border-b-[#D0D0D0] border-b font-semibold text-xs"
                  >
                    <td className="pt-3 pb-3 pl-12 text-[#333333]">
                      {item.fullName || `${item.firstName} ${item.surName}`}
                    </td>
                    <td className="pt-3 pb-3 text-[#333333]">
                      {item.phoneNumber || "N/A"}
                    </td>
                    <td className="pt-3 pb-3 text-[#333333]">
                      {item.email}
                    </td>
                    <td className="pt-3 pb-3 text-[#333333]">
                      Super Admin
                    </td>
                    <td className="pt-3 pb-3 text-[#333333]">
                      <div className="flex gap-4">
                        <FiEdit3
                          className="text-[#80ADCB] cursor-pointer"
                          size={15}
                          onClick={() => openEditModal(item)}
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
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredUsers.length > ITEMS_PER_PAGE && (
          <div className="bg-[#ffffff] rounded-lg p-4 flex justify-center items-center gap-4 mt-2">
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

export default ManageUserItem;