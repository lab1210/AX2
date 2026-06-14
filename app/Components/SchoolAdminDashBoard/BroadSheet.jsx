"use client";
import React, { useState, useEffect } from "react";
import Dropdown from "./DropDown2";
import resultManagementService from "@/Service/ResultService";
import classService from "@/Service/ClassService";
import academicPeriodService from "@/Service/AcademicPeriodService";
import toast from "react-hot-toast";

const BroadSheet = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [classArms, setClassArms] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedClassArm, setSelectedClassArm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [broadsheetData, setBroadsheetData] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchClassArms();
    fetchTerms();
  }, []);

  useEffect(() => {
    if (selectedClassArm && selectedTerm) {
      fetchBroadsheet();
    }
  }, [selectedClassArm, selectedTerm]);

  const fetchClassArms = async () => {
    try {
      const result = await classService.getAllClassArms();
      if (result.success) {
        setClassArms(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch class arms:", error);
    }
  };

  const fetchTerms = async () => {
    try {
      const result = await academicPeriodService.getAllTerms();
      if (result.success) {
        setTerms(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch terms:", error);
    }
  };

  const fetchBroadsheet = async () => {
    if (!selectedClassArm || !selectedTerm) return;
    
    try {
      setLoading(true);
      const result = await resultManagementService.getClassTermReport(
        selectedClassArm,
        selectedTerm
      );
      
      if (result.success && result.data) {
        setBroadsheetData(result.data);
        
        // Get all subjects from the first student to determine columns
        if (result.data.length > 0 && result.data[0].subjectResults) {
          const uniqueSubjects = result.data[0].subjectResults.map(s => ({
            id: s.subjectId,
            name: s.subjectName
          }));
          setSubjects(uniqueSubjects);
        }
      } else {
        toast.error(result.message || "Failed to fetch broadsheet data");
        setBroadsheetData([]);
      }
    } catch (error) {
      console.error("Failed to fetch broadsheet:", error);
      toast.error("Failed to fetch broadsheet data");
    } finally {
      setLoading(false);
    }
  };

  const getClassArmName = (classArmId) => {
    const classArm = classArms.find(ca => ca.id === classArmId);
    return classArm ? `${classArm.classYearName || ""} ${classArm.armName}` : "Select Class";
  };

  const getTermName = (termId) => {
    const term = terms.find(t => t.id === termId);
    return term?.name;
  };

  const paginatedData = broadsheetData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(broadsheetData.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const calculatePassedCount = (subjectResults) => {
    return subjectResults.filter(s => (s.percentage || s.finalScore || 0) >= 40).length;
  };

  const calculateFailedCount = (subjectResults) => {
    return subjectResults.filter(s => (s.percentage || s.finalScore || 0) < 40).length;
  };

  return (
    <div className="p-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class Arm <span className="text-red-500">*</span>
            </label>
            <Dropdown
              label={getClassArmName(selectedClassArm) || "Select Class Arm"}
              items={classArms.map((arm) => ({
                label: `${arm.classYearName || ""} ${arm.armName}`,
                onClick: () => {
                  setSelectedClassArm(arm.id);
                  setCurrentPage(1);
                },
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Term <span className="text-red-500">*</span>
            </label>
            <Dropdown
              label={getTermName(selectedTerm) || "Select Term"}
              items={terms.map((term) => ({
                label: term.name,
                onClick: () => {
                  setSelectedTerm(term.id);
                  setCurrentPage(1);
                },
              }))}
            />
          </div>
        </div>
      </div>

      {/* Broadsheet Table */}
      {selectedClassArm && selectedTerm ? (
        loading ? (
          <div className="flex justify-center items-center p-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#07508F]"></div>
            <span className="ml-2 text-gray-600">Loading broadsheet...</span>
          </div>
        ) : broadsheetData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
            <p className="text-gray-500">No data available for the selected class and term.</p>
            <p className="text-sm text-gray-400 mt-2">Make sure results have been calculated for this term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-full border border-[#01427A]/15 text-sm">
              <thead className="bg-[#f8fdff] text-gray-800">
                <tr>
                  <th
                    className="border px-8 py-2 text-center text-[#6DAAD3] sticky left-0 bg-[#f8fdff] z-10"
                    rowSpan={2}
                  >
                    <div className="rotate-[300deg] whitespace-nowrap">STUDENT NAME</div>
                  </th>
                  <th className="border px-3 py-4 font-bold bg-[#6B90B5]/4" colSpan={subjects.length}>
                    SUBJECTS
                  </th>
                  <th className="border px-3 py-4 font-bold bg-[#6B90B5]/4" rowSpan={2}>
                    No. Passed
                  </th>
                  <th className="border px-3 py-4 font-bold bg-[#6B90B5]/4" rowSpan={2}>
                    No. Failed
                  </th>
                  <th className="border px-3 py-4 font-bold bg-[#6B90B5]/4" rowSpan={2}>
                    Total Avg (%)
                  </th>
                  
                </tr>
                <tr className="bg-[#6B90B5]/4">
                  {subjects.map((subject) => (
                    <th key={subject.id} className="border px-1 py-2">
                      {subject.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {paginatedData.map((student, idx) => {
                  const passedCount = calculatePassedCount(student.subjectResults);
                  const failedCount = calculateFailedCount(student.subjectResults);
                  const avgPercentage = student.averagePercentage || student.totalScore || 0;
                  
                  const subjectScores = {};
                  student.subjectResults.forEach(s => {
                    subjectScores[s.subjectId] = s.percentage || s.finalScore || 0;
                  });

                  return (
                    <tr key={student.studentId || idx} className="text-center font-medium hover:bg-gray-50">
                      <td
                        title={student.studentName}
                        className="border px-3 py-3 font-medium truncate cursor-pointer text-left sticky left-0 bg-white z-10"
                      >
                        {student.studentName}
                      </td>
                      
                      {subjects.map((subject) => (
                        <td key={subject.id} className="border px-3 py-3 text-[#333333]">
                          {subjectScores[subject.id] !== undefined ? subjectScores[subject.id].toFixed(1) : "-"}
                        </td>
                      ))}
                      
                      <td className="border px-3 py-3 text-green-600 font-semibold">
                        {passedCount}
                      </td>
                      <td className="border px-3 py-3 text-red-600 font-semibold">
                        {failedCount}
                      </td>
                      <td className="border px-3 py-3 font-semibold">
                        {avgPercentage.toFixed(1)}%
                      </td>
                      
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-end pr-6 items-center gap-2 mt-3 text-sm text-[#01427A] font-semibold">
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
                      className={`px-2 py-1 text-xs ${
                        currentPage === pageNum
                          ? "bg-[#07508F] text-white"
                          : "hover:bg-[#EDF0F3] bg-[#FAFAFA]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

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
        )
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
          <p className="text-gray-500">Please select a class arm and term to view the broadsheet.</p>
        </div>
      )}
    </div>
  );
};

export default BroadSheet;