import React, { useState } from "react";
const students = Array(20).fill({
  name: "Babalola Ifeoluwa",
  subjects: {
    Maths: 70,
    English: 80,
    Chemistry: 66,
    Physics: 82,
    Biology: 50,
    Agric: 70,
    Yoruba: 90,
    Geography: 76,
  },
  passed: 7,
  failed: 2,
  comment: "",
});
const BroadSheet = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(students.length / itemsPerPage);
  const paginatedStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full min-w-full border overflow-x-auto border-[#01427A]/15 text-sm">
        <thead className="bg-[#f8fdff] text-gray-800">
          <tr>
            <th
              className="border px-8 py-2 text-center text-[#6DAAD3]  sticky left-0 bg-[#f8fdff] z-10"
              rowSpan={2}
            >
              <div className="rotate-[300deg]">NAMES</div>
            </th>

            <th
              className="border px-3 py-4 font-bold bg-[#6B90B5]/4"
              colSpan={12}
            >
              SUBJECTS
            </th>
          </tr>

          <tr className="bg-[#6B90B5]/4 ">
            <th className="border px-1 py-2">Maths (100)</th>
            <th className="border px-1 py-2">English (30)</th>
            <th className="border px-1 py-2">Chemistry (30)</th>
            <th className="border px-1 py-2">Physics (30)</th>
            <th className="border px-1 py-2">Biology (30)</th>
            <th className="border px-1 py-2">Agric (70)</th>
            <th className="border px-1 py-2">Yoruba (100)</th>
            <th className="border px-1 py-2">Geography</th>
            <th className="border px-1 py-2">No of Subj. Passed</th>
            <th className="border px-1 py-2">No of Subj. Failed</th>
            <th className="border px-1 py-2">Comment</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {paginatedStudents.map((student, idx) => (
            <tr key={idx} className="text-center font-medium">
              <td
                title={student.name}
                className="border px-3 py-3 font-medium truncate cursor-pointer text-left sticky left-0 bg-white z-10"
              >
                {student.name}
              </td>

              <td className="border px-3 py-3 text-[#333333]">
                {student.subjects.Maths}
              </td>
              <td className="border px-3 py-3 text-[#333333] ">
                {student.subjects.English}
              </td>
              <td className="border px-3 py-3 text-[#333333] ">
                {student.subjects.Chemistry}
              </td>
              <td className="border px-3 py-3 text-[#333333] ">
                {student.subjects.Physics}
              </td>
              <td className="border px-3 py-3 text-[#333333] ">
                {student.subjects.Biology}
              </td>
              <td className="border px-3 py-3 text-[#333333] ">
                {student.subjects.Agric}
              </td>
              <td className="border px-3 py-3 text-[#333333] ">
                {student.subjects.Yoruba}
              </td>
              <td className="border px-3 py-3 text-[#333333] ">
                {student.subjects.Geography}
              </td>
              <td className="border px-3 py-3 text-[#333333] ">
                {student.passed}
              </td>
              <td className="border px-3 py-3 text-[#333333] ">
                {student.failed}
              </td>
              <td className="border px-3 py-3  bg-[#89B3DF]/60">
                <input
                  type="text"
                  placeholder="Type a Comment"
                  className="text-xs   placeholder:text-[#433B3B] font-medium w-full focus:outline-none"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-self-end pr-6 items-center gap-2 mt-3 text-sm text-[#01427A] font-semibold">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-2 py-1  bg-[#E6ECF2] border ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#EDF0F3]"
          }`}
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-2 py-1   text-xs ${
              currentPage === index + 1
                ? "bg-[#07508F] text-white"
                : "hover:bg-[#EDF0F3] bg-[#FAFAFA]"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-2 py-1  border bg-[#E6ECF2] ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#EDF0F3]"
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default BroadSheet;
