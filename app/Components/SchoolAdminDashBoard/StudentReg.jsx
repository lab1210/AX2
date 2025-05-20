"use client";
import { Country, State, City } from "country-state-city";
import React, { useEffect, useState } from "react";

const StudentReg = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [Student, setStudent] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    date_of_birth: "",
    gender: "",
    country: "",
    state: "",
    city: "",
    Admission_number: "",
    Admission_date: "",
    Status: true,
    parent_first_name: "",
    parent_last_name: "",
    parent_middle_name: "",
    occupation: "",
  });

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (formData.countryCode) {
      const fetchedStates = State.getStatesOfCountry(formData.countryCode);
      setStates(fetchedStates);
      setFormData((prev) => ({ ...prev, state: "", stateCode: "", city: "" }));
    }
  }, [formData.countryCode]);

  useEffect(() => {
    if (formData.countryCode && formData.stateCode) {
      const fetchedCities = City.getCitiesOfState(
        formData.countryCode,
        formData.stateCode
      );
      setCities(fetchedCities);
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  }, [formData.stateCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTeacher([...Teacher, formData]);
    console.log(Teacher);
    setMessage("Teacher registered successfully");
    setMessageType("success");
  };
  return <div></div>;
};

export default StudentReg;
