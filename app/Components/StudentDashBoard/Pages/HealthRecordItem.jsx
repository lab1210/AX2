"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../../Components/Studentlayout";
import { getUserDetails } from "../../../Service/AuthService";

export default function HealthRecordPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
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
  const [physicalDisabilities, setPhysicalDisabilities] = useState("");
  const [physicalDisabilitiesDetails, setPhysicalDisabilitiesDetails] =
    useState("");
  const [heartChallenges, setHeartChallenges] = useState("");
  const [heartChallengesDetails, setHeartChallengesDetails] = useState("");
  const [dietaryNeeds, setDietaryNeeds] = useState("");
  const [dietaryNeedsDetails, setDietaryNeedsDetails] = useState("");
  const [onMedicationCurrently, setOnMedicationCurrently] = useState("");
  const [currentMedicationDetails, setCurrentMedicationDetails] = useState("");
  const [medicalEmergencyCondition, setMedicalEmergencyCondition] =
    useState("");
  const [emergencyConditionDetails, setEmergencyConditionDetails] =
    useState("");
  const [proceedButtonActive, setProceedButtonActive] = useState(false);

  useEffect(() => {
    const userData = getUserDetails();
    setUser(userData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const isWeightFilled = weight.trim() !== "";
    const isHeightFilled = height.trim() !== "";
    const isBloodGroupFilled = bloodGroup.trim() !== "";
    const isGenotypeFilled = genotype.trim() !== "";
    const isHadSurgerySelected = hadSurgery !== "";
    const isHasEyeDefectSelected = hasEyeDefect !== "";
    const isAllergiesSelected = allergies !== "";
    const isRegularMedicationsSelected = regularMedications !== "";
    const isHearingDifficultiesSelected = hearingDifficulties !== "";
    const isPhysicalDisabilitiesSelected = physicalDisabilities !== "";
    const isHeartChallengesSelected = heartChallenges !== "";
    const isDietaryNeedsSelected = dietaryNeeds !== "";
    const isOnMedicationCurrentlySelected = onMedicationCurrently !== "";
    const isMedicalEmergencyConditionSelected =
      medicalEmergencyCondition !== "";

    setProceedButtonActive(
      isWeightFilled &&
        isHeightFilled &&
        isBloodGroupFilled &&
        isGenotypeFilled &&
        isHadSurgerySelected &&
        isHasEyeDefectSelected &&
        isAllergiesSelected &&
        isRegularMedicationsSelected &&
        isHearingDifficultiesSelected &&
        isPhysicalDisabilitiesSelected &&
        isHeartChallengesSelected &&
        isDietaryNeedsSelected &&
        isOnMedicationCurrentlySelected &&
        isMedicalEmergencyConditionSelected
    );
  }, [
    weight,
    height,
    bloodGroup,
    genotype,
    hadSurgery,
    hasEyeDefect,
    allergies,
    regularMedications,
    hearingDifficulties,
    physicalDisabilities,
    heartChallenges,
    dietaryNeeds,
    onMedicationCurrently,
    medicalEmergencyCondition,
  ]);

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-full z-[1000]">
        <div className="border-4 border-[rgba(0,64,128,1)] border-t-[rgba(249,65,68,1)] rounded-full w-[50px] h-[50px] animate-spin"></div>
      </div>
    );
  }
  const handleProceed = (e) => {
    e.preventDefault();
    if (!proceedButtonActive) {
      alert("Please fill in all the required fields and select radio options.");
      return;
    }
    const healthRecord = {
      name: user?.student?.first_name + " " + user?.student?.last_name,
      className: "",
      dob: "",
      gender: "",
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
      physicalDisabilities,
      physicalDisabilitiesDetails,
      heartChallenges,
      heartChallengesDetails,
      dietaryNeeds,
      dietaryNeedsDetails,
      onMedicationCurrently,
      currentMedicationDetails,
      medicalEmergencyCondition,
      emergencyConditionDetails,
    };

    localStorage.setItem("healthRecord", JSON.stringify(healthRecord));
    console.log("Health Record saved:", healthRecord);
    router.push("/Student/Health-Record/RecordSummary");
  };

  const renderQuestion = (
    question,
    state,
    setState,
    detailsState,
    setDetailsState
  ) => (
    <div className="mb-4">
      <p className="mb-1">{question}</p>
      <div className="flex items-center gap-2 mb-1">
        <label>
          <input
            type="radio"
            name={question.replace(/ /g, "")}
            value="Yes"
            checked={state === "Yes"}
            onChange={(e) => setState(e.target.value)}
            required
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            name={question.replace(/ /g, "")}
            value="No"
            checked={state === "No"}
            onChange={(e) => setState(e.target.value)}
            required
          />
          No
        </label>
      </div>
      {state === "Yes" &&
        detailsState !== undefined &&
        setDetailsState !== undefined && (
          <div className="flex items-center gap-2">
            <p className="mt-1">If Yes, Kindly Specify</p>
            <input
              type="text"
              value={detailsState}
              onChange={(e) => setDetailsState(e.target.value)}
              placeholder="Enter details"
              className="border-b border-gray-300 rounded p-1 focus:border-gray-500 outline-none w-full sm:w-auto"
            />
          </div>
        )}
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-[#f0f0f0] p-4 md:p-8">
        <div className="bg-white rounded-md shadow p-6 flex flex-col md:flex-row items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src={
                user?.student?.profile_picture_path === null
                  ? "/female.png"
                  : user?.student?.profile_picture_path
              }
              alt="Avatar"
              className="object-cover h-full w-full"
            />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            {user?.student?.first_name + " " + user?.student?.last_name}
          </h1>
        </div>

        {/* Student Info Card */}
        <div className="bg-white rounded-md shadow p-6 mb-4">
          <h2 className="text-lg font-semibold text-[#01427A] mb-4">
            Student Information
          </h2>
          <div className="grid gap-4 text-sm text-gray-700 grid-rows-4">
            <p>
              <span className="font-bold">Class:</span> {""}
            </p>
            <p>
              <span className="font-bold">Student ID:</span> {user?.id}
            </p>
            <p>
              <span className="font-bold">DOB:</span> {""}
            </p>
            <p>
              <span className="font-bold">Gender:</span> {""}
            </p>
          </div>
        </div>

        {/* Personal Data Card */}
        <div className=" bg-white rounded-md shadow p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Personal Data
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <label className="text-sm text-gray-600 w-full sm:w-auto">
                Weight
              </label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 70kg"
                className="border-b-[1px] border-gray-300 rounded p-1 focus:border-gray-500 outline-none w-full sm:w-auto"
                required
              />
            </div>
            {/* Height */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <label className="text-sm text-gray-600 w-full sm:w-auto">
                Height (ft)
              </label>
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 5.5ft"
                className="border-b border-gray-300 rounded p-1 focus:border-gray-500 outline-none w-full sm:w-auto"
                required
              />
            </div>
            {/* Blood Group */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <label className="text-sm text-gray-600 w-full sm:w-auto">
                Blood Group
              </label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                placeholder="e.g. O+"
                className="border-b border-gray-300 rounded p-1 focus:border-gray-500 outline-none w-full sm:w-auto"
                required
              />
            </div>
            {/* Genotype */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <label className="text-sm text-gray-600 w-full sm:w-auto">
                Genotype
              </label>
              <input
                type="text"
                value={genotype}
                onChange={(e) => setGenotype(e.target.value)}
                placeholder="e.g. AS"
                className="border-b border-gray-300 rounded p-1 focus:border-gray-500 outline-none w-full sm:w-auto"
                required
              />
            </div>
          </div>
        </div>

        {/* Medical Questions */}
        <div className=" bg-white rounded-md shadow p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Medical Questions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-gray-700">
            {renderQuestion(
              "Have you had surgery before?",
              hadSurgery,
              setHadSurgery,
              surgeryDetails,
              setSurgeryDetails
            )}
            {renderQuestion(
              "Do you have any eye defect?",
              hasEyeDefect,
              setHasEyeDefect,
              eyeDefectDetails,
              setEyeDefectDetails
            )}
            {renderQuestion(
              "Do you have physical disabilities?",
              physicalDisabilities,
              setPhysicalDisabilities,
              physicalDisabilitiesDetails,
              setPhysicalDisabilitiesDetails
            )}
            {renderQuestion(
              "Do you have any heart relating challenges?",
              heartChallenges,
              setHeartChallenges,
              heartChallengesDetails,
              setHeartChallengesDetails
            )}
            {renderQuestion(
              "Do you have any allergy?",
              allergies,
              setAllergies,
              allergiesDetails,
              setAllergiesDetails
            )}
            {renderQuestion(
              "Do you take any medication that you take on a regular basis?",
              regularMedications,
              setRegularMedications,
              medicationsDetails,
              setMedicationsDetails
            )}
            {renderQuestion(
              "Do you have regular dietary needs?",
              dietaryNeeds,
              setDietaryNeeds,
              dietaryNeedsDetails,
              setDietaryNeedsDetails
            )}
            {renderQuestion(
              "Are you on on a medication currently?",
              onMedicationCurrently,
              setOnMedicationCurrently,
              currentMedicationDetails,
              setCurrentMedicationDetails
            )}
            {renderQuestion(
              "Do you have a medical condition that requires swift / emergency attention?",
              medicalEmergencyCondition,
              setMedicalEmergencyCondition,
              emergencyConditionDetails,
              setEmergencyConditionDetails
            )}
            {renderQuestion(
              "Do you have any hearing difficulties?",
              hearingDifficulties,
              setHearingDifficulties,
              hearingDetails,
              setHearingDetails
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            onClick={handleProceed}
            className={`mt-4 bg-[#004080] text-white font-semibold py-2 px-7 rounded hover:opacity-90 transition-colors cursor-pointer ${
              !proceedButtonActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!proceedButtonActive}
          >
            Proceed
          </button>
        </div>
      </div>
    </Layout>
  );
}
