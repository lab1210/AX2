"use client";
import React, { useRef } from "react";
import { MdOutlineFileDownload } from "react-icons/md";

const ResultSheetImageDesign = () => {
  const sheetRef = useRef(null);

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
        </style>
      </head>
      <body>
        <div>${printContents}</div>
        <script>
          window.onload = function () {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `);
    printWindow.document.close();
  };

  const subjects = [
    {
      subject: "English",
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

  return (
    <>
      <div className="flex justify-end pr-10 mb-10">
        <button
          onClick={handlePrint}
          className="bg-[#07508F] flex items-center gap-1 text-white  text-sm px-2 py-2 rounded-sm cursor-pointer hover:opacity-90"
        >
          Download as PDF
          <span>
            <MdOutlineFileDownload size={20} />
          </span>
        </button>
      </div>
      <div className="flex justify-center print:p-6">
        <div>
          <div className="bg-white p-1   w-full lg:max-w-3xl sm:max-w-lg border-2 border-dashed border-[#01427a] print:p-6">
            <div className="bg-white border-2 border-dashed border-[#01427a]  overflow-y-auto shadow-lg p-2 no-scrollbar print:border-2 print:shadow-none print:max-h-[95vh] print:p-2">
              <div ref={sheetRef} className="p-2 print:p-2">
                {/* Header */}
                <div className="flex items-center justify-between mb-2 border border-black p-2">
                  <img
                    src="/logo.svg"
                    alt="School Logo"
                    className="lg:w-28 lg:h-28 w-18 h-18"
                  />
                  <div className="flex-1 text-center">
                    <h1 className="font-bold lg:text-[23px] text-sm text-[#01427a] uppercase">
                      Foursquare Int'l Secondary School
                    </h1>
                    <p className="font-bold text-[#01427a] lg:text-[23px] text-sm">
                      ASERO, ABEOKUTA OGUN STATE NIGERIA
                    </p>
                    <p className="font-medium text-[#01427a] lg:text-[16px] text-xs">
                      Academic Year: 2024/2025
                    </p>
                  </div>
                  <div className="w-20 h-20" />
                </div>

                {/* Student Info */}
                <div className="flex flex-row justify-between gap-4 mb-2 text-sm">
                  <div>
                    <div className="mb-2">
                      <span className="font-nomral text-[16px]">
                        Student's Name:
                      </span>{" "}
                      <span className="border-b border-gray-400 min-w-[120px] inline-block">
                        Toluwani Somade
                      </span>
                    </div>
                    <div>
                      <span className="font-nomral text-[16px]">
                        Class Year:
                      </span>{" "}
                      <span className="border-b border-gray-400 min-w-[80px] inline-block">
                        SSS3
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">
                      <span className="font-nomral text-[16px]">
                        Class Arm:
                      </span>{" "}
                      <span className="border-b border-gray-400 min-w-[80px] inline-block">
                        Science
                      </span>
                    </div>
                    <div>
                      <span className="font-nomral text-[16px]">Term:</span>{" "}
                      <span className="border-b border-gray-400 min-w-[80px] inline-block">
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
                          <td className="border p-1 text-center">
                            {row.project}
                          </td>
                          <td className="border p-1 text-center">{row.test}</td>
                          <td className="border p-1 text-center">
                            {row.totalCA}
                          </td>
                          <td className="border p-1 text-center">{row.exam}</td>
                          <td className="border p-1 text-center">{row.mark}</td>
                          <td className="border p-1 text-center">
                            {row.grade}
                          </td>
                          <td className="border p-1 text-center">
                            {row.remark}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

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
                            <td className="border border-black px-1 py-1">
                              69-61
                            </td>
                            <td className="border border-black px-1 py-1">
                              60-51
                            </td>
                            <td className="border border-black px-1 py-1">
                              50-41
                            </td>
                            <td className="border border-black px-1 py-1">
                              40-0
                            </td>
                          </tr>
                        </tbody>
                      </table>
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
