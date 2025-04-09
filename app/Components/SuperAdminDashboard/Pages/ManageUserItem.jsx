"use client";
import React, { useState } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import DashboardHeader from "../DashboardHeader";
import { FaUserPlus } from "react-icons/fa6";
import User from "../../User";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import AddUser from "../Modals/AddUser";
import EditUser from "../Modals/EditUser";

const ManageUserItem = () => {
  const [modalTransform, setModalTransform] = useState("translateX(-100%)");
  const [modalOpacity, setModalOpacity] = useState(0);
  const [selectedSchoolDelete, setSelectedSchoolDelete] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Function to open Add modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => {
      setModalTransform("translateX(0)");
      setModalOpacity(1);
    }, 0);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
    setTimeout(() => {
      setModalTransform("translateX(0)");
      setModalOpacity(1);
    }, 0);
  };

  // Function to close modal
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setModalTransform("translateX(-100%)");
    setModalOpacity(0);
  };

  // Function to close Edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setModalTransform("translateX(-100%)");
    setModalOpacity(0);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Added:", formData);
    closeAddModal();
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

  return (
    <SuperAdminLayout>
      {/* Delete */}
      {/* Overlay and Modal */}
      {selectedSchoolDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>

          {/* Modal Content */}
          <div
            className="relative  bg-white  rounded-xl shadow-lg min-w-75  z-50 transition-transform pt-10 pb-10  duration-600 ease-in-out"
            style={{ transform: modalTransform, opacity: modalOpacity }}
          >
            <p className="font-bold  text-center text-lg">Delete School</p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete the
              </p>
              <p className="text-base text-[#858383]">selected User?</p>
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

      {/* ADD USER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeAddModal}
          ></div>
          <div
            className="relative md:pl-6 md:pr-6 pt-4 pb-4 sm:pl-3 sm:pr-3  bg-white  rounded-md shadow-lg  lg:max-w-280 md:max-w-180 sm:max-w-150  z-50 transition-transform  duration-600 ease-in-out"
            style={{ transform: modalTransform, opacity: modalOpacity }}
          >
            <div className="flex justify-end">
              <span onClick={closeAddModal} className="cursor-pointer">
                <IoClose size={20} />
              </span>
            </div>
            <div className="flex justify-center">
              <p className="font-bold text-xl">ADD NEW USER</p>
            </div>
            <AddUser />
          </div>
        </div>
      )}

      {/* Edit User */}

      {isEditModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeEditModal}
          ></div>
          <div
            className="relative md:pl-6 md:pr-6 pt-4 pb-4 sm:pl-3 sm:pr-3  bg-white  rounded-md shadow-lg lg:max-w-280 md:max-w-180 sm:max-w-150  z-50 transition-transform  duration-600 ease-in-out"
            style={{ transform: modalTransform, opacity: modalOpacity }}
          >
            <div className="flex justify-end">
              <span onClick={closeEditModal} className="cursor-pointer">
                <IoClose size={20} />
              </span>
            </div>
            <div className="flex justify-center">
              <p className="font-bold text-xl">EDIT USER</p>
            </div>
            <EditUser />
          </div>
        </div>
      )}

      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0  z-10 shadow-md  flex justify-between items-center ">
        <DashboardHeader />

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-4xl border lg:min-w-[300px]  border-[#978F8F] ">
            <input
              type="text"
              placeholder="Search School"
              className="w-full outline-none bg-transparent text-[#AEAEAE] text-sm p-2 pl-5"
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
      <div className="bg-[#D4D4D4] overflow-auto flex-1 p-4">
        <div className="bg-[#ffffff] rounded-lg overflow-x-auto">
          <table className="min-w-full table-auto ">
            <thead className="bg-[#E6EFF5] lg:text-sm sm:text-xs ">
              <tr className="border-b-[#978F8F] border-b">
                <th className="pt-3 pb-3 pl-12  text-left  font-bold text-[#333333]">
                  Name
                </th>
                <th className="pt-3 pb-3   text-left  font-bold text-[#333333]">
                  Phone Number
                </th>
                <th className="pt-3 pb-3   text-left  font-bold text-[#333333]">
                  Email Address
                </th>
                <th className="pt-3 pb-3   text-left  font-bold text-[#333333]">
                  User Role
                </th>
                <th className="pt-3 pb-3   text-left  font-bold text-[#333333]">
                  Modify
                </th>
              </tr>
            </thead>
            <tbody>
              {User.map((item, index) => (
                <tr
                  key={index}
                  className="cursor-pointer border-b-[#978F8F] border-b font-semibold text-xs"
                >
                  <td className="pt-2 pb-2 pl-12  text-[#333333]">
                    {item.Surname + " " + item.FirstName}
                  </td>
                  <td className="pt-2 pb-2  text-[#333333]">
                    {item.PhoneNumber}
                  </td>
                  <td className="pt-2 pb-2  text-[#333333]">
                    {item.EmailAddress}
                  </td>
                  <td className="pt-2 pb-2  text-[#333333]">{item.UserRole}</td>
                  <td className="pt-2 pb-2 text-[#333333]">
                    <div className="flex gap-4">
                      <FiEdit3
                        className="text-[#80ADCB] cursor-pointer"
                        size={15}
                        onClick={openEditModal}
                      />
                      <FiTrash2
                        onClick={openDeleteModal}
                        className="text-[#F94144] cursor-pointer"
                        size={15}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default ManageUserItem;
