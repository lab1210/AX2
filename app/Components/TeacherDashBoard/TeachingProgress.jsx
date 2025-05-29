import React, { useState } from "react";

const subjects = [
  { label: "English Language", value: "english" },
  { label: "Mathematics", value: "mathematics" },
  { label: "Basic Science", value: "basicScience" },
  { label: "Civic Education", value: "civic" },
];

const teachingProgressData = {
  english: [
    { className: "JSS1 A", pupils: 31, percent: 32 },
    { className: "JSS1 B", pupils: 26, percent: 43 },
    { className: "JSS1 C", pupils: 20, percent: 67 },
    { className: "JSS2 A", pupils: 28, percent: 50 },
    { className: "JSS2 B", pupils: 30, percent: 60 },
    { className: "JSS2 C", pupils: 25, percent: 70 },
    { className: "JSS3 A", pupils: 35, percent: 80 },
    { className: "JSS3 B", pupils: 33, percent: 75 },
    { className: "JSS3 C", pupils: 29, percent: 85 },
  ],
  mathematics: [
    { className: "JSS1 A", pupils: 31, percent: 40 },
    { className: "JSS1 B", pupils: 26, percent: 50 },
    { className: "JSS1 C", pupils: 20, percent: 60 },
    { className: "JSS2 A", pupils: 28, percent: 55 },
    { className: "JSS2 B", pupils: 30, percent: 65 },
    { className: "JSS2 C", pupils: 25, percent: 75 },
    { className: "JSS3 A", pupils: 35, percent: 85 },
    { className: "JSS3 B", pupils: 33, percent: 90 },
    { className: "JSS3 C", pupils: 29, percent: 95 },
  ],
  basicScience: [
    { className: "JSS1 A", pupils: 31, percent: 20 },
    { className: "JSS1 B", pupils: 26, percent: 30 },
    { className: "JSS1 C", pupils: 20, percent: 40 },
    { className: "JSS2 A", pupils: 28, percent: 35 },
    { className: "JSS2 B", pupils: 30, percent: 45 },
    { className: "JSS2 C", pupils: 25, percent: 55 },
    { className: "JSS3 A", pupils: 35, percent: 65 },
    { className: "JSS3 B", pupils: 33, percent: 70 },
    { className: "JSS3 C", pupils: 29, percent: 75 },
  ],
  civic: [
    { className: "JSS1 A", pupils: 31, percent: 10 },
    { className: "JSS1 B", pupils: 26, percent: 20 },
    { className: "JSS1 C", pupils: 20, percent: 30 },
    { className: "JSS2 A", pupils: 28, percent: 25 },
    { className: "JSS2 B", pupils: 30, percent: 35 },
    { className: "JSS2 C", pupils: 25, percent: 45 },
    { className: "JSS3 A", pupils: 35, percent: 55 },
    { className: "JSS3 B", pupils: 33, percent: 60 },
    { className: "JSS3 C", pupils: 29, percent: 65 },
  ],
};

const TeachingProgress = () => {
  const [selectedSubject, setSelectedSubject] = useState("english");

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const progress = teachingProgressData[selectedSubject];

  return (
    <div className="w-full bg-white rounded-lg shadow p-2 overflow-hidden scrollbar-hidden h-[48vh]">
      <div className="flex flex-col mb-4">
        <h3 className="text-lg font-semibold">Teaching Progress in</h3>
        <select
          value={selectedSubject}
          onChange={handleSubjectChange}
          className="w-3/5 bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-md focus:outline-none"
        >
          {subjects.map((subject) => (
            <option key={subject.value} value={subject.value}>
              {subject.label}
            </option>
          ))}
        </select>
      </div>
      {/* Scrollable Section for All Classes */}
      <div className="space-y-4 overflow-y-scroll no-scrollbar max-h-96">
        {progress.map((p) => (
          <div
            key={p.className}
            className="flex items-center justify-between bg-[#80ADCB] p-4 rounded-lg"
          >
            <div>
              <p className="font-medium">{p.className}</p>
              <p className="text-sm text-white font-semibold">{p.pupils} pupils</p>
            </div>
            <div className="w-16 h-16 relative">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-500"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${p.percent}, 100`}
                  fill="none"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                </svg>
                {/* Percentage Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm font-bold text-black">{p.percent}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeachingProgress;