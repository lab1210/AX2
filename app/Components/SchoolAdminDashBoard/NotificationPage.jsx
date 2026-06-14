"use client";
import React, { useEffect, useState } from "react";
import Dropdown from "./DropDown2";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import { IoFilter, IoSearch } from "react-icons/io5";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import notificationService from "@/Service/NotificationService";
import toast from "react-hot-toast";
import formatdate from "../SchoolAdminDashBoard/Formatdate";

const NotificationPage = () => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editVisible, setEditVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filterType, setFilterType] = useState("title");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [sentNotifications, setSentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSent, setShowSent] = useState(false);
  const [stats, setStats] = useState(null);
  const [accessibleClasses, setAccessibleClasses] = useState([]);
  const [accessibleSubjects, setAccessibleSubjects] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    recipientGroup: "",
    type: "",
    targetId: "",
  });

  const [showContentModal, setShowContentModal] = useState(false);
  const [tempContent, setTempContent] = useState("");

  const recipientGroups = [
    { label: "All Users", value: "All" },
    { label: "All Students", value: "Students" },
    { label: "All Teachers", value: "Teachers" },
    { label: "All Class Teachers", value: "ClassTeachers" },
    { label: "All Subject Teachers", value: "SubjectTeachers" },
    { label: "Specific Class", value: "SpecificClass" },
    { label: "Specific Subject", value: "SpecificSubject" },
  ];

  const notificationTypes = [
    { label: "Information", value: "Information" },
    { label: "Reminder", value: "Reminder" },
    { label: "Alert", value: "Alert" },
  ];

  useEffect(() => {
    fetchAllData();
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const userDetails = notificationService.getUserDetails?.();
      const roles = userDetails?.roles || [];
      setIsAdmin(roles.includes("SchoolAdmin"));
    } catch (error) {
      console.error("Failed to check user role:", error);
    }
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchNotifications(),
      fetchStats(),
      fetchAccessibleClasses(),
      fetchAccessibleSubjects(),
    ]);
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const result = await notificationService.getMyNotifications();
      if (result.success) {
        setNotifications(result.data);
      } else {
        toast.error(result.message);
      }
      
      // Fetch sent notifications if admin or teacher
      const sentResult = await notificationService.getSentNotifications();
      if (sentResult.success) {
        setSentNotifications(sentResult.data);
      }
    } catch (error) {
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await notificationService.getNotificationStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchAccessibleClasses = async () => {
    try {
      const result = await notificationService.getMyAccessibleClasses();
      if (result.success) {
        setAccessibleClasses(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

  const fetchAccessibleSubjects = async () => {
    try {
      const result = await notificationService.getMySubjects();
      if (result.success) {
        setAccessibleSubjects(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    }
  };

  const openDeleteModal = (item) => {
    setSelectedDelete(item);
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setSelectedDelete(null);
    setDeleteModalVisible(false);
  };

  const handleEdit = (notification) => {
    setEditVisible(true);
    setSelected(notification);
    setFormData({
      title: notification.title,
      content: notification.content,
      recipientGroup: notification.recipientGroup,
      type: notification.type,
      targetId: notification.targetId || "",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.recipientGroup || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate target ID for specific groups
    if ((formData.recipientGroup === "SpecificClass" || formData.recipientGroup === "SpecificSubject") && !formData.targetId) {
      toast.error("Please select a target class or subject");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        recipientGroup: formData.recipientGroup,
        type: formData.type,
        targetId: formData.targetId || null,
      };

      let result;
      if (editVisible && selected) {
        result = await notificationService.updateNotification(selected.id, payload);
      } else {
        result = await notificationService.sendNotification(payload);
      }

      if (result.success) {
        await fetchAllData();
        toast.success(
          editVisible ? "Notification updated successfully" : "Notification sent successfully"
        );
        resetForm();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while processing your request");
    }
  };

  const handleDelete = async () => {
    if (!selectedDelete) return;
    try {
      const result = await notificationService.deleteNotification(selectedDelete.id);
      if (result.success) {
        await fetchAllData();
        toast.success("Notification deleted successfully");
        closeDeleteModal();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the notification");
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const result = await notificationService.markAsRead(notificationId);
      if (result.success) {
        await fetchNotifications();
        await fetchStats();
        toast.success("Marked as read");
      }
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const result = await notificationService.markAllAsRead();
      if (result.success) {
        await fetchNotifications();
        await fetchStats();
        toast.success(result.message);
      }
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const resetForm = () => {
    setEditVisible(false);
    setSelected(null);
    setFormData({
      title: "",
      content: "",
      recipientGroup: "",
      type: "",
      targetId: "",
    });
  };

  const openContentModal = () => {
    setTempContent(formData.content || "");
    setShowContentModal(true);
  };

  const closeContentModal = () => {
    setShowContentModal(false);
  };

  const saveContentFromModal = () => {
    setFormData((prev) => ({ ...prev, content: tempContent }));
    setShowContentModal(false);
  };

  // Filtering
  const displayNotifications = showSent ? sentNotifications : notifications;
  
  const filteredNotifications =
    searchText.trim() === ""
      ? displayNotifications
      : displayNotifications.filter((d) => {
          const lowerSearch = searchText.toLowerCase();
          if (filterType === "title") {
            return (d.title || "").toLowerCase().includes(lowerSearch);
          }
          if (filterType === "type") {
            return (d.typeName || d.type || "").toLowerCase().includes(lowerSearch);
          }
          if (filterType === "user") {
            return (d.recipientGroupName || d.recipientGroup || "").toLowerCase().includes(lowerSearch);
          }
          return false;
        });

  const paginatedData = filteredNotifications.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );
  const totalPages = Math.ceil(filteredNotifications.length / 10);
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

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
            <div className="font-bold text-md items-center justify-center pt-3 flex gap-5">
              <button
                onClick={handleDelete}
                className="cursor-pointer text-white bg-[#F94144] rounded-md pl-4 pr-4 py-2"
              >
                Yes, Delete
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

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-5 gap-3 mb-4 px-6">
          <div className="bg-white rounded-lg shadow-sm border p-3 text-center">
            <p className="text-xl font-bold text-[#07508F]">{stats.totalReceived}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-3 text-center">
            <p className="text-xl font-bold text-red-500">{stats.unreadCount}</p>
            <p className="text-xs text-gray-500">Unread</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-3 text-center">
            <p className="text-xl font-bold text-green-500">{stats.readCount}</p>
            <p className="text-xs text-gray-500">Read</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-3 text-center">
            <p className="text-xl font-bold text-blue-500">{stats.informationCount || 0}</p>
            <p className="text-xs text-gray-500">Info</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-3 text-center">
            <p className="text-xl font-bold text-orange-500">{stats.alertCount || 0}</p>
            <p className="text-xs text-gray-500">Alerts</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-3 pb-5 pt-3 bg-white">
        <div className="flex pt-3 pl-6 pr-6 justify-between mb-5">
          <p className="font-bold text-[#07508F]">
            {editVisible ? "Edit Notification" : "Create Notification"}
          </p>
          <div className="flex gap-3">
            {editVisible && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white font-bold text-sm px-5 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-[#07508F] text-white font-bold text-sm px-5 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
            >
              {editVisible ? "Save" : "Send"}
            </button>
          </div>
        </div>

        <div className="pl-6 pr-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Title:</label>
              <input
                type="text"
                placeholder="Enter Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="focus:outline-[#0071E3] placeholder:text-sm border-[1.5px] p-1.5 text-sm rounded-sm border-[#B6B6B6]"
                required
              />
            </div>

            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Content:</label>
              <input
                type="text"
                placeholder="Click to enter content"
                value={formData.content ? (formData.content.length > 65 ? `${formData.content.slice(0, 65)}…` : formData.content) : ""}
                readOnly
                onClick={openContentModal}
                className="cursor-pointer focus:outline-[#0071E3] placeholder:text-sm border-[1.5px] p-1.5 text-sm rounded-sm border-[#B6B6B6] bg-gray-50"
                required
              />
            </div>

            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Recipient:</label>
              <Dropdown
                label={formData.recipientGroup ? recipientGroups.find(r => r.value === formData.recipientGroup)?.label : "Select Recipient"}
                items={recipientGroups.map((group) => ({
                  label: group.label,
                  onClick: () => {
                    handleInputChange("recipientGroup", group.value);
                    handleInputChange("targetId", "");
                  },
                }))}
              />
            </div>

            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Type:</label>
              <Dropdown
                label={formData.type || "Select type"}
                items={notificationTypes.map((item) => ({
                  label: item.label,
                  onClick: () => handleInputChange("type", item.value),
                }))}
              />
            </div>

            {(formData.recipientGroup === "SpecificClass" || formData.recipientGroup === "SpecificSubject") && (
              <div className="flex flex-col gap-2 mb-2">
                <label className="text-[0.88rem] text-[#5E6A72]">
                  {formData.recipientGroup === "SpecificClass" ? "Select Class" : "Select Subject"}:
                </label>
                <Dropdown
                  label={
                    formData.targetId
                      ? formData.recipientGroup === "SpecificClass"
                        ? accessibleClasses.find(c => c.id === formData.targetId)?.className
                        : accessibleSubjects.find(s => s.id === formData.targetId)?.name
                      : `Select ${formData.recipientGroup === "SpecificClass" ? "Class" : "Subject"}`
                  }
                  items={(formData.recipientGroup === "SpecificClass" ? accessibleClasses : accessibleSubjects).map((item) => ({
                    label: formData.recipientGroup === "SpecificClass" ? item.className : item.name,
                    onClick: () => handleInputChange("targetId", item.id),
                  }))}
                />
              </div>
            )}
          </div>
        </div>
      </form>

      <hr className="text-[#A7B9CC]/50 mt-10" />

      {/* Toolbar */}
      <div className="w-full flex flex-wrap justify-between items-center gap-4 mb-3 pl-6 pr-6 mt-4">
        <div className="flex gap-3">
          <button
            onClick={() => setShowSent(false)}
            className={`px-4 py-1 rounded-md text-sm transition-all ${
              !showSent ? "bg-[#07508F] text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Received
          </button>
          <button
            onClick={() => setShowSent(true)}
            className={`px-4 py-1 rounded-md text-sm transition-all ${
              showSent ? "bg-[#07508F] text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Sent
          </button>
          {!showSent && stats?.unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative inline-block">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center text-[#01427A] hover:text-white hover:bg-[#01427A] cursor-pointer text-sm gap-2 border-[1.5px] rounded border-[#01427A] py-1 px-3"
            >
              <span className="hidden xl:block">Filter by</span>
              <IoFilter size={18} />
            </button>
            {showFilterDropdown && (
              <div className="absolute left-0 mt-2 bg-white border rounded shadow-lg z-10 min-w-[150px]">
                {[
                  { label: "Title", value: "title" },
                  { label: "Type", value: "type" },
                  { label: "Recipient", value: "user" },
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

          <div className="relative w-64">
            <IoSearch
              className="text-[#AEAEAE] absolute left-3 top-1/2 transform -translate-y-1/2"
              size={18}
            />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
              className="placeholder:text-[#AEAEAE] text-sm rounded py-1 pl-10 pr-4 border-[1.5px] w-full"
              placeholder={`Filter by ${filterType}`}
            />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="pl-6 pr-6 flex flex-col gap-5 mt-4">
        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#07508F]"></div>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="flex justify-center items-center mt-10">
            <p className="text-center text-sm text-[#858383]">
              No {showSent ? "sent" : ""} notifications found
            </p>
          </div>
        ) : (
          paginatedData.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col bg-white rounded-xl border-2 p-4 ${
                !item.isRead && !showSent ? "border-blue-300 bg-blue-50/30" : "border-[#0B0A0A]/10"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-semibold text-[#333333]">{item.title}</p>
                    {!item.isRead && !showSent && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">New</span>
                    )}
                  </div>
                  <p className="text-sm text-[#555555]">{item.content}</p>
                  {showSent && item.recipientCount !== undefined && (
                    <p className="text-xs text-gray-400 mt-2">
                      Sent to {item.recipientCount} recipients
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-400 ml-4 whitespace-nowrap">
                  {formatdate(item.sentAt)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 px-3 rounded-sm ${
                    item.typeName === "Information" ? "bg-blue-100 text-blue-700" :
                    item.typeName === "Alert" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    <p className="text-xs font-medium">{item.typeName || item.type}</p>
                  </div>
                  <div className="bg-purple-100 p-1.5 px-3 rounded-sm">
                    <p className="text-xs font-medium text-purple-700">
                      {item.recipientGroupName || item.recipientGroup}
                    </p>
                  </div>
                  {showSent && item.targetName && (
                    <div className="bg-green-100 p-1.5 px-3 rounded-sm">
                      <p className="text-xs font-medium text-green-700">{item.targetName}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {!showSent && !item.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(item.id)}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                  {isAdmin && (
                    <>
                      <FiEdit3
                        onClick={() => handleEdit(item)}
                        className="text-[#80ADCB] cursor-pointer hover:text-[#07508F]"
                        size={15}
                      />
                      <FiTrash2
                        onClick={() => openDeleteModal(item)}
                        className="text-[#F94144] cursor-pointer hover:text-red-600"
                        size={15}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end pr-6 items-center gap-2 mt-5 pb-4 text-sm text-[#01427A] font-semibold">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-2 py-1 bg-[#E6ECF2] border rounded ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#EDF0F3] cursor-pointer"
            }`}
          >
            &lt;
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-2 py-1 text-xs rounded ${
                  currentPage === pageNum
                    ? "bg-[#07508F] text-white"
                    : "hover:bg-[#EDF0F3] bg-[#FAFAFA] cursor-pointer"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 border bg-[#E6ECF2] rounded ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#EDF0F3] cursor-pointer"
            }`}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;