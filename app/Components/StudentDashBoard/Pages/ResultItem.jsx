"use client";
import React, { useState, useEffect, useRef } from "react";
import dummysession from "../../../Components/session";
import dummyterm from "../../../Components/Term";
import Layout from "../../../Components/Studentlayout";
import { getUserDetails } from "../../../Service/AuthService";

export default function ResultOverviewPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(dummysession[0]);
  const [term, setTerm] = useState("");
  const sheetRef = useRef(null);

  useEffect(() => {
    const userData = getUserDetails();
    setUser(userData);
    setIsLoading(false);
  }, []);

  // Example result data (adapted for student)
  // const subjects = [
  //   { id: 1, name: "Agricultural Science", ca: 12, midTerm: 12, exam: 66 },
  //   { id: 2, name: "Mathematics", ca: 10, midTerm: 14, exam: 55 },
  //   { id: 3, name: "Creative Arts", ca: 12, midTerm: 10, exam: 54 },
  //   { id: 4, name: "Civic Education", ca: 9, midTerm: 11, exam: 43 },
  //   { id: 5, name: "English Language", ca: 14, midTerm: 9, exam: 56 },
  //   { id: 6, name: "Basic Science", ca: 7, midTerm: 12, exam: 54 },
  //   { id: 7, name: "Data Processing", ca: 13, midTerm: 13, exam: 60 },
  //   { id: 8, name: "Business Studies", ca: 10, midTerm: 13, exam: 51 },
  // ];
  const subjects = [
    {
      subject: "English",
      ca: 15,
      classwork: 15,
      assignment: 15,
      project: 12,
      test: 18,
      totalCA: 14,
      exam: 56,
      mark: 70,
      grade: "A",
      remark: "Excellent",
    },
    {
      subject: "Mathematics",
      ca: 11,
      classwork: 20,
      assignment: 20,
      project: 17.2,
      test: 15,
      totalCA: 35,
      exam: 45,
      mark: 80,
      grade: "A",
      remark: "Excellent",
    },
    {
      subject: "Biology",
      ca: 12,
      classwork: 20,
      assignment: 23,
      project: 21,
      test: 3,
      totalCA: 10,
      exam: 50,
      mark: 60,
      grade: "B",
      remark: "V.Good",
    },
    {
      subject: "Physics",
      ca: 11,
      classwork: 20,
      assignment: 20,
      project: 17.2,
      test: 15,
      totalCA: 35,
      exam: 60,
      mark: 95,
      grade: "A",
      remark: "Excellent",
    },
    {
      subject: "Chemistry",
      ca: 10,
      classwork: 20,
      assignment: 23,
      project: 21,
      test: 3,
      totalCA: 35,
      exam: 45,
      mark: 94,
      grade: "A",
      remark: "Excellent",
    },
    {
      subject: "Economics",
      ca: 11,
      classwork: 20,
      assignment: 20,
      project: 17.2,
      test: 3,
      totalCA: 30,
      exam: 64,
      mark: 72,
      grade: "A",
      remark: "Excellent",
    },
    {
      subject: "Zoology",
      ca: 13,
      classwork: 20,
      assignment: 20,
      project: 17.2,
      test: 15,
      totalCA: 35,
      exam: 45,
      mark: 93,
      grade: "A",
      remark: "Excellent",
    },
    {
      subject: "Computer",
      ca: 9,
      classwork: 20,
      assignment: 20,
      project: 17.2,
      test: 15,
      totalCA: 35,
      exam: 45,
      mark: 53,
      grade: "C",
      remark: "Good",
    },
    {
      subject: "Health Edu.",
      ca: 11,
      classwork: 20,
      assignment: 20,
      project: 17.2,
      test: 15,
      totalCA: 35,
      exam: 45,
      mark: 80,
      grade: "A",
      remark: "Excellent",
    },
    {
      subject: "P.H.E",
      ca: 10,
      classwork: 20,
      assignment: 20,
      project: 17.2,
      test: 15,
      totalCA: 35,
      exam: 45,
      mark: 80,
      grade: "A",
      remark: "Excellent",
    },
    {
      subject: "Anatomy",
      ca: 11,
      classwork: 20,
      assignment: 20,
      project: 17.2,
      test: 15,
      totalCA: 35,
      exam: 45,
      mark: 69,
      grade: "B",
      remark: "V.Good",
    },
    {
      subject: "Agric Science",
      ca: 9,
      classwork: 20,
      assignment: 20,
      project: 17.2,
      test: 3,
      totalCA: 20,
      exam: 20,
      mark: 40,
      grade: "E",
      remark: "Fair",
    },
    {
      subject: "Biotechnology",
      ca: 12,
      classwork: 20,
      assignment: 20,
      project: 17.2,
      test: 15,
      totalCA: 35,
      exam: 45,
      mark: 45,
      grade: "D",
      remark: "Pass",
    },
    {
      subject: "Civic Edu.",
      ca: 12,
      classwork: 20,
      assignment: 20,
      project: 17.2,
      test: 15,
      totalCA: 35,
      exam: 45,
      mark: 50,
      grade: "D",
      remark: "Pass",
    },
    {
      subject: "Yoruba",
      ca: 10,
      classwork: 20,
      assignment: 20,
      project: 17.2,
      test: 15,
      totalCA: 35,
      exam: 45,
      mark: 74,
      grade: "A",
      remark: "Excellent",
    },
  ];

  const computedSubjects = subjects.map((subj) => {
    const total = subj.ca + subj.midTerm + subj.exam;
    return { ...subj, total };
  });

  const totalCount = computedSubjects.length;
  const averageScore =
    computedSubjects.reduce((acc, s) => acc + s.total, 0) / totalCount || 0;
  const targetPoint = 4.57; // example

  // Grading Key (demo)
  const gradingKey = [
    { grade: "A", scorePoint: "5 points", scoreRange: "80 - 100" },
    { grade: "B", scorePoint: "4 points", scoreRange: "70 - 79" },
    { grade: "C", scorePoint: "3 points", scoreRange: "60 - 69" },
    { grade: "D", scorePoint: "2 points", scoreRange: "50 - 59" },
    { grade: "E", scorePoint: "1 points", scoreRange: "45 - 49" },
    { grade: "F", scorePoint: "0 points", scoreRange: "0 - 44" },
  ];

  const handlePrint = () => {
    window.print();
  };

  // For mobile view, compute CA and SUM correctly
  const computedSubjectsMobile = subjects.map((subj) => {
    const ca = subj.ca;
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
                  ASERO, ABEOKUTA OGUN STATE NIGERIA
                </p>
                <p className="font-medium text-[#01427a] text-[16px]">
                  Academic Year: 2024/2025
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
                    Toluwani Somade
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-nomral text-[16px]">Class Year:</span>{" "}
                  <span className="border-b border-gray-400 min-w-[120px] inline-block">
                    SSS3
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-nomral text-[16px]">Class Arm:</span>{" "}
                  <span className="border-b border-gray-400 min-w-[120px] inline-block">
                    Science
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-nomral text-[16px]">Term:</span>{" "}
                  <span className="border-b border-gray-400 min-w-[120px] inline-block">
                    2nd Term
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
                      <td className="border p-1">{row.subject}</td>
                      <td className="border p-1 text-center">
                        {row.classwork}
                      </td>
                      <td className="border p-1 text-center">
                        {row.assignment}
                      </td>
                      <td className="border p-1 text-center">{row.project}</td>
                      <td className="border p-1 text-center">{row.test}</td>
                      <td className="border p-1 text-center">{row.totalCA}</td>
                      <td className="border p-1 text-center">{row.exam}</td>
                      <td className="border p-1 text-center">{row.mark}</td>
                      <td className="border p-1 text-center">{row.grade}</td>
                      <td className="border p-1 text-center">{row.remark}</td>
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
                    Miss Opeyemi
                  </span>
                </div>
                <div className="mb-4 flex items-center">
                  <span className="font-semibold min-w-[150px]">
                    Teacher's Comment:
                  </span>
                  <span className="border-b border-gray-400 flex-1 ml-2">
                    Wonderful performance, keep it up.
                  </span>
                </div>
                <div className="mb-4 flex items-center space-x-2">
                  <span className="font-semibold min-w-[150px]">
                    Teacher's Signature:
                  </span>
                  <span className="border-b border-gray-400 min-w-[80px] ml-2">
                    {" "}
                    Opeyemi
                  </span>
                  <span className="font-semibold ml-6">Date:</span>
                  <span className="border-b border-gray-400 min-w-[80px] ml-2">
                    {" "}
                    26th May, 2025
                  </span>
                </div>
                <div className="mb-4 flex items-center">
                  <span className="font-semibold min-w-[150px]">
                    Principal's Comment:
                  </span>
                  <span className="border-b border-gray-400 flex-1 ml-2">
                    Wonderful performance, keep it up.
                  </span>
                </div>
                <div className="mb-4 flex items-center space-x-2">
                  <span className="font-semibold min-w-[150px]">
                    Principal's Signature:
                  </span>
                  <span className="border-b border-gray-400 min-w-[80px] ml-2">
                    Ibidapo Dada
                  </span>
                  <span className="font-semibold ml-6">Date:</span>
                  <span className="border-b border-gray-400 min-w-[80px] ml-2">
                    26th May, 2025
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
                        <th className="border border-black font-semibold px-1 py-1 w-16">
                          A
                        </th>
                        <th className="border border-black font-semibold px-1 py-1 w-16">
                          B
                        </th>
                        <th className="border border-black font-semibold px-1 py-1 w-16">
                          C
                        </th>
                        <th className="border border-black font-semibold px-1 py-1 w-16">
                          D
                        </th>
                        <th className="border border-black font-semibold px-1 py-1 w-16">
                          E
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="bg-[#0071c1] text-white text-sm border border-black font-semibold px-1 py-1">
                          Mark Range
                        </td>
                        <td className="border border-black px-1 py-1">
                          70-100
                        </td>
                        <td className="border border-black px-1 py-1">69-61</td>
                        <td className="border border-black px-1 py-1">60-51</td>
                        <td className="border border-black px-1 py-1">50-41</td>
                        <td className="border border-black px-1 py-1">40-0</td>
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
          <img src="/ResultItem.png" alt="Result Logo" className="w-40 h-32 mx-auto mb-2" />

            <span className="block text-sm text-black font-semibold mb-1">
              “Excellent work. More effort<br />is needed to achieve the desired goals”
            </span>
            <span className="block text-xs text-gray-700 mb-2">
              Mr Adesuwa Irinola, Principal
            </span>
          </div>
          {/* Table */}
          <div className="w-full overflow-x-auto mb-4">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-red-500 text-white rounded-t-lg">
                  <th className="py-2 px-2 font-semibold rounded-tl-lg">Subject</th>
                  <th className="py-2 px-2 font-semibold">CA/15</th>
                  <th className="py-2 px-2 font-semibold">TEST/15</th>
                  <th className="py-2 px-2 font-semibold">EXAM/70</th>
                  <th className="py-2 px-2 font-semibold rounded-tr-lg">SUM/100</th>
                </tr>
              </thead>
              <tbody>
                {computedSubjectsMobile.map((subj) => (
                  <tr key={subj.subject} className="border-b last:border-b-0">
                    <td className="py-2 px-2 whitespace-pre-line text-gray-900">{subj.subject}</td>
                    <td className="py-2 px-2 text-center">{subj.ca}</td>
                    <td className="py-2 px-2 text-center">{subj.test}</td>
                    <td className="py-2 px-2 text-center">{subj.exam}</td>
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
