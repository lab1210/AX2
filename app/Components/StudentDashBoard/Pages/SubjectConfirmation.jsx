"use client";
import React, { useState } from "react";
import Layout from "../../../Components/Studentlayout";
import { useUser } from "../context/UserProvider";
import { useRouter } from "next/navigation";

export default function SubjectRegistrationDemo() {
  const [stream, setStream] = useState("Science");
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Physics", checked: false },
    { id: 2, name: "Chemistry", checked: false },
    { id: 3, name: "Creative Arts", checked: false },
    { id: 4, name: "Data Processing", checked: false },
    { id: 5, name: "Biology", checked: false },
  ]);
  const { isLoading } = useUser();
  const router = useRouter();

  const [showConfirm, setShowConfirm] = useState(false);

  const handleStreamChange = (value) => {
    setStream(value);
  };

  const handleSubjectToggle = (id) => {
    setSubjects((prev) =>
      prev.map((subj) =>
        subj.id === id ? { ...subj, checked: !subj.checked } : subj
      )
    );
  };

  const handleProceed = () => {
    const selectedSubjects = subjects.filter((s) => s.checked);
    if (selectedSubjects.length < 3) {
      alert("Please select at least 3 subjects before proceeding.");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmNo = () => {
    setShowConfirm(false);
  };

  const handleConfirmYes = () => {
    setShowConfirm(false);
    router.push("/Student/Timetable"); 
  };

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-full z-[1000]">
        <div className="border-4 border-[rgba(0,64,128,1)] border-t-[rgba(249,65,68,1)] rounded-full w-[50px] h-[50px] animate-spin"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#D9D9D9] p-4 md:p-8 flex flex-col items-center relative">
        {/* Main Content */}
        <div className="bg-white w-full max-w-3xl rounded-lg shadow p-6 md:p-8 mb-8">
          <h1 className="text-center text-2xl md:text-3xl font-bold mb-4">
            SS1 subject registration
          </h1>
          <div className="flex justify-center gap-8 mb-4">
            {["Science", "Art", "Commercial"].map((val) => (
              <label key={val} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="stream"
                  value={val}
                  checked={stream === val}
                  onChange={() => handleStreamChange(val)}
                  className="accent-green-600"
                />
                <span className="font-semibold text-gray-700">{val}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Subject selection card */}
        <div className="bg-white w-full max-w-3xl rounded-md shadow p-6 md:p-8">
          {/* Step indicators */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full">
                  1
                </div>
                <span className="text-sm font-medium text-gray-700">
                  select subjects
                </span>
              </div>
              <div className="w-16 h-1 bg-gray-300" />

              <div className="flex flex-col items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full">
                  2
                </div>
                <span className="text-sm font-medium text-gray-700">
                  confirm subjects
                </span>
              </div>
              <div className="w-16 h-1 bg-gray-300" />

              <div className="flex flex-col items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-700 rounded-full">
                  3
                </div>
                <span className="text-sm font-medium text-gray-700">done</span>
              </div>
            </div>
          </div>

          {/* Subject Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700 border-collapse">
              <thead className="bg-red-500 text-white">
                <tr>
                  <th className="py-2 px-4 font-medium">S/N</th>
                  <th className="py-2 px-4 font-medium">Subject</th>
                  <th className="py-2 px-4 font-medium text-center">
                    Tick subjects to offer
                  </th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subj, idx) => (
                  <tr key={subj.id}>
                    <td className="py-2 px-4 ">{idx + 1}</td>
                    <td className="py-2 px-2">{subj.name}</td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={subj.checked}
                        onChange={() => handleSubjectToggle(subj.id)}
                        className="accent-green-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Proceed Button */}
          <div className="text-center mt-6">
            <button
              onClick={handleProceed}
              className="bg-green-600 text-white px-10 py-2 rounded hover:bg-green-700"
            >
              Proceed
            </button>
          </div>
        </div>

        {/* Confirm Modal */}
        {showConfirm && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-2xl max-w-sm w-full">
              <h2 className="text-xl font-bold text-center mb-4">
                Confirm final registration
              </h2>
              <div className="flex justify-center gap-6">
                <button
                  onClick={handleConfirmNo}
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                >
                  No
                </button>
                <button
                  onClick={handleConfirmYes}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
