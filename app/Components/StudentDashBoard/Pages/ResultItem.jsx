"use client";
import React, { useState, useEffect, useRef } from "react";
import Layout from "../../../Components/Studentlayout";
import { getUserDetails } from "../../../Service/AuthService";
import { getAcademicYears, getTerms } from "../../../Service/schoolConfig";
import {
  getStudentResult,
  getStudentSubjects,
  getStudentGrades,
  getGrading,
} from "../../../Service/ResultService";
import toast from "react-hot-toast";

export default function ResultOverviewPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAcademicYear, setCurrentAcademicYear] = useState(null);
  const [currentTerm, setCurrentTerm] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [studentResult, setStudentResult] = useState(null);
  const [gradingSystem, setGradingSystem] = useState([]);
  const sheetRef = useRef(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        const userData = getUserDetails();
        setUser(userData);

        // Fetch academic year and term data
        try {
          const [academicYearsResult, termsResult, gradingResult] =
            await Promise.all([getAcademicYears(), getTerms(), getGrading()]);

          if (academicYearsResult?.data) {
            const activeYear =
              academicYearsResult.data.find((year) => year.status === true) ||
              academicYearsResult.data[0];
            setCurrentAcademicYear(activeYear);
          }

          if (termsResult?.data) {
            const activeTerm =
              termsResult.data.find((term) => term.status === true) ||
              termsResult.data[0];
            setCurrentTerm(activeTerm);
          }

          if (gradingResult?.data) {
            setGradingSystem(gradingResult.data);
          }

          // Fetch student result data if user is available
          if (userData?.student?.id && currentAcademicYear && currentTerm) {
            await fetchStudentData(
              userData.student.id,
              currentAcademicYear.year_id,
              currentTerm.term_id
            );
          }
        } catch (err) {
          console.error("Error fetching academic data:", err);
          toast.error("Failed to load academic data");
        }
      } catch (error) {
        console.error("Error initializing result data:", error);
        toast.error("Failed to initialize result data");
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Fetch student result data when academic year/term changes
  useEffect(() => {
    if (user?.student?.id && currentAcademicYear && currentTerm) {
      fetchStudentData(
        user.student.id,
        currentAcademicYear.year_id,
        currentTerm.term_id
      );
    }
  }, [user, currentAcademicYear, currentTerm]);

  const fetchStudentData = async (studentId, academicYearId, termId) => {
    try {
      const [resultResponse, subjectsResponse] = await Promise.all([
        getStudentResult(studentId, academicYearId, termId),
        getStudentSubjects(studentId, academicYearId, termId),
      ]);

      if (resultResponse?.data) {
        setStudentResult(resultResponse.data);
      }

      if (subjectsResponse?.data) {
        setSubjects(subjectsResponse.data);
      } else {
        setSubjects([]);
        toast.error("No result data found for the current term");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to load student result data");
      setSubjects([]);
      setStudentResult(null);
    }
  };

  // Compute subjects with totals
  const computedSubjects = subjects.map((subj) => {
    const total = (subj.ca || 0) + (subj.test || 0) + (subj.exam || 0);
    return { ...subj, total };
  });

  const totalCount = computedSubjects.length;
  const averageScore =
    computedSubjects.reduce((acc, s) => acc + s.total, 0) / totalCount || 0;

  // Use grading system from API or fallback to default
  const gradingKey =
    gradingSystem.length > 0
      ? gradingSystem
      : [
          {
            grade: "A",
            scorePoint: "5 points",
            scoreRange: "80 - 100",
            min_score: 80,
            max_score: 100,
          },
          {
            grade: "B",
            scorePoint: "4 points",
            scoreRange: "70 - 79",
            min_score: 70,
            max_score: 79,
          },
          {
            grade: "C",
            scorePoint: "3 points",
            scoreRange: "60 - 69",
            min_score: 60,
            max_score: 69,
          },
          {
            grade: "D",
            scorePoint: "2 points",
            scoreRange: "50 - 59",
            min_score: 50,
            max_score: 59,
          },
          {
            grade: "E",
            scorePoint: "1 points",
            scoreRange: "45 - 49",
            min_score: 45,
            max_score: 49,
          },
          {
            grade: "F",
            scorePoint: "0 points",
            scoreRange: "0 - 44",
            min_score: 0,
            max_score: 44,
          },
        ];

  const handlePrint = () => {
    window.print();
  };

  // For mobile view, compute CA and SUM correctly
  const computedSubjectsMobile = subjects.map((subj) => {
    const ca = subj.ca || 0;
    const sum = (subj.ca || 0) + (subj.test || 0) + (subj.exam || 0);
    return { ...subj, ca, sum };
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!subjects || subjects.length === 0) {
    return (
      <Layout>
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="mb-4">
                <div className="text-6xl text-gray-300 mb-4">📄</div>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">
                  No Result Available
                </h2>
                <p className="text-gray-500">
                  No result data found for {currentTerm?.name || "current term"}{" "}
                  in {currentAcademicYear?.name || "current academic year"}.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Please contact your school administrator if you believe this
                  is an error.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Desktop View */}
      <div className="hidden md:flex min-h-screen p-4 flex-col items-center bg-[#e2e2e2]">
        <div className="w-full max-w-5xl bg-white rounded-md shadow p-6 md:p-8 mb-4">
          <h1 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
            Result Overview
          </h1>
        </div>
        <div ref={sheetRef} className="print:p-2">
          <div className="w-full bg-white rounded-md shadow p-6 md:p-8 border-2 border-dashed border-[#01427a] print:border-2 print:shadow-none print:max-h-[95vh] print:p-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-2 border border-black p-2">
              <img src="/logo.svg" alt="School Logo" className="w-28 h-28" />
              <div className="flex-1 text-center">
                <h1 className="font-bold text-[23px] text-[#01427a] uppercase">
                  {user?.student?.school || "School Name"}
                </h1>
                <p className="font-bold text-[#01427a] text-[23px]">
                  {user?.student?.school?.location || "Location"}
                </p>
                <p className="font-medium text-[#01427a] text-[16px]">
                  Academic Year:{" "}
                  {currentAcademicYear?.name || "Current Academic Session"}
                </p>
              </div>
              <div className="w-20 h-20" />
            </div>
            {/* Student Info */}
            <div className="flex flex-row justify-between gap-4 mb-2 text-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-nomral text-[16px]">
                    Student's Name:
                  </span>{" "}
                  <span className="border-b border-gray-400 min-w-[120px] inline-block">
                    {user?.student?.first_name}{" "}
                    {user?.student?.last_name || "Student Name"}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-nomral text-[16px]">Class Year:</span>{" "}
                  <span className="border-b border-gray-400 min-w-[120px] inline-block">
                    {user?.student?.class_year || "N/A"}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-nomral text-[16px]">Class Arm:</span>{" "}
                  <span className="border-b border-gray-400 min-w-[120px] inline-block">
                    {user?.student?.class_arm || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-nomral text-[16px]">Term:</span>{" "}
                  <span className="border-b border-gray-400 min-w-[120px] inline-block">
                    {currentTerm?.name || "Current Term"}
                  </span>
                </div>
              </div>
            </div>

            {/* Assessment Table */}
            <div className="border border-gray-400 rounded mt-2 mb-4 overflow-x-auto">
              <div className="text-center font-bold py-1">
                ASSESSMENT CATEGORY
              </div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-black text-md">
                    <th className="border p-1">SUBJECTS</th>
                    <th className="border p-1">
                      Classwork <br /> (30)
                    </th>
                    <th className="border p-1">
                      Assignment <br /> (30)
                    </th>
                    <th className="border p-1">
                      Project <br /> (30)
                    </th>
                    <th className="border p-1">
                      Test <br /> (30)
                    </th>
                    <th className="border p-1">
                      Total C.A <br /> (30)
                    </th>
                    <th className="border p-1">
                      Exam <br /> (70)
                    </th>
                    <th className="border p-1">
                      Mark Obtained <br /> (100)
                    </th>
                    <th className="border p-1">Grade</th>
                    <th className="border p-1">Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((row, i) => (
                    <tr key={i} className={i % 2 ? "bg-gray-50" : ""}>
                      <td className="border p-1">
                        {row.subject_name || row.subject || "N/A"}
                      </td>
                      <td className="border p-1 text-center">
                        {row.classwork || row.ca_1 || 0}
                      </td>
                      <td className="border p-1 text-center">
                        {row.assignment || row.ca_2 || 0}
                      </td>
                      <td className="border p-1 text-center">
                        {row.project || row.ca_3 || 0}
                      </td>
                      <td className="border p-1 text-center">
                        {row.test || row.ca_4 || 0}
                      </td>
                      <td className="border p-1 text-center">
                        {row.totalCA || row.total_ca || row.ca || 0}
                      </td>
                      <td className="border p-1 text-center">
                        {row.exam || 0}
                      </td>
                      <td className="border p-1 text-center">
                        {row.mark ||
                          row.total_score ||
                          (row.ca || 0) + (row.test || 0) + (row.exam || 0)}
                      </td>
                      <td className="border p-1 text-center">
                        {row.grade || "N/A"}
                      </td>
                      <td className="border p-1 text-center">
                        {row.remark || row.remarks || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Comments and Grading */}
            <div className="flex flex-row justify-between items-start w-full mt-8 gap-8">
              <div className="flex-1 text-sm w-[55%]">
                <div className="mb-4 flex items-center">
                  <span className="font-semibold min-w-[150px]">
                    Teacher's Name:
                  </span>
                  <span className="border-b border-gray-400 flex-1 ml-2">
                    {" "}
                    {studentResult?.teacher_name || "N/A"}
                  </span>
                </div>
                <div className="mb-4 flex items-center">
                  <span className="font-semibold min-w-[150px]">
                    Teacher's Comment:
                  </span>
                  <span className="border-b border-gray-400 flex-1 ml-2">
                    {studentResult?.teacher_comment || "No comment available"}
                  </span>
                </div>
                <div className="mb-4 flex items-center space-x-2">
                  <span className="font-semibold min-w-[150px]">
                    Teacher's Signature:
                  </span>
                  <span className="border-b border-gray-400 min-w-[80px] ml-2">
                    {" "}
                    {studentResult?.teacher_signature || "N/A"}
                  </span>
                  <span className="font-semibold ml-6">Date:</span>
                  <span className="border-b border-gray-400 min-w-[80px] ml-2">
                    {" "}
                    {studentResult?.date_signed ||
                      new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="mb-4 flex items-center">
                  <span className="font-semibold min-w-[150px]">
                    Principal's Comment:
                  </span>
                  <span className="border-b border-gray-400 flex-1 ml-2">
                    {studentResult?.principal_comment ||
                      "Excellent work. More effort is needed to achieve the desired goals"}
                  </span>
                </div>
                <div className="mb-4 flex items-center space-x-2">
                  <span className="font-semibold min-w-[150px]">
                    Principal's Signature:
                  </span>
                  <span className="border-b border-gray-400 min-w-[80px] ml-2">
                    {studentResult?.principal_signature || "N/A"}
                  </span>
                  <span className="font-semibold ml-6">Date:</span>
                  <span className="border-b border-gray-400 min-w-[80px] ml-2">
                    {studentResult?.principal_date_signed ||
                      new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Right: Grading System Table */}
              <div className="w-[45%] no-scrollbar">
                <h2 className="text-lg font-semibold text-center mb-2">
                  Grading System
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-black">
                    <thead>
                      <tr>
                        <th className="bg-[#0071c1] text-white border border-black font-semibold px-1 py-1">
                          Grade
                        </th>
                        {gradingKey.map((gradeItem, index) => (
                          <th
                            key={index}
                            className="border border-black font-semibold px-1 py-1 w-16"
                          >
                            {gradeItem.grade}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="bg-[#0071c1] text-white text-sm border border-black font-semibold px-1 py-1">
                          Mark Range
                        </td>
                        {gradingKey.map((gradeItem, index) => (
                          <td
                            key={index}
                            className="border border-black px-1 py-1"
                          >
                            {gradeItem.scoreRange ||
                              `${gradeItem.min_score}-${gradeItem.max_score}`}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-8 print:hidden">
              <button
                onClick={handlePrint}
                className="bg-blue-900 text-white px-4 py-2 rounded shadow hover:bg-green-800 z-50 cursor-pointer"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile View */}
      <div className="md:hidden min-h-screen flex flex-col items-center bg-[#e2e2e2] p-2">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
          {/* Top image */}
          {/* Principal's comment */}
          <div className="w-full text-center mb-2">
            <img
              src="/ResultItem.png"
              alt="Result Logo"
              className="w-40 h-32 mx-auto mb-2"
            />

            <span className="block text-sm text-black font-semibold mb-1">
              {studentResult?.principal_comment ||
                "Excellent work. More effort is needed to achieve the desired goals"}
            </span>
            <span className="block text-xs text-gray-700 mb-2">
              {studentResult?.principal_signature || "N/A"}
            </span>
          </div>
          {/* Table */}
          <div className="w-full overflow-x-auto mb-4">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-red-500 text-white rounded-t-lg">
                  <th className="py-2 px-2 font-semibold rounded-tl-lg">
                    Subject
                  </th>
                  <th className="py-2 px-2 font-semibold">CA/15</th>
                  <th className="py-2 px-2 font-semibold">TEST/15</th>
                  <th className="py-2 px-2 font-semibold">EXAM/70</th>
                  <th className="py-2 px-2 font-semibold rounded-tr-lg">
                    SUM/100
                  </th>
                </tr>
              </thead>
              <tbody>
                {computedSubjectsMobile.map((subj, index) => (
                  <tr
                    key={subj.subject_name || subj.subject || index}
                    className="border-b last:border-b-0"
                  >
                    <td className="py-2 px-2 whitespace-pre-line text-gray-900">
                      {subj.subject_name || subj.subject || "N/A"}
                    </td>
                    <td className="py-2 px-2 text-center">{subj.ca || 0}</td>
                    <td className="py-2 px-2 text-center">{subj.test || 0}</td>
                    <td className="py-2 px-2 text-center">{subj.exam || 0}</td>
                    <td className="py-2 px-2 text-center">{subj.sum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Download button */}
          <button
            onClick={handlePrint}
            className="w-full mt-2 bg-blue-900 text-white py-2 rounded-lg font-semibold"
          >
            Download PDF
          </button>
        </div>
      </div>
    </Layout>
  );
}
