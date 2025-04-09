"use client";
import React, { useEffect, useState } from "react";
import styles from "../../../css/registerform.module.css";
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
    return Object.keys(newErrors).length === 0; // Return true if no errors
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
          // Redirect or reset form here
        } else {
          const errorData = await response.json(); // Get error details from backend
          alert(`Registration failed: ${errorData.message || "Unknown error"}`);
          // Handle specific errors, e.g., display them on the form
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
    <form className={styles.Reg_form_Container} onSubmit={handleSubmit}>
      <div className={styles.Reg_header}>
        <h2>Student Registration</h2>
        <Link href="/Register">
          <IoIosCloseCircleOutline size={24} />
        </Link>
      </div>
      <div className={styles.Reg_Content}>
        <Token token={token} setToken={setToken} error={errors.token} />
        <hr />
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
        <hr />
        <Admission
          admissionInfo={admissionInfo}
          setadmissionInfo={setadmissionInfo}
          error={errors.admissionInfo}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
        />
        <hr />
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
      <div className={styles.next}>
        <Link href={`${registrationFormPath}/Profile`}>
          <button>Next Page</button>
        </Link>
      </div>
    </form>
  );
};

export default StudentRegistrationForm;
