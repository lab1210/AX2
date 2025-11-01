"use client";
import React, { useEffect, useState } from "react";
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
  const role = ["Teacher", "Student", "Everyone"];

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

  // Content editor modal state
  const [showContentModal, setShowContentModal] = useState(false);
  const [tempContent, setTempContent] = useState("");

  const notificationTypes = [
    { label: "Information", value: "Information" },
    { label: "Reminder", value: "Reminder" },
    { label: "Alert", value: "Alert" },
  ];

  const fetchData = async () => {
    try {
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

  const openDeleteModal = (item) => {
    setselectedDelete(item);
    setDeleteModalVisible(true);
  };

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

  const handleInputChange = (field, value) => {
    setformData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        recipient_group: formData.recipient_group,
        notification_type: formData.notification_type,
      };

      let response;
      if (editVisible && selected) {
        response = await UpdateNotification(selected.notification_id, payload);
      } else {
        response = await createNotifications(payload);
      }

      if (response?.error) {
        toast.error("Failed to create or update notification");
        return;
      }

      await fetchData();
      toast.success(
        editVisible
          ? "Notification updated successfully"
          : "Notification created successfully"
      );

      setEditVisible(false);
      setselected(null);
      setformData({
        title: "",
        content: "",
        recipient_group: "",
        notification_type: "",
      });
    } catch (error) {
      toast.error("An error occurred while processing your request");
    }
  };

  const handleDelete = async () => {
    if (!selectedDelete) return;
    try {
      const response = await DeleteNotification(selectedDelete.notification_id);
      if (response?.error) {
        toast.error(response.error);
        return;
      }
      await fetchData();
      toast.success("Notification deleted successfully");
      closeDeleteModal();
    } catch (error) {
      toast.error("An error occurred while deleting the notification");
    }
  };

  // Pagination
  const itemsPerPage = 10;

  // Filtering
  const filteredNotifications =
    searchText.trim() === ""
      ? notifications
      : notifications.filter((d) => {
          const lowerSearch = searchText.toLowerCase();
          if (filterType === "title") {
            return (d.title || "").toLowerCase().includes(lowerSearch);
          }
          if (filterType === "type") {
            return (d.notification_type || "")
              .toLowerCase()
              .includes(lowerSearch);
          }
          if (filterType === "user") {
            return (d.recipient_group || "")
              .toLowerCase()
              .includes(lowerSearch);
          }
          return false;
        });

  const paginatedData = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Content modal helpers
  const openContentModal = () => {
    setTempContent(formData.content || "");
    setShowContentModal(true);
  };
  const closeContentModal = () => {
    setShowContentModal(false);
  };
  const saveContentFromModal = () => {
    if (editVisible && selected) {
      setselected((prev) => ({ ...prev, content: tempContent }));
    }
    setformData((prev) => ({ ...prev, content: tempContent }));
    setShowContentModal(false);
  };

  return (
    <div className="pr-1 w-full h-full overflow-y-auto no-scrollbar">
      {/* Delete Modal */}
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
              <button
                onClick={handleDelete}
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

      {/* Content Editor Modal */}
      {showContentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeContentModal}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-[min(900px,92vw)] max-h-[88vh] p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-[#01427A]">
                Notification Content
              </h3>
              <button
                onClick={closeContentModal}
                className="px-3 py-1 rounded bg-[#EBEBEB] text-[#333333] hover:opacity-90"
              >
                Close
              </button>
            </div>

            <textarea
              value={tempContent}
              onChange={(e) => setTempContent(e.target.value)}
              className="w-full flex-1 border border-[#B6B6B6] rounded-md p-3 text-sm leading-6 focus:outline-[#0071E3] resize-none"
              placeholder="Type your full notification content here..."
              style={{ minHeight: "55vh", whiteSpace: "pre-wrap" }}
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={closeContentModal}
                type="button"
                className="px-4 py-2 rounded bg-[#EBEBEB] text-[#333333] font-semibold hover:opacity-90"
              >
                Cancel
              </button>
              <button
                onClick={saveContentFromModal}
                type="button"
                className="px-4 py-2 rounded bg-[#07508F] text-white font-bold hover:opacity-90"
              >
                Save Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
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
            {/* Title */}
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Title:</label>
              <input
                type="text"
                name="title"
                placeholder="Enter Title"
                value={formData.title}
                onChange={(e) => {
                  const value = e.target.value;
                  if (editVisible && selected) {
                    setselected((prev) => ({ ...prev, title: value }));
                  }
                  setformData((prev) => ({ ...prev, title: value }));
                }}
                className={`${
                  formData.title !== "" ||
                  (editVisible && selected?.title !== "")
                    ? "border-[#0071E3] font-bold border-2"
                    : "border-[#B6B6B6] border-[1.5px]"
                } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm `}
                required
              />
            </div>

            {/* Content (click to open modal) */}
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Content:</label>
              <input
                type="text"
                name="content"
                placeholder="Enter Content"
                value={
                  formData.content
                    ? formData.content.length > 65
                      ? `${formData.content.slice(0, 65)}…`
                      : formData.content
                    : ""
                }
                readOnly
                onClick={openContentModal}
                onFocus={openContentModal}
                className={`cursor-text ${
                  formData.content !== "" ||
                  (editVisible && selected?.content !== "")
                    ? "border-[#0071E3] font-bold border-2"
                    : "border-[#B6B6B6] border-[1.5px]"
                } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm `}
                required
              />
              {/* <p className="text-[11px] text-[#8b8b8b]">
                Click the field to open a large editor.
              </p> */}
            </div>

            {/* Recipient */}
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Recipient:
              </label>
              <Dropdown
                label={formData.recipient_group || "Select Recipient"}
                items={role.map((roleItem) => ({
                  label: roleItem,
                  onClick: () => handleInputChange("recipient_group", roleItem),
                }))}
              />
            </div>

            {/* Type */}
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

      {/* Toolbar */}
      <div className="w-full grid grid-cols-[auto_1fr] gap-10 items-center mb-3 pl-6 pr-6">
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
            className="placeholder:text-[#AEAEAE] xl:placeholder:text-sm placeholder:text-xs rounded py-1 pl-10 pr-12 border-[1.5px] w-full"
            placeholder={`Type here to filter by ${filterType}`}
          />
        </div>
      </div>

      {/* List */}
      <div className="pl-6 pr-6 flex flex-col gap-5 mt-8">
        {loading ? (
          <div className="flex justify-center items-center mt-10 h-full">
            <p className="text-center text-sm text-[#858383]">Loading…</p>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="flex justify-center items-center mt-10 h-full">
            <p className="text-center text-sm text-[#858383]">
              No notifications found
            </p>
          </div>
        ) : (
          paginatedData.map((item) => (
            <div
              key={item.notification_id}
              className="flex flex-col bg-white rounded-xl border-2 border-[#0B0A0A]/10 p-4"
            >
              <div className="flex justify-between items-center mb-5">
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-[#333333]">{item.title}</p>
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
          ))
        )}
      </div>

      {/* Pagination */}
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
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-2 py-1 border bg-[#E6ECF2] ${
            currentPage === totalPages || totalPages === 0
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
