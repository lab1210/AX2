"use client";
import React, { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Country, State, City } from "country-state-city";
import Token from "@/app/Components/StudentRegForm/Token";
import Personal from "@/app/Components/StudentRegForm/Personal";
import Admission from "@/app/Components/StudentRegForm/Admission";
import Parent from "@/app/Components/StudentRegForm/Parent";

const StudentRegistrationForm = () => {
  const [token, setToken] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    DOB: "",
    gender: "",
    country: "",
    state: "",
    city: "",
  });
  const [parentInfo, setParentInfo] = useState({
    ParentfirstName: "",
    ParentmiddleName: "",
    ParentlastName: "",
    Occupation: "",
    PhoneNumber: "",
    Email: "",
    EmergencyContact: "",
    country: "",
    state: "",
    city: "",
    ParentGender: "",
    Relationship: "",
  });
  const [admissionInfo, setadmissionInfo] = useState({
    admissionNumber: "",
    admissionDate: {
      MM: "",
      DD: "",
      YY: "",
    },
    Status: true,
  });

  const RelationshipData = [
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Aunt",
    "Uncle",
    "Niece",
    "Nephew",
    "Grandfather",
    "Grandmother",
    "Cousin",
  ];
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  const handleCountryChange = (e) => {
    const { value } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      country: value,
      state: "",
      city: "",
    }));
    const states = State.getStatesOfCountry(value);
    setStates(states);
    setCities([]);
  };

  const handleStateChange = (e) => {
    const { value } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      state: value,
      city: "",
    }));
    setCities(City.getCitiesOfState(personalInfo.country, value));
  };

  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setadmissionInfo((prev) => ({
      ...prev,
      admissionDate: { ...prev.admissionDate, [name]: value },
    }));
    setErrors((prevErrors) => ({ ...prevErrors, admissionDate: "" }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!token) newErrors.token = "Token is required";
    if (!personalInfo.firstName) newErrors.firstName = "First name is required";
    if (!personalInfo.lastName) newErrors.lastName = "Last name is required";
    if (!personalInfo.DOB) newErrors.DOB = "Date of birth is required";
    if (!personalInfo.gender) newErrors.gender = "Gender is required";
    if (!personalInfo.country) newErrors.country = "Country is required";
    if (!personalInfo.state) newErrors.state = "State is required";
    if (!personalInfo.city) newErrors.city = "City is required";
    if (!parentInfo.ParentfirstName)
      newErrors.ParentfirstName = "First name is required";
    if (!parentInfo.ParentmiddleName)
      newErrors.ParentmiddleName = "Middle name is required";
    if (!parentInfo.ParentlastName)
      newErrors.ParentlastName = "Last name is required";
    if (!parentInfo.Occupation) newErrors.Occupation = "Occupation is required";
    if (!parentInfo.PhoneNumber)
      newErrors.PhoneNumber = "Phone Number is required";
    if (!parentInfo.Email) newErrors.Email = "Email is required";
    if (!parentInfo.EmergencyContact)
      newErrors.EmergencyContact = "Emergency Contact is required";
    if (!parentInfo.country) newErrors.country = "Country is required";
    if (!parentInfo.state) newErrors.state = "State is required";
    if (!parentInfo.city) newErrors.city = "City is required";
    if (!parentInfo.ParentGender) newErrors.ParentGender = "Gender is required";
    if (!parentInfo.Relationship)
      newErrors.Relationship = "Relationship is required";

    if (!admissionInfo.admissionNumber)
      newErrors.admissionNumber = "Admission number is required";
    if (
      !admissionInfo.admissionDate.DD ||
      !admissionInfo.admissionDate.MM ||
      !admissionInfo.admissionDate.YY
    )
      newErrors.admissionDate = "Admission date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("/api/register", {
          // Your API endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personalInfo,
            admissionInfo,
            token,
            parentInfo,
          }),
        });

        if (response.ok) {
          alert("Registration Successful!");
        } else {
          const errorData = await response.json(); 
          alert(`Registration failed: ${errorData.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred during registration.");
      }
    }
  };
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const registrationFormPath =
    role === "teacher" ? `/Register/Teacher` : `/Register/Student`;

  return (
    <form className="bg-white max-w-full flex flex-col" onSubmit={handleSubmit}>
    <div className="bg-[#01427a] text-white flex justify-between items-center px-8 py-5 font-bold">
      <h2 className="text-2xl">Student Registration</h2>
      <Link href="/Register">
        <IoIosCloseCircleOutline className="size-6 cursor-pointer" />
      </Link>
    </div>

    <div className="w-full">
      <Token token={token} setToken={setToken} error={errors.token} />
      <hr className="border-[#0000001a] -mx-8 my-0" />
      
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
      <hr className="border-[#0000001a] -mx-8 my-0" />
      
      <Admission
        admissionInfo={admissionInfo}
        setadmissionInfo={setadmissionInfo}
        error={errors.admissionInfo}
        handleInputChange={handleInputChange}
        handleDateChange={handleDateChange}
      />
      <hr className="border-[#0000001a] -mx-8 my-0" />
      
      <Parent
        parentInfo={parentInfo}
        setParentInfo={setParentInfo}
        handleInputChange={handleInputChange}
        errors={errors.personalInfo}
        handleCountryChange={handleCountryChange}
        handleStateChange={handleStateChange}
        countries={countries}
        states={states}
        cities={cities}
        RelationshipData={RelationshipData}
      />
    </div>

    <div className="flex justify-end pr-4 pb-3">
      <Link href={`${registrationFormPath}/Profile`}>
        <button className="bg-[#01427a] text-white text-base rounded-lg px-10 py-5 cursor-pointer hover:bg-[#01427a]/90 transition-colors">
          Next Page
        </button>
      </Link>
    </div>
  </form>
);
};

export default StudentRegistrationForm;