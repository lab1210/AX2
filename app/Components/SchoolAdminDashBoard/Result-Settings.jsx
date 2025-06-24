"use client";
import React, { useEffect, useState } from "react";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

import {
  createcategory,
  createResult,
  deleteCategory,
  getCategory,
  getResults,
  UpdateResultVisibility,
} from "../../Service/ResultService";
const ResultSettings = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [AssessmentCategory, setAssessmentCategory] = useState([]);
  const [result, setResult] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editCategoryVisible, setEditCategoryVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCategoryDelete, setSelectedCategoryDelete] = useState(null);

  const [ResultformData, setResultFormData] = useState({
    total_ca_score: "",
    total_exam_score: "",
    passMark: "",
  });

  const [CategoryformData, setCategoryFormData] = useState({
    assessment_name: "",
    number_of_times: "",
    max_score_per_one: "",
  });

  //GET LIST
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await getCategory();
      if (data) setAssessmentCategory(data);
      else setMessage(error || "Failed to load Categories");
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchResult = async () => {
      const { data, error } = await getResults();
      if (data && data.length > 0) {
        setResult(data[0]);
        setResultFormData({
          total_ca_score: data[0].total_ca_score.toString(),
          total_exam_score: data[0].total_exam_score.toString(),
          passMark: "",
        });
      } else if (error) {
        setMessage("Error loading result configuration.");
        setMessageType("error");
      }
    };
    fetchResult();
  }, []);

  //PAGINATION
  const paginatedData = Array.isArray(AssessmentCategory)
    ? AssessmentCategory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const totalPages = Math.ceil(AssessmentCategory.length / itemsPerPage);
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  //SUBMIT FOR CATEGORY

  const handleSubmitForCategory = async (e) => {
    e.preventDefault();

    const trimmedName = editCategoryVisible
      ? selectedCategory?.assessment_name?.trim()
      : CategoryformData.assessment_name?.trim();

    if (!trimmedName) {
      setMessage("Category name is required.");
      setMessageType("error");
      return;
    }

    const existingSession = AssessmentCategory.find(
      (item) =>
        item.assessment_name?.toLowerCase() === trimmedName.toLowerCase()
    );

    if (!editCategoryVisible && existingSession) {
      setMessage("Category name already exists.");
      setMessageType("error");
      return;
    }

    if (editCategoryVisible && selectedCategory) {
      try {
        const updatedData = {
          ...selectedCategory,
          category: selectedCategory.assessment_name,
          numberOfTimes: selectedCategory.number_of_times,
          maxScore: selectedCategory.maxScore,
        };

        const { data, error } = await updateCategory(
          selectedCategory.assessment_category_id,
          updatedData
        );

        if (error) {
          setMessage(error || "Failed to update Category.");
          setMessageType("error");
          return;
        }

        const updatedList = AssessmentCategory.map((item) =>
          item.assessment_category_id ===
          selectedCategory.assessment_category_id
            ? data
            : item
        );
        setAssessmentCategory(updatedList);
        setMessage("Category updated successfully.");
        setMessageType("success");
        setEditCategoryVisible(false);
        setSelectedCategory(null);
      } catch (err) {
        setMessage("An error occurred while updating.");
        setMessageType("error");
      }
    } else {
      try {
        const { data, error } = await createcategory(CategoryformData);

        if (error) {
          setMessage(error || "Failed to add category.");
          setMessageType("error");
        } else {
          setAssessmentCategory((prev) => [...prev, data]);
          setMessage("Category added successfully.");
          setMessageType("success");
        }
      } catch (err) {
        setMessage("An error occurred while adding.");
        setMessageType("error");
      }
    }

    setCategoryFormData({
      assessment_name: "",
      number_of_times: "",
      max_score_per_one: "",
    });

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  // SUBMIT FOR RESULT
  const handleSubmitForResult = async (e) => {
    e.preventDefault();

    const ca = parseFloat(ResultformData.total_ca_score) || 0;
    const exam = parseFloat(ResultformData.total_exam_score) || 0;
    const pass = parseFloat(ResultformData.passMark) || 0;
    console.log("CA:", ca, "EXAM:", exam, "TOTAL:", ca + exam);

    if (
      ResultformData.total_ca_score === "" ||
      ResultformData.total_exam_score === "" ||
      ResultformData.passMark === ""
    ) {
      setMessage("All fields are required.");
      setMessageType("error");
      return;
    }

    const total = ca + exam;

    if (total > 100) {
      setMessage("Total score cannot exceed 100.");
      setMessageType("error");
      return;
    }

    if (total < 100) {
      setMessage("Total score cannot be less than 100.");
      setMessageType("error");
      return;
    }

    try {
      const payload = {
        total_ca_score: ca,
        total_exam_score: exam,
        passMark: pass,
      };

      let response;
      if (result?.id) {
        // Update if exists
        response = await UpdateResultVisibility(result.id, payload);
      } else {
        // Create if not exists
        response = await createResult(payload);
      }

      if (response.error) {
        setMessage(response.error || "Failed to save result configuration.");
        setMessageType("error");
      } else {
        setResult(response.data);
        setMessage("Result configuration saved successfully.");
        setMessageType("success");
      }
    } catch (err) {
      setMessage("An error occurred while saving.");
      setMessageType("error");
    }

    setResultFormData({
      total_ca_score: "",
      total_exam_score: "",
      passMark: "",
    });

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleEdit = (category) => {
    setEditCategoryVisible(true);
    setSelectedCategory({ ...category });
  };

  const openDeleteModal = (school) => {
    setSelectedCategoryDelete(school);
    setDeleteModalVisible(true);
  };

  // Function to close delete modal
  const closeDeleteModal = () => {
    setSelectedCategoryDelete(null);
    setDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedCategoryDelete?.assessment_category_id) {
      try {
        const response = await deleteCategory(
          selectedCategoryDelete.assessment_category_id
        );
        if (response?.status === 204) {
          setMessage("Category deleted successfully.");
          setMessageType("success");
          closeDeleteModal();
        } else {
          setMessage("Failed to delete Category.");
          setMessageType("error");
          closeDeleteModal();
        }
      } catch (error) {
        setMessageType("error");
        setMessage("Failed to delete Category.");
      }
    }
  };

  return (
    <div className="pr-1 h-full overflow-y-auto">
      {message && (
        <div
          className={`mx-6 mb-3 text-sm px-4 py-2 rounded-sm font-semibold ${
            messageType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
      {deleteModalVisible && selectedCategoryDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg min-w-75 z-50 p-8">
            <p className="font-bold text-center text-lg">Delete Category</p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete the Assessment Category
              </p>
              <p className="text-base text-[#858383]">
                <span className="font-bold">
                  {selectedCategoryDelete.assessment_name}
                </span>
                ?
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

      <form
        onSubmit={handleSubmitForResult}
        className="mb-3 pb-5 pt-3  bg-white"
      >
        <div className="flex pt-3 pl-6 pr-6 justify-between mb-2 ">
          <p className="font-bold text-[#07508F]">Result Configuration</p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm px-3 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            Save Scores
          </button>
        </div>
        <div className="pl-6 pr-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Set C.A Score:
              </label>
              <input
                type="number"
                name="total_ca_score"
                placeholder="Enter C.A Score"
                value={ResultformData.total_ca_score}
                onChange={(e) => {
                  const value = e.target.value;
                  setResultFormData((prev) => ({
                    ...prev,
                    total_ca_score: value,
                  }));
                }}
                className={`${
                  ResultformData.total_ca_score !== ""
                    ? "border-[#0071E3]"
                    : "border-[#B6B6B6]"
                } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-2 p-1.5 text-sm rounded-sm `}
                required
              />
            </div>

            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Set Exam Score:
              </label>
              <input
                type="number"
                name="total_exam_score"
                placeholder="Enter  Exam Score"
                value={ResultformData.total_exam_score}
                onChange={(e) => {
                  const value = e.target.value;
                  setResultFormData((prev) => ({
                    ...prev,
                    total_exam_score: value,
                  }));
                }}
                className={`${
                  ResultformData.total_exam_score !== ""
                    ? "border-[#0071E3]"
                    : "border-[#B6B6B6]"
                } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-2 p-1.5 text-sm rounded-sm `}
                required
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Set Pass Mark:
              </label>
              <input
                type="number"
                name="passMark"
                placeholder="Enter Pass Mark"
                value={ResultformData.passMark}
                onChange={(e) => {
                  const value = e.target.value;
                  setResultFormData((prev) => ({
                    ...prev,
                    passMark: value,
                  }));
                }}
                className={`${
                  ResultformData.passMark !== ""
                    ? "border-[#0071E3]"
                    : "border-[#B6B6B6]"
                } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-2 p-1.5 text-sm rounded-sm `}
                required
              />
            </div>
          </div>
        </div>
      </form>

      <div className="pb-5 pt-3  bg-white">
        <form onSubmit={handleSubmitForCategory} className="mb-3 ">
          <div className="flex pt-3 pl-6 pr-6 justify-between mb-2 ">
            <p className="font-bold text-[#07508F]">Assessment Category</p>
            <button
              type="submit"
              className="bg-[#07508F] text-white font-bold text-sm px-3 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
            >
              {editCategoryVisible ? "Save Category" : "Set Category"}
            </button>
          </div>
          <div className="pl-6 pr-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-2 mb-2">
                <label className="text-[0.88rem] text-[#5E6A72]">
                  Category:
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Category"
                  value={
                    editCategoryVisible
                      ? selectedCategory?.assessment_name
                      : CategoryformData.assessment_name
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    editCategoryVisible
                      ? setSelectedCategory((prev) => ({
                          ...prev,
                          assessment_name: value,
                        }))
                      : setCategoryFormData((prev) => ({
                          ...prev,
                          assessment_name: value,
                        }));
                  }}
                  className={`${
                    CategoryformData.assessment_name !== "" ||
                    (editCategoryVisible &&
                      selectedCategory?.assessment_name !== "")
                      ? "border-[#0071E3]"
                      : "border-[#B6B6B6]"
                  } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-2 p-1.5 text-sm rounded-sm `}
                  required
                />
              </div>

              <div className="flex flex-col gap-2 mb-2">
                <label className="text-[0.88rem] text-[#5E6A72]">
                  No of Times:
                </label>
                <input
                  type="number"
                  name="name"
                  placeholder="Enter No of Times"
                  value={
                    editCategoryVisible
                      ? selectedCategory?.number_of_times
                      : CategoryformData.number_of_times
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    editCategoryVisible
                      ? setSelectedCategory((prev) => ({
                          ...prev,
                          number_of_times: value,
                        }))
                      : setCategoryFormData((prev) => ({
                          ...prev,
                          number_of_times: value,
                        }));
                  }}
                  className={`${
                    CategoryformData.number_of_times !== "" ||
                    (editCategoryVisible &&
                      selectedCategory?.number_of_times !== "")
                      ? "border-[#0071E3]"
                      : "border-[#B6B6B6]"
                  } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-2 p-1.5 text-sm rounded-sm `}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <label className="text-[0.88rem] text-[#5E6A72]">
                  Max Score per One:
                </label>
                <input
                  type="number"
                  name="name"
                  placeholder="Enter Max Score"
                  value={
                    editCategoryVisible
                      ? selectedCategory?.max_score_per_one
                      : CategoryformData.max_score_per_one
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    editCategoryVisible
                      ? setSelectedCategory((prev) => ({
                          ...prev,
                          max_score_per_one: value,
                        }))
                      : setCategoryFormData((prev) => ({
                          ...prev,
                          max_score_per_one: value,
                        }));
                  }}
                  className={`${
                    CategoryformData.max_score_per_one !== "" ||
                    (editCategoryVisible &&
                      selectedCategory?.max_score_per_one !== "")
                      ? "border-[#0071E3]"
                      : "border-[#B6B6B6]"
                  } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-2 p-1.5 text-sm rounded-sm `}
                  required
                />
              </div>
            </div>
          </div>
        </form>
        <hr className="mt-10" />

        <div className="flex-shrink-0 mb-2">
          <p className="font-semibold flex justify-center p-3 text-[#333333]">
            Existing Categories
          </p>
        </div>
        <div className="px-0">
          <div className="overflow-y-auto max-h-[200px] no-scrollbar">
            <table className="min-w-full table-auto">
              {paginatedData.length > 0 && (
                <thead className="bg-[#EDF0F3] text-center sticky top-0 z-10 lg:text-base text-xs">
                  <tr>
                    <th className="p-2  bg-[#EDF0F3]">Category</th>
                    <th className="p-2  bg-[#EDF0F3]">No of Times</th>
                    <th className="p-2 bg-[#EDF0F3]">Max Score</th>
                    <th className="p-2 bg-[#EDF0F3]">Actions</th>
                  </tr>
                </thead>
              )}
              <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-5  text-center border text-gray-500"
                    >
                      No Data Available
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => (
                    <tr className="border-b-[#D0D0D0]  border-b" key={index}>
                      <td className="p-2 text-center ">
                        {item.assessment_name}
                      </td>
                      <td className="p-2 text-center ">
                        {item.number_of_times}
                      </td>
                      <td className="p-2 text-center">
                        {item.max_score_per_one}
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex gap-4 items-center justify-center">
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
      </div>
    </div>
  );
};

export default ResultSettings;
