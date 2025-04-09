"use client";
import React, { useEffect, useState } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import DashboardHeader from "../DashboardHeader";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaUserPlus } from "react-icons/fa6";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import styles from "../../../Super-Admin/css/spinner.module.css";
import { getSchoolAdmin } from "@/app/Service/schoolAdminService";

const ManageSchoolAdminItem = () => {
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");

  // State to store the fetched school admins
  const [schoolAdminsData, setSchoolAdminsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the search term
  const [searchTerm, setSearchTerm] = useState("");

  // State to track selected school admin for modal actions
  const [selectedSchoolAdmin, setSelectedSchoolAdmin] = useState(null);
  const [selectedSchoolDelete, setSelectedSchoolDelete] = useState(null);

  const [modalTransform, setModalTransform] = useState("translateX(-100%)");
  const [modalOpacity, setModalOpacity] = useState(0);

  // Function to open modal
  const openModal = (school) => {
    setSelectedSchoolAdmin(school);
    setTimeout(() => {
      setModalTransform("translateX(0)");
      setModalOpacity(1);
    }, 0);
  };

  // Function to close modal
  const closeModal = () => {
    setModalTransform("translateX(-100%)");
    setModalOpacity(0);
    setTimeout(() => {
      setSelectedSchoolAdmin(null);
    }, 300);
  };
  const openDeleteModal = (school) => {
    setSelectedSchoolDelete(school);
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

  useEffect(() => {
    const fetchSchoolAdminsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getSchoolAdmin();
        console.log("Data from API:", response.data);
        setSchoolAdminsData(response.data);
      } catch (err) {
        console.error("Error fetching school admin data:", err);
        setError(err.message || "Failed to fetch school admin data");
        setSchoolAdminsData([]);
      } finally {
        setLoading(false);
        console.log("Loading state after fetch:", loading);
      }
    };

    fetchSchoolAdminsData();
  }, []);

  // Filter the school admins based on the search term
  const filteredSchoolAdmins = schoolAdminsData.filter((admin) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      admin.first_name.toLowerCase().includes(searchLower) ||
      admin.surname.toLowerCase().includes(searchLower) ||
      admin.school_name.toLowerCase().includes(searchLower) ||
      admin.designation.toLowerCase().includes(searchLower) ||
      admin.phone_number.toLowerCase().includes(searchLower) ||
      admin.email.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading School Admins: {error}</div>; // Basic error indicator
  }

  console.log("schoolAdminsData before render:", schoolAdminsData);
  console.log("Loading before render:", loading);
  return (
    <SuperAdminLayout>
      {/* Delete Modal */}
      {selectedSchoolDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>

          {/* Modal Content */}
          <div
            className="relative  bg-white  rounded-xl shadow-lg min-w-75  z-50 transition-transform pt-10 pb-10   duration-600 ease-in-out"
            style={{ transform: modalTransform, opacity: modalOpacity }}
          >
            <p className="font-bold  text-center text-lg">
              Delete School Admin
            </p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete the
              </p>
              <p className="text-base text-[#858383]">selected School Admin?</p>
            </div>
            <div className="font-bold text-md items-center justify-center pt-3 flex gap-5 ">
              <button className="cursor-pointer text-white bg-[#F94144] rounded-md pl-4 pr-4">
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

      {/* Information Modal */}
      {selectedSchoolAdmin && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div
            className="relative pb-5 bg-white  rounded-md shadow-lg min-w-165  z-50 transition-transform  duration-600 ease-in-out"
            style={{ transform: modalTransform, opacity: modalOpacity }}
          >
            <div className="bg-[#01427A] rounded-t-md">
              <p className="  flex items-center justify-between pl-6 pr-6 pt-4 pb-4 text-white font-bold text-xl">
                Administrative Information
                <span onClick={closeModal} className="cursor-pointer">
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

      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0  z-10 shadow-md  flex justify-between items-center ">
        <DashboardHeader />

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-4xl border lg:min-w-[300px]  border-[#978F8F] ">
            <input
              type="text"
              placeholder="Search School Admin"
              className="w-full outline-none bg-transparent text-[#AEAEAE] text-sm p-2 pl-5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <th className="pt-3 pb-3 pl-12  text-left  font-bold text-[#333333]">
                  School Admin Name
                </th>
                <th className="pt-3 pb-3 text-left  font-bold text-[#333333]">
                  School Name
                </th>
                <th className="pt-3 pb-3 text-left  font-bold text-[#333333]">
                  Designation
                </th>
                <th className="pt-3 pb-3 text-left  font-bold text-[#333333]">
                  Phone Number
                </th>
                <th className="pt-3 pb-3 text-left  font-bold text-[#333333]">
                  Email Address
                </th>
                <th className="pt-3 pb-3 text-left  font-bold text-[#333333]">
                  Modify
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSchoolAdmins.length > 0 ? (
                filteredSchoolAdmins.map((item, index) => (
                  <tr
                    onClick={() => openModal(item)}
                    key={index}
                    className="cursor-pointer border-b-[#978F8F] border-b font-semibold text-xs"
                  >
                    <td className="pt-2 pb-2 pl-12 text-[#333333]">
                      {item.first_name + " " + item.surname}
                    </td>
                    <td className="pt-2 pb-2  text-[#333333]">
                      {item.school_name}
                    </td>
                    <td className="pt-2 pb-2  text-[#333333]">
                      {item.designation}
                    </td>
                    <td className="pt-2 pb-2  text-[#333333]">
                      {item.phone_number}
                    </td>
                    <td className="pt-2 pb-2  text-[#333333]">{item.email}</td>
                    <td className="pt-2 pb-2 text-[#333333]">
                      <div className="flex gap-4">
                        <Link
                          href={`/Super-Admin/Manage-School-Admin/Edit-School-Admin?adminId=${adminId}`}
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
      </div>
    </SuperAdminLayout>
  );
};

export default ManageSchoolAdminItem;
