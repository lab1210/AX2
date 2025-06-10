"use client";
import React, { useEffect, useState } from "react";
import { getAcademicYears, getClass, getTerms } from "@/Service/schoolConfig";
import Dropdown from "./DropDown";
import { getStudents } from "@/Service/studentService";
import { RiErrorWarningFill } from "react-icons/ri";
import { MdInfo } from "react-icons/md";
const ViewStudentResult = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [studentResult, setStudentResult] = useState([]);
  const [years, setYears] = useState([]);
  const [term, setTerm] = useState([]);
  const [classYear, setClassYear] = useState([]);
  const [students, setStudents] = useState([]);
  const [generate, setGenerate] = useState(false);

  const [formData, setFormData] = useState({
    year: "",
    term: "",
    class: "",
    student: "",
  });
  useEffect(() => {
    const fetchYears = async () => {
      const { data, error } = await getAcademicYears();
      if (data) {
        setYears(data);
      } else {
        setMessage(error || "Failed to load academic years");
      }
    };
    const fetchTerms = async () => {
      const { data, error } = await getTerms();
      if (data) setTerm(data);
      else setMessage(error || "Failed to load terms");
    };
    const fetchClass = async () => {
      const { data, error } = await getClass();
      if (data) {
        setClassYear(data);
      } else {
        setMessage(error || "Failed to load Class years");
      }
    };
    const fetchstudents = async () => {
      const { data, error } = await getStudents();
      if (data) {
        setStudents(data);
      } else {
        setMessage(error || "Failed to load students");
      }
    };
    fetchstudents();
    fetchClass();
    fetchTerms();
    fetchYears();
  }, []);

  const getYearName = (yearid) => {
    const year = years.find((item) => item.year_id === yearid);
    return year?.name;
  };
  const getTermName = (yearid) => {
    const terms = term.find((item) => item.term_id === yearid);
    return terms?.name;
  };
  const getClassYearName = (yearid) => {
    const year = classYear.find((item) => item.class_year_id === yearid);
    return year?.class_name;
  };

  const getStudentname = (yearid) => {
    if (!yearid) return "";
    const year = students.find((item) => item.student_id === yearid);
    if (!year) return "";
    return year?.first_name + " " + year?.last_name;
  };

  return (
    <div className="pr-1 h-full overflow-y-auto">
      {message && (
        <div
          className={`mx-6 mb-3 text-sm px-4 py-2 rounded-sm font-semibold ${
            messageType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mb-3 pb-5 pt-3  bg-white">
        <div className="flex pl-6 pt-3 pr-6 mb-2 justify-between ">
          <p className="font-bold text-[#07508F]">Search Result </p>
          <button
            onClick={() => setGenerate((prev) => !prev)}
            className="bg-[#07508F] text-white font-bold text-sm px-3 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            Generate
          </button>
        </div>
        <div className="pl-6 pr-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Year:</label>
              <Dropdown
                label={getYearName(formData.year) || "Select Year"}
                items={years.map((year) => ({
                  label: year.name,
                  onClick: () =>
                    setFormData({
                      ...formData,
                      year: year.year_id,
                    }),
                }))}
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Term:</label>
              <Dropdown
                label={getTermName(formData.term) || "Select Term"}
                items={term.map((t) => ({
                  label: t.name,
                  onClick: () =>
                    setFormData({
                      ...formData,
                      term: t.term_id,
                    }),
                }))}
              />
            </div>

            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Class:</label>
              <Dropdown
                label={getClassYearName(formData.class) || "Select Class"}
                items={classYear.map((t) => ({
                  label: t.class_name,
                  onClick: () =>
                    setFormData({
                      ...formData,
                      class: t.class_year_id,
                    }),
                }))}
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[0.88rem] text-[#5E6A72]">Student:</label>
              <Dropdown
                label={getStudentname(formData.student) || "Select Student"}
                items={students.map((t) => ({
                  label: t.first_name + " " + t.last_name,
                  onClick: () =>
                    setFormData({
                      ...formData,
                      student: t.student_id,
                    }),
                }))}
              />
            </div>
          </div>
        </div>
        <hr className="text-gray-100 mt-10 mb-10" />
        {generate ? (
          <p>info</p>
        ) : (
          <div className="flex flex-col items-center justify-center mx-10 border border-[#9B9A9A] min-h-52 rounded">
            <div>
              <p className="font-bold flex flex-row items-center gap-1">
                <span>
                  <MdInfo className="text-red-500" size={23} />
                </span>
                No Result Found
              </p>
            </div>
            <div className="mt-2">
              <p className="text-xs text-[#8A8989]">
                Kindly fill in details above to view Result.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStudentResult;
