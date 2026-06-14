"use client";
import RegDropdown from "@/Components/Regdropdown";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Country, State, City } from "country-state-city";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import studentService from "@/Service/studentService";
import regTokenService from "@/Service/RegistrationTokenService";

const StudentForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classYearOptions, setClassYearOptions] = useState([]);
  const [classArmOptions, setClassArmOptions] = useState([]);
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [tokenInput, setTokenInput] = useState("");

  const [formData, setFormData] = useState({
    token: "",
    admission_number: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    admission_date: "",
    email: "",
    username: "",
    password: "",
    confirm_password: "",
    parent_first_name: "",
    parent_last_name: "",
    parent_occupation: "",
    parent_contact_info: "",
    parent_emergency_contact: "",
    parent_relationship: "",
    class_year_id: "",
    class_arm_id: "",
  });

  // Get token from URL query params on page load
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setTokenInput(tokenFromUrl);
      // Auto-validate the token from URL
      handleValidateToken(tokenFromUrl);
    }
  }, [searchParams]);

  // Fetch class arms when class year changes
  useEffect(() => {
    if (formData.class_year_id && tokenInfo?.classArms) {
      const filteredArms = tokenInfo.classArms.filter(
        (arm) => arm.classYearId === formData.class_year_id
      );
      setClassArmOptions(
        filteredArms.map((arm) => ({
          label: arm.name,
          value: arm.id,
        }))
      );
    } else {
      setClassArmOptions([]);
    }
    setFormData((prev) => ({ ...prev, class_arm_id: "" }));
  }, [formData.class_year_id, tokenInfo]);

  const handleValidateToken = async (token = tokenInput) => {
    if (!token.trim()) {
      toast.error("Please enter a registration token");
      return;
    }

    setIsValidatingToken(true);
    try {
      const result = await regTokenService.getRegistrationInfo(token);
      
      if (result.success && result.data) {
        setTokenInfo(result.data);
        setTokenValid(true);
        setFormData(prev => ({ ...prev, token: token }));
        
        // Populate class years from API response
        if (result.data.classYears && result.data.classYears.length > 0) {
          setClassYearOptions(
            result.data.classYears.map((year) => ({
              label: year.className,
              value: year.id,
            }))
          );
        }
        
        // Pre-fill email if available from token
        if (result.data.email) {
          setFormData(prev => ({ ...prev, email: result.data.email }));
        }
        
        // Pre-fill name if available
        if (result.data.firstName) {
          setFormData(prev => ({ ...prev, first_name: result.data.firstName }));
        }
        if (result.data.lastName) {
          setFormData(prev => ({ ...prev, last_name: result.data.lastName }));
        }
        
        toast.success("Token validated successfully!");
      } else {
        setTokenValid(false);
        setTokenInfo(null);
        toast.error(result.message || "Invalid registration token");
      }
    } catch (error) {
      console.error("Error validating token:", error);
      setTokenValid(false);
      setTokenInfo(null);
      toast.error("Failed to validate registration token");
    } finally {
      setIsValidatingToken(false);
    }
  };

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const relationshipOptions = [
    { label: "Father", value: "Father" },
    { label: "Mother", value: "Mother" },
    { label: "Guardian", value: "Guardian" },
  ];

  const countries = Country.getAllCountries();
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode)
    : [];
  const cities = selectedState
    ? City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode)
    : [];

  const handleCountryChange = (selected) => {
    setSelectedCountry(selected);
    setSelectedState(null);
    setSelectedCity(null);
    setFormData(prev => ({ ...prev, country: selected?.isoCode || "" }));
  };

  const handleStateChange = (selected) => {
    setSelectedState(selected);
    setSelectedCity(null);
    setFormData(prev => ({ ...prev, state: selected?.isoCode || "" }));
  };

  const handleCityChange = (selected) => {
    setSelectedCity(selected);
    setFormData(prev => ({ ...prev, city: selected?.name || "" }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.token) newErrors.token = "Token is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirm_password) newErrors.confirm_password = "Passwords do not match";
    
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    if (!formData.admission_number) newErrors.admission_number = "Admission number is required";
    if (!formData.date_of_birth) newErrors.date_of_birth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.class_year_id) newErrors.class_year_id = "Class year is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tokenValid) {
      toast.error("Please validate your registration token first");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    const studentData = {
      token: formData.token,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      admission_number: formData.admission_number,
      first_name: formData.first_name,
      last_name: formData.last_name,
      middle_name: formData.middle_name,
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      admission_date: formData.admission_date || new Date().toISOString().split('T')[0],
      parent_first_name: formData.parent_first_name,
      parent_last_name: formData.parent_last_name,
      parent_occupation: formData.parent_occupation,
      parent_contact_info: formData.parent_contact_info,
      parent_emergency_contact: formData.parent_emergency_contact,
      parent_relationship: formData.parent_relationship,
      class_year_id: formData.class_year_id,
      class_arm_id: formData.class_arm_id || null,
    };

    try {
      const result = await studentService.selfRegisterStudent(studentData);
      
      if (result.success) {
        toast.success("Registration successful! Please login with your credentials.");
        // Clear stored data
        localStorage.removeItem("verificationToken");
        localStorage.removeItem("classYears");
        // Redirect to login page
        router.push("/");
      } else {
        toast.error(result.message || "Registration failed");
        setErrors(prev => ({ ...prev, submit: result.message }));
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("An error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white max-w-full flex flex-col">
      <div className="bg-[#01427a] w-full left-0 fixed top-0 z-[1000] text-white flex justify-between items-center px-8 py-5 font-bold">
        <h2 className="text-2xl">Student Registration</h2>
        <Link href={"/"}>
          <IoIosCloseCircleOutline className="size-6 cursor-pointer" />
        </Link>
      </div>
      
      <div className="w-full mt-20">
        {/* Token Validation Section */}
        <div className="px-8 py-3">
          <div className="text-[#01427a] text-xl font-bold mb-4 mt-6">
            <h1>Registration Token</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
            <div className="flex-1">
              <label className="text-gray-500 font-bold text-sm block mb-1">
                Enter your Registration Token *
              </label>
              <input
                className="w-full p-2 rounded border-2 border-neutral-300 bg-white text-gray-500 text-sm outline-none"
                type="text"
                value={tokenInput}
                placeholder="Enter the token you received"
                onChange={(e) => setTokenInput(e.target.value)}
                disabled={tokenValid}
              />
            </div>
            <div>
              {!tokenValid ? (
                <button
                  type="button"
                  onClick={() => handleValidateToken()}
                  disabled={isValidatingToken || !tokenInput.trim()}
                  className="bg-[#01427a] text-white px-6 py-2 rounded hover:bg-[#01427a]/80 disabled:opacity-50"
                >
                  {isValidatingToken ? "Validating..." : "Validate Token"}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-semibold">✓ Token Validated</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTokenValid(false);
                      setTokenInfo(null);
                      setTokenInput("");
                      setFormData(prev => ({ ...prev, token: "" }));
                      setClassYearOptions([]);
                      setClassArmOptions([]);
                    }}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Change Token
                  </button>
                </div>
              )}
            </div>
            {tokenInfo && (
              <div className="text-sm text-gray-500">
                <p>School: <span className="font-semibold">{tokenInfo.schoolName}</span></p>
                <p>Expires: <span className="font-semibold">{new Date(tokenInfo.expiresAt).toLocaleDateString()}</span></p>
              </div>
            )}
          </div>
          {error.token && <p className="text-red-500 text-sm mt-1">{error.token}</p>}
        </div>

        <hr className="border-[#0000001a] -mx-8 my-0" />

        {/* Login Information - Only show if token is validated */}
        {tokenValid && (
          <>
            <div className="px-8 py-3">
              <div className="text-[#01427a] text-xl font-bold mb-4 mt-6">
                <h1>Login Information</h1>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-500 font-bold text-sm block mb-1">
                    Email *
                  </label>
                  <input
                    className="w-full p-2 rounded border-2 border-neutral-300 bg-white text-gray-500 text-sm outline-none"
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter Email"
                    onChange={handleInputChange}
                    required
                  />
                  {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
                </div>
                <div>
                  <label className="text-gray-500 font-bold text-sm block mb-1">
                    Username *
                  </label>
                  <input
                    className="w-full p-2 rounded border-2 border-neutral-300 bg-white text-gray-500 text-sm outline-none"
                    type="text"
                    name="username"
                    value={formData.username}
                    placeholder="Enter Username"
                    onChange={handleInputChange}
                    required
                  />
                  {error.username && <p className="text-red-500 text-sm mt-1">{error.username}</p>}
                </div>
                <div>
                  <label className="text-gray-500 font-bold text-sm block mb-1">
                    Password *
                  </label>
                  <input
                    className="w-full p-2 rounded border-2 border-neutral-300 bg-white text-gray-500 text-sm outline-none"
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="Enter Password (min 6 characters)"
                    onChange={handleInputChange}
                    required
                  />
                  {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
                </div>
                <div>
                  <label className="text-gray-500 font-bold text-sm block mb-1">
                    Confirm Password *
                  </label>
                  <input
                    className="w-full p-2 rounded border-2 border-neutral-300 bg-white text-gray-500 text-sm outline-none"
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    placeholder="Confirm Password"
                    onChange={handleInputChange}
                    required
                  />
                  {error.confirm_password && <p className="text-red-500 text-sm mt-1">{error.confirm_password}</p>}
                </div>
              </div>
            </div>

            <hr className="border-[#0000001a] -mx-8 my-0" />

            {/* Personal Info */}
            <div className="w-full mb-5 px-8 py-2.5">
              <div className="font-bold text-blue-900 mb-4 text-xl mt-6">
                <h1>Personal Information</h1>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="font-bold text-gray-500 text-sm block mb-1">
                    First Name *
                  </label>
                  <input
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    placeholder="Enter First Name"
                    required
                    onChange={handleInputChange}
                    className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
                  />
                  {error.first_name && <p className="text-red-500 text-sm mt-1">{error.first_name}</p>}
                </div>
                <div>
                  <label className="font-bold text-gray-500 text-sm block mb-1">
                    Middle Name
                  </label>
                  <input
                    name="middle_name"
                    type="text"
                    value={formData.middle_name}
                    placeholder="Enter Middle Name"
                    onChange={handleInputChange}
                    className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-500 text-sm block mb-1">
                    Last Name *
                  </label>
                  <input
                    name="last_name"
                    type="text"
                    value={formData.last_name}
                    placeholder="Enter Last Name"
                    required
                    onChange={handleInputChange}
                    className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
                  />
                  {error.last_name && <p className="text-red-500 text-sm mt-1">{error.last_name}</p>}
                </div>
                <div>
                  <label className="font-bold text-gray-500 text-sm block mb-1">
                    Admission Number *
                  </label>
                  <input
                    name="admission_number"
                    type="text"
                    value={formData.admission_number}
                    placeholder="Enter Admission Number"
                    required
                    onChange={handleInputChange}
                    className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
                  />
                  {error.admission_number && <p className="text-red-500 text-sm mt-1">{error.admission_number}</p>}
                </div>
                <div>
                  <label className="font-bold text-gray-500 text-sm block mb-1">
                    Date of Birth *
                  </label>
                  <input
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    required
                    onChange={handleInputChange}
                    className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
                  />
                  {error.date_of_birth && <p className="text-red-500 text-sm mt-1">{error.date_of_birth}</p>}
                </div>
                <div>
                  <label className="font-bold text-gray-500 text-sm block mb-1">
                    Gender *
                  </label>
                  <RegDropdown
                    label={formData.gender || "Select Gender"}
                    items={genderOptions}
                    onSelect={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                  />
                  {error.gender && <p className="text-red-500 text-sm mt-1">{error.gender}</p>}
                </div>
                <div>
                  <label className="font-bold text-gray-500 text-sm block mb-1">
                    Address
                  </label>
                  <input
                    name="address"
                    type="text"
                    value={formData.address}
                    placeholder="Enter Address"
                    onChange={handleInputChange}
                    className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-500 text-sm block mb-1">
                    Country
                  </label>
                  <RegDropdown
                    label={selectedCountry?.name || "Select Country"}
                    items={countries.map((country) => ({
                      label: country.name,
                      value: country,
                    }))}
                    onSelect={handleCountryChange}
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-500 text-sm block mb-1">
                    State
                  </label>
                  <RegDropdown
                    label={selectedState?.name || "Select State"}
                    items={states.map((state) => ({
                      label: state.name,
                      value: state,
                    }))}
                    onSelect={handleStateChange}
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-500 text-sm block mb-1">
                    City
                  </label>
                  <RegDropdown
                    label={selectedCity?.name || "Select City"}
                    items={cities.map((city) => ({
                      label: city.name,
                      value: city,
                    }))}
                    onSelect={handleCityChange}
                  />
                </div>
              </div>
            </div>

            <hr className="border-[#0000001a] -mx-8 my-0" />

            {/* Class Info */}
            <div className="w-full mb-5 px-8 py-2.5">
              <div className="font-bold text-blue-900 mb-4 text-xl mt-6">
                <h1>Class Information</h1>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="font-bold text-gray-500 text-sm block mb-1">
                    Class Year *
                  </label>
                  <RegDropdown
                    label={classYearOptions.find(y => y.value === formData.class_year_id)?.label || "Select Class Year"}
                    items={classYearOptions}
                    onSelect={(value) => setFormData((prev) => ({ ...prev, class_year_id: value }))}
                  />
                  {error.class_year_id && <p className="text-red-500 text-sm mt-1">{error.class_year_id}</p>}
                </div>
                <div>
                  <label className="font-bold text-gray-500 text-sm block mb-1">
                    Class Arm
                  </label>
                  <RegDropdown
                    label={classArmOptions.find(a => a.value === formData.class_arm_id)?.label || "Select Class Arm"}
                    items={classArmOptions}
                    onSelect={(value) => setFormData((prev) => ({ ...prev, class_arm_id: value }))}
                    disabled={!formData.class_year_id}
                  />
                </div>
              </div>
            </div>

            <hr className="border-[#0000001a] -mx-8 my-0" />

            {/* Parent Information */}
            <div className="w-full mb-5 px-8 py-2.5">
              <div className="font-bold text-blue-900 mb-4 text-xl mt-6">
                <h1>Parent's Information</h1>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="font-bold text-gray-500 text-sm block mb-1">
                    Parent's First Name
                  </label>
                  <input
                    name="parent_first_name"
                    type="text"
                    value={formData.parent_first_name}
                    placeholder="Enter First Name"
                    onChange={handleInputChange}
                    className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-500 text-sm block mb-1">
                    Parent's Last Name
                  </label>
                  <input
                    name="parent_last_name"
                    type="text"
                    value={formData.parent_last_name}
                    placeholder="Enter Last Name"
                    onChange={handleInputChange}
                    className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-500 text-sm block mb-1">
                    Parent's Occupation
                  </label>
                  <input
                    name="parent_occupation"
                    type="text"
                    value={formData.parent_occupation}
                    placeholder="Enter Occupation"
                    onChange={handleInputChange}
                    className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-500 text-sm block mb-1">
                    Parent's Phone Number
                  </label>
                  <input
                    name="parent_contact_info"
                    type="tel"
                    value={formData.parent_contact_info}
                    placeholder="Enter Phone Number"
                    onChange={handleInputChange}
                    className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-500 text-sm block mb-1">
                    Emergency Contact
                  </label>
                  <input
                    name="parent_emergency_contact"
                    type="tel"
                    value={formData.parent_emergency_contact}
                    placeholder="Enter Emergency Contact"
                    onChange={handleInputChange}
                    className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-500 text-sm block mb-1">
                    Relationship
                  </label>
                  <RegDropdown
                    label={formData.parent_relationship || "Select Relationship"}
                    items={relationshipOptions}
                    onSelect={(value) => setFormData((prev) => ({ ...prev, parent_relationship: value }))}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {tokenValid && (
        <div className="flex justify-end pr-4 pb-3 mt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#01427a] text-white text-base rounded px-8 py-4 cursor-pointer hover:bg-[#01427a]/90 transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Processing..." : "Register"}
          </button>
        </div>
      )}
    </form>
  );
};

export default StudentForm;