"use client";
import React, { useState, useEffect, useMemo } from "react";
import { IoFilter, IoSearch } from "react-icons/io5";
import MultiDropdown from "./Multidropdownbyid";
import { FiEdit, FiEdit2, FiEdit3, FiTrash2 } from "react-icons/fi";
import RegControlModal from "./RegControlModal";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import {
  deleteStudentSubjectRegistration,
  getRegistrationControl,
  getStudentSubjectRegistrations,
  getStudenttoClassRelationship,
  getSubjectDepartmentRelationships,
  registerStudentSubject,
  updateRegistrationControl,
  updateStudentSubjectRegistration,
} from "@/Service/SchoolAdminAssignmentService";
import toast from "react-hot-toast";

const MAX_CHIPS = 5; // show this many chips before collapsing

const StudentToSubject = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [StudentSubjectList, setStudentSubjectList] = useState([]);
  const [selectedSubjectAssignment, setSelectedSubjectAssignment] =
    useState(null);
  const [editSubjectAssignmentVisible, setEditSubjectAssignmentVisible] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [registrationControl, setRegistrationControl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState("name");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editStatus, setEditStatus] = useState("Pending");
  const [expandedRows, setExpandedRows] = useState({}); // { [student_id]: boolean }

  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [studentsRes, subjectsRes, registrationsRes, controlRes] =
        await Promise.all([
          getStudenttoClassRelationship(),
          getSubjectDepartmentRelationships(),
          getStudentSubjectRegistrations(),
          getRegistrationControl(),
        ]);

      if (!studentsRes.error) setAllStudents(studentsRes);
      if (!subjectsRes.error) setAllSubjects(subjectsRes);
      if (!registrationsRes.error) setStudentSubjectList(registrationsRes);
      if (!controlRes.error) {
        setRegistrationControl(controlRes);
        setRegistrationEnabled(controlRes.is_open);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents =
    searchText.trim() === ""
      ? allStudents
      : allStudents.filter((student) => {
          const fullName = student.student_name.toLowerCase();
          const className = student.class_year_name?.toLowerCase() || "";

          return filterType === "name"
            ? fullName.includes(searchText.toLowerCase())
            : className.includes(searchText.toLowerCase());
        });

  // Group raw registration rows by student_id
  const groupedByStudent = useMemo(() => {
    const map = new Map();
    StudentSubjectList.forEach((item) => {
      const key = item.student_id;
      if (!map.has(key)) {
        map.set(key, {
          key,
          student_id: item.student_id,
          student_name: item.student_name,
          student_admission_number: item.student_admission_number,
          class_arm: item.class_arm,
          subjects: [],
        });
      }
      map.get(key).subjects.push({
        subject_name: item.subject_name,
        status: item.status,
        registration_id: item.registration_id,
        student_class: item.student_class,
        subject_class: item.subject_class,
        raw: item,
      });
    });
    return Array.from(map.values());
  }, [StudentSubjectList]);

  // Paginate the grouped rows
  const paginatedData = groupedByStudent.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(groupedByStudent.length / itemsPerPage);

  const handlePrevious = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editSubjectAssignmentVisible && selectedSubjectAssignment) {
        const studentId = formData.Student?.[0];
        const subjectId = formData.Subject?.[0];

        if (!studentId || !subjectId) {
          toast.error("Please select both student and subject.");
          return;
        }

        await updateStudentSubjectRegistration(
          selectedSubjectAssignment.registration_id,
          {
            student_class: studentId,
            subject_class: subjectId,
            status: editStatus,
          }
        );

        toast.success("Subject Registration updated successfully.");
        setEditSubjectAssignmentVisible(false);
        setSelectedSubjectAssignment(null);
        setFormData({ Student: [], Subject: [] });
        setEditStatus("Pending");
        fetchData();
        return;
      } else {
        const registrations = formData.Student.map((studentClassId) => ({
          student_class: studentClassId,
          subject_class: formData.Subject[0],
        }));

        await Promise.all(
          registrations.map((reg) => registerStudentSubject(reg))
        );

        toast.success("Student Subject Registration successful.");
        fetchData();
        setFormData({ Student: [], Subject: [] });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error.message || "Registration failed");
    }
  };

  const handleEdit = (assignment) => {
    setEditSubjectAssignmentVisible(true);
    setSelectedSubjectAssignment(assignment);

    const studentId = assignment.student_class; // from GET
    const subjectId = assignment.subject_class;

    setFormData({
      Student: studentId ? [String(studentId)] : [],
      Subject: subjectId ? [String(subjectId)] : [],
    });

    setEditStatus(assignment.status || "Pending");
  };

  const handleDelete = async (registrationId) => {
    if (!window.confirm("Are you sure you want to delete this registration?"))
      return;
    try {
      const response = await deleteStudentSubjectRegistration(registrationId);
      if (!response.error) {
        toast.success("Registration deleted successfully.");
        fetchData();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Deletion failed:", error);
      toast.error("Failed to delete registration");
    }
  };

  const toggleRegistration = () => {
    if (!registrationEnabled) setShowModal(true);
    else handleCloseRegistration();
  };

  const handleCloseRegistration = async () => {
    try {
      const response = await updateRegistrationControl({
        is_open: false,
        start_date: registrationControl.start_date,
        end_date: registrationControl.end_date,
      });

      if (!response.error) {
        setRegistrationEnabled(false);
        setRegistrationControl(response);
        toast.success("Registration closed successfully.");
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Failed to close registration:", error);
      toast.error("Failed to close registration");
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      const response = await updateRegistrationControl({
        is_open: true,
        start_date: formData.startDate,
        end_date: formData.endDate,
      });

      if (!response.error) {
        setRegistrationEnabled(true);
        setRegistrationControl(response);
        setShowModal(false);
        toast.success("Registration successfully enabled!");
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Failed to enable registration:", error);
      toast.error("Failed to enable registration");
    }
  };

  const [formData, setFormData] = useState({
    Student: [],
    Subject: [],
  });

  const toggleRowExpand = (studentId) => {
    setExpandedRows((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#07508F]"></div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto no-scrollbar h-full ">
      {registrationControl && (
        <div className="mx-6 mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm font-semibold">Registration Period:</p>
          <p className="text-sm">
            {new Date(registrationControl.start_date).toLocaleDateString()} -{" "}
            {new Date(registrationControl.end_date).toLocaleDateString()}
          </p>
          <p className="text-sm">
            Status:{" "}
            <span
              className={
                registrationControl.is_open
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {registrationControl.is_open ? "OPEN" : "CLOSED"}
            </span>
          </p>
        </div>
      )}

      <div className="flex justify-between items-center gap-5 pt-5 pl-6 pr-6 ">
        <div className="flex items-center gap-3 relative w-1/2">
          <div className="">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center text-[#01427A] hover:text-white hover:bg-[#01427A] cursor-pointer text-sm gap-2 border-[1.5px]
             rounded-full border-[#01427A] py-2 px-3 w-full "
            >
              <span className="hidden xl:block">Filter by </span>
              <span>
                <IoFilter size={18} />
              </span>
            </button>
            {showFilterDropdown && (
              <div className="absolute top-full mt-1 left-0 bg-white border rounded shadow-lg z-10">
                {["name", "class"].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setFilterType(type);
                      setShowFilterDropdown(false);
                    }}
                    className="border-b flex items-center gap-3 px-4 py-2 text-sm hover:bg-[#01427A]/40 cursor-pointer w-full text-left"
                  >
                    <span>
                      <RxLetterCaseCapitalize />
                    </span>
                    {type === "class" ? "Class" : "Name"}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="relative w-full">
              <IoSearch
                className="text-[#AEAEAE] absolute right-7 top-2.5 ml-3 "
                size={18}
              />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                type="text"
                className="placeholder:text-[#AEAEAE] xl:placeholder:text-sm placeholder:text-xs rounded-full py-1 pl-5 pr-12 border-[1.5px] w-full "
                placeholder={`Type here to filter by ${
                  filterType === "class" ? "class" : "name"
                }`}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label className="text-sm">Set Registration Control:</label>
          <button
            onClick={toggleRegistration}
            aria-pressed={registrationEnabled}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none  ${
              registrationEnabled ? "bg-[#1BB66E]" : "bg-[#F94144]"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                registrationEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {registrationEnabled && (
        <form onSubmit={handleSubmit} className="mb-3 flex-shrink-0 mt-2">
          <div className="flex pt-3 pl-6 pr-6 justify-between mb-2 ">
            <p className="font-bold text-[#07508F]">
              Register Students Subject
            </p>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
              >
                {editSubjectAssignmentVisible ? "Save" : "Assign"}
              </button>
              {editSubjectAssignmentVisible ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditSubjectAssignmentVisible(false);
                    setSelectedSubjectAssignment(null);
                    setFormData({ Student: [], Subject: [] });
                    setEditStatus("Pending");
                  }}
                  className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm"
                >
                  Cancel
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="pl-6 pr-6">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-x-2 ">
                <label className="text-[0.88rem] text-[#5E6A72]">
                  Student:
                </label>
                <MultiDropdown
                  label="Select Student(s)"
                  items={(editSubjectAssignmentVisible
                    ? allStudents
                    : filteredStudents
                  ).map((s) => ({
                    label: `${s.student_name} - ${s.class_year_name} ${s.class_arm_name}`,
                    value: s.student_class_id,
                  }))}
                  selectedValues={formData.Student}
                  onChange={(values) =>
                    setFormData((prev) => ({ ...prev, Student: values }))
                  }
                />
              </div>
              <div className="flex flex-col gap-x-2 ">
                <label className="text-[0.88rem] text-[#5E6A72]">
                  Subject:
                </label>
                <MultiDropdown
                  label="Select Subject(s)"
                  items={allSubjects.map((s) => ({
                    label: s.subject_name,
                    value: s.subject_class_id,
                  }))}
                  selectedValues={formData.Subject}
                  onChange={(values) =>
                    setFormData((prev) => ({ ...prev, Subject: values }))
                  }
                />
              </div>
            </div>

            {editSubjectAssignmentVisible && (
              <div className="mt-3 flex items-center gap-4">
                <label className="text-[0.88rem] text-[#5E6A72]">Status:</label>

                <button
                  type="button"
                  onClick={() =>
                    setEditStatus((prev) =>
                      prev === "Approved" ? "Pending" : "Approved"
                    )
                  }
                  aria-pressed={editStatus === "Approved"}
                  className={`relative inline-flex h-6 w-12 items-center  rounded-full transition-colors duration-300 focus:outline-none ${
                    editStatus === "Approved" ? "bg-[#1BB66E]" : "bg-yellow-500"
                  }`}
                  title="Toggle Approved / Pending"
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full  bg-white transition-transform duration-300 ${
                      editStatus === "Approved"
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>

                <span className="text-sm font-medium">
                  {editStatus === "Approved" ? "Approved" : "Pending"}
                </span>
              </div>
            )}
          </div>
        </form>
      )}

      <hr />
      <div className="flex-shrink-0">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Assigned Students to Subjects.
        </p>
      </div>

      <div className="px-0 overflow-y-auto h-full">
        <div>
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-left lg:text-base text-xs">
                <tr>
                  <th className="p-2 pl-16 bg-[#EDF0F3]">Student</th>
                  <th className="p-2 bg-[#EDF0F3]">Admission Number</th>
                  <th className="p-2 bg-[#EDF0F3]">Class</th>
                  <th className="p-2 bg-[#EDF0F3]">Subjects</th>
                  <th className="p-2 bg-[#EDF0F3]">Status</th>
                </tr>
              </thead>
            )}
            <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-5 text-center border text-gray-500"
                  >
                    No Data Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => {
                  const isExpanded = !!expandedRows[row.student_id];
                  const subjects = row.subjects;
                  const displaySubjects = isExpanded
                    ? subjects
                    : subjects.slice(0, MAX_CHIPS);
                  const remaining = subjects.length - displaySubjects.length;

                  const allSame = row.subjects.every(
                    (s) => s.status === row.subjects[0].status
                  );
                  const groupStatus = allSame
                    ? row.subjects[0].status
                    : "Mixed";

                  return (
                    <tr
                      className="border-b-[#D0D0D0] border-b"
                      key={row.key ?? index}
                    >
                      <td className="p-2 pl-16">{row.student_name}</td>
                      <td className="p-2">{row.student_admission_number}</td>
                      <td className="p-2">{row.class_arm}</td>

                      {/* Subjects with collapse/expand */}
                      <td className="p-2">
                        <div className="flex flex-wrap gap-2">
                          {displaySubjects.map((s) => (
                            <div
                              key={s.registration_id}
                              className={`group inline-flex items-center gap-1 rounded-full px-2 py-0.5 border text-[11px]
                                ${
                                  s.status === "Approved"
                                    ? "bg-green-50 border-green-200 text-green-700"
                                    : s.status === "Rejected"
                                    ? "bg-red-50 border-red-200 text-red-700"
                                    : "bg-yellow-50 border-yellow-200 text-yellow-700"
                                }`}
                            >
                              <button type="button" className="outline-none">
                                {s.subject_name}
                              </button>
                              <FiEdit2
                                size={12}
                                onClick={() => handleEdit(s.raw)}
                                className="cursor-pointer opacity-60 hover:opacity-100"
                                title="Edit subject registration"
                              />
                              <FiTrash2
                                size={12}
                                className="cursor-pointer opacity-60 hover:opacity-100"
                                title="Delete this subject registration"
                                onClick={() => handleDelete(s.registration_id)}
                              />
                            </div>
                          ))}

                          {remaining > 0 && !isExpanded && (
                            <button
                              type="button"
                              onClick={() => toggleRowExpand(row.student_id)}
                              className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 hover:bg-gray-200"
                              title="Show more subjects"
                            >
                              +{remaining} more
                            </button>
                          )}

                          {isExpanded && subjects.length > MAX_CHIPS && (
                            <button
                              type="button"
                              onClick={() => toggleRowExpand(row.student_id)}
                              className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 hover:bg-gray-200"
                              title="Show fewer subjects"
                            >
                              Show less
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Group-level status (or Mixed) */}
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            groupStatus === "Approved"
                              ? "bg-green-100 text-green-800"
                              : groupStatus === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : groupStatus === "Mixed"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {groupStatus}
                        </span>
                      </td>

                      {/* Placeholder for future bulk actions if needed */}
                      <td className="p-2"></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-self-end pr-6 items-center gap-2 mt-3 text-sm text-[#01427A] font-semibold">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-2 py-1 bg-[#E6ECF2] border ${
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
                className={`px-2 py-1 text-xs ${
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
              className={`px-2 py-1 border bg-[#E6ECF2] ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#EDF0F3]"
              }`}
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <RegControlModal
          setRegistrationEnabled={setRegistrationEnabled}
          setShowModal={setShowModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default StudentToSubject;
