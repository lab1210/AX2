"use client";
import React, { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Country, State, City } from "country-state-city";
import Token from "../../../Components/StudentRegForm/Token";
import Personal from "../../../Components/StudentRegForm/Personal";
import Admission from "../../../Components/StudentRegForm/Admission";
import Parent from "../../../Components/StudentRegForm/Parent";
import TeacherDetails from "../../../Components/TeacherRegForm/TeacherDetails";
import VerifyCV from "../../../Components/TeacherRegForm/verifyCV";

const StudentRegistrationForm = () => {
  const pathname = usePathname();
  const role = pathname.includes("/teacher")
    ? "teacher"
    : pathname.includes("/student")
    ? "student"
    : null;
  const router = useRouter();
  const [token, setToken] = useState("");
  const [personalInfo, setPersonalInfo] = useState({});
  const [admissionInfo, setAdmissionInfo] = useState({});

  const [parentInfo, setParentInfo] = useState({});
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  // Personal info locations
  const [personalStates, setPersonalStates] = useState([]);
  const [personalCities, setPersonalCities] = useState([]);

  // Parent info locations
  const [parentStates, setParentStates] = useState([]);
  const [parentCities, setParentCities] = useState([]);

  const [teacherState, setTeacherState] = useState([]);
  const [teacherCities, setTeacherCities] = useState([]);

  const handleTokenError = (newErrors) => {
    setErrors(newErrors);
  };
  useEffect(() => {
    const countriesData = Country.getAllCountries();
    setCountries(countriesData);
  }, []);

  const handleCountryChange = (e, type = "personal") => {
    const countryCode = e.target.value;

    if (type === "personal") {
      const statesData = State.getStatesOfCountry(countryCode);
      setPersonalStates(statesData);
      setPersonalCities([]); // reset cities when country changes
      setPersonalInfo({ ...personalInfo, country: countryCode });
    } else if (type === "parent") {
      const statesData = State.getStatesOfCountry(countryCode);
      setParentStates(statesData);
      setParentCities([]);
      setParentInfo({ ...parentInfo, country: countryCode });
    }
  };

  const handleStateChange = (e, type = "personal") => {
    const stateCode = e.target.value;

    if (type === "personal") {
      const citiesData = City.getCitiesOfState(personalInfo.country, stateCode);
      setPersonalCities(citiesData);
      setPersonalInfo({ ...personalInfo, state: stateCode });
    } else if (type === "parent") {
      const citiesData = City.getCitiesOfState(parentInfo.country, stateCode);
      setParentCities(citiesData);
      setParentInfo({ ...parentInfo, state: stateCode });
    }
  };

  const handleInputChange = (e, section, field) => {
    const value = e.target.value;
    if (section === "personalInfo") {
      setPersonalInfo({ ...personalInfo, [field]: value });
    } else if (section === "admissionInfo") {
      setAdmissionInfo({ ...admissionInfo, [field]: value });
    } else if (section === "parentInfo") {
      setParentInfo({ ...parentInfo, [field]: value });
    }
  };

  const validateFields = () => {
    const newErrors = {};

    if (!token) newErrors.token = "Token is required.";

    const requiredPersonal = [
      "first_name",
      "middle_name",
      "last_name",
      "gender",
      "date_of_birth",
      "country",
      "state",
      "city",
    ];
    const personalErrors = {};
    requiredPersonal.forEach((field) => {
      if (!personalInfo[field]) {
        personalErrors[field] = `this field is required.`;
      }
    });
    if (Object.keys(personalErrors).length > 0)
      newErrors.personalInfo = personalErrors;

    const requiredAdmission = [
      "admissionNumber",
      "admissionDate",
      "classYear",
      "classArm",
    ];
    const admissionErrors = {};
    requiredAdmission.forEach((field) => {
      if (!admissionInfo[field]) {
        admissionErrors[field] = `this field is required.`;
      }
    });
    if (Object.keys(admissionErrors).length > 0)
      newErrors.admissionInfo = admissionErrors;

    const requiredParent = [
      "ParentfirstName",
      "ParentmiddleName",
      "ParentlastName",
      "Occupation",
      "PhoneNumber",
      "Email",
      "EmergencyContact",
      "ParentGender",
      "country",
      "state",
      "city",
      "Relationship",
    ];
    const parentErrors = {};
    requiredParent.forEach((field) => {
      if (!parentInfo[field]) {
        parentErrors[field] = `this field is required.`;
      }
    });
    if (Object.keys(parentErrors).length > 0)
      newErrors.parentInfo = parentErrors;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNextForStudent = () => {
    if (!validateFields()) {
      return;
    }
    const studentInfo = {
      ...personalInfo,
      ...admissionInfo,
      ...parentInfo,
    };
    localStorage.setItem(
      "studentRegistrationInfo",
      JSON.stringify(studentInfo)
    );
    router.push(`${registrationFormPath}Profile`);
  };

  if (!role) {
    return <p className="text-center mt-8 text-red-500">Role not specified.</p>;
  }

  const registrationFormPath = `/Register/${role}/`;

  return (
    <form className="bg-white max-w-full flex flex-col">
      {/* Top Bar */}
      <div className="bg-[#01427a] text-white flex justify-between items-center px-8 py-5 font-bold">
        <h2 className="text-2xl">
          {role === "teacher"
            ? "Teacher's Registration"
            : "Student Registration"}
        </h2>
        <Link href={"/Register"}>
          <IoIosCloseCircleOutline className="size-6 cursor-pointer" />
        </Link>
      </div>

      <div className="w-full">
        <Token
          token={token}
          setToken={setToken}
          error={errors.token}
          setErrors={handleTokenError}
        />
        <hr className="border-[#0000001a] -mx-8 my-0" />

        {role === "student" ? (
          <Personal
            personalInfo={personalInfo}
            setPersonalInfo={setPersonalInfo}
            errors={errors.personalInfo}
            handleInputChange={handleInputChange}
            countries={countries}
            states={personalStates}
            cities={personalCities}
            handleCountryChange={(e) => handleCountryChange(e, "personal")}
            handleStateChange={(e) => handleStateChange(e, "personal")}
          />
        ) : (
          <TeacherDetails
            personalInfo={personalInfo}
            setPersonalInfo={setPersonalInfo}
            errors={errors.personalInfo}
            handleInputChange={handleInputChange}
            countries={countries}
            handleCountryChange={handleCountryChange}
            handleStateChange={handleStateChange}
            // states={states}
            // cities={cities}
          />
        )}
        <hr className="border-[#0000001a] -mx-8 my-0" />

        {role === "student" && (
          <>
            <Admission
              admissionInfo={admissionInfo}
              setadmissionInfo={setAdmissionInfo}
              error={errors.admissionInfo}
              handleInputChange={handleInputChange}
            />
            <hr className="border-[#0000001a] -mx-8 my-0" />
            <Parent
              parentInfo={parentInfo}
              setParentInfo={setParentInfo}
              handleInputChange={handleInputChange}
              errors={errors.parentInfo}
              countries={countries}
              states={parentStates}
              cities={parentCities}
              handleCountryChange={(e) => handleCountryChange(e, "parent")}
              handleStateChange={(e) => handleStateChange(e, "parent")}
            />
          </>
        )}

        {role === "teacher" && <VerifyCV />}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pr-4 pb-3">
        <button
          type="button"
          className="bg-[#01427a] text-white text-base rounded-lg px-10 py-5 cursor-pointer hover:bg-[#01427a]/90 transition-colors"
          onClick={() => handleNextForStudent()}
        >
          Next Page
        </button>
      </div>
    </form>
  );
};

export default StudentRegistrationForm;
