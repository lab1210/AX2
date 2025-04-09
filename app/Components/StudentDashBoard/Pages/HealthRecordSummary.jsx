"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../../Components/Studentlayout";

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

  // Destructure the data for convenience
  const {
    name,
    className,
    dob,
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
  } = healthRecord;

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen p-4 md:p-8">
        {/* Top Card: Student Name + Image */}
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
              <p className="text-black">Malaria Drugs</p>
            </div>
            <div className="flex justify-between">
              <p className="text-black font-semibold mb-1">
                Emergency Condition:
              </p>
              <p className="text-black">Asthma</p>
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
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2 font-semibold text-gray-600 border-r border-gray-300">
                    Medical Informations
                  </th>
                  <th className="py-2 font-semibold text-gray-600 border-r border-gray-300">
                    Response
                  </th>
                  <th className="py-2 font-semibold text-gray-600">Details</th>
                </tr>
              </thead>
              <tbody>
                {/* Had Surgery */}
                <tr className="border-b border-gray-300">
                  <td className="py-2 border-r border-gray-300">
                    Had surgery before?
                  </td>
                  <td className="py-2 border-r border-gray-300">
                    {hadSurgery === "Yes" ? "Yes" : "No"}
                  </td>
                  <td className="py-2">
                    {hadSurgery === "Yes" ? surgeryDetails || "N/A" : "Nil"}
                  </td>
                </tr>

                {/* Eye Defect */}
                <tr className="border-b border-gray-300">
                  <td className="py-2 border-r border-gray-300">Eye defect?</td>
                  <td className="py-2 border-r border-gray-300 mr-5">
                    {hasEyeDefect === "Yes" ? "Yes" : "No"}
                  </td>
                  <td className="py-2">
                    {hasEyeDefect === "Yes" ? eyeDefectDetails || "N/A" : "Nil"}
                  </td>
                </tr>

                {/* Allergies */}
                <tr className="border-b border-gray-300">
                  <td className="py-2 border-r border-gray-300">Allergies?</td>
                  <td className="py-2 border-r border-gray-300">
                    {allergies === "Yes" ? "Yes" : "No"}
                  </td>
                  <td className="py-2">
                    {allergies === "Yes" ? allergiesDetails || "N/A" : "Nil"}
                  </td>
                </tr>

                {/* Regular Medications */}
                <tr className="border-b border-gray-300">
                  <td className="py-2 border-r border-gray-300">
                    Regular Medications?
                  </td>
                  <td className="py-2 border-r border-gray-300">
                    {regularMedications === "Yes" ? "Yes" : "No"}
                  </td>
                  <td className="py-2">
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
                  <td className="py-2 border-r border-gray-300">
                    {hearingDifficulties === "Yes" ? "Yes" : "No"}
                  </td>
                  <td className="py-2">
                    {hearingDifficulties === "Yes"
                      ? hearingDetails || "N/A"
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
