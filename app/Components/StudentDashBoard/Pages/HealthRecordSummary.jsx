"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../../Components/Studentlayout";
import { PiPencilSimpleLine } from "react-icons/pi";

export default function RecordSummary() {
  const router = useRouter();
  const [healthRecord, setHealthRecord] = useState(null);

  // On component mount, fetch the saved health record from localStorage
  useEffect(() => {
    const storedRecord = localStorage.getItem("healthRecord");
    if (storedRecord) {
      setHealthRecord(JSON.parse(storedRecord));
    }
  }, []);

  // Handle edit button
  const handleEdit = () => {
    router.push("/Student/Health-Record/Record");
  };

  // Handle "View all"
  const handleViewAll = () => {
    console.log("View all past records...");
  };

  if (!healthRecord) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[100vh]">
          <p className="text-gray-500">No Health Record Found</p>
        </div>
      </Layout>
    );
  }

  const {
    name,
    className,
    dob,
    age,
    classes,
    gender,
    weight,
    height,
    bloodGroup,
    genotype,
    hadSurgery,
    surgeryDetails,
    hasEyeDefect,
    eyeDefectDetails,
    allergies,
    allergiesDetails,
    regularMedications,
    medicationsDetails,
    hearingDifficulties,
    hearingDetails,
    currentMedication,
    currentMedicationDetails,
    emergencyCondition,
    emergencyConditionDetails,
    heartChallenges,
    heartChallengesDetails,
    physicalDisabilities,
    physicalDisabilitiesDetails,
    dietaryNeeds,
    dietaryNeedsDetails,
  } = healthRecord;

  return (
    <Layout>
      {/* Desktop View (unchanged) */}
      <div className="hidden lg:block">
        <div className="bg-gray-100 min-h-screen p-4 md:p-8">
          <div className="bg-white rounded-md shadow p-6 flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img
                src="/female.png"
                alt="Avatar"
                className="object-cover h-full"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                {name}
              </h1>
            </div>
          </div>

          {/* Student Info Card */}
          <div className="bg-white rounded-md shadow p-6 mb-4">
            <h2 className="text-lg font-semibold text-[#01427A] mb-4">
              Student Information
            </h2>
            <div className="grid gap-2 text-sm text-gray-700">
              <p>
                <span className="font-bold">Class:</span> {className}
              </p>
              <p>
                <span className="font-bold">DOB:</span> {dob}
              </p>
              <p>
                <span className="font-bold">Gender:</span> {gender}
              </p>
              <p>
                <span className="font-bold">Age:</span> {age}
              </p>
            </div>
          </div>

          {/* Current Health Record */}
          <div className="bg-[#E6ECF2] rounded-md shadow p-6 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                Student's Health Record
              </h2>
              <button
                onClick={handleEdit}
                className="text-md font-semibold bg-[#E6ECF2] text-[#F94144] py-1 px-3 cursor-pointer hover:underline"
              >
                Edit
              </button>
            </div>

            <div className="grid gap-4]">
              <div className="flex justify-between">
                <p className="text-black font-semibold mb-1">Body Weight:</p>
                <p className="text-black">{weight || "N/A"}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-black font-semibold mb-1">Height:</p>
                <p className="text-black">{height || "N/A"}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-black font-semibold mb-1">Blood Group:</p>
                <p className="text-black">{bloodGroup || "N/A"}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-black font-semibold mb-1">Genotype:</p>
                <p className="text-black">{genotype || "N/A"}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-black font-semibold mb-1">
                  Current Medication:
                </p>
                <p className="text-black">
                  {currentMedicationDetails || "N/A"}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-black font-semibold mb-1">
                  Emergency Condition:
                </p>
                <p className="text-black">
                  {emergencyConditionDetails || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Past Health Record */}
          <div className="bg-white rounded-md shadow p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#01427A]">
                Past Health Record
              </h2>
              <button
                onClick={handleViewAll}
                className="text-sm text-blue-600 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  {/* Had Surgery */}
                  <tr className="border-b border-gray-300">
                    <td className="py-2 border-r border-gray-300">
                      Had surgery before?
                    </td>
                    <td className="py-2 border-r border-gray-300 text-center">
                      {hadSurgery === "Yes" ? "Yes" : "No"}
                    </td>
                    <td className="py-2 text-right">
                      {hadSurgery === "Yes" ? surgeryDetails || "N/A" : "Nil"}
                    </td>
                  </tr>

                  {/* Eye Defect */}
                  <tr className="border-b border-gray-300">
                    <td className="py-2 border-r border-gray-300">
                      Eye defect?
                    </td>
                    <td className="py-2 border-r border-gray-300 text-center">
                      {hasEyeDefect === "Yes" ? "Yes" : "No"}
                    </td>
                    <td className="py-2 text-right">
                      {hasEyeDefect === "Yes"
                        ? eyeDefectDetails || "N/A"
                        : "Nil"}
                    </td>
                  </tr>

                  {/* Allergies */}
                  <tr className="border-b border-gray-300">
                    <td className="py-2 border-r border-gray-300">
                      Allergies?
                    </td>
                    <td className="py-2 border-r border-gray-300 text-center">
                      {allergies === "Yes" ? "Yes" : "No"}
                    </td>
                    <td className="py-2 text-right">
                      {allergies === "Yes" ? allergiesDetails || "N/A" : "Nil"}
                    </td>
                  </tr>

                  {/* Regular Medications */}
                  <tr className="border-b border-gray-300">
                    <td className="py-2 border-r border-gray-300">
                      Regular Medications?
                    </td>
                    <td className="py-2 border-r border-gray-300 text-center">
                      {regularMedications === "Yes" ? "Yes" : "No"}
                    </td>
                    <td className="py-2 text-right">
                      {regularMedications === "Yes"
                        ? medicationsDetails || "N/A"
                        : "Nil"}
                    </td>
                  </tr>

                  {/* Hearing Difficulties */}
                  <tr className="border-b border-gray-300">
                    <td className="py-2 border-r border-gray-300">
                      Hearing Difficulties?
                    </td>
                    <td className="py-2 border-r border-gray-300 text-center">
                      {hearingDifficulties === "Yes" ? "Yes" : "No"}
                    </td>
                    <td className="py-2 text-right">
                      {hearingDifficulties === "Yes"
                        ? hearingDetails || "N/A"
                        : "Nil"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-2 border-r border-gray-300 text-left">
                      Heart challenges?
                    </td>
                    <td className="py-2 border-r border-gray-300 p-2 text-center">
                      {heartChallenges === "Yes" ? "Yes" : "No"}
                    </td>
                    <td className="py-2 text-right">
                      {heartChallenges === "Yes"
                        ? heartChallengesDetails || "N/A"
                        : "Nil"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-2 border-r border-gray-300 text-left">
                      Physical disabilities?
                    </td>
                    <td className="py-2 border-r border-gray-300 p-2 text-center">
                      {physicalDisabilities === "Yes" ? "Yes" : "No"}
                    </td>
                    <td className="py-2 text-right">
                      {physicalDisabilities === "Yes"
                        ? physicalDisabilitiesDetails || "N/A"
                        : "Nil"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-2 border-r border-gray-300 text-left">
                      Dietary Needs?
                    </td>
                    <td className="py-2 border-r border-gray-300 p-2 text-center">
                      {dietaryNeeds === "Yes" ? "Yes" : "No"}
                    </td>
                    <td className="py-2 text-right">
                      {dietaryNeeds === "Yes"
                        ? dietaryNeedsDetails || "N/A"
                        : "Nil"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet View */}
      <div className="block lg:hidden bg-white">
        <div className="bg-white rounded-md p-4 flex flex-col items-center mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
            <img
              src="/female.png"
              alt="Avatar"
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-1 text-center">
            {name}
          </h1>
          <p className="text-sm text-gray-600 text-center">{className}</p>
        </div>

        {/* Student Info Card */}
        <div className="bg-white rounded-md p-4 mb-4">
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="font-bold">Name:</span>
              <span>{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Age:</span>
              <span>{age}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Class:</span>
              <span>{classes}</span>
            </div>
          </div>
        </div>

        {/* Current Health Record */}
        <div className="bg-[#E6ECF2] rounded-md shadow p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-md font-semibold text-[#01427A]">
              Student's Health Summary
            </h2>
            <button
              onClick={handleEdit}
              className="text-sm font-semibold bg-[#E6ECF2] text-[#F94144] py-1 px-2 rounded cursor-pointer hover:underline"
            >
              Edit
            </button>
          </div>

          <div className="flex flex-col gap-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="font-semibold">Body Weight:</span>
              <span>{weight || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Height:</span>
              <span>{height || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Blood Group:</span>
              <span>{bloodGroup || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Genotype:</span>
              <span>{genotype || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Current Medication:</span>
              <span>{currentMedicationDetails || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Emergency Condition:</span>
              <span>{emergencyConditionDetails || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Past Health Record */}
        <div>
          <div className="flex justify-between items-center mb-2 bg-[#004080] rounded-lg p-2">
            <h2 className="text-lg font-bold text-white">Past Records</h2>
            <button
              onClick={handleViewAll}
              className="text-sm text-blue-600 hover:underline"
            >
              <PiPencilSimpleLine
                size={20}
                className="text-white cursor-pointer font-medium"
              />
            </button>
          </div>
          <div className="flex justify-between items-center mb-2 p-2">
            <h2 className="text-lg font-bold text-black">Medical Records</h2>
            <button
              onClick={handleViewAll}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              View all
            </button>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-center">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="py-2 border-r border-gray-300 text-left">
                    Had surgery before?
                  </td>
                  <td className="py-2 border-r border-gray-300">
                    {hadSurgery === "Yes" ? "Yes" : "No"}
                  </td>
                  <td className="py-2 text-right">
                    {hadSurgery === "Yes" ? surgeryDetails || "N/A" : "Nil"}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="py-2 border-r border-gray-300 text-left">
                    Eye defect?
                  </td>
                  <td className="py-2 border-r border-gray-300">
                    {hasEyeDefect === "Yes" ? "Yes" : "No"}
                  </td>
                  <td className="py-2 text-right">
                    {hasEyeDefect === "Yes" ? eyeDefectDetails || "N/A" : "Nil"}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="py-2 border-r border-gray-300 text-left">
                    Allergies?
                  </td>
                  <td className="py-2 border-r border-gray-300">
                    {allergies === "Yes" ? "Yes" : "No"}
                  </td>
                  <td className="py-2 text-right">
                    {allergies === "Yes" ? allergiesDetails || "N/A" : "Nil"}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="py-2 border-r border-gray-300 text-left">
                    Regular Medications?
                  </td>
                  <td className="py-2 border-r border-gray-300">
                    {regularMedications === "Yes" ? "Yes" : "No"}
                  </td>
                  <td className="py-2 text-right">
                    {regularMedications === "Yes"
                      ? medicationsDetails || "N/A"
                      : "Nil"}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="py-2 border-r border-gray-300 text-left">
                    Hearing Difficulties?
                  </td>
                  <td className="py-2 border-r border-gray-300 p-2">
                    {hearingDifficulties === "Yes" ? "Yes" : "No"}
                  </td>
                  <td className="py-2 text-right">
                    {hearingDifficulties === "Yes"
                      ? hearingDetails || "N/A"
                      : "Nil"}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="py-2 border-r border-gray-300 text-left">
                    Heart challenges?
                  </td>
                  <td className="py-2 border-r border-gray-300 p-2">
                    {heartChallenges === "Yes" ? "Yes" : "No"}
                  </td>
                  <td className="py-2 text-right">
                    {heartChallenges === "Yes"
                      ? heartChallengesDetails || "N/A"
                      : "Nil"}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="py-2 border-r border-gray-300 text-left">
                    Physical disabilities?
                  </td>
                  <td className="py-2 border-r border-gray-300 p-2">
                    {physicalDisabilities === "Yes" ? "Yes" : "No"}
                  </td>
                  <td className="py-2 text-right">
                    {physicalDisabilities === "Yes"
                      ? physicalDisabilitiesDetails || "N/A"
                      : "Nil"}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="py-2 border-r border-gray-300 text-left">
                    Dietary Needs?
                  </td>
                  <td className="py-2 border-r border-gray-300 p-2">
                    {dietaryNeeds === "Yes" ? "Yes" : "No"}
                  </td>
                  <td className="py-2 text-right">
                    {dietaryNeeds === "Yes"
                      ? dietaryNeedsDetails || "N/A"
                      : "Nil"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
