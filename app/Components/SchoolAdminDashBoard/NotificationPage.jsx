"use client";
import React, { useEffect, useState } from "react";
import { getAllRoles } from "../../Service/RoleService";
import {
  createNotifications,
  DeleteNotification,
  getNotifications,
  UpdateNotification,
} from "../../Service/NotificationService";
import Dropdown from "./DropDown2";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import { IoFilter, IoSearch } from "react-icons/io5";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import formatdate from "../SchoolAdminDashBoard/Formatdate";
const NotificationPage = () => {
  const [role, setRole] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedDelete, setselectedDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editVisible, setEditVisible] = useState(false);
  const [selected, setselected] = useState(null);
  const [filterType, setFilterType] = useState("title");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setformData] = useState({
    title: "",
    content: "",
    recipient_group: "",
    notification_type: "",
  });

  const notificationTypes = [
    { label: "Information", value: "Information" },
    { label: "Reminder", value: "Reminder" },
    { label: "Alert", value: "Alert" },
  ];

  const fetchData = async () => {
    try {
      const roleRes = await getAllRoles();
      if (roleRes.data) {
        setRole(roleRes.data);
      } else {
        toast.error("Failed to fetch roles");
      }
      const notificationRes = await getNotifications();
      if (notificationRes) {
        setNotifications(notificationRes);
      } else {
        toast.error("Failed to fetch notifications");
      }
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const getRoleName = (roleID) => {
    const t = role.find((item) => item.id === roleID);
    if (!t) return null; // explicitly return null if not found
    return t.name;
  };

  const openDeleteModal = (school) => {
    setselectedDelete(school);
    setDeleteModalVisible(true);
  };

  // Function to close delete modal
  const closeDeleteModal = () => {
    setselectedDelete(null);
    setDeleteModalVisible(false);
  };

  const handleEdit = (notification) => {
    setEditVisible(true);
    setselected({ ...notification });

    setformData({
      title: notification.title,
      content: notification.content,
      recipient_group: notification.recipient_group,
      notification_type: notification.notification_type,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const notificationData = {
        title: formData.title,
        content: formData.content,
        recipient_group: formData.recipient_group,
        notification_type: formData.notification_type,
      };

      if (editVisible && selected) {
        response = await UpdateNotification(
          selected.notification_id,
          notificationData
        );
      } else {
        response = await createNotifications(notificationData);
      }

      if (response.error) {
        console.log(response.error);
        toast.error("Failed to create or update notification");
        return;
      }

      fetchData();

      toast.success(
        editVisible
          ? "Notification updated successfully"
          : "Notification created successfully"
      );
      setEditVisible(false);
      setformData({
        title: "",
        content: "",
        recipient_group: "",
        notification_type: "",
      });
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while processing your request");
    }
  };

  const handleDelete = async () => {
    if (!selectedDelete) return;

    try {
      const response = await DeleteNotification(selectedDelete.id);
      if (response.error) {
        toast.error(response.error);
        return;
      }

      // Refresh notifications after successful deletion
      const updatedNotifications = await getNotifications();
      if (updatedNotifications.data) {
        setNotifications(updatedNotifications.data);
      }

      toast.success("Notification deleted successfully");
      closeDeleteModal();
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while deleting the notification");
    }
  };

  const itemsPerPage = 10;

  const filteredNotifications =
    searchText.trim() === ""
      ? notifications
      : notifications.filter((d) => {
          const lowerSearch = searchText.toLowerCase();

          if (filterType === "title") {
            return d.title.toLowerCase().includes(lowerSearch);
          }

          if (filterType === "type") {
            return d.notification_type.toLowerCase().includes(lowerSearch);
          }

          if (filterType === "user") {
            const recipientName =
              getRoleName(d.recipient_group)?.toLowerCase() || "";
            return recipientName.includes(lowerSearch);
          }

          return false;
        });

  //PAGINATION FOR PERIODS
  const paginatedData = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="pr-1 w-full h-full overflow-y-auto no-scrollbar">
      {deleteModalVisible && selectedDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg min-w-75 z-50 p-8">
            <p className="font-bold text-center text-lg">Delete Notification</p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete the Notification
              </p>
              <p className="text-base text-[#858383]">
                <span className="font-bold">{selectedDelete.title}</span>?
              </p>
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
      <form onSubmit={handleSubmit} className="mb-3 pb-5 pt-3  bg-white">
        <div className="flex pt-3 pl-6 pr-6 justify-between mb-5 ">
          <p className="font-bold text-[#07508F]">
            {editVisible ? "Edit Notification" : "Create Notification"}
          </p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm px-5 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            {editVisible ? "Save" : "Create"}
          </button>
        </div>
        <div className="pl-6 pr-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Title:</label>
              <input
                type="text"
                name="title"
                placeholder="Enter Title"
                value={formData.title}
                onChange={(e) => {
                  const value = e.target.value;
                  editVisible
                    ? setselected((prev) => ({
                        ...prev,
                        title: value,
                      }))
                    : setformData((prev) => ({
                        ...prev,
                        title: value,
                      }));
                }}
                className={`${
                  formData.title !== "" ||
                  (editVisible && selected?.title !== "")
                    ? "border-[#0071E3]"
                    : "border-[#B6B6B6]"
                } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-[1.5px] p-1.5 text-sm rounded-sm `}
                required
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Content:</label>
              <input
                type="text"
                name="content"
                placeholder="Enter Notification Content"
                value={formData.content}
                onChange={(e) => {
                  const value = e.target.value;
                  editVisible
                    ? setselected((prev) => ({
                        ...prev,
                        content: value,
                      }))
                    : setformData((prev) => ({
                        ...prev,
                        content: value,
                      }));
                }}
                className={`${
                  formData.content !== "" ||
                  (editVisible && selected?.content !== "")
                    ? "border-[#0071E3]"
                    : "border-[#B6B6B6]"
                } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-[1.5px] p-1.5 text-sm rounded-sm `}
                required
              />
            </div>

            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Recipient:
              </label>
              <Dropdown
                label={formData.recipient_group || "Select Recipient"}
                items={role.map((t) => ({
                  label: t.name,
                  onClick: () =>
                    setformData((prev) => ({
                      ...prev,
                      recipient_group: t.name,
                    })),
                }))}
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Notification Type:
              </label>
              <Dropdown
                label={formData.notification_type || "Select type"}
                items={notificationTypes.map((item) => ({
                  label: item.label,
                  onClick: () =>
                    setformData((prev) => ({
                      ...prev,
                      notification_type: item.value,
                    })),
                }))}
              />
            </div>
          </div>
        </div>
      </form>
      <hr className=" text-[#A7B9CC]/50 mt-10" />
      <div className="flex-shrink-0 mb-2">
        <p className="font-semibold flex justify-center mb-5 p-3 text-[#333333]">
          Existing Notifications
        </p>
      </div>
      <div className=" w-full grid grid-cols-[auto_1fr] gap-10 items-center  mb-3 pl-6 pr-6 ">
        <div className="w-full relative inline-block">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center text-[#01427A] hover:text-white hover:bg-[#01427A] cursor-pointer text-sm gap-2 border-[1.5px] rounded border-[#01427A] py-2 px-3"
          >
            <span className="hidden xl:block">Filter by</span>
            <IoFilter size={18} />
          </button>

          {showFilterDropdown && (
            <div className="absolute left-0 mt-2 bg-white border rounded shadow-lg z-10 min-w-[150px]">
              {[
                { label: "Title", value: "title" },
                { label: "Type", value: "type" },
                { label: "User", value: "user" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setFilterType(type.value);
                    setShowFilterDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-[#01427A]/10 border-b last:border-none flex items-center gap-2"
                >
                  <RxLetterCaseCapitalize />
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative w-full">
          <IoSearch
            className="text-[#AEAEAE] absolute left-0 top-2.5 mr-10 ml-3 "
            size={18}
          />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            className="placeholder:text-[#AEAEAE] xl:placeholder:text-sm placeholder:text-xs rounded  py-1 pl-10 pr-12 border-[1.5px] w-full "
            placeholder={`Type here to filter by ${filterType}`}
          />
        </div>
      </div>

      <div className="pl-6 pr-6 flex flex-col gap-5 mt-8">
        {paginatedData.length === 0 ? (
          <div className="flex justify-center items-center mt-10 h-full">
            <p className="text-center text-sm text-[#858383]">
              No notifications found
            </p>
          </div>
        ) : (
          paginatedData.map((item) => {
            return (
              <div
                key={item.id}
                className="flex flex-col bg-white rounded-xl border-2 border-[#0B0A0A]/10  p-4"
              >
                <div className="flex justify-between items-center mb-5">
                  <div className="flex flex-col gap-1">
                    <p className=" font-medium text-[#333333]">{item.title}</p>
                    <p className="text-sm text-[#333333]">{item.content}</p>
                  </div>
                  <p className="text-sm font-light text-[#333333]">
                    {formatdate(item.created_at)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <div className="bg-[#9747FF]/30 p-2.5 py-1 rounded-sm">
                      <p className="text-sm font-medium text-[#9747FF]">
                        {item.recipient_group}
                      </p>
                    </div>
                    <div className="bg-[#2D9CFB]/25 p-2.5 py-1 rounded-sm">
                      <p className="text-sm font-medium text-[#1983DE]">
                        {item.notification_type}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end items-center gap-3">
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
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-self-end pr-6 items-center gap-2 mt-3 text-sm text-[#01427A] font-semibold">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-2 py-1  bg-[#E6ECF2] border ${
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
            className={`px-2 py-1   text-xs ${
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
          className={`px-2 py-1  border bg-[#E6ECF2] ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#EDF0F3]"
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default NotificationPage;
