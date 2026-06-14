"use client";
import React, { useState, useEffect, useMemo } from "react";
import { IoFilter, IoSearch } from "react-icons/io5";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import subjectRuleAndRegistrationService from "@/Service/StudenttoSubject";
import studentService from "@/Service/studentService";
import academicEntityService from "@/Service/AcademicEntityService";
import registrationControlService from "@/Service/RegControlService";
import toast from "react-hot-toast";

const MAX_CHIPS = 2;

const StudentToSubject = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [studentSubjectList, setStudentSubjectList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [registrationControl, setRegistrationControl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState("name");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});
  const [isToggling, setIsToggling] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchStudents(),
        fetchSubjects(),
        fetchRegistrations(),
        fetchRegistrationStatus(),
      ]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async () => {
    const result = await studentService.getAllStudents();
    if (result.success) {
      setAllStudents(result.data);
    }
  };

  const fetchSubjects = async () => {
    const result = await academicEntityService.getAllSubjects();
    if (result.success) {
      setAllSubjects(result.data);
    }
  };

  const fetchRegistrations = async () => {
    const result = await subjectRuleAndRegistrationService.getAllRegisteredStudents();
    if (result.success && result.data) {
      console.log("Registrations API Response:", result.data);
      setStudentSubjectList(result.data);
    }
  };

  const fetchRegistrationStatus = async () => {
    try {
      const result = await registrationControlService.getControl();
      console.log("Registration Control API Response:", result);
      
      if (result.success && result.data) {
        setRegistrationControl(result.data);
        const isOpen = result.data.isOpen === true;
        setRegistrationEnabled(isOpen);
        console.log("Setting registration enabled to:", isOpen);
      } else {
        console.log("No registration control data found");
        setRegistrationEnabled(false);
        setRegistrationControl(null);
      }
    } catch (error) {
      console.error("Failed to fetch registration status:", error);
      setRegistrationEnabled(false);
    }
  };

  const groupedByStudent = useMemo(() => {
    const map = new Map();
    
    const registrations = Array.isArray(studentSubjectList) ? studentSubjectList : [];
    
    registrations.forEach((item) => {
      const key = item.studentId;
      if (!map.has(key)) {
        map.set(key, {
          key,
          studentId: item.studentId,
          studentName: item.studentName,
          admissionNumber: item.admissionNumber,
          classArmName: item.classArmName,
          classYearName: item.classYearName,
          subjects: [],
          status: item.status,
        });
      }
      
      if (item.subjects && Array.isArray(item.subjects)) {
        item.subjects.forEach((subject) => {
          map.get(key).subjects.push({
            subjectId: subject.subjectId,
            subjectName: subject.subjectName,
            status: item.status || "Pending",
            registrationId: subject.registrationId || `${item.studentId}_${subject.subjectId}`,
          });
        });
      } else if (item.subjectName) {
        map.get(key).subjects.push({
          subjectId: item.subjectId,
          subjectName: item.subjectName,
          status: item.status || "Pending",
          registrationId: item.registrationId || `${item.studentId}_${item.subjectId}`,
        });
      }
    });
    
    return Array.from(map.values());
  }, [studentSubjectList]);

  const filteredGrouped = useMemo(() => {
    let filtered = groupedByStudent;
    
    const q = searchText.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((row) => {
        const byName = (row.studentName || "").toLowerCase().includes(q);
        const byAdmission = (row.admissionNumber || "").toLowerCase().includes(q);
        const byClass = ((row.classYearName || "") + " " + (row.classArmName || "")).toLowerCase().includes(q);

        if (filterType === "name") return byName || byAdmission;
        return byClass;
      });
    }

    return filtered;
  }, [groupedByStudent, searchText, filterType]);

  const paginatedData = filteredGrouped.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredGrouped.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filterType]);

  const handlePrevious = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const toggleRegistration = () => {
    if (registrationEnabled) {
      if (window.confirm("Are you sure you want to close registration? Students will not be able to register new subjects.")) {
        handleCloseRegistration();
      }
    } else {
      setShowModal(true);
    }
  };

  const handleCloseRegistration = async () => {
    if (isToggling) return;
    
    try {
      setIsToggling(true);
      const result = await registrationControlService.toggleRegistration(false);
      console.log("Close registration response:", result);
      
      if (result.success) {
        // CRITICAL FIX: Update state based on the response
        setRegistrationEnabled(false);
        setRegistrationControl(result.data);
        toast.success("Registration closed successfully.");
        // Refresh to ensure everything is in sync
        await fetchRegistrationStatus();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Failed to close registration:", error);
      toast.error("Failed to close registration");
    } finally {
      setIsToggling(false);
    }
  };

  const handleModalSubmit = async (formData) => {
    if (isToggling) return;
    
    try {
      setIsToggling(true);
      const result = await registrationControlService.createOrUpdateControl({
        startDate: formData.startDate,
        endDate: formData.endDate,
        isOpen: true,
      });
      
      console.log("Enable registration response:", result);
      
      if (result.success) {
        // CRITICAL FIX: Update state based on the response
        setRegistrationEnabled(true);
        setRegistrationControl(result.data);
        setShowModal(false);
        toast.success("Registration successfully enabled!");
        await fetchRegistrationStatus();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Failed to enable registration:", error);
      toast.error(error.message || "Failed to enable registration");
    } finally {
      setIsToggling(false);
    }
  };

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
    <div className="overflow-y-auto no-scrollbar min-h-full">
      {/* Registration Control Status Card */}
      {registrationControl && (
        <div className="mx-6 mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <p className="text-sm font-semibold">Registration Period:</p>
              <p className="text-sm">
                {new Date(registrationControl.startDate).toLocaleDateString()} -{" "}
                {new Date(registrationControl.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold">Status:</p>
              <p className="text-sm">
                <span
                  className={
                    registrationControl.isOpen
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {registrationControl.isOpen ? "OPEN" : "CLOSED"}
                </span>
              </p>
            </div>
            {registrationControl.daysRemaining > 0 && registrationControl.isOpen && (
              <div>
                <p className="text-sm font-semibold">Days Remaining:</p>
                <p className="text-sm text-orange-600 font-semibold">
                  {registrationControl.daysRemaining} days
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center gap-5 pt-5 pl-6 pr-6">
        <div className="flex items-center gap-3 relative w-1/2">
          <div>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center text-[#01427A] hover:text-white hover:bg-[#01427A] cursor-pointer text-sm gap-2 border-[1.5px] rounded-full border-[#01427A] py-2 px-3 w-full"
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
                className="text-[#AEAEAE] absolute right-7 top-2.5 ml-3"
                size={18}
              />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                type="text"
                className="placeholder:text-[#AEAEAE] xl:placeholder:text-sm placeholder:text-xs rounded-full py-1 pl-5 pr-12 border-[1.5px] w-full"
                placeholder={`Type here to filter by ${
                  filterType === "class" ? "class" : "name or admission number"
                }`}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label className="text-sm font-medium">Registration:</label>
          <button
            onClick={toggleRegistration}
            disabled={isToggling}
            aria-pressed={registrationEnabled}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${
              registrationEnabled ? "bg-[#1BB66E]" : "bg-[#F94144]"
            } ${isToggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                registrationEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm font-medium">
            {registrationEnabled ? "Open" : "Closed"}
          </span>
        </div>
      </div>

      <hr className="mt-4" />
      
      <div className="flex-shrink-0">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Existing Assigned Students to Subjects
        </p>
      </div>

      <div className="px-0 overflow-x-auto">
        <table className="min-w-full table-auto">
          {paginatedData.length > 0 && (
            <thead className="bg-[#EDF0F3] text-center lg:text-base text-xs sticky top-0 z-10">
              <tr>
                <th className="p-3 bg-[#EDF0F3]">Student Name</th>
                <th className="p-3 bg-[#EDF0F3]">Admission Number</th>
                <th className="p-3 bg-[#EDF0F3]">Class</th>
                <th className="p-3 bg-[#EDF0F3]">Subjects</th>
                <th className="p-3 bg-[#EDF0F3]">Status</th>
              </tr>
            </thead>
          )}
          <tbody className="xl:text-sm text-center text-xs text-[#333333] font-medium">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-5 text-center border text-gray-500">
                  No Data Available
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const isExpanded = !!expandedRows[row.studentId];
                const subjects = row.subjects || [];
                const displaySubjects = isExpanded
                  ? subjects
                  : subjects.slice(0, MAX_CHIPS);
                const remaining = subjects.length - displaySubjects.length;

                let groupStatus = "Pending";
                if (subjects.length > 0) {
                  const allSame = subjects.every(
                    (s) => s.status === subjects[0].status
                  );
                  groupStatus = allSame ? subjects[0].status : "Mixed";
                }

                return (
                  <tr
                    className="border-b-[#D0D0D0] border-b hover:bg-gray-50"
                    key={row.key ?? index}
                  >
                    <td className="p-3">{row.studentName}</td>
                    <td className="p-3">{row.admissionNumber}</td>
                    <td className="p-3">
                      {row.classYearName} {row.classArmName}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap justify-center gap-2">
                        {displaySubjects.map((s, idx) => (
                          <div
                            key={s.registrationId || idx}
                            className={`inline-flex items-center px-2 py-1 rounded-full border text-[11px] font-medium ${
                              s.status === "Approved"
                                ? "bg-green-50 border-green-200 text-green-700"
                                : s.status === "Rejected"
                                ? "bg-red-50 border-red-200 text-red-700"
                                : "bg-yellow-50 border-yellow-200 text-yellow-700"
                            }`}
                          >
                            <span>{s.subjectName}</span>
                          </div>
                        ))}
                        {remaining > 0 && !isExpanded && (
                          <button
                            type="button"
                            onClick={() => toggleRowExpand(row.studentId)}
                            className="text-[11px] px-2 py-1 rounded-full bg-gray-100 border border-gray-200 hover:bg-gray-200"
                          >
                            +{remaining} more
                          </button>
                        )}
                        {isExpanded && subjects.length > MAX_CHIPS && (
                          <button
                            type="button"
                            onClick={() => toggleRowExpand(row.studentId)}
                            className="text-[11px] px-2 py-1 rounded-full bg-gray-100 border border-gray-200 hover:bg-gray-200"
                          >
                            Show less
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex justify-end pr-6 items-center gap-2 mt-3 text-sm text-[#01427A] font-semibold pb-4">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-3 py-1 bg-[#E6ECF2] border rounded ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#EDF0F3] cursor-pointer"
              }`}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded text-xs ${
                  currentPage === index + 1
                    ? "bg-[#07508F] text-white"
                    : "hover:bg-[#EDF0F3] bg-[#FAFAFA] cursor-pointer"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border bg-[#E6ECF2] rounded ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#EDF0F3] cursor-pointer"
              }`}
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {/* RegControlModal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white min-w-100 rounded-lg p-3">
            <div className="flex justify-end text-[#333333] cursor-pointer">
              <button onClick={() => setShowModal(false)} className="text-2xl">&times;</button>
            </div>
            <div className="flex justify-center font-bold text-xl mb-5">
              <p>SET REGISTRATION PERIOD</p>
            </div>
            <form className="flex flex-col px-5" onSubmit={(e) => {
              e.preventDefault();
              const formData = {
                startDate: e.target.startDate.value,
                endDate: e.target.endDate.value,
              };
              handleModalSubmit(formData);
            }}>
              <div className="flex flex-col gap-1 mb-5">
                <label className="text-sm font-semibold text-[#808080]">
                  Start Date:
                </label>
                <input
                  name="startDate"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  defaultValue={registrationControl?.startDate?.split('T')[0] || ""}
                  required
                  className="focus:outline-[#0071E3] border-2 p-3 rounded-sm border-[#B6B6B6]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#808080]">
                  End Date:
                </label>
                <input
                  type="date"
                  name="endDate"
                  defaultValue={registrationControl?.endDate?.split('T')[0] || ""}
                  required
                  className="focus:outline-[#0071E3] border-2 p-3 rounded-sm border-[#B6B6B6]"
                />
              </div>
              <div className="w-full mt-10">
                <button className="bg-[#07508F] hover:opacity-90 cursor-pointer w-full py-2 rounded-sm font-bold mb-5 text-white">
                  Enable Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentToSubject;