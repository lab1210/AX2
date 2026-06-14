"use client";
import React, { useState, useEffect } from "react";
import { FiEdit3, FiTrash2, FiPlus } from "react-icons/fi";
import resultManagementService from "@/Service/ResultService";
import toast from "react-hot-toast";

const CommentTopics = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [editTopicVisible, setEditTopicVisible] = useState(false);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTopicDelete, setSelectedTopicDelete] = useState(null);

  const itemsPerPage = 10;

  const [topicFormData, setTopicFormData] = useState({
    name: "",
  });

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const result = await resultManagementService.getAllCommentTopics();
      if (result.success) {
        setTopics(result.data);
      } else {
        toast.error(result.message || "Failed to load comment topics");
      }
    } catch (error) {
      toast.error("Failed to load comment topics");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTopic = async (e) => {
    e.preventDefault();

    const trimmedName = editTopicVisible
      ? selectedTopic?.name?.trim()
      : topicFormData.name?.trim();

    if (!trimmedName) {
      toast.error("Topic name is required");
      return;
    }

    const topicExists = topics.some(
      (item) =>
        item.name?.toLowerCase() === trimmedName.toLowerCase() &&
        (!editTopicVisible || item.id !== selectedTopic?.id)
    );

    if (topicExists) {
      toast.error("Topic already exists");
      return;
    }

    try {
      setLoading(true);
      if (editTopicVisible && selectedTopic) {
        const result = await resultManagementService.updateCommentTopic(selectedTopic.id, {
          name: trimmedName,
        });

        if (result.success) {
          await fetchTopics();
          toast.success("Topic updated successfully");
          handleCancelEdit();
        } else {
          toast.error(result.message || "Failed to update topic");
        }
      } else {
        const result = await resultManagementService.createCommentTopic({
          name: trimmedName,
        });

        if (result.success) {
          await fetchTopics();
          toast.success("Topic added successfully");
          setTopicFormData({ name: "" });
          setShowTopicForm(false);
        } else {
          toast.error(result.message || "Failed to add topic");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (topic) => {
    setEditTopicVisible(true);
    setSelectedTopic(topic);
    setShowTopicForm(true);
  };

  const handleCancelEdit = () => {
    setEditTopicVisible(false);
    setSelectedTopic(null);
    setShowTopicForm(false);
    setTopicFormData({ name: "" });
  };

  const openDeleteModal = (topic) => {
    setSelectedTopicDelete(topic);
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setSelectedTopicDelete(null);
    setDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedTopicDelete?.id) {
      try {
        setLoading(true);
        const result = await resultManagementService.deleteCommentTopic(selectedTopicDelete.id);

        if (result.success) {
          toast.success("Topic deleted successfully");
          await fetchTopics();
          closeDeleteModal();
        } else {
          toast.error(result.message || "Failed to delete topic");
        }
      } catch (error) {
        toast.error("Failed to delete topic");
      } finally {
        setLoading(false);
      }
    }
  };

  const paginatedData = topics.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(topics.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="p-6">
      {/* Delete Modal */}
      {deleteModalVisible && selectedTopicDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg min-w-75 z-50 p-8">
            <p className="font-bold text-center text-lg">Delete Comment Topic</p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure you want to delete the comment topic
              </p>
              <p className="text-base text-[#858383]">
                <span className="font-bold">{selectedTopicDelete.name}</span>?
              </p>
            </div>
            <div className="font-bold text-md items-center justify-center pt-3 flex gap-5">
              <button
                onClick={handleDelete}
                disabled={loading}
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

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#07508F]">Comment Topics</h2>
        {!showTopicForm && !editTopicVisible && (
          <button
            onClick={() => setShowTopicForm(true)}
            className="flex items-center gap-2 bg-[#07508F] text-white px-4 py-2 rounded-md hover:bg-[#05406e] transition-all"
          >
            <FiPlus size={16} /> Add Topic
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Configure topics that teachers can use for behavioral comments (e.g., Neatness, Punctuality, Attentiveness, etc.)
      </p>

      {/* Add/Edit Topic Form */}
      {(showTopicForm || editTopicVisible) && (
        <form onSubmit={handleSubmitTopic} className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Topic Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Neatness, Punctuality, Attentiveness"
                value={editTopicVisible ? selectedTopic?.name || "" : topicFormData.name}
                onChange={(e) => {
                  const value = e.target.value;
                  editTopicVisible
                    ? setSelectedTopic((prev) => ({ ...prev, name: value }))
                    : setTopicFormData((prev) => ({ ...prev, name: value }));
                }}
                className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#07508F] text-white rounded-md hover:bg-[#05406e] transition-all disabled:opacity-50"
            >
              {editTopicVisible ? "Update Topic" : "Add Topic"}
            </button>
          </div>
        </form>
      )}

      {/* Topics Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-[#EDF0F3]">
              <tr>
                <th className="p-3 text-left">S/N</th>
                <th className="p-3 text-left">Topic Name</th>
                <th className="p-3 text-left">Created By</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && topics.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#07508F] mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading topics...</p>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-10 text-gray-500">
                    No comment topics available. Click "Add Topic" to create one.
                  </td>
                </tr>
              ) : (
                paginatedData.map((topic, index) => (
                  <tr key={topic.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-3 font-medium">{topic.name}</td>
                    <td className="p-3">{topic.createdBy || "System"}</td>
                    <td className="p-3">{new Date(topic.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-center">
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => handleEdit(topic)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Edit topic"
                        >
                          <FiEdit3 size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(topic)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete topic"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-2 p-4 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-md ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded-md ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">About Comment Topics</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Topics are used by class teachers to provide behavioral feedback for students</li>
          <li>• Each topic can be rated from Poor to Excellent</li>
          <li>• Common topics include: Neatness, Punctuality, Attentiveness, Participation, etc.</li>
          <li>• Topics can be created, edited, or deleted as needed</li>
        </ul>
      </div>
    </div>
  );
};

export default CommentTopics;