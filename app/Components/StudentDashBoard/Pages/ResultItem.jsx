"use client";
import React, { useState, useEffect } from "react";
import dummysession from "../../../Components/session";
import dummyterm from "../../../Components/Term";
import { useUser } from "../context/UserProvider";
import Layout from "../../../Components/Studentlayout";

export default function ResultOverviewPage() {
  // Example data for the report sheet
  const studentInfo = {
    name: "Ife Babalola Adesina",
    studentId: "001",
    class: "JSS1",
    gradeYear: "7",
    session: "2023/2024",
    age: 14,
  };

  const [session, setSession] = useState(dummysession[0]);
  const [term, setTerm] = useState("");
  const { user, isLoading } = useUser();
  
    

  // Example result data
  const subjects = [
    { id: 1, name: "Agricultural Science", ca: 12, midTerm: 12, exam: 66 },
    { id: 2, name: "Mathematics", ca: 10, midTerm: 14, exam: 55 },
    { id: 3, name: "Creative Arts", ca: 12, midTerm: 10, exam: 54 },
    { id: 4, name: "Physical Education", ca: 9, midTerm: 11, exam: 43 },
    { id: 5, name: "English Language", ca: 14, midTerm: 9, exam: 56 },
    { id: 6, name: "French", ca: 7, midTerm: 12, exam: 54 },
    { id: 7, name: "Business Studies", ca: 13, midTerm: 13, exam: 60 },
    { id: 8, name: "Data Processing", ca: 10, midTerm: 13, exam: 51 },
  ];

  // Example function to calculate total, average, etc.
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

  const handleDownloadPDF = () => {
    if (downloadPdf) {
      downloadPdf(
        ".thirdCard",
        `${user.username}-Result-${session}-${term}.pdf`
      );
    } else {
      console.error("downloadPdf not loaded yet.");
    }
  };
  const [downloadPdf, setDownloadPdf] = useState(null);
  
  useEffect(() => {
      import("../../Print/DownloadasPdf").then((module) => {
        setDownloadPdf(() => module.default);
      });
    }, []);

    if (isLoading) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="w-12 h-12 border-4 border-blue-900 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      );
    }

  return (
    <Layout>
      <div className="min-h-screen p-4 flex flex-col items-center bg-[#e2e2e2]">
        <div className="w-full max-w-5xl bg-white rounded-md shadow p-6 md:p-8 mb-4">
          <h1 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
            Result Overview
          </h1>
        </div>
        <div className="w-full max-w-5xl bg-white rounded-md shadow p-6 md:p-8 thirdCard">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 mb-8 justify-between">
            <div className="flex items-center gap-1">
              <label className="text-sm">Select Session :</label>
              <select
                className="bg-gray-100 rounded-lg px-2 py-1 text-sm"
                value={session}
                onChange={(e) => setSession(e.target.value)}
              >
                {dummysession.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm">Select Term :</label>
              <select
                className="bg-gray-100 rounded-lg px-2 py-1 text-sm"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              >
                {dummyterm.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleDownloadPDF}
              className="bg-blue-700 text-white rounded-lg px-4 py-2 text-sm hover:bg-red-500 transition-colors duration-300"
            >
              Print
            </button>
          </div>

          {/* School Name / Student Info */}
          <div className="text-center mb-6">
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-1">
              Foursquare International Secondary School
            </h2>
            <p className="text-sm text-gray-600 font-semibold">
              Name: {studentInfo.name} &nbsp;|&nbsp; Student ID:{" "}
              {studentInfo.studentId} &nbsp;|&nbsp; Class: {studentInfo.class}{" "}
              &nbsp;|&nbsp; Grade Year: {studentInfo.gradeYear} &nbsp;|&nbsp;
              Session: {studentInfo.session} &nbsp;|&nbsp; Age:{" "}
              {studentInfo.age}
            </p>
          </div>

          {/* Report Sheet Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left -collapse">
              <thead className="bg-red-500 text-white">
                <tr>
                  <th className="py-2 px-4 font-semibold">S/N</th>
                  <th className="py-2 px-4 font-semibold">Subject</th>
                  <th className="py-2 px-4 font-semibold">
                    Continous
                    <br />
                    Assessment /15
                  </th>
                  <th className="py-2 px-4 font-semibold">Mid-term test /10</th>
                  <th className="py-2 px-4 font-semibold">Exam /70</th>
                  <th className="py-2 px-4 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {computedSubjects.map((subj, index) => (
                  <tr key={subj.id}>
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{subj.name}</td>
                    <td className="py-2 px-4">{subj.ca}</td>
                    <td className="py-2 px-4">{subj.midTerm}</td>
                    <td className="py-2 px-4">{subj.exam}</td>
                    <td className="py-2 px-4  text-gray-800">
                      {subj.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-col md:items-center md:justify-between mb-6 float-right">
            <div className="mb-4 flex flex-cols-2 lg:flex-row gap-4">
              <p className="text-sm text-gray-700">
                Average:{" "}
                <span className="font-semibold bg-[#F2645C] p-1">
                  {averageScore.toFixed(2)}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                Total Point:{" "}
                <span className="font-semibold bg-[#F2645C] p-1">910.12</span>
              </p>
              <p className="text-sm text-gray-700">
                Target Point:{" "}
                <span className="font-semibold bg-[#F2645C] p-1">
                  {targetPoint}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                GPA:{" "}
                <span className="font-semibold bg-[#F2645C] p-1">4.23</span>
              </p>
              </div>
              
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-white p-2 bg-[#F2645C] font-semibold">
                    Principal's Comment:{" "}
                  </p>
                  <span className="text-sm">
                    Excellent work. More effort is needed to reach the desired
                    goal
                  </span>
                </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-white rounded w-full">
              <h3 className="flex items-center justify-center font-bold mb-2 text-white bg-[#F94144] p-2">
                Grading Key
              </h3>
              <table className="w-full text-left text-sm">
                <tbody>
                  {gradingKey.map((g) => (
                    <tr
                      key={g.grade}
                      className="flex items-center justify-between"
                    >
                      <td className="py-1 px-2">{g.grade}</td>
                      <td className="py-1 px-2">{g.scorePoint}</td>
                      <td className="py-1 px-2">{g.scoreRange}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
