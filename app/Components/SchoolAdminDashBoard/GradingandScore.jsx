"use client";
import React, { useEffect, useState } from "react";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import Dropdown from "./DropDown2";
import resultManagementService from "@/Service/ResultService";
import classService from "@/Service/ClassService";
import academicEntityService from "@/Service/AcademicEntityService";
import academicPeriodService from "@/Service/AcademicPeriodService";
import toast from "react-hot-toast";

const GradingandScore = () => {
  const [grade, setGrade] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [editGradeVisible, setEditGradeVisible] = useState(false);
  const [currentPageforgrade, setCurrentPageforgrade] = useState(1);
  const itemsPerPage = 5;
  const [classYear, setClassYear] = useState([]);
  const [termsForSession, setTermsForSession] = useState([]); // Terms for selected session
  const [sessions, setSessions] = useState([]);
  const [deleteModalVisibleforgrade, setDeleteModalVisibleforgrade] = useState(false);
  const [selectedGradeDelete, setSelectedGradeDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const [toggle, setToggle] = useState({});
  const [toggleFormData, setToggleFormData] = useState({
    isTermResultOpen: false,
    isAnnualResultOpen: false,
  });

  const [gradeFormData, setGradeFormData] = useState({
    minScore: "",
    maxScore: "",
    gradeName: "",
    remark: "",
  });

  const [computationFormData, setComputationFormData] = useState({
    classYearId: "",
    sessionId: "",
    termWeights: {} // Store weights by termId
  });

  const [originalWeights, setOriginalWeights] = useState({});

  useEffect(() => {
    fetchGrades();
    fetchClassYears();
    fetchSessions();
    fetchVisibility();
  }, []);

  // Fetch terms when session changes (include inactive terms)
  useEffect(() => {
    if (computationFormData.sessionId) {
      fetchTermsForSession(computationFormData.sessionId);
    } else {
      setTermsForSession([]);
    }
  }, [computationFormData.sessionId]);

  // Fetch annual weights when class year and session are selected
  useEffect(() => {
    if (computationFormData.classYearId && computationFormData.sessionId) {
      fetchAnnualWeights();
    }
  }, [computationFormData.classYearId, computationFormData.sessionId]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const result = await resultManagementService.getAllGrades();
      if (result.success) {
        setGrade(result.data);
      } else {
        toast.error(result.message || "Failed to load grades");
      }
    } catch (error) {
      toast.error("Failed to load grades");
    } finally {
      setLoading(false);
    }
  };

  const fetchClassYears = async () => {
    try {
      const result = await classService.getAllClassYears();
      if (result.success) {
        setClassYear(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch class years:", error);
    }
  };

  const fetchSessions = async () => {
    try {
      const result = await academicPeriodService.getAllSessions();
      if (result.success) {
        setSessions(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  };

  const fetchTermsForSession = async (sessionId) => {
    try {
      // Include inactive terms to get all First, Second, Third terms
      const result = await academicPeriodService.getAllTerms(sessionId, true, false);
      if (result.success) {
        // Sort terms by sequence
        const sortedTerms = result.data.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
        setTermsForSession(sortedTerms);
      }
    } catch (error) {
      console.error("Failed to fetch terms:", error);
    }
  };

  const fetchVisibility = async () => {
    try {
      const result = await resultManagementService.getAllVisibilities();
      if (result.success && result.data.length > 0) {
        setToggle(result.data[0]);
        setToggleFormData({
          isTermResultOpen: result.data[0].isTermResultOpen,
          isAnnualResultOpen: result.data[0].isAnnualResultOpen,
        });
      }
    } catch (error) {
      console.error("Failed to fetch visibility:", error);
    }
  };

  const fetchAnnualWeights = async () => {
    try {
      const result = await resultManagementService.getAnnualWeightSummary(
        computationFormData.classYearId,
        computationFormData.sessionId
      );
      if (result.success && result.data) {
        const weights = result.data.termWeights || [];
        const weightsMap = {};
        weights.forEach(w => {
          weightsMap[w.termId] = w.weight;
        });
        setComputationFormData(prev => ({
          ...prev,
          termWeights: weightsMap
        }));
        setOriginalWeights(weightsMap);
      } else {
        // No weights found, initialize empty
        setComputationFormData(prev => ({
          ...prev,
          termWeights: {}
        }));
        setOriginalWeights({});
      }
    } catch (error) {
      console.error("Failed to fetch annual weights:", error);
    }
  };

  const getClassYearName = (yearId) => {
    const year = classYear.find((item) => item.id === yearId);
    return year?.className;
  };

  const getSessionName = (sessionId) => {
    const session = sessions.find((item) => item.id === sessionId);
    return session?.name;
  };

  const paginatedDataforgrade = Array.isArray(grade)
    ? grade.slice(
        (currentPageforgrade - 1) * itemsPerPage,
        currentPageforgrade * itemsPerPage
      )
    : [];

  const totalPages = Math.ceil(grade.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPageforgrade((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPageforgrade((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSubmitForGrading = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const minScore = parseInt(gradeFormData.minScore);
    const maxScore = parseInt(gradeFormData.maxScore);

    if (minScore >= maxScore) {
      toast.error("Minimum score must be less than maximum score");
      return;
    }

    const gradeLetterExists = grade.some(
      (item) =>
        item.gradeName?.toLowerCase() === gradeFormData.gradeName?.toLowerCase() &&
        (!editGradeVisible || item.id !== selectedGrade?.id)
    );

    if (gradeLetterExists) {
      toast.error("Grade letter already exists");
      return;
    }

    const rangeOverlaps = grade.some((item) => {
      if (editGradeVisible && item.id === selectedGrade?.id) return false;
      return (
        (minScore >= item.minScore && minScore <= item.maxScore) ||
        (maxScore >= item.minScore && maxScore <= item.maxScore) ||
        (minScore <= item.minScore && maxScore >= item.maxScore)
      );
    });

    if (rangeOverlaps) {
      toast.error("Score range overlaps with an existing grade");
      return;
    }

    try {
      setLoading(true);
      if (editGradeVisible && selectedGrade) {
        const result = await resultManagementService.updateGrade(selectedGrade.id, {
          minScore: minScore,
          maxScore: maxScore,
          gradeName: gradeFormData.gradeName,
          remark: gradeFormData.remark,
        });

        if (result.success) {
          await fetchGrades();
          toast.success("Grade updated successfully.");
          setEditGradeVisible(false);
          setSelectedGrade(null);
        } else {
          toast.error(result.message);
        }
      } else {
        const result = await resultManagementService.createGrade({
          minScore: minScore,
          maxScore: maxScore,
          gradeName: gradeFormData.gradeName,
          remark: gradeFormData.remark,
        });

        if (result.success) {
          await fetchGrades();
          toast.success("Grade added successfully.");
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      toast.error("An error occurred while saving grade.");
    } finally {
      setLoading(false);
    }

    setGradeFormData({
      minScore: "",
      maxScore: "",
      gradeName: "",
      remark: "",
    });
  };

  const handleEdit = (gradeItem) => {
    setEditGradeVisible(true);
    setSelectedGrade(gradeItem);
    setGradeFormData({
      minScore: gradeItem.minScore?.toString() || "",
      maxScore: gradeItem.maxScore?.toString() || "",
      gradeName: gradeItem.gradeName || "",
      remark: gradeItem.remark || "",
    });
  };

  const openDeleteModal = (gradeItem) => {
    setSelectedGradeDelete(gradeItem);
    setDeleteModalVisibleforgrade(true);
  };

  const closeDeleteModal = () => {
    setSelectedGradeDelete(null);
    setDeleteModalVisibleforgrade(false);
  };

  const handleDelete = async () => {
    if (selectedGradeDelete?.id) {
      try {
        setLoading(true);
        const result = await resultManagementService.deleteGrade(selectedGradeDelete.id);
        if (result.success) {
          toast.success("Grade deleted successfully.");
          await fetchGrades();
          closeDeleteModal();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to delete grade.");
      } finally {
        setLoading(false);
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
      setLoading(true);
      let result;
      if (toggle.id) {
        result = await resultManagementService.updateVisibility(toggle.id, updatedData);
      } else {
        const activeTerm = termsForSession.length > 0 ? termsForSession[0] : null;
        result = await resultManagementService.createOrUpdateVisibility({
          termId: activeTerm?.id,
          ...updatedData,
        });
        if (result.success && result.data?.id) {
          setToggle(result.data);
        }
      }

      if (result.success) {
        toast.success(`${name.replace(/([A-Z])/g, ' $1').toLowerCase()} updated successfully.`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`Failed to update ${name.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  const handleWeightChange = (termId, value) => {
    setComputationFormData(prev => ({
      ...prev,
      termWeights: {
        ...prev.termWeights,
        [termId]: parseFloat(value) || 0
      }
    }));
  };

  const handleSaveAnnualWeight = async () => {
    const termWeights = termsForSession.map(term => ({
      termId: term.id,
      weight: computationFormData.termWeights[term.id] || 0
    }));

    const total = termWeights.reduce((sum, tw) => sum + tw.weight, 0);

    if (Math.abs(total - 1) > 0.001) {
      toast.error(`Total weight must equal 1 (100%). Current total: ${total}`);
      return;
    }

    try {
      setLoading(true);
      const result = await resultManagementService.createOrUpdateWeights({
        classYearId: computationFormData.classYearId,
        sessionId: computationFormData.sessionId,
        termWeights: termWeights,
      });

      if (result.success) {
        toast.success("Weight configuration saved successfully.");
        await fetchAnnualWeights();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to save weight configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pr-1 h-full overflow-y-auto">
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
                <span className="font-bold">{selectedGradeDelete?.gradeName}</span>?
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

      {/* Grading System Section */}
      <div className="pb-5 pt-3 bg-white">
        <form onSubmit={handleSubmitForGrading} className="mb-3">
          <div className="flex pt-3 pl-6 pr-6 justify-between mb-2">
            <p className="font-bold text-[#07508F]">Grading System</p>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#07508F] text-white font-bold text-sm px-3 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90 disabled:opacity-50"
            >
              {!editGradeVisible ? "+ Add Grade" : "Save Grade"}
            </button>
          </div>
          <div className="pl-6 pr-6">
            <div className="grid grid-cols-3 gap-10">
              <div className="flex flex-col gap-2 mb-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Grade:</label>
                <input
                  type="text"
                  placeholder="Enter Grade"
                  value={editGradeVisible ? selectedGrade?.gradeName : gradeFormData.gradeName}
                  onChange={(e) => {
                    const value = e.target.value;
                    editGradeVisible
                      ? setSelectedGrade((prev) => ({ ...prev, gradeName: value }))
                      : setGradeFormData((prev) => ({ ...prev, gradeName: value }));
                  }}
                  className="focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-[1.5px] p-1.5 text-sm rounded-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 mb-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Range:</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min Score"
                    value={editGradeVisible ? selectedGrade?.minScore : gradeFormData.minScore}
                    onChange={(e) => {
                      const value = e.target.value;
                      editGradeVisible
                        ? setSelectedGrade((prev) => ({ ...prev, minScore: value }))
                        : setGradeFormData((prev) => ({ ...prev, minScore: value }));
                    }}
                    className="focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-[1.5px] p-1.5 text-sm rounded-sm"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Max Score"
                    value={editGradeVisible ? selectedGrade?.maxScore : gradeFormData.maxScore}
                    onChange={(e) => {
                      const value = e.target.value;
                      editGradeVisible
                        ? setSelectedGrade((prev) => ({ ...prev, maxScore: value }))
                        : setGradeFormData((prev) => ({ ...prev, maxScore: value }));
                    }}
                    className="focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-[1.5px] p-1.5 text-sm rounded-sm"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <label className="text-[0.88rem] text-[#5E6A72]">Remark:</label>
                <input
                  type="text"
                  placeholder="Enter Remark"
                  value={editGradeVisible ? selectedGrade?.remark : gradeFormData.remark}
                  onChange={(e) => {
                    const value = e.target.value;
                    editGradeVisible
                      ? setSelectedGrade((prev) => ({ ...prev, remark: value }))
                      : setGradeFormData((prev) => ({ ...prev, remark: value }));
                  }}
                  className="focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-[1.5px] p-1.5 text-sm rounded-sm"
                  required
                />
              </div>
            </div>
          </div>
        </form>
        <hr className="mt-10" />

        <div className="flex-shrink-0 mb-2">
          <p className="font-semibold flex justify-center p-3 text-[#333333]">Existing Grades</p>
        </div>
        <div className="px-0">
          <div className="overflow-y-auto max-h-[200px] no-scrollbar">
            <table className="min-w-full table-auto">
              <thead className="bg-[#EDF0F3] text-center sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 bg-[#EDF0F3]">Grade</th>
                  <th className="p-2 bg-[#EDF0F3]">Range</th>
                  <th className="p-2 bg-[#EDF0F3]">Remark</th>
                  <th className="p-2 bg-[#EDF0F3]">Actions</th>
                </tr>
              </thead>
              <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
                {paginatedDataforgrade.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-5 text-center border text-gray-500">
                      No Data Available
                    </td>
                  </tr>
                ) : (
                  paginatedDataforgrade.map((item, index) => (
                    <tr className="border-b-[#D0D0D0] border-b" key={item.id || index}>
                      <td className="p-2 text-center">{item.gradeName}</td>
                      <td className="p-2 text-center">{`${item.minScore}-${item.maxScore}`}</td>
                      <td className="p-2 text-center">{item.remark}</td>
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
            <div className="flex justify-end pr-6 items-center gap-2 mt-3 text-sm text-[#01427A] font-semibold">
              <button
                onClick={handlePrevious}
                disabled={currentPageforgrade === 1}
                className={`px-2 py-1 bg-[#E6ECF2] border ${
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
                  className={`px-2 py-1 text-xs ${
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
                className={`px-2 py-1 border bg-[#E6ECF2] ${
                  currentPageforgrade === totalPages
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

      {/* Result Visibility Section */}
      <div className="pb-5 pt-3 mt-5 bg-white rounded-lg">
        <div className="pt-3 pl-6 pr-6 mb-5">
          <p className="font-bold text-[#07508F]">Result Visibility</p>
        </div>
        <div className="pl-6 pr-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[0.88rem] text-[#5E6A72]">
              Term Result Visibility
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isTermResultOpen"
                checked={toggleFormData.isTermResultOpen}
                onChange={handleToggleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-red-500 rounded-full peer peer-checked:bg-[#1BB66E] transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-full"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-[0.88rem] text-[#5E6A72]">
              Annual Result Visibility
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isAnnualResultOpen"
                checked={toggleFormData.isAnnualResultOpen}
                onChange={handleToggleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-red-500 rounded-full peer peer-checked:bg-[#1BB66E] transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-full"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Score Entry and Computation Section */}
      <div className="pb-5 pt-3 mt-5 bg-white rounded-lg">
        <div className="pt-3 pl-6 pr-6 mb-5 flex justify-between items-center">
          <p className="font-bold text-[#07508F]">Score Entry and Computation</p>
          <button
            onClick={handleSaveAnnualWeight}
            disabled={!computationFormData.classYearId || !computationFormData.sessionId || loading}
            className={`bg-[#07508F] text-white font-bold text-sm px-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90 ${
              !computationFormData.classYearId || !computationFormData.sessionId
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Save
          </button>
        </div>
        <div className="pl-6 pr-6 space-y-4 mb-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Set Class:</label>
              <Dropdown
                label={getClassYearName(computationFormData.classYearId) || "Select Class"}
                items={classYear.map((t) => ({
                  label: t.className,
                  onClick: () =>
                    setComputationFormData({
                      ...computationFormData,
                      classYearId: t.id,
                    }),
                }))}
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Set Session:</label>
              <Dropdown
                label={getSessionName(computationFormData.sessionId) || "Select Session"}
                items={sessions.map((t) => ({
                  label: t.name,
                  onClick: () =>
                    setComputationFormData({
                      ...computationFormData,
                      sessionId: t.id,
                    }),
                }))}
              />
            </div>
          </div>
        </div>
        <hr className="text-gray-200 mt-10" />
        <div className="flex-shrink-0 mb-2">
          <p className="font-semibold flex justify-center p-3 text-[#333333]">Set Term Annual Weight</p>
        </div>
        <div className="px-0">
          <div>
            <table className="min-w-full table-auto">
              <thead className="bg-[#EDF0F3] text-center sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 bg-[#EDF0F3]">Term</th>
                  <th className="p-2 bg-[#EDF0F3]">Weight</th>
                  <th className="p-2 bg-[#EDF0F3]">Action</th>
                </tr>
              </thead>
              <tbody>
                {termsForSession.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-5 text-center border text-gray-500">
                      {computationFormData.sessionId ? "No terms found for this session" : "Select a session first"}
                    </td>
                  </tr>
                ) : (
                  termsForSession.map((termItem) => {
                    const weight = computationFormData.termWeights[termItem.id] || "";
                    const originalWeight = originalWeights[termItem.id] || "";
                    const isChanged = weight !== "" && parseFloat(weight) !== parseFloat(originalWeight);

                    return (
                      <tr className="border-b-[#D0D0D0] border-b" key={termItem.id}>
                        <td className="p-2 text-center">{termItem.name}</td>
                        <td className="p-2 text-center">
                          <input
                            type="number"
                            step="0.01"
                            className={`rounded p-1 w-24 text-center focus:border-[#99C4EF] outline-none border ${
                              weight !== "" ? "border-[#99C4EF]" : "border-[#A4A4A4]"
                            }`}
                            placeholder="0.00"
                            min={0}
                            max={1}
                            value={weight}
                            onChange={(e) => handleWeightChange(termItem.id, e.target.value)}
                          />
                        </td>
                        <td className="p-2 text-center">
                          {isChanged && (
                            <button
                              type="button"
                              onClick={() => handleWeightChange(termItem.id, originalWeight)}
                              className="bg-gray-500 text-white text-xs px-3 py-1 rounded cursor-pointer hover:opacity-90"
                            >
                              Reset
                            </button>
                          )}
                          {!weight && !originalWeight && (
                            <div className="text-gray-400 text-xs">Not set</div>
                          )}
                          {!isChanged && weight && (
                            <div className="text-green-600 text-xs">Saved</div>
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
      </div>
    </div>
  );
};

export default GradingandScore;