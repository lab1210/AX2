"use client";
import React, { useEffect, useState } from "react";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import resultManagementService from "@/Service/ResultService";
import toast from "react-hot-toast";

const ResultSettings = () => {
  const [assessmentCategories, setAssessmentCategories] = useState([]);
  const [configuration, setConfiguration] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editCategoryVisible, setEditCategoryVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCategoryDelete, setSelectedCategoryDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const [resultFormData, setResultFormData] = useState({
    totalCAScore: "",
    totalExamScore: "",
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    numberOfInstances: "",
    maxScore: "",
    description: "",
    isExam: false,
  });

  // Fetch Assessment Categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const result = await resultManagementService.getAllAssessmentCategories();
      if (result.success) {
        setAssessmentCategories(result.data);
      } else {
        toast.error(result.message || "Failed to load categories");
      }
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Result Configuration
  const fetchConfiguration = async () => {
    try {
      const result = await resultManagementService.getConfiguration();
      if (result.success && result.data && result.data.totalCAScore > 0) {
        setConfiguration(result.data);
        setResultFormData({
          totalCAScore: result.data.totalCAScore?.toString() || "",
          totalExamScore: result.data.totalExamScore?.toString() || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch configuration:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchConfiguration();
  }, []);

  // Pagination
  const paginatedData = Array.isArray(assessmentCategories)
    ? assessmentCategories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const totalPages = Math.ceil(assessmentCategories.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Submit for Result Configuration
  const handleSubmitForResult = async (e) => {
    e.preventDefault();

    const ca = parseFloat(resultFormData.totalCAScore) || 0;
    const exam = parseFloat(resultFormData.totalExamScore) || 0;

    if (
      resultFormData.totalCAScore === "" ||
      resultFormData.totalExamScore === ""
    ) {
      toast.error("Both CA and Exam scores are required.");
      return;
    }

    const total = ca + exam;

    if (total > 100) {
      toast.error("Total score cannot exceed 100.");
      return;
    }

    if (total < 100) {
      toast.error("Total score cannot be less than 100.");
      return;
    }

    try {
      setLoading(true);
      const result = await resultManagementService.createOrUpdateConfiguration({
        totalCAScore: ca,
        totalExamScore: exam,
      });

      if (result.success) {
        setConfiguration(result.data);
        toast.success("Result configuration saved successfully.");
      } else {
        toast.error(result.message || "Failed to save result configuration.");
      }
    } catch (err) {
      toast.error("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  // Submit for Category
  const handleSubmitForCategory = async (e) => {
    e.preventDefault();

    const trimmedName = editCategoryVisible
      ? selectedCategory?.name?.trim()
      : categoryFormData.name?.trim();

    if (!trimmedName) {
      toast.error("Category name is required.");
      return;
    }

    const existingCategory = assessmentCategories.find(
      (item) => item.name?.toLowerCase() === trimmedName.toLowerCase()
    );

    if (!editCategoryVisible && existingCategory) {
      toast.error("Category name already exists.");
      return;
    }

    if (editCategoryVisible && selectedCategory) {
      try {
        setLoading(true);
        const updateData = {
          name: selectedCategory.name,
          numberOfInstances: parseInt(selectedCategory.numberOfInstances),
          maxScore: parseInt(selectedCategory.maxScore),
          description: selectedCategory.description,
          isExam: selectedCategory.isExam,
        };

        const result = await resultManagementService.updateAssessmentCategory(
          selectedCategory.id,
          updateData
        );

        if (result.success) {
          await fetchCategories();
          toast.success("Category updated successfully.");
          setEditCategoryVisible(false);
          setSelectedCategory(null);
        } else {
          toast.error(result.message || "Failed to update category.");
        }
      } catch (err) {
        toast.error("An error occurred while updating.");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const result = await resultManagementService.createAssessmentCategory({
          name: categoryFormData.name,
          numberOfInstances: parseInt(categoryFormData.numberOfInstances),
          maxScore: parseInt(categoryFormData.maxScore),
          description: categoryFormData.description,
          isExam: categoryFormData.isExam,
        });

        if (result.success) {
          await fetchCategories();
          toast.success("Category added successfully.");
          setCategoryFormData({
            name: "",
            numberOfInstances: "",
            maxScore: "",
            description: "",
            isExam: false,
          });
        } else {
          toast.error(result.message || "Failed to add category.");
        }
      } catch (err) {
        toast.error("An error occurred while adding.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (category) => {
    setEditCategoryVisible(true);
    setSelectedCategory({
      id: category.id,
      name: category.name,
      numberOfInstances: category.numberOfInstances,
      maxScore: category.maxScore,
      description: category.description || "",
      isExam: category.isExam,
    });
    setCategoryFormData({
      name: category.name,
      numberOfInstances: category.numberOfInstances.toString(),
      maxScore: category.maxScore.toString(),
      description: category.description || "",
      isExam: category.isExam,
    });
  };

  const handleCancelEdit = () => {
    setEditCategoryVisible(false);
    setSelectedCategory(null);
    setCategoryFormData({
      name: "",
      numberOfInstances: "",
      maxScore: "",
      description: "",
      isExam: false,
    });
  };

  const openDeleteModal = (category) => {
    setSelectedCategoryDelete(category);
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setSelectedCategoryDelete(null);
    setDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedCategoryDelete?.id) {
      try {
        setLoading(true);
        const result = await resultManagementService.deleteAssessmentCategory(
          selectedCategoryDelete.id
        );

        if (result.success) {
          toast.success("Category deleted successfully.");
          await fetchCategories();
          closeDeleteModal();
        } else {
          toast.error(result.message || "Failed to delete category.");
        }
      } catch (error) {
        toast.error("Failed to delete category.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="pr-1 h-full overflow-y-auto">
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
                  {selectedCategoryDelete.name}
                </span>
                ?
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

      <form onSubmit={handleSubmitForResult} className="mb-3 pb-5 pt-3 bg-white">
        <div className="flex pt-3 pl-6 pr-6 justify-between mb-2">
          <p className="font-bold text-[#07508F]">Result Configuration</p>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#07508F] text-white font-bold text-sm px-3 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90 disabled:opacity-50"
          >
            Save Scores
          </button>
        </div>
        <div className="pl-6 pr-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Set C.A Score:
              </label>
              <input
                type="number"
                name="totalCAScore"
                placeholder="Enter C.A Score"
                value={resultFormData.totalCAScore}
                onChange={(e) => {
                  const value = e.target.value;
                  setResultFormData((prev) => ({
                    ...prev,
                    totalCAScore: value,
                  }));
                }}
                className={`${
                  resultFormData.totalCAScore !== ""
                    ? "border-[#0071E3]"
                    : "border-[#B6B6B6]"
                } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-[1.5px] p-1.5 text-sm rounded-sm`}
                required
              />
            </div>

            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Set Exam Score:
              </label>
              <input
                type="number"
                name="totalExamScore"
                placeholder="Enter Exam Score"
                value={resultFormData.totalExamScore}
                onChange={(e) => {
                  const value = e.target.value;
                  setResultFormData((prev) => ({
                    ...prev,
                    totalExamScore: value,
                  }));
                }}
                className={`${
                  resultFormData.totalExamScore !== ""
                    ? "border-[#0071E3]"
                    : "border-[#B6B6B6]"
                } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-[1.5px] p-1.5 text-sm rounded-sm`}
                required
              />
            </div>
          </div>
        </div>
      </form>

      <div className="pb-5 pt-3 bg-white">
        <form onSubmit={handleSubmitForCategory} className="mb-3">
          <div className="flex pt-3 pl-6 pr-6 justify-between mb-2">
            <p className="font-bold text-[#07508F]">Assessment Category</p>
            <div className="flex gap-2">
              {editCategoryVisible && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white font-bold text-sm px-3 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="bg-[#07508F] text-white font-bold text-sm px-3 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90 disabled:opacity-50"
              >
                {editCategoryVisible ? "Save Category" : "Set Category"}
              </button>
            </div>
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
                      ? selectedCategory?.name || ""
                      : categoryFormData.name
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    editCategoryVisible
                      ? setSelectedCategory((prev) => ({
                          ...prev,
                          name: value,
                        }))
                      : setCategoryFormData((prev) => ({
                          ...prev,
                          name: value,
                        }));
                  }}
                  className={`${
                    categoryFormData.name !== "" ||
                    (editCategoryVisible && selectedCategory?.name !== "")
                      ? "border-[#0071E3]"
                      : "border-[#B6B6B6]"
                  } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-[1.5px] p-1.5 text-sm rounded-sm`}
                  required
                />
              </div>

              <div className="flex flex-col gap-2 mb-2">
                <label className="text-[0.88rem] text-[#5E6A72]">
                  No of Times:
                </label>
                <input
                  type="number"
                  name="numberOfInstances"
                  min={0}
                  placeholder="Enter No of Times"
                  value={
                    editCategoryVisible
                      ? selectedCategory?.numberOfInstances || ""
                      : categoryFormData.numberOfInstances
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    editCategoryVisible
                      ? setSelectedCategory((prev) => ({
                          ...prev,
                          numberOfInstances: value,
                        }))
                      : setCategoryFormData((prev) => ({
                          ...prev,
                          numberOfInstances: value,
                        }));
                  }}
                  className={`${
                    categoryFormData.numberOfInstances !== "" ||
                    (editCategoryVisible && selectedCategory?.numberOfInstances !== "")
                      ? "border-[#0071E3]"
                      : "border-[#B6B6B6]"
                  } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-[1.5px] p-1.5 text-sm rounded-sm`}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <label className="text-[0.88rem] text-[#5E6A72]">
                  Max Score per One:
                </label>
                <input
                  type="number"
                  name="maxScore"
                  min={0}
                  placeholder="Enter Max Score"
                  value={
                    editCategoryVisible
                      ? selectedCategory?.maxScore || ""
                      : categoryFormData.maxScore
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    editCategoryVisible
                      ? setSelectedCategory((prev) => ({
                          ...prev,
                          maxScore: value,
                        }))
                      : setCategoryFormData((prev) => ({
                          ...prev,
                          maxScore: value,
                        }));
                  }}
                  className={`${
                    categoryFormData.maxScore !== "" ||
                    (editCategoryVisible && selectedCategory?.maxScore !== "")
                      ? "border-[#0071E3]"
                      : "border-[#B6B6B6]"
                  } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-[1.5px] p-1.5 text-sm rounded-sm`}
                  required
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    editCategoryVisible
                      ? selectedCategory?.isExam || false
                      : categoryFormData.isExam
                  }
                  onChange={(e) => {
                    const checked = e.target.checked;
                    editCategoryVisible
                      ? setSelectedCategory((prev) => ({
                          ...prev,
                          isExam: checked,
                        }))
                      : setCategoryFormData((prev) => ({
                          ...prev,
                          isExam: checked,
                        }));
                  }}
                  className="w-4 h-4 text-[#07508F] rounded"
                />
                <span className="text-[0.88rem] text-[#5E6A72]">This is an Exam Category</span>
              </label>
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
                    <th className="p-2 bg-[#EDF0F3]">Category</th>
                    <th className="p-2 bg-[#EDF0F3]">Type</th>
                    <th className="p-2 bg-[#EDF0F3]">No of Times</th>
                    <th className="p-2 bg-[#EDF0F3]">Max Score</th>
                    <th className="p-2 bg-[#EDF0F3]">Actions</th>
                  </tr>
                </thead>
              )}
              <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-5 text-center border text-gray-500">
                      No Data Available
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => (
                    <tr className="border-b-[#D0D0D0] border-b" key={item.id || index}>
                      <td className="p-2 text-center">{item.name}</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.isExam ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {item.isExam ? "Exam" : "CA"}
                        </span>
                      </td>
                      <td className="p-2 text-center">{item.numberOfInstances}</td>
                      <td className="p-2 text-center">{item.maxScore}</td>
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
          {totalPages > 1 && (
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
                disabled={currentPage === totalPages}
                className={`px-2 py-1 border bg-[#E6ECF2] ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#EDF0F3]"
                }`}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultSettings;