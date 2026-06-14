"use client";
import React, { useEffect, useState, useRef } from "react";
import Dropdown from "./DropDown2";
import resultManagementService from "@/Service/ResultService";
import classService from "@/Service/ClassService";
import academicPeriodService from "@/Service/AcademicPeriodService";
import studentService from "@/Service/studentService";
import ResultSheetImageDesign from "./ResultSheet";
import { MdInfo } from "react-icons/md";
import toast from "react-hot-toast";

const ViewStudentResult = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [studentResult, setStudentResult] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [classYears, setClassYears] = useState([]);
  const [students, setStudents] = useState([]);
  const [generate, setGenerate] = useState(false);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const [formData, setFormData] = useState({
    sessionId: "",
    termId: "",
    classYearId: "",
    studentId: "",
  });

  // Filtered terms based on selected session
  const [filteredTerms, setFilteredTerms] = useState([]);
  // Filtered students based on selected class
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    fetchSessions();
    fetchClassYears();
    fetchStudents();
  }, []);

  // Fetch terms when session changes
  useEffect(() => {
    if (formData.sessionId) {
      fetchTermsForSession(formData.sessionId);
    } else {
      setFilteredTerms([]);
    }
  }, [formData.sessionId]);

  // Fetch students when class changes
  useEffect(() => {
    if (formData.classYearId) {
      filterStudentsByClass(formData.classYearId);
    } else {
      setFilteredStudents(students);
    }
  }, [formData.classYearId, students]);

  const fetchSessions = async () => {
    try {
      const result = await academicPeriodService.getAllSessions();
      if (result.success) {
        setSessions(result.data);
      } else {
        setMessage(result.message || "Failed to load sessions");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Failed to load sessions");
      setMessageType("error");
    }
  };

  const fetchTermsForSession = async (sessionId) => {
    try {
      // Get all terms for the selected session (including inactive)
      const result = await academicPeriodService.getAllTerms(sessionId, true, false);
      if (result.success) {
        const sortedTerms = result.data.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
        setFilteredTerms(sortedTerms);
        // Reset term selection when session changes
        setFormData(prev => ({ ...prev, termId: "" }));
      } else {
        setFilteredTerms([]);
      }
    } catch (error) {
      console.error("Failed to fetch terms:", error);
      setFilteredTerms([]);
    }
  };

  const fetchClassYears = async () => {
    try {
      const result = await classService.getAllClassYears();
      if (result.success) {
        setClassYears(result.data);
      } else {
        setMessage(result.message || "Failed to load classes");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Failed to load classes");
      setMessageType("error");
    }
  };

  const fetchStudents = async () => {
    try {
      const result = await studentService.getAllStudents();
      if (result.success) {
        setStudents(result.data);
        setFilteredStudents(result.data);
      } else {
        setMessage(result.message || "Failed to load students");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Failed to load students");
      setMessageType("error");
    }
  };

  const filterStudentsByClass = (classYearId) => {
    const filtered = students.filter(student => student.classYearId === classYearId);
    setFilteredStudents(filtered);
    // Reset student selection when class changes
    setFormData(prev => ({ ...prev, studentId: "" }));
  };

  const fetchStudentResult = async () => {
    if (!formData.sessionId || !formData.termId || !formData.studentId) {
      toast.error("Please select Session, Term, and Student");
      return;
    }

    try {
      setLoading(true);
      // Get student term report
      const result = await resultManagementService.getStudentTermReport(
        formData.studentId,
        formData.termId
      );
      
      if (result.success && result.data) {
        setStudentResult(result.data);
        setGenerate(true);
        toast.success("Result loaded successfully");
      } else {
        setStudentResult(null);
        setGenerate(true);
        toast.error(result.message || "No result found for this student");
      }
    } catch (error) {
      console.error("Failed to fetch result:", error);
      setStudentResult(null);
      setGenerate(true);
      toast.error("Failed to load result");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    if (!formData.sessionId) {
      toast.error("Please select a session");
      return;
    }
    if (!formData.termId) {
      toast.error("Please select a term");
      return;
    }
    if (!formData.studentId) {
      toast.error("Please select a student");
      return;
    }
    fetchStudentResult();
  };

  const getSessionName = (sessionId) => {
    const session = sessions.find((item) => item.id === sessionId);
    return session?.name;
  };

  const getTermName = (termId) => {
    const termItem = filteredTerms.find((item) => item.id === termId);
    return termItem?.name;
  };

  const getClassYearName = (classYearId) => {
    const classItem = classYears.find((item) => item.id === classYearId);
    return classItem?.className;
  };

  const getStudentName = (studentId) => {
    const student = filteredStudents.find((item) => item.userId === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "";
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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

      <div className="mb-3 pb-5 pt-3 bg-white">
        <div className="flex pl-6 pt-3 pr-6 mb-2 justify-between">
          <p className="font-bold text-[#07508F]">Search Result</p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-[#07508F] text-white font-bold text-sm px-3 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Generate"}
          </button>
        </div>
        <div className="pl-6 pr-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Session:</label>
              <Dropdown
                label={getSessionName(formData.sessionId) || "Select Session"}
                items={sessions.map((session) => ({
                  label: session.name,
                  onClick: () =>
                    setFormData({
                      ...formData,
                      sessionId: session.id,
                    }),
                }))}
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Term:</label>
              <Dropdown
                label={getTermName(formData.termId) || "Select Term"}
                items={filteredTerms.map((t) => ({
                  label: t.name,
                  onClick: () =>
                    setFormData({
                      ...formData,
                      termId: t.id,
                    }),
                }))}
              />
              {formData.sessionId && filteredTerms.length === 0 && (
                <p className="text-xs text-yellow-600">No terms found for this session</p>
              )}
            </div>

            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Class:</label>
              <Dropdown
                label={getClassYearName(formData.classYearId) || "Select Class"}
                items={classYears.map((c) => ({
                  label: c.className,
                  onClick: () =>
                    setFormData({
                      ...formData,
                      classYearId: c.id,
                    }),
                }))}
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Student:</label>
              <Dropdown
                label={getStudentName(formData.studentId) || "Select Student"}
                items={filteredStudents.map((s) => ({
                  label: `${s.firstName} ${s.lastName}`,
                  onClick: () =>
                    setFormData({
                      ...formData,
                      studentId: s.userId,
                    }),
                }))}
              />
              {formData.classYearId && filteredStudents.length === 0 && (
                <p className="text-xs text-yellow-600">No students found in this class</p>
              )}
            </div>
          </div>
        </div>
        <hr className={`text-gray-100 ${!generate ? "mt-10 mb-10" : ""}`} />
        
        {generate && (
          <>
            <div className="flex-shrink-0">
              <p className="font-semibold flex justify-center p-3 text-[#333333]">
                Generated Result
              </p>
            </div>
          </>
        )}
        
        {generate ? (
          studentResult ? (
            <div ref={resultRef}>
              <ResultSheetImageDesign 
                resultData={studentResult}
                termName={getTermName(formData.termId)}
                sessionName={getSessionName(formData.sessionId)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mx-10 border border-[#9B9A9A] min-h-52 rounded">
              <div>
                <p className="font-bold flex flex-row items-center gap-1">
                  <span>
                    <MdInfo className="text-red-500" size={23} />
                  </span>
                  No Result Found
                </p>
              </div>
              <div className="mt-2">
                <p className="text-xs text-[#8A8989]">
                  No result data available for the selected criteria.
                </p>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center mx-10 border border-[#9B9A9A] min-h-52 rounded">
            <div>
              <p className="font-bold flex flex-row items-center gap-1">
                <span>
                  <MdInfo className="text-red-500" size={23} />
                </span>
                No Result Found
              </p>
            </div>
            <div className="mt-2">
              <p className="text-xs text-[#8A8989]">
                Kindly fill in details above to view Result.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStudentResult;