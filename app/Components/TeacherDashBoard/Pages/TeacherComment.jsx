"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../Teacherlayout";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const TeacherComments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(comments.length / commentsPerPage));
  const paginatedComments = comments.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );

  const students = [
    { id: 1, name: "Toluwani Somade", class: "JSS 1C" },
    { id: 2, name: "Ibidapo Dada", class: "SSS 2A" },
    { id: 3, name: "Awokoya Opeyemi", class: "JSS 1A" },
    { id: 4, name: "Maryam Labake", class: "JSS 3A" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing && editingComment) {
      setComments(
        comments.map((c) =>
          c.id === editingComment.id
            ? {
                ...c,
                student: students.find(
                  (s) => s.id === parseInt(selectedStudent)
                )?.name,
                class: students.find((s) => s.id === parseInt(selectedStudent))
                  ?.class,
                comment,
              }
            : c
        )
      );
    } else {
      const newComment = {
        id: Date.now(),
        student: students.find((s) => s.id === parseInt(selectedStudent))?.name,
        class: students.find((s) => s.id === parseInt(selectedStudent))?.class,
        comment,
        date: new Date().toISOString().split("T")[0],
      };
      setComments([...comments, newComment]);
    }
    setComment("");
    setSelectedStudent("");
    setIsEditing(false);
    setEditingComment(null);
    setIsModalOpen(false);
  };

  const handleEdit = (commentToEdit) => {
    setIsEditing(true);
    setEditingComment(commentToEdit);
    setComment(commentToEdit.comment);
    const student = students.find((s) => s.name === commentToEdit.student);
    setSelectedStudent(student ? student.id.toString() : "");
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <Layout>
      {/* Desktop View */}
      <div className="hidden lg:block bg-[#F7F8FA] min-h-screen overflow-hidden">
        <div className="fixed top-0 z-30 flex items-center justify-between bg-white px-6 py-4 w-[80%] xl:w-[85%]">
          <h1 className="text-2xl font-bold text-[#01427A]">
            Teacher's Comments
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#01427A] text-white px-4 py-2 rounded-lg hover:bg-[#013567]"
          >
            Add New Comment
          </button>
        </div>
        <div className="pt-22 p-2">
          <div
            className="bg-white rounded-lg shadow p-4 xl:fixed w-full xl:w-[64%]"
            style={{ height: "90vh", display: "flex", flexDirection: "column" }}
          >
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No comments yet
              </div>
            ) : (
              <>
                <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                  <div className="overflow-y-auto no-scrollbar xl:fixed w-full xl:w-[62%]" style={{ flex: 1, minHeight: 0 }}>
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0 bg-white z-10">
                        <tr className="bg-[#6B90B5] text-white">
                          <th className="border-b border-gray-300 px-4 py-2 text-left">
                            Date
                          </th>
                          <th className="border-b border-gray-300 px-4 py-2 text-left">
                            Student
                          </th>
                          <th className="border-b border-gray-300 px-4 py-2 text-left">
                            Class
                          </th>
                          <th className="border-b border-gray-300 px-4 py-2 text-left">
                            Comment
                          </th>
                          <th className="border-b border-gray-300 px-4 py-2 text-left">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedComments.map((comment, index) => (
                          <tr
                            key={comment.id}
                            className={
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }
                          >
                            <td className="border-b border-gray-300 px-4 py-3">
                              {comment.date}
                            </td>
                            <td className="border-b border-gray-300 px-4 py-3">
                              {comment.student}
                            </td>
                            <td className="border-b border-gray-300 px-4 py-3">
                              {comment.class}
                            </td>
                            <td className="border-b border-gray-300 px-4 py-3">
                              {comment.comment}
                            </td>
                            <td className="border-b border-gray-300 px-4 py-3">
                              <div className="flex gap-4">
                                <FiEdit3
                                  className="text-[#80ADCB] cursor-pointer"
                                  size={15}
                                  onClick={() => handleEdit(comment)}
                                />
                                <FiTrash2
                                  className="text-[#F94144] cursor-pointer"
                                  size={15}
                                  onClick={() => handleDelete(comment.id)}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-2 py-1 rounded ${
                          currentPage === i + 1
                            ? "bg-[#01427A] text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet View */}
      <div className="block lg:hidden w-full min-h-screen bg-[#F7F8FA] overflow-hidden">
        <div className="sticky top-0 z-20 bg-white border-b flex items-center justify-between px-4 py-3">
          <button
            onClick={() => {
              router.back();
            }}
            className="text-xl flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft />
          </button>
          <span className="font-semibold text-base">Teacher's Comments</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#01427A] rounded-full px-2 py-2 text-white text-sm font-semibold"
          >
            +
          </button>
        </div>
        <div className="p-2 pt-4">
          <div
            className="bg-white rounded-lg shadow p-2"
            style={{ height: "90vh", display: "flex", flexDirection: "column" }}
          >
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No comments yet
              </div>
            ) : (
              <>
                <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                  <div className="overflow-y-auto" style={{ flex: 1, minHeight: 0 }}>
                    <div className="overflow-x-auto">
                      <table className="min-w-[600px] w-full border-collapse text-xs">
                        <thead className="sticky top-0 bg-white z-10">
                          <tr className="bg-[#6B90B5] text-white">
                            <th className="border-b border-gray-300 px-2 py-2 text-left">
                              Date
                            </th>
                            <th className="border-b border-gray-300 px-2 py-2 text-left">
                              Student
                            </th>
                            <th className="border-b border-gray-300 px-2 py-2 text-left">
                              Class
                            </th>
                            <th className="border-b border-gray-300 px-2 py-2 text-left">
                              Comment
                            </th>
                            <th className="border-b border-gray-300 px-2 py-2 text-left">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedComments.map((comment, index) => (
                            <tr
                              key={comment.id}
                              className={
                                index % 2 === 0 ? "bg-gray-50" : "bg-white"
                              }
                            >
                              <td className="border-b border-gray-300 px-2 py-2">
                                {comment.date}
                              </td>
                              <td className="border-b border-gray-300 px-2 py-2">
                                {comment.student}
                              </td>
                              <td className="border-b border-gray-300 px-2 py-2">
                                {comment.class}
                              </td>
                              <td className="border-b border-gray-300 px-2 py-2 max-w-[120px] truncate">
                                {comment.comment}
                              </td>
                              <td className="border-b border-gray-300 px-2 py-2">
                                <div className="flex gap-2">
                                  <FiEdit3
                                    className="text-[#80ADCB] cursor-pointer"
                                    size={14}
                                    onClick={() => handleEdit(comment)}
                                  />
                                  <FiTrash2
                                    className="text-[#F94144] cursor-pointer"
                                    size={14}
                                    onClick={() => handleDelete(comment.id)}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-2 py-1 rounded ${
                          currentPage === i + 1
                            ? "bg-[#01427A] text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
                  </div>
                </div>
                
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg p-4 w-[95vw] max-w-md shadow-xl mx-2"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[#01427A]">
                  {isEditing ? "Edit Comment" : "Add Comment"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Student
                  </label>
                  <select
                    value={selectedStudent || ""}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} - {student.class}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md h-24"
                    placeholder="Enter your comment here..."
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#01427A] text-white rounded-md hover:bg-[#013567]"
                  >
                    Submit Comment
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default TeacherComments;
