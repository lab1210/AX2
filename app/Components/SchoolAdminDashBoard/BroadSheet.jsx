import React from "react";
const students = Array(10).fill({
  name: "Babalola Ife",
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
  return (
    <div className="overflow-x-auto p-4 px-0 ">
      <table className="min-w-full border border-[#01427A]/15 text-sm">
        <thead className="bg-[#f8fdff] text-gray-800">
          <tr>
            <th
              className="border  px-3 py-2 text-center text-[#6DAAD3] rotate-[300deg]"
              rowSpan={2}
            >
              NAMES
            </th>
            <th
              className="border px-3 py-4 font-normal bg-[#6B90B5]/4"
              colSpan={12}
            >
              SUBJECTS
            </th>
          </tr>

          <tr className="bg-[#6B90B5]/4 text-xs">
            <th className="border px-3 py-2">Maths (100)</th>
            <th className="border px-3 py-2">English (30)</th>
            <th className="border px-3 py-2">Chemistry (30)</th>
            <th className="border px-3 py-2">Physics (30)</th>
            <th className="border px-3 py-2">Biology (30)</th>
            <th className="border px-3 py-2">Agric (70)</th>
            <th className="border px-3 py-2">Yoruba (100)</th>
            <th className="border px-3 py-2">Geography</th>
            <th className="border px-3 py-2">No of Subj. Passed</th>
            <th className="border px-3 py-2">No of Subj. Failed</th>
            <th className="border px-3 py-2">Comment</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, idx) => (
            <tr key={idx} className="text-center font-medium">
              <td className="border px-5 py-1 font-medium  text-left">
                {student.name}
              </td>
              <td className="border px-3 text-[#333333]">
                {student.subjects.Maths}
              </td>
              <td className="border px-3 text-[#333333] ">
                {student.subjects.English}
              </td>
              <td className="border px-3 text-[#333333] ">
                {student.subjects.Chemistry}
              </td>
              <td className="border px-3 text-[#333333] ">
                {student.subjects.Physics}
              </td>
              <td className="border px-3 text-[#333333] ">
                {student.subjects.Biology}
              </td>
              <td className="border px-3 text-[#333333] ">
                {student.subjects.Agric}
              </td>
              <td className="border px-3 text-[#333333] ">
                {student.subjects.Yoruba}
              </td>
              <td className="border px-3 text-[#333333] ">
                {student.subjects.Geography}
              </td>
              <td className="border px-3 text-[#333333] ">{student.passed}</td>
              <td className="border px-3 text-[#333333] ">{student.failed}</td>
              <td className="border px-3  bg-[#89B3DF]/60">
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
    </div>
  );
};

export default BroadSheet;
