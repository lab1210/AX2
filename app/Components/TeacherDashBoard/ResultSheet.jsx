"use client";
import React, { useRef } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import { useRouter } from "next/navigation";

const ResultSheetImageDesign = ({ onClose }) => {
  const sheetRef = useRef(null);
  const router = useRouter();

  //   const handleDownload = async () => {
  //     const input = sheetRef.current;
  //     if (!input) return;
  //     input.style.background = "#fff";
  //     const canvas = await html2canvas(input, { scale: 2 });
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF({
  //       orientation: "portrait",
  //       unit: "mm",
  //       format: "a4",
  //     });

  //     const pageWidth = pdf.internal.pageSize.getWidth();
  //     const pageHeight = pdf.internal.pageSize.getHeight();

  //     const imgProps = pdf.getImageProperties(imgData);
  //     const pxFullWidth = canvas.width;
  //     const pxFullHeight = canvas.height;
  //     const mmImgHeight = (pxFullHeight * pageWidth) / pxFullWidth;
  //     let position = 0;
  //     let remainingHeight = mmImgHeight;

  //     while (remainingHeight > 0) {
  //       pdf.addImage(
  //         imgData,
  //         "PNG",
  //         0,
  //         position,
  //         pageWidth,
  //         mmImgHeight,
  //         undefined,
  //         "FAST"
  //       );
  //       remainingHeight -= pageHeight;
  //       if (remainingHeight > 0) {
  //         pdf.addPage();
  //         position = -remainingHeight;
  //       }

  //     pdf.save("result-sheet.pdf");
  //     input.style.background = "";
  //   };
  // }

  const handlePrint = () => {
    window.print();
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

  // const cognitiveSkills = [
  //   { skill: "Problem Solving", grade: 2 },
  //   { skill: "Communication", grade: 5 },
  //   { skill: "Leadership", grade: 5 },
  //   { skill: "Time Management", grade: 2 },
  // ];

  // const affectiveSkills = [
  //   { skill: "Empathy", grade: 3 },
  //   { skill: "Teamwork", grade: 5 },
  //   { skill: "Responsibility", grade: 5 },
  //   { skill: "Honesty", grade: 3 },
  // ];

  // const psychomotorSkills = [
  //   { skill: "Handwriting", grade: 3 },
  //   { skill: "Physical Fitness", grade: 4 },
  //   { skill: "Coordination", grade: 5 },
  //   { skill: "Endurance", grade: 3 },
  // ];

  const handleClose = () => {
    if (onClose) onClose();
    router.back();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 print:p-6">
      <div>
        <div className="bg-white p-6 border-2 border-dashed border-[#01427a] print:p-6">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-0 right-0 bg-white text-gray-700 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow hover:bg-gray-300 z-100 cursor-pointer print:hidden"
            aria-label="Close"
          >
            &times;
          </button>
          <div className="bg-white border-2 border-dashed border-[#01427a] max-h-[95vh] w-full max-w-3xl overflow-y-auto shadow-lg p-2 no-scrollbar print:border-2 print:shadow-none print:max-h-[95vh] print:p-2">
            <div ref={sheetRef} className="p-2 print:p-2">
              {/* Header */}
              <div className="flex items-center justify-between mb-2 border border-black p-2">
                <img src="/logo.svg" alt="School Logo" className="w-28 h-28" />
                <div className="flex-1 text-center">
                  <h1 className="font-bold text-[23px] text-[#01427a] uppercase">
                    Foursquare Int'l Secondary School
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
                  <div className="mb-2">
                    <span className="font-nomral text-[16px]">
                      Student's Name:
                    </span>{" "}
                    <span className="border-b border-gray-400 min-w-[120px] inline-block">
                      Toluwani Somade
                    </span>
                  </div>
                  <div>
                    <span className="font-nomral text-[16px]">Class Year:</span>{" "}
                    <span className="border-b border-gray-400 min-w-[80px] inline-block">
                      SSS3
                    </span>
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <span className="font-nomral text-[16px]">Class Arm:</span>{" "}
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
                        <td className="border p-1 text-center">{row.grade}</td>
                        <td className="border p-1 text-center">{row.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Skills Section */}
              {/* <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
              <div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-1">COGNITIVE SKILLS</th>
                      <th className="border p-1">5</th>
                      <th className="border p-1">4</th>
                      <th className="border p-1">3</th>
                      <th className="border p-1">2</th>
                      <th className="border p-1">1</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cognitiveSkills.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border p-1">{item.skill}</td>
                        {[5, 4, 3, 2, 1].map((g) => (
                          <td className="border p-1 text-center" key={g}>
                            {item.grade === g ? "✓" : ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-1">AFFECTIVE SKILLS</th>
                      <th className="border p-1">5</th>
                      <th className="border p-1">4</th>
                      <th className="border p-1">3</th>
                      <th className="border p-1">2</th>
                      <th className="border p-1">1</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affectiveSkills.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border p-1">{item.skill}</td>
                        {[5, 4, 3, 2, 1].map((g) => (
                          <td className="border p-1 text-center" key={g}>
                            {item.grade === g ? "✓" : ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-1">PSYCHOMOTOR SKILLS</th>
                      <th className="border p-1">5</th>
                      <th className="border p-1">4</th>
                      <th className="border p-1">3</th>
                      <th className="border p-1">2</th>
                      <th className="border p-1">1</th>
                    </tr>
                  </thead>
                  <tbody>
                    {psychomotorSkills.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border p-1">{item.skill}</td>
                        {[5, 4, 3, 2, 1].map((g) => (
                          <td className="border p-1 text-center" key={g}>
                            {item.grade === g ? "✓" : ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div> */}

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

          <div className="absolute bottom-5 right-4 flex gap-2 print:hidden">
            {/* <button
            onClick={handleDownload}
            className="bg-blue-700 text-white px-4 py-2 rounded shadow hover:bg-blue-800 z-50 cursor-pointer"
          >
            Download PDF
          </button> */}
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
  );
};

export default ResultSheetImageDesign;
