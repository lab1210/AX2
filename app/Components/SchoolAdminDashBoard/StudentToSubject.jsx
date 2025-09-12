"use client";
import React, { useState, useEffect } from "react";
import { IoFilter, IoSearch } from "react-icons/io5";
import MultiDropdown from "./MultiDropDown";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import RegControlModal from "./RegControlModal";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import {
  deleteStudentSubjectRegistration,
  getRegistrationControl,
  getStudentSubjectRegistrations,
  registerStudentSubject,
  updateRegistrationControl,
  updateStudentSubjectRegistration,
} from "@/Service/SchoolAdminAssignmentService";
import { getStudents } from "@/Service/studentService";
import { getSubject } from "@/Service/schoolConfig";

const StudentToSubject = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [StudentSubjectList, setStudentSubjectList] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
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

  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch all necessary data
      const [studentsRes, subjectsRes, registrationsRes, controlRes] =
        await Promise.all([
          getStudents(),
          getSubject(),
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
      setMessage("Failed to load data");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents =
    searchText.trim() === ""
      ? allStudents.map((student) => ({
          id: student.student_id,
          name: `${student.first_name} ${student.last_name}`,
          admission_number: student.admission_number,
        }))
      : allStudents
          .filter((student) => {
            const fullName =
              `${student.first_name} ${student.last_name}`.toLowerCase();
            const admissionNumber =
              student.admission_number?.toLowerCase() || "";

            return filterType === "name"
              ? fullName.includes(searchText.toLowerCase())
              : admissionNumber.includes(searchText.toLowerCase());
          })
          .map((student) => ({
            id: student.student_id,
            name: `${student.first_name} ${student.last_name}`,
            admission_number: student.admission_number,
          }));

  const paginatedData = StudentSubjectList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(StudentSubjectList.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editSubjectAssignmentVisible && selectedSubjectAssignment) {
        // Update existing registration
        const response = await updateStudentSubjectRegistration(
          selectedSubjectAssignment.registration_id,
          {
            student_class: selectedSubjectAssignment.student_class_id,
            subject_class: selectedSubjectAssignment.subject_class_id,
          }
        );

        if (!response.error) {
          setMessage("Subject Registration updated successfully.");
          setMessageType("success");
          setEditSubjectAssignmentVisible(false);
          setSelectedSubjectAssignment(null);
          fetchData(); // Refresh data
        } else {
          throw new Error(response.error);
        }
      } else {
        // Create new registrations
        const registrations = formData.Student.map((studentId) => {
          const student = allStudents.find((s) => s.student_id === studentId);
          return {
            student_class: student.class_id, // You'll need to ensure students have class_id
            subject_class: formData.Subject[0], // Assuming single subject selection for now
          };
        });

        const results = await Promise.all(
          registrations.map((reg) => registerStudentSubject(reg))
        );

        const hasError = results.some((result) => result.error);

        if (hasError) {
          throw new Error("Some registrations failed");
        }

        setMessage("Student Subject Registration successful.");
        setMessageType("success");
        setFormData({
          Student: [],
          Subject: [],
        });
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setMessage(error.message || "Registration failed");
      setMessageType("error");
    }

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleEdit = (assignment) => {
    setEditSubjectAssignmentVisible(true);
    setSelectedSubjectAssignment(assignment);
  };

  const handleDelete = async (registrationId) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) {
      return;
    }

    try {
      const response = await deleteStudentSubjectRegistration(registrationId);

      if (!response.error) {
        setMessage("Registration deleted successfully.");
        setMessageType("success");
        fetchData(); // Refresh data
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Deletion failed:", error);
      setMessage("Failed to delete registration");
      setMessageType("error");
    }

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const toggleRegistration = () => {
    if (!registrationEnabled) {
      setShowModal(true);
    } else {
      handleCloseRegistration();
    }
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
        setMessage("Registration closed successfully.");
        setMessageType("success");
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Failed to close registration:", error);
      setMessage("Failed to close registration");
      setMessageType("error");
    }

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
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
        setMessage("Registration successfully enabled!");
        setMessageType("success");
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Failed to enable registration:", error);
      setMessage("Failed to enable registration");
      setMessageType("error");
    }

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const [formData, setFormData] = useState({
    Student: [],
    Subject: [],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="overflow-y-auto no-scrollbar h-full ">
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
                {["name", "admission_number"].map((type) => (
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
                    {type === "admission_number" ? "Admission Number" : "Name"}
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
                  filterType === "admission_number"
                    ? "admission number"
                    : "name"
                }`}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label htmlFor="" className="text-sm">
            Set Registration Control:
          </label>
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
            <button
              type="submit"
              className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
            >
              {editSubjectAssignmentVisible ? "Save" : "Assign"}
            </button>
          </div>
          <div className="pl-6 pr-6">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-x-2 ">
                <label className="text-[0.88rem] text-[#5E6A72]">
                  Student:
                </label>
                <MultiDropdown
                  label="Select Student (s)"
                  selectedItems={
                    editSubjectAssignmentVisible
                      ? [selectedSubjectAssignment.student_name] || []
                      : formData.Student.map((id) => {
                          const student = allStudents.find(
                            (s) => s.student_id === id
                          );
                          return student
                            ? `${student.first_name} ${student.last_name}`
                            : "";
                        })
                  }
                  onSelect={(selected) => {
                    if (editSubjectAssignmentVisible) {
                      // For editing, we need to handle this differently
                      // You might want to implement student selection in edit mode if needed
                    } else {
                      const selectedIds = selected
                        .map((name) => {
                          const student = allStudents.find(
                            (s) => `${s.first_name} ${s.last_name}` === name
                          );
                          return student ? student.student_id : null;
                        })
                        .filter((id) => id !== null);

                      setFormData((prev) => ({
                        ...prev,
                        Student: selectedIds,
                      }));
                    }
                  }}
                  items={filteredStudents.map((student) => ({
                    label: student.name,
                  }))}
                />
              </div>
              <div className="flex flex-col gap-x-2 ">
                <label className="text-[0.88rem] text-[#5E6A72]">
                  Subject:
                </label>
                <MultiDropdown
                  label="Select Subject (s)"
                  selectedItems={
                    editSubjectAssignmentVisible
                      ? [selectedSubjectAssignment.subject_name] || []
                      : formData.Subject.map((id) => {
                          const subject = allSubjects.find(
                            (s) => s.subject_id === id
                          );
                          return subject ? subject.name : "";
                        })
                  }
                  onSelect={(selected) => {
                    if (editSubjectAssignmentVisible) {
                      // For editing, update the selected subject
                      const subject = allSubjects.find(
                        (s) => s.name === selected[0]
                      );
                      if (subject) {
                        setSelectedSubjectAssignment((prev) => ({
                          ...prev,
                          subject_name: subject.name,
                          subject_class_id: subject.subject_id, // This might need adjustment based on your API
                        }));
                      }
                    } else {
                      const selectedIds = selected
                        .map((name) => {
                          const subject = allSubjects.find(
                            (s) => s.name === name
                          );
                          return subject ? subject.subject_id : null;
                        })
                        .filter((id) => id !== null);

                      setFormData((prev) => ({
                        ...prev,
                        Subject: selectedIds,
                      }));
                    }
                  }}
                  items={allSubjects.map((subject) => ({
                    label: subject.name,
                  }))}
                />
              </div>
            </div>
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
                  <th className="p-2 bg-[#EDF0F3]">Subject</th>
                  <th className="p-2 bg-[#EDF0F3]">Status</th>
                  <th className="p-2 bg-[#EDF0F3]">Actions</th>
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
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={index}>
                    <td className="p-2 pl-16">{item.student_name}</td>
                    <td className="p-2">{item.student_admission_number}</td>
                    <td className="p-2">{item.class_arm}</td>
                    <td className="p-2">{item.subject_name}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-4">
                        <FiEdit3
                          onClick={() => handleEdit(item)}
                          className="text-[#80ADCB] cursor-pointer"
                          size={15}
                        />
                        <FiTrash2
                          onClick={() => handleDelete(item.registration_id)}
                          className="text-[#F94144] cursor-pointer"
                          size={15}
                        />
                      </div>
                    </td>
                  </tr>
                ))
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
