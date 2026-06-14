"use client";
import React, { useRef, useState, useEffect } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import authService from "@/Service/AuthService";
import resultManagementService from "@/Service/ResultService";

const ResultSheetImageDesign = ({ resultData, termName, sessionName }) => {
  const sheetRef = useRef(null);
  const [schoolInfo, setSchoolInfo] = useState({
    schoolName: "ABC Int'l Secondary School",
    schoolLogo: "/AlgorithmX.png",
    schoolAddress: "Somewhere"
  });
  const [gradingSystem, setGradingSystem] = useState([]);

  useEffect(() => {
    const userDetails = authService.getUserDetails();
    if (userDetails) {
      setSchoolInfo({
        schoolName: userDetails.schoolName || "Foursquare Int'l Secondary School",
        schoolLogo: userDetails.schoolLogo || "/whitelogo.png",
        schoolAddress: userDetails.schoolAddress || "ASERO, ABEOKUTA OGUN STATE NIGERIA"
      });
    }
    
    fetchGradingSystem();
  }, []);

  const fetchGradingSystem = async () => {
    try {
      const result = await resultManagementService.getAllGrades();
      if (result.success && result.data.length > 0) {
        const sortedGrades = result.data.sort((a, b) => a.minScore - b.minScore);
        setGradingSystem(sortedGrades);
      } else {
        setGradingSystem([
          { gradeName: "A", minScore: 70, maxScore: 100, remark: "Excellent" },
          { gradeName: "B", minScore: 60, maxScore: 69, remark: "Very Good" },
          { gradeName: "C", minScore: 50, maxScore: 59, remark: "Good" },
          { gradeName: "D", minScore: 45, maxScore: 49, remark: "Fair" },
          { gradeName: "E", minScore: 40, maxScore: 44, remark: "Pass" },
          { gradeName: "F", minScore: 0, maxScore: 39, remark: "Fail" },
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch grading system:", error);
    }
  };

  const handlePrint = () => {
    if (!sheetRef.current) return;

    const printContents = sheetRef.current.innerHTML;
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          return "";
        }
      })
      .join("\n");

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      alert("Popup blocked. Please allow popups for this site.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Student Result</title>
          <style>
            ${styles}
          </style>
          <style>
            body {
              margin: 0;
              padding: 10px;
              font-family: Arial, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
              .no-break {
                break-inside: avoid;
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div>${printContents}</div>
          <script>
            window.onload = function () {
              window.print();
              window.close();
            };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const studentInfo = resultData || {};
  const subjects = studentInfo.subjectResults || [];
  
  const totalScore = studentInfo.totalScore || 0;
  const averagePercentage = studentInfo.averagePercentage || 0;
  const totalPosition = studentInfo.totalPosition || 0;

  const getGradeFromScore = (percentage) => {
    if (!gradingSystem.length) return { grade: "N/A", remark: "N/A" };
    const grade = gradingSystem.find(g => percentage >= g.minScore && percentage <= g.maxScore);
    return {
      grade: grade?.gradeName || "F",
      remark: grade?.remark || "Fail"
    };
  };

  const getOverallGrade = (percentage) => {
    const gradeInfo = getGradeFromScore(percentage);
    return gradeInfo.grade;
  };

  const getOverallRemark = (percentage) => {
    const gradeInfo = getGradeFromScore(percentage);
    return gradeInfo.remark;
  };

  const behavioralComments = studentInfo.behavioralComments || [];
  
  let classTeacherName = studentInfo.generalCommentTeacher || "Class Teacher";
  if ((classTeacherName === "Unknown" || classTeacherName === "Class Teacher") && behavioralComments.length > 0 && behavioralComments[0].teacherName) {
    classTeacherName = behavioralComments[0].teacherName;
  }
  
  const classTeacherComment = studentInfo.generalComment || "No comment available";
  const overallRemark = studentInfo.overallRemark || getOverallRemark(averagePercentage);

  return (
    <>
      <div className="flex justify-end pr-10 mb-10">
        <button
          onClick={handlePrint}
          className="bg-[#07508F] flex items-center gap-1 text-white text-sm px-2 py-2 rounded-sm cursor-pointer hover:opacity-90"
        >
          Download as PDF
          <span>
            <MdOutlineFileDownload size={20} />
          </span>
        </button>
      </div>
      <div className="flex justify-center print:p-6">
        <div>
          <div className="bg-white p-1 w-full lg:max-w-4xl sm:max-w-lg border-2 border-dashed border-[#01427a] print:p-6">
            <div className="bg-white border-2 border-dashed border-[#01427a] overflow-y-auto shadow-lg p-2 no-scrollbar print:border-2 print:shadow-none print:max-h-[95vh] print:p-2">
              <div ref={sheetRef} className="p-2 print:p-2">
                {/* Header */}
                <div className="flex items-center justify-between mb-2 border border-black p-2">
                  <img
                    src={schoolInfo.schoolLogo}
                    alt="School Logo"
                    className="lg:w-28 lg:h-28 w-18 h-18"
                    onError={(e) => { e.target.src = "/whitelogo.png"; }}
                  />
                  <div className="flex-1 text-center">
                    <h1 className="font-bold lg:text-[23px] text-sm text-[#01427a] uppercase">
                      {schoolInfo.schoolName}
                    </h1>
                    <p className="font-bold text-[#01427a] lg:text-[16px] text-xs">
                      {schoolInfo.schoolAddress}
                    </p>
                    <p className="font-medium text-[#01427a] lg:text-[14px] text-xs">
                      Academic Session: {sessionName || "2024/2025"}
                    </p>
                  </div>
                  <div className="w-20 h-20" />
                </div>

                {/* Student Info */}
                <div className="flex flex-row justify-between gap-4 mb-2 text-sm">
                  <div>
                    <div className="mb-2">
                      <span className="font-normal text-[14px]">
                        Student's Name:
                      </span>{" "}
                      <span className="border-b border-gray-400 min-w-[150px] inline-block px-2">
                        {studentInfo.studentName || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-normal text-[14px]">
                        Admission No:
                      </span>{" "}
                      <span className="border-b border-gray-400 min-w-[120px] inline-block px-2">
                        {studentInfo.admissionNumber || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">
                      <span className="font-normal text-[14px]">
                        Class:
                      </span>{" "}
                      <span className="border-b border-gray-400 min-w-[100px] inline-block px-2">
                        {studentInfo.classArmName || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-normal text-[14px]">Term:</span>{" "}
                      <span className="border-b border-gray-400 min-w-[100px] inline-block px-2">
                        {termName || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Assessment Table */}
                <div className="border border-gray-400 rounded mt-2 mb-4 overflow-x-auto">
                  <div className="text-center font-bold py-1 bg-gray-100">
                    ACADEMIC PERFORMANCE REPORT
                  </div>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border p-1">S/N</th>
                        <th className="border p-1">SUBJECTS</th>
                        <th className="border p-1">CA (%)</th>
                        <th className="border p-1">Exam (%)</th>
                        <th className="border p-1">Total (%)</th>
                        <th className="border p-1">Grade</th>
                        <th className="border p-1">Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="border p-4 text-center text-gray-500">
                            No subject results available
                          </td>
                        </tr>
                      ) : (
                        subjects.map((subject, index) => {
                          const percentage = subject.percentage || subject.finalScore || 0;
                          const gradeInfo = getGradeFromScore(percentage);
                          
                          return (
                            <tr key={subject.subjectId || index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                              <td className="border p-1 text-center">{index + 1}</td>
                              <td className="border p-1">{subject.subjectName}</td>
                              <td className="border p-1 text-center">
                                {subject.caPercentage?.toFixed(1) || subject.totalCAScore || "-"}
                              </td>
                              <td className="border p-1 text-center">
                                {subject.examPercentage?.toFixed(1) || subject.totalExamScore || "-"}
                              </td>
                              <td className="border p-1 text-center font-semibold">
                                {percentage.toFixed(1)}%
                              </td>
                              <td className="border p-1 text-center">{subject.grade || gradeInfo.grade}</td>
                              <td className="border p-1 text-center">{subject.remark || gradeInfo.remark}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100 font-semibold">
                        <td colSpan="4" className="border p-1 text-right">Total Average:</td>
                        <td className="border p-1 text-center">{averagePercentage?.toFixed(1) || totalScore?.toFixed(1) || "-"}%</td>
                        <td className="border p-1 text-center">{getOverallGrade(averagePercentage)}</td>
                        <td className="border p-1 text-center">{getOverallRemark(averagePercentage)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Behavioral Comments Section */}
                {behavioralComments.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-md mb-2">Behavioral Assessment</h3>
                    <table className="w-full text-sm border-collapse border border-gray-400">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-1">S/N</th>
                          <th className="border p-1">Topic</th>
                          <th className="border p-1">Rating</th>
                          <th className="border p-1">Teacher's Comment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {behavioralComments.map((comment, index) => (
                          <tr key={comment.id || index}>
                            <td className="border p-1 text-center">{index + 1}</td>
                            <td className="border p-1">{comment.topicName}</td>
                            <td className="border p-1 text-center">{comment.ratingName}</td>
                            <td className="border p-1">{comment.comment || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Comments and Signatures */}
                <div className="flex flex-row justify-between items-start w-full mt-4 gap-6">
                  <div className="flex-1 text-sm">
                    <div className="mb-3">
                      <span className="font-semibold">Class Teacher's Comment:</span>
                      <div className="border-b border-gray-400 mt-1 p-1 min-h-[40px]">
                        {classTeacherComment}
                      </div>
                    </div>
                    <div className="mb-3 flex items-center">
                      <span className="font-semibold w-32">Class Teacher's Name:</span>
                      <span className="border-b border-gray-400 flex-1 ml-2 px-2">
                        {classTeacherName}
                      </span>
                    </div>
                    <div className="mb-3 flex items-center">
                      <span className="font-semibold w-32">Class Teacher's Signature:</span>
                      <span className="border-b border-gray-400 w-32 ml-2">&nbsp;</span>
                      <span className="font-semibold ml-6">Date:</span>
                      <span className="border-b border-gray-400 w-28 ml-2">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mb-3 mt-4">
                      <span className="font-semibold">Overall Remark:</span>
                      <div className="border-b border-gray-400 mt-1 p-1 min-h-[40px]">
                        {overallRemark}
                      </div>
                    </div>
                   
                    <div className="mb-3 flex items-center">
                      <span className="font-semibold w-32">Principal's Signature:</span>
                      <span className="border-b border-gray-400 w-32 ml-2">&nbsp;</span>
                      <span className="font-semibold ml-6">Date:</span>
                      <span className="border-b border-gray-400 w-28 ml-2">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Right: Grading System Table */}
                  <div className="w-[35%] no-scrollbar">
                    <h3 className="text-md font-semibold text-center mb-2">Grading System</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-black text-sm">
                        <thead>
                          <tr>
                            <th className="bg-[#0071c1] text-white border border-black font-semibold px-2 py-1">
                              Grade
                            </th>
                            <th className="bg-[#0071c1] text-white border border-black font-semibold px-2 py-1">
                              Mark Range
                            </th>
                            <th className="bg-[#0071c1] text-white border border-black font-semibold px-2 py-1">
                              Remark
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {gradingSystem.map((grade, index) => (
                            <tr key={index}>
                              <td className="border border-black px-2 py-1 text-center font-semibold">
                                {grade.gradeName}
                              </td>
                              <td className="border border-black px-2 py-1 text-center">
                                {grade.minScore} - {grade.maxScore}
                              </td>
                              <td className="border border-black px-2 py-1">
                                {grade.remark}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-sm font-semibold">
                        Total Average: {averagePercentage?.toFixed(1) || "0"}%
                      </p>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultSheetImageDesign;