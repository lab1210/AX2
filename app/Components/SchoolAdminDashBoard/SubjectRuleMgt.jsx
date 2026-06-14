"use client";
import React, { useState, useEffect } from "react";
import { FiTrash2, FiPlus, FiX, FiChevronDown, FiChevronRight } from "react-icons/fi";
import Dropdown from "./DropDown2";
import subjectRuleAndRegistrationService from "@/Service/StudenttoSubject";
import classService from "@/Service/ClassService";
import academicEntityService from "@/Service/AcademicEntityService";
import toast from "react-hot-toast";

const SubjectRulesManagement = () => {
  const [classArms, setClassArms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClassArm, setSelectedClassArm] = useState("");
  const [compulsoryRules, setCompulsoryRules] = useState([]);
  const [optionalRules, setOptionalRules] = useState([]);
  const [groupRules, setGroupRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSections, setOpenSections] = useState({
    compulsory: true,
    optional: true,
    groupRules: true
  });
  
  // Compulsory form state
  const [selectedCompulsorySubject, setSelectedCompulsorySubject] = useState("");
  
  // Optional form state
  const [selectedOptionalSubject, setSelectedOptionalSubject] = useState("");
  
  // Group form state
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupFormData, setGroupFormData] = useState({
    subjectIds: [],
    minSelect: 1,
    maxSelect: 1,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classArmsRes, subjectsRes] = await Promise.all([
        classService.getAllClassArms(),
        academicEntityService.getAllSubjects(),
      ]);

      if (classArmsRes.success) setClassArms(classArmsRes.data);
      if (subjectsRes.success) setSubjects(subjectsRes.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRules = async () => {
    if (!selectedClassArm) return;
    try {
      const result = await subjectRuleAndRegistrationService.getRules(selectedClassArm);
      if (result.success) {
        setCompulsoryRules(result.data.filter(rule => rule.selectionType === "Compulsory"));
        setOptionalRules(result.data.filter(rule => rule.selectionType === "Optional"));
        setGroupRules(result.data.filter(rule => rule.selectionType === "GroupSelection"));
      }
    } catch (error) {
      console.error("Failed to fetch rules:", error);
    }
  };

  useEffect(() => {
    if (selectedClassArm) {
      fetchRules();
    }
  }, [selectedClassArm]);

  // ==================== COMPULSORY SUBJECTS ====================
  const handleAddCompulsory = async () => {
    if (!selectedClassArm || !selectedCompulsorySubject) {
      toast.error("Please select both class arm and subject");
      return;
    }

    try {
      setLoading(true);
      const result = await subjectRuleAndRegistrationService.addCompulsorySubject(
        selectedClassArm,
        { subjectId: selectedCompulsorySubject }
      );
      
      if (result.success) {
        toast.success("Compulsory subject added successfully");
        setSelectedCompulsorySubject("");
        await fetchRules();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to add compulsory subject");
    } finally {
      setLoading(false);
    }
  };

  // ==================== OPTIONAL SUBJECTS ====================
  const handleAddOptional = async () => {
    if (!selectedClassArm || !selectedOptionalSubject) {
      toast.error("Please select both class arm and subject");
      return;
    }

    try {
      setLoading(true);
      const result = await subjectRuleAndRegistrationService.addOptionalSubject(
        selectedClassArm,
        { subjectId: selectedOptionalSubject }
      );
      
      if (result.success) {
        toast.success("Optional subject added successfully");
        setSelectedOptionalSubject("");
        await fetchRules();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to add optional subject");
    } finally {
      setLoading(false);
    }
  };

  // ==================== GROUP RULES ====================
  const addSubjectField = () => {
    setGroupFormData((prev) => ({
      ...prev,
      subjectIds: [...prev.subjectIds, ""],
    }));
  };

  const removeSubjectField = (index) => {
    if (groupFormData.subjectIds.length <= 1) return;
    setGroupFormData((prev) => ({
      ...prev,
      subjectIds: prev.subjectIds.filter((_, i) => i !== index),
    }));
  };

  const updateSubjectField = (index, value) => {
    setGroupFormData((prev) => {
      const updatedSubjectIds = [...prev.subjectIds];
      updatedSubjectIds[index] = value;
      return { ...prev, subjectIds: updatedSubjectIds };
    });
  };

  const handleAddGroup = async () => {
    const validSubjects = groupFormData.subjectIds.filter(id => id);
    if (!selectedClassArm || validSubjects.length === 0) {
      toast.error("Please select class arm and at least one subject");
      return;
    }

    if (groupFormData.minSelect > groupFormData.maxSelect) {
      toast.error("Min select cannot be greater than max select");
      return;
    }

    if (groupFormData.minSelect < 0 || groupFormData.maxSelect > validSubjects.length) {
      toast.error(`Min/Max must be between 0 and ${validSubjects.length}`);
      return;
    }

    try {
      setLoading(true);
      const result = await subjectRuleAndRegistrationService.addGroupRule(
        selectedClassArm,
        {
          subjectIds: validSubjects,
          minSelect: groupFormData.minSelect,
          maxSelect: groupFormData.maxSelect,
        }
      );
      
      if (result.success) {
        toast.success("Group rule added successfully");
        setGroupFormData({ subjectIds: [], minSelect: 1, maxSelect: 1 });
        setShowGroupForm(false);
        await fetchRules();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to add group rule");
    } finally {
      setLoading(false);
    }
  };

  // ==================== DELETE RULE ====================
  const handleDeleteRule = async (ruleId) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      try {
        const result = await subjectRuleAndRegistrationService.deleteRule(ruleId);
        if (result.success) {
          toast.success("Rule deleted successfully");
          await fetchRules();
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        toast.error(error.message || "Failed to delete rule");
      }
    }
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : "Unknown";
  };

  const getClassArmName = (classArmId) => {
    const classArm = classArms.find(c => c.id === classArmId);
    return classArm ? `${classArm.classYearName || classArm.class_year_name} (${classArm.armName || classArm.arm_name})` : "Select Class Arm";
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="p-6">
      {/* Class Arm Selection */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Class Arm
        </label>
        <Dropdown
          label={selectedClassArm ? getClassArmName(selectedClassArm) : "Select Class Arm"}
          items={classArms.map((classArm) => ({
            label: `${classArm.classYearName || classArm.class_year_name} (${classArm.armName || classArm.arm_name})`,
            onClick: () => {
              setSelectedClassArm(classArm.id);
              setShowGroupForm(false);
            },
          }))}
        />
      </div>

      {!selectedClassArm && (
        <div className="text-center py-12 text-gray-500">
          Please select a class arm to configure subject rules
        </div>
      )}

      {selectedClassArm && (
        <>
          {/* Compulsory Subjects Section */}
          <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection("compulsory")}
              className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <h3 className="font-semibold text-[#07508F]">Compulsory Subjects</h3>
              {openSections.compulsory ? <FiChevronDown /> : <FiChevronRight />}
            </button>
            
            {openSections.compulsory && (
              <div className="p-4">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <Dropdown
                      label={selectedCompulsorySubject ? getSubjectName(selectedCompulsorySubject) : "Select Subject"}
                      items={subjects.map((subject) => ({
                        label: subject.name,
                        onClick: () => setSelectedCompulsorySubject(subject.id),
                      }))}
                    />
                  </div>
                  <button
                    onClick={handleAddCompulsory}
                    disabled={loading || !selectedCompulsorySubject}
                    className="bg-[#07508F] text-white px-4 py-2 rounded-md hover:bg-[#05406e] disabled:opacity-50 flex items-center gap-2"
                  >
                    <FiPlus /> Add
                  </button>
                </div>
                
                {compulsoryRules.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No compulsory subjects added yet</p>
                ) : (
                  <div className="space-y-2">
                    {compulsoryRules.map((rule) => (
                      <div key={rule.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                        <span className="font-medium">{rule.subjectName}</span>
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Optional Subjects Section */}
          <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection("optional")}
              className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <h3 className="font-semibold text-[#07508F]">Optional Subjects</h3>
              {openSections.optional ? <FiChevronDown /> : <FiChevronRight />}
            </button>
            
            {openSections.optional && (
              <div className="p-4">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <Dropdown
                      label={selectedOptionalSubject ? getSubjectName(selectedOptionalSubject) : "Select Subject"}
                      items={subjects.map((subject) => ({
                        label: subject.name,
                        onClick: () => setSelectedOptionalSubject(subject.id),
                      }))}
                    />
                  </div>
                  <button
                    onClick={handleAddOptional}
                    disabled={loading || !selectedOptionalSubject}
                    className="bg-[#07508F] text-white px-4 py-2 rounded-md hover:bg-[#05406e] disabled:opacity-50 flex items-center gap-2"
                  >
                    <FiPlus /> Add
                  </button>
                </div>
                
                {optionalRules.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No optional subjects added yet</p>
                ) : (
                  <div className="space-y-2">
                    {optionalRules.map((rule) => (
                      <div key={rule.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                        <span className="font-medium">{rule.subjectName}</span>
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Group Rules Section */}
          <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection("groupRules")}
              className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <h3 className="font-semibold text-[#07508F]">Group Selection Rules</h3>
              {openSections.groupRules ? <FiChevronDown /> : <FiChevronRight />}
            </button>
            
            {openSections.groupRules && (
              <div className="p-4">
                {!showGroupForm && (
                  <button
                    onClick={() => setShowGroupForm(true)}
                    className="flex items-center gap-2 text-[#07508F] hover:text-[#05406e] mb-4"
                  >
                    <FiPlus /> Add New Group Rule
                  </button>
                )}

                {showGroupForm && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                    <h4 className="font-semibold mb-4">Create New Group Rule</h4>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subjects in this Group
                      </label>
                      {groupFormData.subjectIds.map((subjectId, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          <div className="flex-1">
                            <Dropdown
                              label={subjectId ? getSubjectName(subjectId) : "Select Subject"}
                              items={subjects.map((subject) => ({
                                label: subject.name,
                                onClick: () => updateSubjectField(index, subject.id),
                              }))}
                            />
                          </div>
                          {groupFormData.subjectIds.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSubjectField(index)}
                              className="text-red-500"
                            >
                              <FiX size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addSubjectField}
                        className="flex items-center gap-1 text-sm text-[#07508F] mt-2"
                      >
                        <FiPlus size={14} /> Add another subject
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Subjects to Select
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={groupFormData.subjectIds.filter(id => id).length}
                          value={groupFormData.minSelect}
                          onChange={(e) => setGroupFormData(prev => ({ ...prev, minSelect: parseInt(e.target.value) || 0 }))}
                          className="w-full border border-gray-300 rounded-md p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Subjects to Select
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={groupFormData.subjectIds.filter(id => id).length}
                          value={groupFormData.maxSelect}
                          onChange={(e) => setGroupFormData(prev => ({ ...prev, maxSelect: parseInt(e.target.value) || 0 }))}
                          className="w-full border border-gray-300 rounded-md p-2"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleAddGroup}
                        disabled={loading}
                        className="bg-[#07508F] text-white px-4 py-2 rounded-md hover:bg-[#05406e] disabled:opacity-50"
                      >
                        Save Group Rule
                      </button>
                      <button
                        onClick={() => {
                          setShowGroupForm(false);
                          setGroupFormData({ subjectIds: [], minSelect: 1, maxSelect: 1 });
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {groupRules.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No group rules added yet</p>
                ) : (
                  <div className="space-y-3">
                    {groupRules.map((rule) => (
                      <div key={rule.id} className="p-3 bg-gray-50 rounded-lg border">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-sm text-gray-600">
                              Select {rule.minSelect} - {rule.maxSelect} subjects from:
                            </span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {rule.groupSubjects?.map((subject, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                                  {subject.subjectName}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SubjectRulesManagement;