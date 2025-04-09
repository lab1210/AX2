"use client";
import React, { useState } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import DashboardHeader from "../DashboardHeader";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { BiChevronDown } from "react-icons/bi";
import { Country, State, City } from "country-state-city";
import { LuUpload } from "react-icons/lu";
import { createSchool } from "../../../Service/schoolService"; // Ensure this path is correct

const AddSchoolItem = () => {
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");

  const [schoolName, setSchoolName] = useState("");
  const [shortName, setShortName] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [schoolLogo, setSchoolLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("/icons.png");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const countries = Country.getAllCountries();
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode)
    : [];
  const cities = selectedState
    ? City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode)
    : [];

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSchoolLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCountryChange = (event) => {
    const countryCode = event.target.value;
    const country = countries.find((c) => c.isoCode === countryCode);
    setSelectedCountry(country);
    setSelectedState(null);
    setSelectedCity(null);
  };

  const handleStateChange = (event) => {
    const stateCode = event.target.value;
    const state = states.find((s) => s.isoCode === stateCode);
    setSelectedState(state);
    setSelectedCity(null);
  };

  const handleCityChange = (event) => {
    const city = cities.find((c) => c.name === event.target.value);
    setSelectedCity(city);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (
      !schoolName ||
      !shortName ||
      !schoolType ||
      !educationLevel ||
      !phoneNumber ||
      !email ||
      !selectedCountry ||
      !selectedState ||
      !selectedCity
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("school_name", schoolName);
    formData.append("short_name", shortName);
    formData.append("school_type", schoolType);
    formData.append("education_level", educationLevel);
    formData.append("phone_number", phoneNumber);
    formData.append("email", email);
    formData.append("country", selectedCountry.name);
    formData.append("state", selectedState.name);
    formData.append("city", selectedCity.name);
    formData.append("region", "South West"); // Adjust as needed
    if (schoolLogo) {
      formData.append("logo", schoolLogo);
    }

    try {
      const response = await createSchool(formData);
      if (response?.status === 201) {
        setSuccessMessage("School created successfully!");
        // Optionally reset the form fields
        setSchoolName("");
        setShortName("");
        setSchoolType("");
        setEducationLevel("");
        setPhoneNumber("");
        setEmail("");
        setSelectedCountry(null);
        setSelectedState(null);
        setSelectedCity(null);
        setSchoolLogo(null);
        setLogoPreview("/icons.png");
      } else {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
      }
    } catch (error) {
      setError(`Error creating school: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SuperAdminLayout>
      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0  z-10 shadow-md  flex justify-between items-center ">
        <DashboardHeader />
        <Link href={`/Super-Admin/Manage-Existing-Schools?adminId=${adminId}`}>
          <button className="bg-[#07508F] text-white p-2 rounded-lg cursor-pointer ">
            View Existing School
          </button>
        </Link>
      </div>
      <div className="bg-[#D4D4D4] h-screen p-4 sm:overflow-auto lg:overflow-hidden ">
        <div className="sm:flex sm:flex-col h-screen sm:gap-2 lg:grid lg:grid-cols-[2.5fr_1fr] overflow-auto  gap-3 lg:h-screen ">
          <div className="bg-[#ffffff] rounded-lg flex flex-col lg:overflow-y-auto lg:max-h-[calc(100vh-95px)] lg:overflow-auto no-scrollbar">
            <div>
              <p className="font-bold text-xl p-6">
                General School Information
              </p>
              <hr className="w-full border-t border-[#978F8F]" />
            </div>
            <form onSubmit={handleSubmit} className="flex-grow flex flex-col ">
              <div className="grid grid-cols-2 mt-6 pl-6 pr-6 gap-3 pb-0 ">
                <div className="flex flex-col gap-1 mb-2">
                  <label
                    className="text-[#808080] font-semibold"
                    htmlFor="schoolName"
                  >
                    School Name
                  </label>
                  <input
                    type="text"
                    id="schoolName"
                    className="text-base text-[#808080] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4] placeholder:text-[#d4d4d4] "
                    placeholder="Enter School Name"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2 ">
                  <label
                    className="text-[#808080] font-semibold"
                    htmlFor="shortName"
                  >
                    School Short Name
                  </label>
                  <input
                    type="text"
                    id="shortName"
                    className="text-base text-[#808080] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4] placeholder:text-[#d4d4d4] "
                    placeholder="Enter School Short Name"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2 ">
                  <label
                    className="text-[#808080] font-semibold"
                    htmlFor="schoolType"
                  >
                    School Type
                  </label>
                  <div className="grid grid-cols-1 ">
                    <select
                      id="schoolType"
                      className=" w-full bg-white col-start-1 row-start-1 appearance-none text-base text-[#808080] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4] placeholder:text-[#d4d4d4] "
                      value={schoolType}
                      onChange={(e) => setSchoolType(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select School Type
                      </option>
                      <option value="Private">Private</option>
                      <option value="Public">Public</option>
                    </select>
                    <BiChevronDown className="text-[#d4d4d4] col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label
                    className="text-[#808080] font-semibold"
                    htmlFor="educationLevel"
                  >
                    Education Level
                  </label>
                  <div className="grid grid-cols-1 ">
                    <select
                      id="educationLevel"
                      className=" w-full bg-white col-start-1 row-start-1 appearance-none text-base text-[#808080] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4] placeholder:text-[#d4d4d4] "
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select Education Level
                      </option>
                      <option value="Primary">Primary</option>
                      <option value="Junior Secondary">Junior Secondary</option>
                      <option value="Senior Secondary">Senior Secondary</option>
                    </select>
                    <BiChevronDown className="text-[#d4d4d4] col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label
                    className="text-[#808080] font-semibold"
                    htmlFor="phoneNumber"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    className="text-base text-[#808080] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4] placeholder:text-[#d4d4d4] "
                    placeholder="Enter Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label
                    className="text-[#808080] font-semibold"
                    htmlFor="email"
                  >
                    School Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="text-base text-[#808080] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4] placeholder:text-[#d4d4d4] "
                    placeholder="Enter School Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="pt-4 pl-6 pr-6 pb-0">
                <label
                  className="text-[#808080] font-semibold"
                  htmlFor="schoolAddress"
                >
                  School Address
                </label>
                <div className="grid grid-cols-2 gap-3 mt-1 ">
                  <div className="grid grid-cols-1 mb-2">
                    <select
                      className="w-full bg-white col-start-1 row-start-1 appearance-none text-base text-[#808080] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4]"
                      onChange={handleCountryChange}
                      value={selectedCountry ? selectedCountry.isoCode : ""}
                      required
                    >
                      <option value="" disabled>
                        Select Country
                      </option>
                      {countries.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    <BiChevronDown className="text-[#d4d4d4] col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end pointer-events-none" />
                  </div>
                  <div className="grid grid-cols-1 mb-2">
                    <select
                      className="w-full bg-white col-start-1 row-start-1 appearance-none text-base text-[#808080] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4]"
                      onChange={handleStateChange}
                      value={selectedState ? selectedState.isoCode : ""}
                      disabled={!selectedCountry}
                      required
                    >
                      <option value="" disabled>
                        Select State
                      </option>
                      {states.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    <BiChevronDown className="text-[#d4d4d4] col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end pointer-events-none" />
                  </div>

                  <div className="grid grid-cols-1">
                    <select
                      className="w-full bg-white col-start-1 row-start-1 appearance-none text-base text-[#808080] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4]"
                      onChange={handleCityChange}
                      value={selectedCity ? selectedCity.name : ""}
                      disabled={!selectedState}
                      required
                    >
                      <option value="" disabled>
                        Select City
                      </option>
                      {cities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    <BiChevronDown className="text-[#d4d4d4] col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pr-6 pb-2  mt-auto ">
                <button
                  type="submit"
                  className={`bg-[#07508F] text-white pt-2 pb-2 pl-12 pr-12 text-sm rounded-lg cursor-pointer ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
              {error && <p className="pl-6 text-red-500">{error}</p>}
              {successMessage && (
                <p className="pl-6 text-green-500">{successMessage}</p>
              )}
            </form>
          </div>
          <div className="flex flex-col gap-2 h-screen  ">
            <div className="bg-[#ffffff] rounded-lg drop-shadow-lg p-4  flex flex-col">
              <p className="font-bold sm:tex-lg xl:text-xl xl:mb-2 sm:mb-4 ">
                LOGO
              </p>
              <div className="flex flex-col items-center justify-center mt-2">
                <div className="mb-4 bg-[#E4E4E4] border-dashed border-[1.5px] border-[#333333] flex items-center relative  justify-center w-48 h-35">
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      className="max-w-full max-h-full object-contain"
                      src={logoPreview}
                      alt="school-logo-preview"
                    />
                  </div>
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    onChange={handleLogoUpload}
                    accept="image/*"
                  />
                </div>
                <button
                  onClick={() => document.getElementById("logo-upload").click()}
                  className="text-[#07508F] border-[1.5px] rounded-lg cursor-pointer  border-dashed  w-48 p-2 flex items-center justify-between"
                >
                  Upload School LOGO
                  <span>
                    <LuUpload size={20} />
                  </span>
                </button>
              </div>
            </div>
            <div className="bg-[#ffffff] xl:gap-0 lg:gap-2 h-auto rounded-lg pt-5 pl-5 pr-5 xl:pb-2 pb-8 drop-shadow-lg flex flex-col">
              <p className="font-bold sm:text-lg xl:text-xl mb-4 ">
                SUBSCRIPTION PLAN
              </p>
              <div>
                <div className="flex justify-between">
                  <p className="font-semibold text-xs text-[#9C9B9B]">
                    Amount Per Student:
                  </p>
                  <p className="font-semibold text-xs text-[#9C9B9B]">N1500</p>
                </div>

                <div className="flex justify-between">
                  <p className="font-semibold text-xs ">No of Students:</p>
                  <p className="font-semibold text-xs ">N100</p>
                </div>

                <div className="flex justify-between">
                  <p className="font-semibold text-xs ">
                    Amount Expected to be paid::
                  </p>
                  <p className="font-semibold text-xs ">N1500</p>
                </div>
              </div>

              <div className="flex justify-center pt-4 ">
                <button className="bg-[#4084B1] text-white pt-2 pb-2 pl-12 pr-12 text-sm rounded-lg cursor-pointer ">
                  Activate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default AddSchoolItem;
