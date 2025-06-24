"use client";
import {
  AddAnnualweigh,
  AddResultVisibility,
  createGrading,
  deleteGrade,
  getAnnualweigh,
  getGrading,
  getResultVisibility,
  UpdateAnnualWeigh,
  UpdateGrade,
  UpdateResultVisibility,
} from "@/Service/ResultService";
import { getClass, getDepartment, getTerms } from "@/Service/schoolConfig";
import React, { useEffect, useState } from "react";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import Dropdown from "./DropDown2";

const GradingandScore = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [grade, setgrade] = useState([]);
  const [selectedGrade, setselectedGrade] = useState(null);
  const [editGradeVisible, seteditGradeVisible] = useState(false);
  const [currentPageforgrade, setCurrentPageforgrade] = useState(1);
  const [currentPageforterm, setCurrentPageforterm] = useState(1);
  const itemsPerPage = 5;
  const [classYear, setClassYear] = useState([]);
  const [term, setTerm] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [deleteModalVisibleforgrade, setDeleteModalVisibleforgrade] =
    useState(false);
  const [selectedGradeDelete, setselectedGradeDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedWeightDelete, setselectedWeightDelete] = useState(null);

  const [Weight, setWeight] = useState({});
  const [originalWeights, setOriginalWeights] = useState({});

  const [toggle, setToggle] = useState({});
  const [toggleFormData, setToggleFormData] = useState({
    term_result_open: false,
    annual_result_open: false,
  });
  //Grade Aspect
  const [GradeFormData, setGradeFormData] = useState({
    min_score: "",
    max_score: "",
    grade: "",
    remarks: "",
  });

  const toggleWeightEdit = (termId) => {
    setWeight((prevState) => ({
      ...prevState,
      [termId]: !prevState[termId],
    }));
  };

  const [computationFormData, setComputationFormData] = useState({
    class_year: "",
    department: "",
    first_term_weight: "",
    second_term_weight: "",
    third_term_weight: "",
  });

  useEffect(() => {
    const fetchGrade = async () => {
      const { data, error } = await getGrading();
      if (data) setgrade(data);
      else setMessage(error || "Failed to load grading system");
    };
    const fetchClass = async () => {
      const { data, error } = await getClass();
      if (data) {
        setClassYear(data);
      } else {
        setMessage(error || "Failed to load Class years");
      }
    };
    const fetchTerms = async () => {
      const { data, error } = await getTerms();
      if (data) setTerm(data);
      else setMessage(error || "Failed to load terms");
    };
    const fetchDepartments = async () => {
      const { data, error } = await getDepartment();
      if (data) setDepartmentList(data);
      else setMessage(error || "Failed to load departments");
    };
    fetchDepartments();
    fetchTerms();
    fetchClass();
    fetchGrade();
  }, []);

  const getClassYearName = (yearid) => {
    const year = classYear.find((item) => item.class_year_id === yearid);
    return year?.class_name;
  };
  const getDepartmentName = (depID) => {
    const year = departmentList.find((item) => item.department_id === depID);
    return year?.name;
  };
  const getTermName = (yearid) => {
    const terms = term.find((item) => item.term_id === yearid);
    return terms?.name;
  };
  useEffect(() => {
    const fetchVisibility = async () => {
      const { data, error } = await getResultVisibility();
      console.log("Fetched visibility:", data, "Error:", error);

      if (Array.isArray(data) && data.length > 0) {
        setToggle(data[0]);
        setToggleFormData({
          term_result_open: data[0].term_result_open,
          annual_result_open: data[0].annual_result_open,
        });
      } else if (error) {
        setMessage(error || "Failed to load result visibility");
        setMessageType("error");
      }
    };
    fetchVisibility();
  }, []);

  const paginatedDataforgrade = Array.isArray(grade)
    ? grade.slice(
        (currentPageforgrade - 1) * itemsPerPage,
        currentPageforgrade * itemsPerPage
      )
    : [];
  const paginatedDataforAnnualweigh = Array.isArray(term)
    ? term.slice(
        (currentPageforterm - 1) * itemsPerPage,
        currentPageforterm * itemsPerPage
      )
    : [];

  const totalPages = Math.ceil(grade.length / itemsPerPage);
  const totalPagesforterm = Math.ceil(term.length / itemsPerPage);
  const handlePrevious = () => {
    setCurrentPageforgrade((prev) => Math.max(prev - 1, 1));
  };
  const handlePreviousterm = () => {
    setCurrentPageforterm((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPageforgrade((prev) => Math.min(prev + 1, totalPages));
  };
  const handleNextterm = () => {
    setCurrentPageforterm((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSubmitForGrading = async (e) => {
    e.preventDefault();

    if (editGradeVisible && selectedGrade) {
      try {
        const updatedData = {
          ...selectedGrade,
          min_score: selectedGrade.min_score,
          max_score: selectedGrade.max_score,
          grade: selectedGrade.grade,
          remarks: selectedGrade.remarks,
        };

        const { data, error } = await UpdateGrade(
          selectedGrade.id,
          updatedData
        );

        if (response?.status === 204) {
          setMessage("Grade Updated successfully.");
          setMessageType("success");
          closeDeleteModal();
        } else {
          setMessage("Failed to update Grade.");
          setMessageType("error");
        }
        const updatedList = grade.map((item) =>
          item.id === selectedGrade.id ? data : item
        );
        setgrade(updatedList);
        setMessage("Grade updated successfully.");
        setMessageType("success");
        seteditGradeVisible(false);
        setselectedGrade(null);
      } catch (err) {
        setMessage("An error occurred while updating.");
        setMessageType("error");
      }
    } else {
      try {
        const { data, error } = await createGrading(GradeFormData);

        if (error) {
          setMessage(error || "Failed to add grade.");
          setMessageType("error");
        } else {
          setgrade((prev) => [...prev, data]);
          setMessage("Grade added successfully.");
          setMessageType("success");
        }
      } catch (err) {
        setMessage("An error occurred while adding.");
        setMessageType("error");
      }
    }

    setGradeFormData({
      min_score: "",
      max_score: "",
      grade: "",
      remarks: "",
    });

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleEdit = (grade) => {
    seteditGradeVisible(true);
    setselectedGrade({ ...grade });
  };

  const openDeleteModal = (school) => {
    setselectedGradeDelete(school);
    setDeleteModalVisibleforgrade(true);
  };

  // Function to close delete modal
  const closeDeleteModal = () => {
    setselectedGradeDelete(null);
    setDeleteModalVisibleforgrade(false);
  };

  const openDeleteModalforweigh = (school) => {
    setselectedWeightDelete(school);
    setDeleteModalVisible(true);
  };

  // Function to close delete modal
  const closeDeleteModalforweigh = () => {
    setselectedWeightDelete(null);
    setDeleteModalVisible(false);
  };
  const handleDelete = async () => {
    if (selectedGradeDelete?.id) {
      try {
        const response = await deleteGrade(selectedGradeDelete.id);
        if (response?.status === 204) {
          setMessage("Grade deleted successfully.");
          setMessageType("success");
          closeDeleteModal();
        } else {
          setMessage("Failed to delete Grade.");
          setMessageType("error");
          closeDeleteModal();
        }
      } catch (error) {
        setMessageType("error");
        setMessage("Failed to delete Grade.");
      }
    }
  };

  const handleToggleChange = async (e) => {
    const { name, checked } = e.target;

    const updatedData = {
      ...toggleFormData,
      [name]: checked,
    };

    setToggleFormData(updatedData);

    try {
      let data, error;

      if (toggle.id) {
        ({ data, error } = await UpdateResultVisibility(
          toggle.id,
          updatedData
        ));
      } else {
        ({ data, error } = await AddResultVisibility(updatedData));

        // ✅ Add this: update toggle with returned `data` (including the new ID)
        if (data?.id) {
          setToggle(data); // so future toggle uses PATCH not POST
        }
      }

      if (error) throw new Error(error);

      setMessage(`${name.replaceAll("_", " ")} updated successfully.`);
      setMessageType("success");
    } catch (error) {
      setMessage(`Failed to update ${name.replaceAll("_", " ")}`);
      setMessageType("error");
    }

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  useEffect(() => {
    const fetchAnnualWeight = async () => {
      if (computationFormData.class_year && computationFormData.department) {
        const { data, error } = await getAnnualweigh();
        if (error) {
          setMessage(error);
          setMessageType("error");
          return;
        }

        const match = data.find(
          (item) =>
            item.class_year === computationFormData.class_year &&
            item.department === computationFormData.department
        );

        if (match) {
          setComputationFormData((prev) => ({
            ...prev,
            first_term_weight: match.first_term_weight,
            second_term_weight: match.second_term_weight,
            third_term_weight: match.third_term_weight,
            id: match.id, // Store id for update later
          }));
          setOriginalWeights({
            first_term_weight: match.first_term_weight,
            second_term_weight: match.second_term_weight,
            third_term_weight: match.third_term_weight,
          });
        } else {
          setComputationFormData((prev) => ({
            ...prev,
            first_term_weight: "",
            second_term_weight: "",
            third_term_weight: "",
            id: null,
          }));

          setOriginalWeights({});
        }
      }
    };

    fetchAnnualWeight();
  }, [computationFormData.class_year, computationFormData.department]);

  const handleSaveAnnualWeight = async (e) => {
    e.preventDefault();

    const total =
      parseFloat(computationFormData.first_term_weight || 0) +
      parseFloat(computationFormData.second_term_weight || 0) +
      parseFloat(computationFormData.third_term_weight || 0);

    if (Math.abs(total - 1) > 0.001) {
      setMessage("Total weight must equal 1.");
      setMessageType("error");
      return;
    }

    const payload = {
      class_year: computationFormData.class_year,
      department: computationFormData.department,
      first_term_weight: parseFloat(computationFormData.first_term_weight),
      second_term_weight: parseFloat(computationFormData.second_term_weight),
      third_term_weight: parseFloat(computationFormData.third_term_weight),
    };

    let response;

    if (computationFormData.id) {
      response = await UpdateAnnualWeigh(computationFormData.id, payload);
    } else {
      response = await AddAnnualweigh(payload);
    }

    if (response?.error) {
      setMessage("Failed to save weight configuration.");
      setMessageType("error");
    } else {
      setMessage("Weight configuration saved successfully.");
      setMessageType("success");
      setWeight({});
    }

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  return (
    <div className="pr-1 h-full overflow-y-auto">
      {message && (
        <div
          className={`mx-6 mb-3 z-[3000] sticky top-0 text-sm px-4 py-2 rounded-sm font-semibold ${
            messageType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
      {deleteModalVisibleforgrade && selectedGradeDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg min-w-75 z-50 p-8">
            <p className="font-bold text-center text-lg">Delete Grade</p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete the Grade
              </p>
              <p className="text-base text-[#858383]">
                <span className="font-bold">{selectedGradeDelete.grade}</span>?
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

      <div className="pb-5 pt-3  bg-white">
        <form onSubmit={handleSubmitForGrading} className="mb-3 ">
          <div className="flex pt-3 pl-6 pr-6 justify-between mb-2 ">
            <p className="font-bold text-[#07508F]">Grading System</p>
            <button
              type="submit"
              className="bg-[#07508F] text-white font-bold text-sm px-3 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
            >
              {!editGradeVisible ? "+ Add Grade" : "Set Grade"}
            </button>
          </div>
          <div className="pl-6 pr-6">
            <div className="grid grid-cols-3 gap-10">
              <div className="flex flex-col gap-2 mb-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Grade:</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Grade"
                  value={
                    editGradeVisible
                      ? selectedGrade?.grade
                      : GradeFormData.grade
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    editGradeVisible
                      ? setselectedGrade((prev) => ({
                          ...prev,
                          grade: value,
                        }))
                      : setGradeFormData((prev) => ({
                          ...prev,
                          grade: value,
                        }));
                  }}
                  className={`${
                    GradeFormData.grade !== "" ||
                    (editGradeVisible && selectedGrade?.grade !== "")
                      ? "border-[#0071E3]"
                      : "border-[#B6B6B6]"
                  } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-[1.5px] p-1.5 text-sm rounded-sm `}
                  required
                />
              </div>

              <div className="flex flex-col gap-2 mb-2 ">
                <label className="text-[0.88rem] text-[#5E6A72]">Range:</label>
                <div className="grid grid-cols-2 gap-2 ">
                  <input
                    type="number"
                    name="name"
                    placeholder="Enter Min Score"
                    value={
                      editGradeVisible
                        ? selectedGrade?.min_score
                        : GradeFormData.min_score
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      editGradeVisible
                        ? setselectedGrade((prev) => ({
                            ...prev,
                            min_score: value,
                          }))
                        : setGradeFormData((prev) => ({
                            ...prev,
                            min_score: value,
                          }));
                    }}
                    className={`${
                      GradeFormData.min_score !== "" ||
                      (editGradeVisible && selectedGrade?.min_score !== "")
                        ? "border-[#0071E3]"
                        : "border-[#B6B6B6]"
                    } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-[1.5px] p-1.5 text-sm rounded-sm `}
                    required
                  />
                  <input
                    type="number"
                    name="name"
                    placeholder="Enter Max Score"
                    value={
                      editGradeVisible
                        ? selectedGrade?.max_score
                        : GradeFormData.max_score
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      editGradeVisible
                        ? setselectedGrade((prev) => ({
                            ...prev,
                            max_score: value,
                          }))
                        : setGradeFormData((prev) => ({
                            ...prev,
                            max_score: value,
                          }));
                    }}
                    className={`${
                      GradeFormData.max_score !== "" ||
                      (editGradeVisible && selectedGrade?.max_score !== "")
                        ? "border-[#0071E3]"
                        : "border-[#B6B6B6]"
                    } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-[1.5px] p-1.5 text-sm rounded-sm `}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Remark:</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Remark"
                  value={
                    editGradeVisible
                      ? selectedGrade?.remarks
                      : GradeFormData.remarks
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    editGradeVisible
                      ? setselectedGrade((prev) => ({
                          ...prev,
                          remarks: value,
                        }))
                      : setGradeFormData((prev) => ({
                          ...prev,
                          remarks: value,
                        }));
                  }}
                  className={`${
                    GradeFormData.remarks !== "" ||
                    (editGradeVisible && selectedGrade?.remarks !== "")
                      ? "border-[#0071E3]"
                      : "border-[#B6B6B6]"
                  } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-[1.5px] p-1.5 text-sm rounded-sm `}
                  required
                />
              </div>
            </div>
          </div>
        </form>
        <hr className="mt-10" />

        <div className="flex-shrink-0 mb-2">
          <p className="font-semibold flex justify-center p-3 text-[#333333]">
            Existing Grades
          </p>
        </div>
        <div className="px-0">
          <div className="overflow-y-auto max-h-[200px] no-scrollbar">
            <table className="min-w-full table-auto">
              {paginatedDataforgrade.length > 0 && (
                <thead className="bg-[#EDF0F3] text-center sticky top-0 z-10 lg:text-base text-xs">
                  <tr>
                    <th className="p-2 bg-[#EDF0F3]">Grade</th>
                    <th className="p-2 bg-[#EDF0F3]">Range</th>
                    <th className="p-2 bg-[#EDF0F3]">Remark</th>
                    <th className="p-2 bg-[#EDF0F3]">Actions</th>
                  </tr>
                </thead>
              )}
              <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
                {paginatedDataforgrade.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-5  text-center border text-gray-500"
                    >
                      No Data Available
                    </td>
                  </tr>
                ) : (
                  paginatedDataforgrade.map((item, index) => (
                    <tr className="border-b-[#D0D0D0] border-b" key={index}>
                      <td className="p-2 text-center">{item.grade}</td>
                      <td className="p-2 text-center">{`${item.min_score}-${item.max_score}`}</td>
                      <td className="p-2 text-center">{item.remarks}</td>
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
              disabled={currentPageforgrade === 1}
              className={`px-2 py-1  bg-[#E6ECF2] border ${
                currentPageforgrade === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#EDF0F3]"
              }`}
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPageforgrade(index + 1)}
                className={`px-2 py-1   text-xs ${
                  currentPageforgrade === index + 1
                    ? "bg-[#07508F] text-white"
                    : "hover:bg-[#EDF0F3] bg-[#FAFAFA]"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={handleNext}
              disabled={currentPageforgrade === totalPages}
              className={`px-2 py-1  border bg-[#E6ECF2] ${
                currentPageforgrade === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#EDF0F3]"
              }`}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
      <div className="pb-5 pt-3 mt-5 bg-white rounded-lg">
        <div className="pt-3 pl-6 pr-6 mb-5">
          <p className="font-bold text-[#07508F]">Result Visibility</p>
        </div>
        <div className="pl-6 pr-6 space-y-4">
          {/* Term Result Visibility */}
          <div className="flex items-center justify-between">
            <label className="text-[0.88rem] text-[#5E6A72]">
              Term Result Visibility
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="term_result_open"
                checked={toggleFormData.term_result_open}
                onChange={handleToggleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-red-500 rounded-full peer peer-checked:bg-[#1BB66E] transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-full"></div>
            </label>
          </div>

          {/* Annual Result Visibility */}
          <div className="flex items-center justify-between">
            <label className="text-[0.88rem] text-[#5E6A72]">
              Annual Result Visibility
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="annual_result_open"
                checked={toggleFormData.annual_result_open}
                onChange={handleToggleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-red-500 rounded-full peer peer-checked:bg-[#1BB66E] transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-full"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="pb-5 pt-3 mt-5 bg-white   rounded-lg">
        <div className="pt-3 pl-6 pr-6 mb-5 flex justify-between items-center">
          <p className="font-bold text-[#07508F]">
            Score Entry and Computation
          </p>
          <button
            onClick={handleSaveAnnualWeight}
            disabled={
              !computationFormData.class_year || !computationFormData.department
            }
            className={`bg-[#07508F] text-white font-bold text-sm px-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90 ${
              !computationFormData.class_year || !computationFormData.department
                ? "cursor-not-allowed"
                : ""
            }`}
          >
            Save
          </button>
        </div>
        <form>
          <div className="pl-6 pr-6 space-y-4 mb-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2 mb-2">
                <label className="text-[0.88rem] text-[#5E6A72]">
                  Set Class:
                </label>
                <Dropdown
                  label={
                    getClassYearName(computationFormData.class_year) ||
                    "Select Class"
                  }
                  items={classYear.map((t) => ({
                    label: t.class_name,
                    onClick: () =>
                      setComputationFormData({
                        ...computationFormData,
                        class_year: t.class_year_id,
                      }),
                  }))}
                />
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <label className="text-[0.88rem] text-[#5E6A72]">
                  Set Department:
                </label>
                <Dropdown
                  label={
                    getDepartmentName(computationFormData.department) ||
                    "Select Department"
                  }
                  items={departmentList.map((t) => ({
                    label: t.name,
                    onClick: () =>
                      setComputationFormData({
                        ...computationFormData,
                        department: t.department_id,
                      }),
                  }))}
                />
              </div>
            </div>
          </div>
          <hr className="text-gray-200 mt-10" />
          <div className="flex-shrink-0 mb-2">
            <p className="font-semibold flex justify-center p-3 text-[#333333]">
              Set Term Annual Weigh
            </p>
          </div>
          <div className="px-0">
            <div>
              <table className="min-w-full table-auto">
                {paginatedDataforAnnualweigh.length > 0 && (
                  <thead className="bg-[#EDF0F3] text-center sticky top-0 z-10 lg:text-base text-xs">
                    <tr>
                      <th className="p-2  bg-[#EDF0F3]">Term</th>
                      <th className="p-2 bg-[#EDF0F3]">Input Score</th>
                      <th className="p-2 bg-[#EDF0F3]">Action</th>
                    </tr>
                  </thead>
                )}
                <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
                  {paginatedDataforAnnualweigh.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="p-5  text-center border text-gray-500"
                      >
                        No Data Available
                      </td>
                    </tr>
                  ) : (
                    paginatedDataforAnnualweigh.map((item, index) => {
                      let termKey = "";
                      if (item.name.toLowerCase().includes("first"))
                        termKey = "first_term_weight";
                      else if (item.name.toLowerCase().includes("second"))
                        termKey = "second_term_weight";
                      else if (item.name.toLowerCase().includes("third"))
                        termKey = "third_term_weight";

                      const inputValue = computationFormData[termKey];
                      const originalValue = originalWeights[termKey];

                      const isSynced =
                        parseFloat(inputValue) === parseFloat(originalValue);

                      return (
                        <tr
                          className="border-b-[#D0D0D0]  border-b"
                          key={index}
                        >
                          <td className="p-2 text-center ">{item.name}</td>
                          <td className="p-2 text-center ">
                            <input
                              type="number"
                              required
                              className={` ${
                                Weight[item.term_id] || isSynced
                                  ? "text-sm"
                                  : "border  text-xs"
                              }  placeholder:text-[#000] rounded p-1  w-24 placeholder:text-center focus:border-[#99C4EF] outline-none text-center ${
                                computationFormData[termKey] !== "" &&
                                computationFormData[termKey] !== undefined
                                  ? "border-[#99C4EF]"
                                  : "border-[#A4A4A4]"
                              }`}
                              placeholder={
                                Weight[item.term_id] ? "" : "Enter Weigh"
                              }
                              readOnly={Weight[item.term_id] ? true : false}
                              min={0}
                              step={0.1}
                              value={computationFormData[termKey] || ""}
                              onChange={(e) =>
                                setComputationFormData((prev) => ({
                                  ...prev,
                                  [termKey]: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="p-2 text-center ">
                            {isSynced ? (
                              <div className="flex gap-4 items-center justify-center">
                                <FiEdit3
                                  className="text-[#80ADCB] cursor-pointer"
                                  size={15}
                                  onClick={() => toggleWeightEdit(item.term_id)}
                                />
                                <FiTrash2
                                  className="text-[#F94144] cursor-pointer"
                                  size={15}
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                <div
                                  onClick={() => toggleWeightEdit(item.term_id)}
                                  className="bg-[#07508F]   text-white  text-xs px-5 py-1 rounded cursor-pointer hover:opacity-90"
                                >
                                  Set
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradingandScore;
