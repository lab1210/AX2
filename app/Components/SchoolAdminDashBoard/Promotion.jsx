"use client";
import React, { useState, useEffect } from "react";
import Dropdown from "./DropDown2";
import promotionService from "@/Service/PromotionService";
import classService from "@/Service/ClassService";
import academicPeriodService from "@/Service/AcademicPeriodService";
import academicEntityService from "@/Service/AcademicEntityService";
import classArmDepartmentService from "@/Service/ClassDeptService";
import toast from "react-hot-toast";

const Promotion = () => {
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [classArms, setClassArms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classArmDepartments, setClassArmDepartments] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedClassArm, setSelectedClassArm] = useState("");
  const [promotionHistory, setPromotionHistory] = useState([]);
  const [showCriteriaForm, setShowCriteriaForm] = useState(false);
  const [criteriaList, setCriteriaList] = useState([]);
  const [criteriaFormData, setCriteriaFormData] = useState({
    classArmDepartmentId: "",
    minPercentage: "",
    description: "",
  });

  useEffect(() => {
    fetchSessions();
    fetchClassArms();
    fetchDepartments();
    fetchClassArmDepartments();
    fetchCriteriaList();
  }, []);

  const fetchSessions = async () => {
    try {
      const result = await academicPeriodService.getAllSessions();
      if (result.success) {
        setSessions(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  };

  const fetchClassArms = async () => {
    try {
      const result = await classService.getAllClassArms();
      if (result.success) {
        setClassArms(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch class arms:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const result = await academicEntityService.getAllDepartments();
      if (result.success) {
        setDepartments(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  const fetchClassArmDepartments = async () => {
    try {
      const result = await classArmDepartmentService.getAllMappings();
      if (result.success && result.data) {
        // Map the data to include class year name, class arm name, and department name
        const mappedData = result.data.map(item => ({
          id: item.id,
          classArmId: item.classArmId,
          departmentId: item.departmentId,
          classArmName: item.classArmName,
          classYearName: item.classYearName,
          departmentName: item.departmentName,
          displayName: `${item.classYearName} ${item.classArmName} - ${item.departmentName}`
        }));
        setClassArmDepartments(mappedData);
      }
    } catch (error) {
      console.error("Failed to fetch class arm departments:", error);
    }
  };

  const fetchCriteriaList = async () => {
    try {
      const result = await promotionService.getAllCriteria();
      if (result.success) {
        setCriteriaList(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch criteria:", error);
    }
  };

  const fetchPromotionHistory = async () => {
    if (!selectedSession || !selectedClassArm) {
      toast.error("Please select session and class arm");
      return;
    }
    
    try {
      setLoading(true);
      const result = await promotionService.getPromotionHistoryByClass(
        selectedClassArm,
        selectedSession
      );
      
      if (result.success) {
        setPromotionHistory(result.data);
      } else {
        toast.error(result.message || "Failed to fetch promotion history");
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
      toast.error("Failed to fetch promotion history");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCriteria = async (e) => {
    e.preventDefault();
    
    if (!criteriaFormData.classArmDepartmentId || !criteriaFormData.minPercentage) {
      toast.error("Please select class arm department and enter min percentage");
      return;
    }

    try {
      setLoading(true);
      const result = await promotionService.createCriteria({
        classArmDepartmentId: criteriaFormData.classArmDepartmentId,
        minPercentage: parseFloat(criteriaFormData.minPercentage),
        description: criteriaFormData.description,
      });
      
      if (result.success) {
        toast.success("Promotion criteria created successfully");
        setCriteriaFormData({ classArmDepartmentId: "", minPercentage: "", description: "" });
        setShowCriteriaForm(false);
        await fetchCriteriaList();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to create criteria");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCriteria = async (criteriaId) => {
    if (window.confirm("Are you sure you want to delete this promotion criteria?")) {
      try {
        setLoading(true);
        const result = await promotionService.deleteCriteria(criteriaId);
        if (result.success) {
          toast.success("Criteria deleted successfully");
          await fetchCriteriaList();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to delete criteria");
      } finally {
        setLoading(false);
      }
    }
  };

  const getClassArmDeptName = (classArmDeptId) => {
    if (!classArmDeptId) return "Select Class Arm Department";
    const dept = classArmDepartments.find(d => d.id === classArmDeptId);
    if (!dept) return "Select Class Arm Department";
    // Display format: "JSS3 A - Science Department"
    return `${dept.classYearName} ${dept.classArmName} - ${dept.departmentName}`;
  };

  const getSessionName = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    return session?.name;
  };

  const getClassArmName = (classArmId) => {
    const classArm = classArms.find(ca => ca.id === classArmId);
    return classArm ? `${classArm.classYearName || ""} ${classArm.armName}` : "Select Class Arm";
  };

  return (
    <div className="p-6">
      {/* Promotion Criteria Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg text-[#07508F]">Promotion Criteria Configuration</h3>
          <button
            onClick={() => setShowCriteriaForm(!showCriteriaForm)}
            className="text-sm bg-[#07508F] text-white px-3 py-1 rounded hover:bg-[#05406e]"
          >
            {showCriteriaForm ? "Cancel" : "+ Add Criteria"}
          </button>
        </div>

        {showCriteriaForm && (
          <form onSubmit={handleCreateCriteria} className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Arm Department <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  label={getClassArmDeptName(criteriaFormData.classArmDepartmentId)}
                  items={classArmDepartments.map((dept) => ({
                    label: `${dept.classYearName} ${dept.classArmName} - ${dept.departmentName}`,
                    onClick: () => setCriteriaFormData(prev => ({ ...prev, classArmDepartmentId: dept.id })),
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Percentage (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={criteriaFormData.minPercentage}
                  onChange={(e) => setCriteriaFormData(prev => ({ ...prev, minPercentage: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={criteriaFormData.description}
                  onChange={(e) => setCriteriaFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="e.g., Promotion to next class"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#07508F] text-white px-4 py-2 rounded-md hover:bg-[#05406e] disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Criteria"}
              </button>
            </div>
          </form>
        )}

        {/* Criteria List Table */}
        {criteriaList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Class Arm Department</th>
                  <th className="p-2 text-left">Min %</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {criteriaList.map((criteria) => (
                  <tr key={criteria.id} className="border-b">

<td className="p-2">{criteria.classYearName} {criteria.classArmName} - {criteria.departmentName}</td>
                    <td className="p-2">{criteria.minPercentage}%</td>
                    <td className="p-2">{criteria.description || "-"}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        criteria.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {criteria.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleDeleteCriteria(criteria.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No promotion criteria configured. Click "Add Criteria" to create one.
          </div>
        )}
      </div>

      {/* Promotion History Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-[#07508F] mb-4">Promotion History</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Session <span className="text-red-500">*</span>
              </label>
              <Dropdown
                label={getSessionName(selectedSession) || "Select Session"}
                items={sessions.map((session) => ({
                  label: session.name,
                  onClick: () => {
                    setSelectedSession(session.id);
                    setPromotionHistory([]);
                  },
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class Arm <span className="text-red-500">*</span>
              </label>
              <Dropdown
                label={getClassArmName(selectedClassArm) || "Select Class Arm"}
                items={classArms.map((arm) => ({
                  label: `${arm.classYearName || ""} ${arm.armName}`,
                  onClick: () => {
                    setSelectedClassArm(arm.id);
                    setPromotionHistory([]);
                  },
                }))}
              />
            </div>
          </div>
          <button
            onClick={fetchPromotionHistory}
            disabled={!selectedSession || !selectedClassArm || loading}
            className="bg-[#07508F] text-white px-4 py-2 rounded-md hover:bg-[#05406e] disabled:opacity-50"
          >
            {loading ? "Loading..." : "View History"}
          </button>
        </div>

        {/* Promotion History Table */}
        {promotionHistory.length > 0 ? (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full text-sm">
              <thead className="bg-[#EDF0F3]">
                <tr>
                  <th className="p-3 text-left">S/N</th>
                  <th className="p-3 text-left">Student Name</th>
                  <th className="p-3 text-left">Admission No</th>
                  <th className="p-3 text-left">From Class</th>
                  <th className="p-3 text-left">To Class</th>
                  <th className="p-3 text-left">Final Score</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Promoted By</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {promotionHistory.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{item.studentName}</td>
                    <td className="p-3">{item.admissionNumber}</td>
                    <td className="p-3">{item.fromClassArmName}</td>
                    <td className="p-3">{item.toClassArmName || "Graduated"}</td>
                    <td className="p-3 font-semibold">{item.finalPercentage?.toFixed(1)}%</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.isManualOverride
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {item.statusName}
                        {item.isManualOverride && " (Manual)"}
                      </span>
                    </td>
                    <td className="p-3">{item.promotedBy}</td>
                    <td className="p-3">{new Date(item.promotedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          selectedSession && selectedClassArm && promotionHistory.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500 mt-4">
              No promotion history found for this class and session.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Promotion;