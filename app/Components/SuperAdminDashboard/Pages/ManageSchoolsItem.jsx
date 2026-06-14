"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import DashboardHeader from "../DashboardHeader";
import { RiEqualizerLine } from "react-icons/ri";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import schoolService from "@/Service/SchoolService";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 7;

// Helper function to convert education level enum to string
const getEducationLevelString = (value) => {
  const levelMap = {
    0: "Nursery",
    1: "Primary",
    2: "Nursery & Primary",
    3: "Nursery, Primary & Secondary",
    4: "Secondary",
    5: "Primary & Secondary",
    6: "Tertiary"
  };
  return levelMap[value] ?? "Primary";
};

const ManageSchoolsItem = () => {
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");
  const router = useRouter();

  const [allSchools, setAllSchools] = useState([]);
  const [schoolsData, setSchoolsData] = useState([]);
  const [totalSchools, setTotalSchools] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedschoolDetail, setselectedschoolDetail] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Delete modal states
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedSchoolDelete, setSelectedSchoolDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [modalTransform, setModalTransform] = useState("translateX(-100%)");
  const [modalOpacity, setModalOpacity] = useState(0);

  const fetchAllSchools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await schoolService.getAllSchools(searchTerm);
      console.log("Schools response:", response);
      
      if (response.success) {
        setAllSchools(response.data || []);
        setTotalSchools(response.count || 0);
      } else {
        setError(response.message || "Failed to fetch schools");
        toast.error(response.message || "Failed to fetch schools");
      }
    } catch (err) {
      setError(`Error fetching schools: ${err.message}`);
      toast.error(`Error fetching schools: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchAllSchools();
  }, [fetchAllSchools]);

  const filteredSchools = useMemo(() => {
    if (!searchTerm) {
      return allSchools;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allSchools.filter(
      (school) =>
        (school.schoolName && school.schoolName.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (school.shortName && school.shortName.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (school.schoolType !== undefined && school.schoolType.toString().toLowerCase().includes(lowerCaseSearchTerm)) ||
        (school.city && school.city.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (school.state && school.state.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [allSchools, searchTerm]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setSchoolsData(filteredSchools.slice(startIndex, endIndex));
    setTotalSchools(filteredSchools.length);
  }, [filteredSchools, currentPage]);

  const openDetailModal = (school) => {
    setselectedschoolDetail(school);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setselectedschoolDetail(null);
    setDetailModalVisible(false);
  };

  const openDeleteModal = (school, e) => {
    e.stopPropagation();
    setDeleteSuccess(false);
    setDeleteError(null);
    setSelectedSchoolDelete(school);
    setDeleteModalVisible(true);
    setTimeout(() => {
      setModalTransform("translateX(0)");
      setModalOpacity(1);
    }, 0);
  };

  const closeDeleteModal = () => {
    setModalTransform("translateX(-100%)");
    setModalOpacity(0);
    setTimeout(() => {
      setSelectedSchoolDelete(null);
      setDeleteModalVisible(false);
    }, 300);
  };

  const handleDeleteSchool = async () => {
    if (selectedSchoolDelete?.id) {
      setDeleteLoading(true);
      setDeleteError(null);
      setDeleteSuccess(false);
      try {
        const response = await schoolService.deleteSchool(selectedSchoolDelete.id);
        console.log("Delete response:", response);
        
        if (response.success) {
          toast.success(response.message || "School deleted successfully");
          setDeleteSuccess(true);
          setTimeout(() => {
            closeDeleteModal();
            fetchAllSchools();
          }, 1500);
        } else {
          setDeleteError(response.message || "Failed to delete school");
          toast.error(response.message || "Failed to delete school");
        }
      } catch (err) {
        setDeleteError(`Error deleting school: ${err.message}`);
        toast.error(`Error deleting school: ${err.message}`);
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

  const totalPages = Math.ceil(totalSchools / ITEMS_PER_PAGE);

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
            <p className="font-bold text-center text-lg">Delete School</p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure you want to delete
              </p>
              <p className="text-base text-[#858383] font-semibold">
                {selectedSchoolDelete.schoolName}?
              </p>
              {deleteError && (
                <p className="text-red-500 mt-2">{deleteError}</p>
              )}
              {deleteSuccess && (
                <p className="text-green-500 mt-2">
                  School deleted successfully!
                </p>
              )}
            </div>
            <div className="font-bold text-md items-center justify-center pt-3 flex gap-5">
              <button
                onClick={handleDeleteSchool}
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

      {/* Detail Modal */}
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
                  {selectedschoolDetail.schoolName}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">School Short Name:</p>
                <p className="font-bold text-lg">
                  {selectedschoolDetail.shortName}
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
                  {getEducationLevelString(selectedschoolDetail.educationLevel)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">School Type:</p>
                <p className="font-bold text-lg">
                  {selectedschoolDetail.schoolType === 0 ? "Public" : "Private"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Phone Number:</p>
                <p className="font-bold text-lg">
                  {selectedschoolDetail.phoneNumber}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">City:</p>
                <p className="font-bold text-lg">
                  {selectedschoolDetail.city}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">State:</p>
                <p className="font-bold text-lg">
                  {selectedschoolDetail.state}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Country:</p>
                <p className="font-bold text-lg">
                  {selectedschoolDetail.country}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Status:</p>
                <p
                  className={`font-bold text-lg ${
                    selectedschoolDetail.isActive
                      ? " text-[#1BB66E] "
                      : " text-[#F94144] "
                  }`}
                >
                  {selectedschoolDetail.isActive ? "Active" : "Inactive"}
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
              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-blue-900 border-t-red-500 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center bg-red-200 border border-red-500 text-red-700 px-4 py-2 rounded-md m-4">
                {error}
              </div>
            ) : (
              <table className="min-w-full table-auto">
                <thead className="bg-[#E6EFF5] lg:text-sm sm:text-xs">
                  <tr className="border-b-[#D0D0D0] border-b">
                    <th className="pt-3 pb-3 pl-10 text-left font-bold text-[#333333]">
                      School Name
                    </th>
                    <th className="pt-3 pb-3 text-center font-bold text-[#333333]">
                      School Type
                    </th>
                    <th className="pt-3 pb-3 text-center font-bold text-[#333333]">
                      Short Sch Name
                    </th>
                    <th className="pt-3 pb-3 text-center font-bold text-[#333333]">
                      City
                    </th>
                    <th className="pt-3 pb-3 text-center font-bold text-[#333333]">
                      Status
                    </th>
                    <th className="pt-3 pb-3 text-center pr-10 font-bold text-[#333333]">
                      Modify
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schoolsData.length > 0 ? (
                    schoolsData.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b-[#D0D0D0] border-b font-semibold text-[0.85rem] cursor-pointer"
                        onClick={() => openDetailModal(item)}
                      >
                        <td className="pt-3 pb-3 pl-10 text-left text-[#333333]">
                          {item.schoolName}
                        </td>
                        <td className="pt-3 pb-3 text-center text-[#333333]">
                          {item.schoolType === 0 ? "Public" : "Private"}
                        </td>
                        <td className="pt-3 pb-3 text-center text-[#333333]">
                          {item.shortName}
                        </td>
                        <td className="pt-3 pb-3 text-center text-[#333333]">
                          {item.city}
                        </td>
                        <td className="pt-3 pb-3 text-center">
                          <span
                            className={`${
                              item.isActive
                                ? "bg-[#E8F8F0] text-[#1BB66E]"
                                : "bg-[#FEECEC] text-[#F94144]"
                            } rounded-2xl py-1 text-sm`}
                            style={{
                              minWidth: "80px",
                              display: "inline-block",
                              textAlign: "center",
                            }}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="pt-3 pb-3 text-[#333333] pr-10">
                          <div className="flex items-center justify-center gap-4">
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
                              onClick={(e) => openDeleteModal(item, e)}
                              className="text-[#F94144] cursor-pointer"
                              size={15}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-gray-500">
                        No schools found.
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