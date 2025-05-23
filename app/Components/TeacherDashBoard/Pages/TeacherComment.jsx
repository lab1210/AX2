"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../Teacherlayout";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

const TeacherComments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentType, setCommentType] = useState("individual");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingComment, setEditingComment] = useState(null);

  // Existing students data
  const students = [
    { id: 1, name: "Toluwani Somade", class: "JSS 1C" },
    { id: 2, name: "Ibidapo Dada", class: "SSS 2A" },
    { id: 3, name: "Awokoya Opeyemi", class: "JSS 1A" },
    { id: 4, name: "Maryam Labake", class: "JSS 3A" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing && editingComment) {
      // Update existing comment
      setComments(comments.map(c => 
        c.id === editingComment.id 
          ? {
              ...c,
              student: commentType === "individual" ? students.find(s => s.id === parseInt(selectedStudent))?.name : "General",
              class: commentType === "individual" ? students.find(s => s.id === parseInt(selectedStudent))?.class : "All Classes",
              comment,
              type: commentType,
            }
          : c
      ));
    } else {
      // Add new comment
      const newComment = {
        id: Date.now(), // Using timestamp as unique ID
        student: commentType === "individual" ? students.find(s => s.id === parseInt(selectedStudent))?.name : "General",
        class: commentType === "individual" ? students.find(s => s.id === parseInt(selectedStudent))?.class : "All Classes",
        comment,
        type: commentType,
        date: new Date().toISOString().split('T')[0]
      };
      setComments([...comments, newComment]);
    }
    
    // Reset form
    setComment("");
    setSelectedStudent("");
    setIsEditing(false);
    setEditingComment(null);
    setIsModalOpen(false);
  };

  const handleEdit = (commentToEdit) => {
    setIsEditing(true);
    setEditingComment(commentToEdit);
    setCommentType(commentToEdit.type);
    setComment(commentToEdit.comment);
    if (commentToEdit.type === "individual") {
      const student = students.find(s => s.name === commentToEdit.student);
      setSelectedStudent(student ? student.id.toString() : "");
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setComments(comments.filter(comment => comment.id !== id));
  };

  return (
    <Layout>
      <div className="bg-[#F7F8FA] min-h-screen">
        <div className="fixed top-0 z-30 flex items-center justify-between bg-white px-6 py-4 w-[85%]">
          <h1 className="text-2xl font-bold text-[#01427A]">Teacher's Comments</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#01427A] text-white px-4 py-2 rounded-lg hover:bg-[#013567]"
          >
            Add New Comment
          </button>
        </div>

        <div className="pt-30 p-6">
          <div className="bg-white rounded-lg shadow p-4">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No comments yet
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#6B90B5] text-white">
                    <th className="border-b border-gray-300 px-4 py-2 text-left">Date</th>
                    <th className="border-b border-gray-300 px-4 py-2 text-left">Student</th>
                    <th className="border-b border-gray-300 px-4 py-2 text-left">Class</th>
                    <th className="border-b border-gray-300 px-4 py-2 text-left">Comment</th>
                    <th className="border-b border-gray-300 px-4 py-2 text-left">Type</th>
                    <th className="border-b border-gray-300 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((comment, index) => (
                    <tr key={comment.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="border-b border-gray-300 px-4 py-3">{comment.date}</td>
                      <td className="border-b border-gray-300 px-4 py-3">{comment.student}</td>
                      <td className="border-b border-gray-300 px-4 py-3">{comment.class}</td>
                      <td className="border-b border-gray-300 px-4 py-3">{comment.comment}</td>
                      <td className="border-b border-gray-300 px-4 py-3">{comment.type}</td>
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
            )}
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
                className="bg-white rounded-lg p-6 w-[600px] shadow-xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[#01427A]">
                    {isEditing ? 'Edit Comment' : 'Add Comment'}
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
                      Comment Type
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="individual"
                          checked={commentType === "individual"}
                          onChange={(e) => setCommentType(e.target.value)}
                          className="mr-2 accent-[#01427A]"
                        />
                        Individual Student
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="general"
                          checked={commentType === "general"}
                          onChange={(e) => setCommentType(e.target.value)}
                          className="mr-2 accent-[#01427A]"
                        />
                        General Comment
                      </label>
                    </div>
                  </div>

                  {commentType === "individual" && (
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
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Comment
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md h-32"
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
      </div>
    </Layout>
  );
};

export default TeacherComments;