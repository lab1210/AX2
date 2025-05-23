"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const ResultSheet = ({
  studentData,
  assessmentData,
  cognitiveData,
  affectiveData,
  psychomotorData,
  onClose,
  isOpen,
}) => {
  // Dummy fallback data
  const dummyStudent = {
    name: "George Elijah David",
    classYear: "JSS 1",
    classArm: "A",
    term: "1st Term",
    academicYear: "2024/2025",
    teacherName: "Mr. Joshua Daniel",
    teacherComment: "An excellent performance. Keep it up!",
    principalComment: "Outstanding result. Well done!",
  };

  const subjects = assessmentData || [
    {
      subject: "English",
      classwork: 15,
      assignment: 15,
      project: 12,
      test: 18,
      totalCA: 54,
      exam: 56,
      total: 70,
      grade: "A",
      remark: "Excellent",
    },
    {
      subject: "Mathematics",
      classwork: 20,
      assignment: 20,
      project: 17,
      test: 15,
      totalCA: 35,
      exam: 45,
      total: 80,
      grade: "A",
      remark: "Excellent",
    },
    {
      subject: "Biology",
      classwork: 20,
      assignment: 23,
      project: 21,
      test: 3,
      totalCA: 30,
      exam: 50,
      total: 60,
      grade: "B",
      remark: "V.Good",
    },
    {
      subject: "Physics",
      classwork: 20,
      assignment: 23,
      project: 21,
      test: 3,
      totalCA: 30,
      exam: 65,
      total: 95,
      grade: "A",
      remark: "Excellent",
    },
    {
      subject: "Chemistry",
      classwork: 20,
      assignment: 23,
      project: 21,
      test: 3,
      totalCA: 30,
      exam: 55,
      total: 85,
      grade: "A",
      remark: "Excellent",
    },
    {
      subject: "Economics",
      classwork: 20,
      assignment: 23,
      project: 21,
      test: 3,
      totalCA: 30,
      exam: 64,
      total: 94,
      grade: "A",
      remark: "Excellent",
    },
    {
      subject: "Zoology",
      classwork: 20,
      assignment: 23,
      project: 21,
      test: 3,
      totalCA: 30,
      exam: 72,
      total: 102,
      grade: "A",
      remark: "Excellent",
    },
    {
      subject: "Computer",
      classwork: 20,
      assignment: 23,
      project: 21,
      test: 3,
      totalCA: 30,
      exam: 93,
      total: 123,
      grade: "A",
      remark: "Excellent",
    },
    {
      subject: "Health Edu.",
      classwork: 20,
      assignment: 23,
      project: 21,
      test: 3,
      totalCA: 30,
      exam: 53,
      total: 83,
      grade: "C",
      remark: "Good",
    },
    {
      subject: "P.H.E",
      classwork: 20,
      assignment: 23,
      project: 21,
      test: 3,
      totalCA: 30,
      exam: 72,
      total: 102,
      grade: "A",
      remark: "Excellent",
    },
    {
      subject: "Anatomy",
      classwork: 20,
      assignment: 23,
      project: 21,
      test: 3,
      totalCA: 30,
      exam: 69,
      total: 99,
      grade: "B",
      remark: "V.Good",
    },
    {
      subject: "Agric Science",
      classwork: 20,
      assignment: 23,
      project: 21,
      test: 3,
      totalCA: 30,
      exam: 40,
      total: 70,
      grade: "E",
      remark: "Fair",
    },
    {
      subject: "Biotechnology",
      classwork: 20,
      assignment: 23,
      project: 21,
      test: 3,
      totalCA: 30,
      exam: 45,
      total: 75,
      grade: "D",
      remark: "Pass",
    },
    {
      subject: "Civic Edu.",
      classwork: 20,
      assignment: 23,
      project: 21,
      test: 3,
      totalCA: 30,
      exam: 50,
      total: 80,
      grade: "D",
      remark: "Pass",
    },
    {
      subject: "Yoruba",
      classwork: 20,
      assignment: 23,
      project: 21,
      test: 3,
      totalCA: 30,
      exam: 74,
      total: 104,
      grade: "A",
      remark: "Excellent",
    },
  ];

  const cog = cognitiveData || {
    "Problem Solving": 5,
    Creativity: 4,
    "Time Management": 3,
    Leadership: 4,
    Communication: 5,
  };

  const aff = affectiveData || {
    Empathy: 4,
    Teamwork: 5,
    Responsibility: 4,
    Honesty: 5,
  };

  const psy = psychomotorData || {
    Handwriting: 4,
    "Physical Fitness": 5,
    Coordination: 4,
    Endurance: 5,
  };

  const student = studentData || dummyStudent;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start p-6 overflow-auto"
        >
          <motion.div
            initial={{ y: "-10%" }}
            animate={{ y: 0 }}
            exit={{ y: "-10%" }}
            transition={{ duration: 0.3 }}
            className="bg-white max-w-4xl w-full rounded-lg shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-2xl font-bold">Student Result Sheet</h2>
              <button onClick={onClose} className="text-3xl leading-none">
                &times;
              </button>
            </div>

            <div className="p-6">
              {/* School Header */}
              <div className="flex items-center justify-between mb-8">
                <img
                  src="/logo.svg"
                  alt="School Logo"
                  className="w-24 h-24"
                />
                <div className="text-center">
                  <h1 className="text-lg font-bold text-[#01427A] uppercase">
                    Foursquare Int'l Secondary School
                  </h1>
                  <p className="text-sm">Asero, Abeokuta Ogun State, Nigeria</p>
                  <p className="text-sm font-medium">
                    Academic Year: {student.academicYear}
                  </p>
                </div>
                <div className="w-24 h-24" />
              </div>

              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                <div className="space-y-1">
                  <p>
                    <span className="font-semibold">Student’s Name:</span>{" "}
                    {student.name}
                  </p>
                  <p>
                    <span className="font-semibold">Class Arm:</span>{" "}
                    {student.classArm}
                  </p>
                </div>
                <div className="space-y-1">
                  <p>
                    <span className="font-semibold">Class Year:</span>{" "}
                    {student.classYear}
                  </p>
                  <p>
                    <span className="font-semibold">Term:</span> {student.term}
                  </p>
                </div>
              </div>

              {/* Assessment Table */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#01427A] text-white text-center">
                      <th className="border p-2">Subject</th>
                      <th className="border p-2">
                        CW
                        <br />
                        (20)
                      </th>
                      <th className="border p-2">
                        AS
                        <br />
                        (30)
                      </th>
                      <th className="border p-2">
                        PT
                        <br />
                        (30)
                      </th>
                      <th className="border p-2">
                        TS
                        <br />
                        (20)
                      </th>
                      <th className="border p-2">
                        Total CA
                        <br />
                        (30)
                      </th>
                      <th className="border p-2">
                        Exam
                        <br />
                        (70)
                      </th>
                      <th className="border p-2">
                        Mark
                        <br />
                        (100)
                      </th>
                      <th className="border p-2">Grade</th>
                      <th className="border p-2">Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subj, i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="border p-2">{subj.subject}</td>
                        <td className="border p-2 text-center">
                          {subj.classwork}
                        </td>
                        <td className="border p-2 text-center">
                          {subj.assignment}
                        </td>
                        <td className="border p-2 text-center">
                          {subj.project}
                        </td>
                        <td className="border p-2 text-center">{subj.test}</td>
                        <td className="border p-2 text-center">
                          {subj.totalCA}
                        </td>
                        <td className="border p-2 text-center">{subj.exam}</td>
                        <td className="border p-2 text-center">{subj.total}</td>
                        <td className="border p-2 text-center">{subj.grade}</td>
                        <td className="border p-2">{subj.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Skills Grids */}
              <div className="grid grid-cols-3 gap-6 mb-8 text-sm">
                {[
                  { title: "Cognitive Skills", data: cog },
                  { title: "Affective Skills", data: aff },
                  { title: "Psychomotor Skills", data: psy },
                ].map((section, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold mb-2">{section.title}</h3>
                    <table className="w-full border-collapse">
                      <tbody>
                        {Object.entries(section.data).map(
                          ([skill, grade], j) => (
                            <tr key={j} className={j % 2 ? "bg-gray-50" : ""}>
                              <td className="border p-2">{skill}</td>
                              <td className="border p-2 text-center">
                                {grade}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>

              {/* Comments */}
              <div className="space-y-4 mb-8 text-sm">
                <p>
                  <span className="font-semibold">Teacher’s Name:</span>{" "}
                  {student.teacherName}
                </p>
                <p>
                  <span className="font-semibold">Teacher’s Comment:</span>{" "}
                  {student.teacherComment}
                </p>
                <p>
                  <span className="font-semibold">Principal’s Comment:</span>{" "}
                  {student.principalComment}
                </p>
              </div>

              {/* Grading System */}
              <div className="text-sm">
                <h3 className="font-semibold mb-2">Grading System</h3>
                <div className="grid grid-cols-6 gap-4 text-center">
                  <div>
                    <span className="font-medium">A</span>
                    <br />
                    70–100
                  </div>
                  <div>
                    <span className="font-medium">B</span>
                    <br />
                    60–69
                  </div>
                  <div>
                    <span className="font-medium">C</span>
                    <br />
                    50–59
                  </div>
                  <div>
                    <span className="font-medium">D</span>
                    <br />
                    45–49
                  </div>
                  <div>
                    <span className="font-medium">E</span>
                    <br />
                    40–44
                  </div>
                  <div>
                    <span className="font-medium">F</span>
                    <br />
                    0–39
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ResultSheet.propTypes = {
  studentData: PropTypes.shape({
    name: PropTypes.string,
    classYear: PropTypes.string,
    classArm: PropTypes.string,
    term: PropTypes.string,
    academicYear: PropTypes.string,
    teacherName: PropTypes.string,
    principalComment: PropTypes.string,
    teacherComment: PropTypes.string,
  }),
  assessmentData: PropTypes.arrayOf(PropTypes.object),
  cognitiveData: PropTypes.object,
  affectiveData: PropTypes.object,
  psychomotorData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default ResultSheet;
