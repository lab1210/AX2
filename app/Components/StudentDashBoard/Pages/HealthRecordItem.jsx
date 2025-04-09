"use client"; 
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../../Components/Studentlayout";
import { useUser } from "../context/UserProvider";

export default function HealthRecordPage() {
  const student = {
    name: "Ife Babalola Adesina",
    profilePic: "/female.png", 
    className: "SSS 1B",
    dob: "13/01/2000",
    gender: "Female",
  };
  const {isLoading } = useUser();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-full z-[1000]">
        <div className="border-4 border-[rgba(0,64,128,1)] border-t-[rgba(249,65,68,1)] rounded-full w-[50px] h-[50px] animate-spin"></div>
      </div>
    );
  }

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [genotype, setGenotype] = useState("");
  const [surgeryDetails, setSurgeryDetails] = useState("");
  const [hasEyeDefect, setHasEyeDefect] = useState("");
  const [eyeDefectDetails, setEyeDefectDetails] = useState("");
  const [hadSurgery, setHadSurgery] = useState("");
  const [allergies, setAllergies] = useState("");
  const [allergiesDetails, setAllergiesDetails] = useState("");
  const [regularMedications, setRegularMedications] = useState("");
  const [medicationsDetails, setMedicationsDetails] = useState("");
  const [hearingDifficulties, setHearingDifficulties] = useState("");
  const [hearingDetails, setHearingDetails] = useState("");

  const handleProceed = (e) => {
    e.preventDefault();
    const healthRecord = {
      name: student.name,
      className: student.className,
      dob: student.dob,
      gender: student.gender,
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
    };
  
    localStorage.setItem("healthRecord", JSON.stringify(healthRecord));
    console.log("Health Record saved:", healthRecord);
    router.push("/Student/Health-Record/RecordSummary");
  };
  

  return (
    <Layout>
    <div className="min-h-screen bg-[#f0f0f0] p-4 md:p-8">
      <div className="bg-white rounded-md shadow p-6 flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          {student.profilePic && (
            <img
              src={student.profilePic}
              alt="Avatar"
              className="object-cover h-full"
            />
          )}
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          {student.name}
        </h1>
      </div>

      {/* Student Info Card */}
      <div className="bg-white rounded-md shadow p-6 mb-4">
        <h2 className="text-lg font-semibold text-[#01427A] mb-4">
          Student Information
        </h2>
        <div className="grid gap-2 text-sm text-gray-700">
          <p>
            <span className="font-bold">Class:</span> {student.className}
          </p>
          <p>
            <span className="font-bold">Student ID:</span> 001
          </p>
          <p>
            <span className="font-bold">DOB:</span> {student.dob}
          </p>
          <p>
            <span className="font-bold">Gender:</span> {student.gender}
          </p>
        </div>
      </div>

      {/* Personal Data Card */}
      <div className=" bg-white rounded-md shadow p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Personal Data
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          
          <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Weight</label>
          <input
            type="text"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 70kg"
            className="border-b-[1px] border-gray-300 rounded p-1 focus:border-gray-500 outline-none"
          />
            
          </div>
          {/* Height */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 mb-1">
              Height (ft)
            </label>
            <input
              type="text"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g. 5.5ft"
              className="border-b border-gray-300 rounded p-1 focus:border-gray-500 outline-none"
            />
          </div>
          {/* Blood Group */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 mb-1">
              Blood Group
            </label>
            <input
              type="text"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              placeholder="e.g. O+"
              className="border-b border-gray-300 rounded p-1 focus:border-gray-500 outline-none"
            />
          </div>
          {/* Genotype */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 mb-1">Genotype</label>
            <input
              type="text"
              value={genotype}
              onChange={(e) => setGenotype(e.target.value)}
              placeholder="e.g. AS"
              className="border-b border-gray-300 rounded p-1 focus:border-gray-500 outline-none"
            />
          </div>
        </div>

        {/* Medical Questions */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Medical Questions
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          {/* Surgery question */}
          <div>
            <p className="mb-1">Have you had surgery before?</p>
            <div className="flex items-center gap-2">
            <label>
            <input
              type="radio"
              name="surgery"
              value="Yes"
              onChange={(e) => setHadSurgery(e.target.value)}
            />
            Yes
            </label>
            <label>
            <input
              type="radio"
              name="surgery"
              value="No"
              onChange={(e) => setHadSurgery(e.target.value)}
            />
            No
            </label>
            </div>
            <div className="flex items-center gap-2">
            <p className="mt-1">If Yes, Kindly Specify</p>
            <input
              type="text"
              value={surgeryDetails}
              onChange={(e) => setSurgeryDetails(e.target.value)}
              placeholder="Enter details"
              className="border-b border-gray-300 rounded p-1 focus:border-gray-500 outline-none"
            />
            </div>
          </div>

          {/* Eye defect question */}
          <div>
            <p className="mb-1">Do you have any eye defect?</p>
            <div className="flex items-center gap-2">
            <label>
            <input
              type="radio"
              name="eyeDefect"
              value="Yes"
              onChange={(e) => setHasEyeDefect(e.target.value)}
            />
            Yes
            </label>
            <label>
            <input
              type="radio"
              name="eyeDefect"
              value="No"
              onChange={(e) => setHasEyeDefect(e.target.value)}
              />
              No
            </label>
            </div>
            <div className="flex items-center gap-2">
            <p className="mt-1">If Yes, Kindly Specify</p>
            <input
              type="text"
              value={eyeDefectDetails}
              onChange={(e) => setEyeDefectDetails(e.target.value)}
              placeholder="Enter details"
              className="border-b border-gray-300 rounded p-1 outline-none"
            />
            </div>
          </div>
          {/*Allegies*/}
          <div>
            <p className="mb-1">Do you have any Allegies?</p>
            <div className="flex items-center gap-2">
            <label>
            <input
              type="radio"
              name="allegies"
              value="Yes"
              onChange={(e) => setAllergies(e.target.value)}
            />
            Yes
            </label>
            <label>
            <input
              type="radio"
              name="allegies"
              value="No"
              onChange={(e) => setAllergies(e.target.value)}
              />
              No
            </label>
            </div>
            <div className="flex items-center gap-2">
            <p className="mt-1">If Yes, Kindly Specify</p>
            <input
              type="text"
              value={allergiesDetails}
              onChange={(e) => setAllergiesDetails(e.target.value)}
              placeholder="Enter details"
              className="border-b border-gray-300 rounded p-1 outline-none"
            />
            </div>
          </div>
          {/*Regular Medication */}
          <div>
            <p className="mb-1">Do you take any medication regularly?</p>
            <div className="flex items-center gap-2">
            <label>
            <input
              type="radio"
              name="medication"
              value="Yes"
              onChange={(e) => setRegularMedications(e.target.value)}
            />
            Yes
            </label>
            <label>
            <input
              type="radio"
              name="medication"
              value="No"
              onChange={(e) => setRegularMedications(e.target.value)}
              />
              No
            </label>
            </div>
            <div className="flex items-center gap-2">
            <p className="mt-1">If Yes, Kindly Specify</p>
            <input
              type="text"
              value={medicationsDetails}
              onChange={(e) => setMedicationsDetails(e.target.value)}
              placeholder="Enter details"
              className="border-b border-gray-300 rounded p-1 outline-none"
            />
            </div>
          </div>
          {/*Hearing details */}
          <div>
            <p className="mb-1">Do you have any hearing difficulties?</p>
            <div className="flex items-center gap-2">
            <label>
            <input
              type="radio"
              name="hearing"
              value="Yes"
              onChange={(e) => setHearingDifficulties(e.target.value)}
            />
            Yes
            </label>
            <label>
            <input
              type="radio"
              name="hearing"
              value="No"
              onChange={(e) => setHearingDifficulties(e.target.value)}
              />
              No
            </label>
            </div>
            <div className="flex items-center gap-2">
            <p className="mt-1">If Yes, Kindly Specify</p>
            <input
              type="text"
              value={hearingDetails}
              onChange={(e) => setHearingDetails(e.target.value)}
              placeholder="Enter details"
              className="border-b border-gray-300 rounded p-1 outline-none"
            />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
        <button
              type="submit"
              onClick={handleProceed}
              className="mt-4 bg-[#004080] text-white font-semibold py-2 px-47 rounded hover:opacity-90 transition-colors cursor-pointer"
            >
              Proceed
            </button>
        </div>
      </div>
    </div>
    </Layout>
  );
}