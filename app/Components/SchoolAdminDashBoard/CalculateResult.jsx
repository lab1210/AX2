"use client";
import React, { useEffect, useState } from "react";
import Dropdown from "./DropDown2";
import resultManagementService from "@/Service/ResultService";
import classService from "@/Service/ClassService";
import academicPeriodService from "@/Service/AcademicPeriodService";
import academicEntityService from "@/Service/AcademicEntityService";
import toast from "react-hot-toast";

const CalculateResult = () => {
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [classYears, setClassYears] = useState([]);
  const [classArms, setClassArms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredTerms, setFilteredTerms] = useState([]);
  const [filteredClassArms, setFilteredClassArms] = useState([]);

  const [termFormData, setTermFormData] = useState({
    termId: "",
    classArmId: "",
    studentId: "",
    subjectId: "",
  });

  const [annualFormData, setAnnualFormData] = useState({
    sessionId: "",
    classYearId: "",
    studentId: "",
    subjectId: "",
  });

  const [calculationType, setCalculationType] = useState("term");

  useEffect(() => {
    fetchSessions();
    fetchClassYears();
    fetchClassArms();
    fetchSubjects();
    fetchTerms();
  }, []);

  useEffect(() => {
    if (termFormData.termId) {
      // No need to filter terms further, terms are already fetched
    }
  }, [termFormData.termId]);

  useEffect(() => {
    if (termFormData.classArmId) {
      const arms = classArms.filter(arm => arm.id === termFormData.classArmId);
      setFilteredClassArms(arms);
    }
  }, [termFormData.classArmId, classArms]);

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

  const fetchClassYears = async () => {
    try {
      const result = await classService.getAllClassYears();
      if (result.success) {
        setClassYears(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch class years:", error);
    }
  };

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

  const fetchSubjects = async () => {
    try {
      const result = await academicEntityService.getAllSubjects();
      if (result.success) {
        setSubjects(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    }
  };

  const handleTermCalculation = async () => {
    if (!termFormData.termId) {
      toast.error("Please select a term");
      return;
    }

    const payload = {
      termId: termFormData.termId,
    };

    if (termFormData.classArmId) payload.classArmId = termFormData.classArmId;
    if (termFormData.studentId) payload.studentId = termFormData.studentId;
    if (termFormData.subjectId) payload.subjectId = termFormData.subjectId;

    try {
      setLoading(true);
      const result = await resultManagementService.calculateTermResults(payload);
      if (result.success) {
        toast.success(result.message);
        console.log("Calculation result:", result.data);
      } else {
        toast.error(result.message);
        if (result.data?.errors?.length) {
          result.data.errors.forEach(err => console.error(err));
        }
      }
    } catch (error) {
      toast.error("Failed to calculate term results");
    } finally {
      setLoading(false);
    }
  };

  const handleAnnualCalculation = async () => {
    if (!annualFormData.sessionId) {
      toast.error("Please select a session");
      return;
    }

    const payload = {
      sessionId: annualFormData.sessionId,
    };

    if (annualFormData.classYearId) payload.classYearId = annualFormData.classYearId;
    if (annualFormData.studentId) payload.studentId = annualFormData.studentId;
    if (annualFormData.subjectId) payload.subjectId = annualFormData.subjectId;

    try {
      setLoading(true);
      const result = await resultManagementService.calculateAnnualResults(payload);
      if (result.success) {
        toast.success(result.message);
        console.log("Annual calculation result:", result.data);
      } else {
        toast.error(result.message);
        if (result.data?.errors?.length) {
          result.data.errors.forEach(err => console.error(err));
        }
      }
    } catch (error) {
      toast.error("Failed to calculate annual results");
    } finally {
      setLoading(false);
    }
  };

  const getTermName = (termId) => {
    const term = terms.find(t => t.id === termId);
    return term?.name;
  };

  const getSessionName = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    return session?.name;
  };

  const getClassYearName = (classYearId) => {
    const classYear = classYears.find(cy => cy.id === classYearId);
    return classYear?.className;
  };

  const getClassArmName = (classArmId) => {
    const classArm = classArms.find(ca => ca.id === classArmId);
    return classArm?.armName;
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name;
  };

  return (
    <div className="p-6">
      {/* Calculation Type Toggle */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setCalculationType("term")}
            className={`flex-1 px-4 py-3 text-center font-medium transition-all ${
              calculationType === "term"
                ? "text-[#07508F] border-b-2 border-[#07508F] bg-blue-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Term Result Calculation
          </button>
          <button
            onClick={() => setCalculationType("annual")}
            className={`flex-1 px-4 py-3 text-center font-medium transition-all ${
              calculationType === "annual"
                ? "text-[#07508F] border-b-2 border-[#07508F] bg-blue-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Annual Result Calculation
          </button>
        </div>
      </div>

      {/* Term Calculation Form */}
      {calculationType === "term" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-[#07508F] mb-4">Calculate Term Results</h2>
          <p className="text-sm text-gray-500 mb-6">
            Calculate results for students based on their registered subjects and assessment scores.
            Results will be calculated for all students or filtered by your selections below.
          </p>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Term <span className="text-red-500">*</span>
              </label>
              <Dropdown
                label={getTermName(termFormData.termId) || "Select Term"}
                items={terms.map((term) => ({
                  label: term.name,
                  onClick: () => setTermFormData(prev => ({ ...prev, termId: term.id })),
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Class Arm (Optional)
              </label>
              <Dropdown
                label={getClassArmName(termFormData.classArmId) || "All Class Arms"}
                items={[
                  { label: "All Class Arms", onClick: () => setTermFormData(prev => ({ ...prev, classArmId: "" })) },
                  ...classArms.map((arm) => ({
                    label: `${arm.classYearName || ""} ${arm.armName}`,
                    onClick: () => setTermFormData(prev => ({ ...prev, classArmId: arm.id })),
                  })),
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Student (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter Student ID"
                value={termFormData.studentId}
                onChange={(e) => setTermFormData(prev => ({ ...prev, studentId: e.target.value }))}
                className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to calculate for all students</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Subject (Optional)
              </label>
              <Dropdown
                label={getSubjectName(termFormData.subjectId) || "All Subjects"}
                items={[
                  { label: "All Subjects", onClick: () => setTermFormData(prev => ({ ...prev, subjectId: "" })) },
                  ...subjects.map((subject) => ({
                    label: subject.name,
                    onClick: () => setTermFormData(prev => ({ ...prev, subjectId: subject.id })),
                  })),
                ]}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleTermCalculation}
              disabled={loading || !termFormData.termId}
              className="bg-[#07508F] text-white px-6 py-2 rounded-md hover:bg-[#05406e] disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Calculating...
                </>
              ) : (
                "Calculate Term Results"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Annual Calculation Form */}
      {calculationType === "annual" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-[#07508F] mb-4">Calculate Annual Results</h2>
          <p className="text-sm text-gray-500 mb-6">
            Calculate annual results for students based on their term results across the session.
            Results will be calculated for all students or filtered by your selections below.
          </p>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Session <span className="text-red-500">*</span>
              </label>
              <Dropdown
                label={getSessionName(annualFormData.sessionId) || "Select Session"}
                items={sessions.map((session) => ({
                  label: session.name,
                  onClick: () => setAnnualFormData(prev => ({ ...prev, sessionId: session.id })),
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Class Year (Optional)
              </label>
              <Dropdown
                label={getClassYearName(annualFormData.classYearId) || "All Class Years"}
                items={[
                  { label: "All Class Years", onClick: () => setAnnualFormData(prev => ({ ...prev, classYearId: "" })) },
                  ...classYears.map((year) => ({
                    label: year.className,
                    onClick: () => setAnnualFormData(prev => ({ ...prev, classYearId: year.id })),
                  })),
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Student (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter Student ID"
                value={annualFormData.studentId}
                onChange={(e) => setAnnualFormData(prev => ({ ...prev, studentId: e.target.value }))}
                className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to calculate for all students</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Subject (Optional)
              </label>
              <Dropdown
                label={getSubjectName(annualFormData.subjectId) || "All Subjects"}
                items={[
                  { label: "All Subjects", onClick: () => setAnnualFormData(prev => ({ ...prev, subjectId: "" })) },
                  ...subjects.map((subject) => ({
                    label: subject.name,
                    onClick: () => setAnnualFormData(prev => ({ ...prev, subjectId: subject.id })),
                  })),
                ]}
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Annual results are calculated using:
            </p>
            <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
              <li>Term results from all terms in the selected session</li>
              <li>Annual weight configuration for each term</li>
              <li>Only subjects the student was registered for will be calculated</li>
            </ul>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAnnualCalculation}
              disabled={loading || !annualFormData.sessionId}
              className="bg-[#07508F] text-white px-6 py-2 rounded-md hover:bg-[#05406e] disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Calculating...
                </>
              ) : (
                "Calculate Annual Results"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#07508F]">Term Results</div>
            <p className="text-xs text-gray-500 mt-1">Calculates CA + Exam scores</p>
            <p className="text-xs text-gray-400 mt-2">Uses result configuration weights</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#07508F]">Annual Results</div>
            <p className="text-xs text-gray-500 mt-1">Aggregates term results</p>
            <p className="text-xs text-gray-400 mt-2">Uses term weight configuration</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#07508F]">Positions</div>
            <p className="text-xs text-gray-500 mt-1">Auto-calculated after results</p>
            <p className="text-xs text-gray-400 mt-2">Ranked by performance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculateResult;