"use client";
import toast from "react-hot-toast";
import { Country, State, City } from "country-state-city";
import React, { useEffect, useState } from "react";
import studentService from "@/Service/studentService";
import classService from "@/Service/ClassService";
import DropDownLight from "./DropDownwithlightborder";
import { FiEye, FiEyeOff } from "react-icons/fi";

const StudentReg = () => {
  const [filteredClassArms, setFilteredClassArms] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classYears, setClassYears] = useState([]);
  const [classArms, setClassArms] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const nigeria = Country.getAllCountries().find(
    (country) => country.name === "Nigeria"
  );
  
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: "",
    country: nigeria ? "Nigeria" : "",
    countryCode: nigeria ? nigeria.isoCode : "",
    state: "",
    stateCode: "",
    city: "",
    admissionNumber: "",
    admissionDate: "",
    status: "Active",
    parentFirstName: "",
    parentLastName: "",
    parentOccupation: "",
    parentContactInfo: "",
    parentEmergencyContact: "",
    parentRelationship: "",
    address: "",
    classYearId: "",
    classArmId: "",
  });

  const handleInputChange = (field, value) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getFieldError = (fieldName) => {
    return errors[fieldName]?.[0] || "";
  };

  const getInputBorderClass = (fieldName, value) => {
    if (errors[fieldName]) {
      return "border-2 border-red-500";
    }
    return value !== ""
      ? "border-2 border-[#0071E3]"
      : "border border-[#B6B6B6]";
  };

  useEffect(() => {
    const fetchClassData = async () => {
      const [yearsRes, armsRes] = await Promise.all([
        classService.getAllClassYears(),
        classService.getAllClassArms(),
      ]);
      if (yearsRes.success) setClassYears(yearsRes.data);
      if (armsRes.success) setClassArms(armsRes.data);
    };
    fetchClassData();
  }, []);

  useEffect(() => {
    if (formData.classYearId) {
      const filtered = classArms.filter(
        (arm) => arm.classYearId === formData.classYearId
      );
      setFilteredClassArms(filtered);
      if (!filtered.some((arm) => arm.id === formData.classArmId)) {
        setFormData((prev) => ({ ...prev, classArmId: "" }));
      }
    } else {
      setFilteredClassArms([]);
    }
  }, [formData.classYearId, classArms]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.username || !formData.password || !formData.admissionNumber) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        admissionNumber: formData.admissionNumber,
        admissionDate: formData.admissionDate || null,
        status: formData.status,
        parentFirstName: formData.parentFirstName,
        parentLastName: formData.parentLastName,
        parentOccupation: formData.parentOccupation,
        parentContactInfo: formData.parentContactInfo,
        parentEmergencyContact: formData.parentEmergencyContact,
        parentRelationship: formData.parentRelationship,
        classYearId: formData.classYearId || null,
        classArmId: formData.classArmId || null,
      };
      
      const result = await studentService.createStudent(submitData);
      
      if (result.success) {
        toast.success("Student registered successfully!");
        
        // Reset form
        setFormData({
          email: "",
          username: "",
          password: "",
          firstName: "",
          lastName: "",
          middleName: "",
          dateOfBirth: "",
          gender: "",
          country: nigeria ? "Nigeria" : "",
          countryCode: nigeria ? nigeria.isoCode : "",
          state: "",
          stateCode: "",
          city: "",
          admissionNumber: "",
          admissionDate: "",
          status: "Active",
          parentFirstName: "",
          parentLastName: "",
          parentOccupation: "",
          parentContactInfo: "",
          parentEmergencyContact: "",
          parentRelationship: "",
          address: "",
          classYearId: "",
          classArmId: "",
        });
      } else {
        toast.error(result.message || "Failed to register student");
        if (result.errors) setErrors(result.errors);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Error registering student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex-shrink-0">
        <div className="pt-5 pl-6 pr-6 mb-2">
          <p className="font-bold text-[#07508F]">Personal Information</p>
        </div>
        <div className="pl-6 pr-6">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">
                First Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] p-1.5 text-sm rounded-sm ${getInputBorderClass(
                  "firstName",
                  formData.firstName
                )}`}
                required
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{getFieldError("firstName")}</p>
              )}
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">Middle Name:</label>
              <input
                type="text"
                placeholder="Enter Middle Name"
                value={formData.middleName}
                onChange={(e) => handleInputChange("middleName", e.target.value)}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] p-1.5 text-sm rounded-sm ${getInputBorderClass(
                  "middleName",
                  formData.middleName
                )}`}
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Last Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] p-1.5 text-sm rounded-sm ${getInputBorderClass(
                  "lastName",
                  formData.lastName
                )}`}
                required
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{getFieldError("lastName")}</p>
              )}
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Username: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] p-1.5 text-sm rounded-sm ${getInputBorderClass(
                  "username",
                  formData.username
                )}`}
                required
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{getFieldError("username")}</p>
              )}
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Email: <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] p-1.5 text-sm rounded-sm ${getInputBorderClass(
                  "email",
                  formData.email
                )}`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{getFieldError("email")}</p>
              )}
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Password: <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password (min 6 chars)"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`w-full focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] p-1.5 text-sm rounded-sm ${getInputBorderClass(
                    "password",
                    formData.password
                  )}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center px-2 text-[#808080] hover:text-[#01427A] focus:outline-none"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{getFieldError("password")}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-3">
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">DOB:</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] p-1.5 text-sm rounded-sm border border-[#B6B6B6]"
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">Gender:</label>
              <DropDownLight
                label={formData.gender || "Select Gender"}
                items={[
                  { label: "Male", onClick: () => handleInputChange("gender", "Male") },
                  { label: "Female", onClick: () => handleInputChange("gender", "Female") },
                ]}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-x-6 gap-y-3 mt-3">
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">Country:</label>
              <DropDownLight
                label={formData.country || "Select Country"}
                items={countries.map((country) => ({
                  label: country.name,
                  onClick: () => {
                    setFormData((prev) => ({
                      ...prev,
                      country: country.name,
                      countryCode: country.isoCode,
                    }));
                  },
                }))}
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#FFFFFF]">State</label>
              <DropDownLight
                label={formData.state || "Select State"}
                items={states.map((state) => ({
                  label: state.name,
                  onClick: () => {
                    setFormData((prev) => ({
                      ...prev,
                      state: state.name,
                      stateCode: state.isoCode,
                    }));
                  },
                }))}
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#FFFFFF]">City</label>
              <DropDownLight
                label={formData.city || "Select City"}
                items={cities.map((city) => ({
                  label: city.name,
                  onClick: () => setFormData((prev) => ({ ...prev, city: city.name })),
                }))}
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-x-1 mt-3">
            <label className="text-[0.88rem] text-[#5E6A72]">Address:</label>
            <input
              type="text"
              placeholder="Enter Address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] p-1.5 text-sm rounded-sm border border-[#B6B6B6]"
            />
          </div>
        </div>

        <div className="pt-8 pl-6 pr-6 mb-2">
          <p className="font-bold text-[#07508F]">Admission Information</p>
        </div>
        
        <div className="grid grid-cols-2 pl-6 pr-6 gap-x-6 gap-y-3">
          <div className="flex flex-col gap-x-1">
            <label className="text-[0.88rem] text-[#5E6A72]">
              Admission Number: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Admission Number"
              value={formData.admissionNumber}
              onChange={(e) => handleInputChange("admissionNumber", e.target.value)}
              className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] p-1.5 text-sm rounded-sm ${getInputBorderClass(
                "admissionNumber",
                formData.admissionNumber
              )}`}
              required
            />
            {errors.admissionNumber && (
              <p className="text-red-500 text-xs mt-1">{getFieldError("admissionNumber")}</p>
            )}
          </div>
          <div className="flex flex-col gap-x-1">
            <label className="text-[0.88rem] text-[#5E6A72]">Admission Date:</label>
            <input
              type="date"
              value={formData.admissionDate}
              onChange={(e) => handleInputChange("admissionDate", e.target.value)}
              className="focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] p-1.5 text-sm rounded-sm border border-[#B6B6B6]"
            />
          </div>
          <div className="flex flex-col gap-x-1">
            <label className="text-[0.88rem] text-[#5E6A72]">Class Year</label>
            <DropDownLight
              label={classYears.find((y) => y.id === formData.classYearId)?.className || "Select Class Year"}
              items={classYears.map((year) => ({
                label: year.className,
                onClick: () => setFormData((prev) => ({ ...prev, classYearId: year.id, classArmId: "" })),
              }))}
            />
          </div>
          <div className="flex flex-col gap-x-1">
            <label className="text-[0.88rem] text-[#FFFFFF]">Class Arm</label>
            <DropDownLight
              label={filteredClassArms.find((a) => a.id === formData.classArmId)?.armName || "Select Class Arm"}
              items={filteredClassArms.map((arm) => ({
                label: arm.armName,
                onClick: () => setFormData((prev) => ({ ...prev, classArmId: arm.id })),
              }))}
            />
          </div>
          <div className="flex flex-col gap-x-1">
            <label className="text-[0.88rem] text-[#5E6A72]">Status:</label>
            <div
              className={`${
                formData.status === "Active" ? "bg-[#1BB66E]" : "bg-red-500"
              } text-white font-bold max-w-36 text-sm rounded py-2 cursor-pointer flex justify-center`}
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  status: prev.status === "Active" ? "Inactive" : "Active",
                }));
              }}
            >
              {formData.status}
            </div>
          </div>
        </div>

        <div className="pt-8 pl-6 pr-6 mb-2">
          <p className="font-bold text-[#07508F]">Parents Information</p>
        </div>
        
        <div className="pl-6 pr-6">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">Parent First Name:</label>
              <input
                type="text"
                placeholder="Enter First Name"
                value={formData.parentFirstName}
                onChange={(e) => handleInputChange("parentFirstName", e.target.value)}
                className="focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] p-1.5 text-sm rounded-sm border border-[#B6B6B6]"
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">Parent Last Name:</label>
              <input
                type="text"
                placeholder="Enter Last Name"
                value={formData.parentLastName}
                onChange={(e) => handleInputChange("parentLastName", e.target.value)}
                className="focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] p-1.5 text-sm rounded-sm border border-[#B6B6B6]"
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">Parent Occupation:</label>
              <input
                type="text"
                placeholder="Enter Occupation"
                value={formData.parentOccupation}
                onChange={(e) => handleInputChange("parentOccupation", e.target.value)}
                className="focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] p-1.5 text-sm rounded-sm border border-[#B6B6B6]"
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">Parent Phone Number:</label>
              <input
                type="tel"
                placeholder="Enter Phone Number"
                value={formData.parentContactInfo}
                onChange={(e) => handleInputChange("parentContactInfo", e.target.value)}
                className="focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] p-1.5 text-sm rounded-sm border border-[#B6B6B6]"
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">Emergency Contact:</label>
              <input
                type="tel"
                placeholder="Enter Emergency Contact"
                value={formData.parentEmergencyContact}
                onChange={(e) => handleInputChange("parentEmergencyContact", e.target.value)}
                className="focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] p-1.5 text-sm rounded-sm border border-[#B6B6B6]"
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">Relationship:</label>
              <DropDownLight
                label={formData.parentRelationship || "Select Relationship"}
                items={[
                  { label: "Father", onClick: () => handleInputChange("parentRelationship", "Father") },
                  { label: "Mother", onClick: () => handleInputChange("parentRelationship", "Mother") },
                  { label: "Guardian", onClick: () => handleInputChange("parentRelationship", "Guardian") },
                ]}
              />
            </div>
          </div>

          <div className="flex justify-end mb-5 mt-10">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#01427A] text-sm text-white font-bold py-1.5 cursor-pointer hover:opacity-80 px-5 rounded-sm disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentReg;