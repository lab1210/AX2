"use client";
import React, { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { usePathname } from "next/navigation";
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

  const [token, setToken] = useState("");
  const [personalInfo, setPersonalInfo] = useState({});
  const [admissionInfo, setAdmissionInfo] = useState({});
  const [parentInfo, setParentInfo] = useState({});
  const [errors, setErrors] = useState({});

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const RelationshipData = [
    { value: "Father", label: "Father" },
    { value: "Mother", label: "Mother" },
    { value: "Guardian", label: "Guardian" },
  ];

  useEffect(() => {
    const countriesData = Country.getAllCountries();
    setCountries(countriesData);
  }, []);

  const handleCountryChange = (e, type = "personal") => {
    const countryCode = e.target.value;
    const statesData = State.getStatesOfCountry(countryCode);
    setStates(statesData);
  };

  const handleStateChange = (e, type = "personal") => {
    const stateCode = e.target.value;
    const countryCode =
      (type === "personal"
        ? personalInfo.country
        : parentInfo.country
      ) || "";
    const citiesData = City.getCitiesOfState(countryCode, stateCode);
    setCities(citiesData);
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

  const handleDateChange = (date, section, field) => {
    if (section === "admissionInfo") {
      setAdmissionInfo({ ...admissionInfo, [field]: date });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form...");
  };

  if (!role) {
    return (
      <p className="text-center mt-8 text-red-500">Role not specified.</p>
    );
  }

  const registrationFormPath =
    role === "teacher" ? "/Register/teacher" : "/Register/student";

  return (
    <form className="bg-white max-w-full flex flex-col" onSubmit={handleSubmit}>
      {/* Top Bar */}
      <div className="bg-[#01427a] text-white flex justify-between items-center px-8 py-5 font-bold">
        <h2 className="text-2xl">
          {role === "teacher" ? "Teacher's Registration" : "Student Registration"}
        </h2>
        <Link href={registrationFormPath}>
          <IoIosCloseCircleOutline className="size-6 cursor-pointer" />
        </Link>
      </div>

      <div className="w-full">
        <Token token={token} setToken={setToken} error={errors.token} />
        <hr className="border-[#0000001a] -mx-8 my-0" />

        {role === "student" ? (
          <Personal
            personalInfo={personalInfo}
            setPersonalInfo={setPersonalInfo}
            errors={errors.personalInfo}
            handleInputChange={handleInputChange}
            handleCountryChange={handleCountryChange}
            handleStateChange={handleStateChange}
            countries={countries}
            states={states}
            cities={cities}
          />
        ) : (
          <TeacherDetails
            personalInfo={personalInfo}
            setPersonalInfo={setPersonalInfo}
            errors={errors.personalInfo}
            handleInputChange={handleInputChange}
            handleCountryChange={handleCountryChange}
            handleStateChange={handleStateChange}
            countries={countries}
            states={states}
            cities={cities}
          />
        )}
        <hr className="border-[#0000001a] -mx-8 my-0" />
        
        {role === "student" && (
          <><Parent
            parentInfo={parentInfo}
            setParentInfo={setParentInfo}
            handleInputChange={handleInputChange}
            errors={errors.parentInfo}
            handleCountryChange={handleCountryChange}
            handleStateChange={handleStateChange}
            countries={countries}
            states={states}
            cities={cities}
            RelationshipData={RelationshipData} />
            
            <Admission
              admissionInfo={admissionInfo}
              setadmissionInfo={setAdmissionInfo}
              error={errors.admissionInfo}
              handleInputChange={handleInputChange}
              handleDateChange={handleDateChange} /><hr className="border-[#0000001a] -mx-8 my-0" /></>
        )}

        
          {role === "teacher" && <VerifyCV />}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pr-4 pb-3">
        <Link href={`${registrationFormPath}/Profile`}>
          <button
            type="button"
            className="bg-[#01427a] text-white text-base rounded-lg px-10 py-5 cursor-pointer hover:bg-[#01427a]/90 transition-colors"
          >
            Next Page
          </button>
        </Link>
      </div>
    </form>
  );
};

export default StudentRegistrationForm;
