"use client";
import RegDropdown from "@/Components/Regdropdown";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Country, State, City } from "country-state-city";
import { usePathname, useRouter } from "next/navigation";

const TeacherForm = () => {
  const pathname = usePathname();
  const role = pathname.includes("/teacher")
    ? "teacher"
    : pathname.includes("/student")
    ? "student"
    : null;

  const registrationFormPath = `/Register/${role}/`;

  const [token, setToken] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const router = useRouter();
  const [error, setErrors] = useState({});
  const [expectedToken, setExpectedToken] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    temp_token: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    date_of_birth: "",
    gender: "",
    address: "default",
    city: "",
    state: "",
    country: "",
    region: "SouthWest",
    date_hire: "",
    qualification: "",
    specialization: "",
    // status: "",
    status: true,
    cv: null,
  });

  // Retrieve the token from localStorage when the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem("verificationToken");
    console.log("Stored Token:", storedToken);
    if (storedToken) {
      setExpectedToken(storedToken);
    }
  }, []);

  const handleTokenChange = (e) => {
    const enteredToken = e.target.value;
    setToken(enteredToken);
    console.log("Entered Token:", enteredToken);

    // Validate the token
    if (enteredToken.trim() === expectedToken) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        token: "", // Clear any token-related error
      }));
      setFormData((prevData) => ({ ...prevData, temp_token: enteredToken })); // Set the token in formData
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        token: "Token does not match.", // Set the error if token doesn't match
      }));
    }
  };

  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          cv: reader.result, // base64
        }));
        setCvFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
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
  };

  const handleStateChange = (selected) => {
    setSelectedState(selected);
    setSelectedCity(null);
  };

  const handleCityChange = (selected) => {
    setSelectedCity(selected);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      return { ...prevData, [name]: value };
    });
  };

  const handleNext = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const teacherInfo = {
      ...formData,
      country: selectedCountry?.isoCode || "", // Or name, depending on your backend
      state: selectedState?.isoCode || "", // Or name
      city: selectedCity?.name || "",
    };
    localStorage.setItem("teacherInfo", JSON.stringify(teacherInfo));
    console.log("Teacher Info:", teacherInfo);
    router.push(`/Register/TeacherProfile`);
  };

  return (
    <form onSubmit={handleNext} className="bg-white max-w-full  flex flex-col ">
      <div className="bg-[#01427a] w-full left-0 fixed top-0 z-[1000] text-white flex justify-between items-center px-8 py-5 font-bold">
        <h2 className="text-2xl">Teacher's Registration</h2>
        <Link href={"/Register/Role"}>
          <IoIosCloseCircleOutline className="size-6 cursor-pointer" />
        </Link>
      </div>
      <div className="w-full mt-15">
        {/* Token Component */}
        <div className="hidden lg:block px-8 py-3">
          <div className="text-[#01427a] text-xl font-bold mb-4 mt-6">
            <h1>Verified Token</h1>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full">
            <div>
              <label
                className="text-gray-500 font-bold text-sm block mb-1"
                htmlFor="Token"
              >
                Token
              </label>
              <input
                className="w-full p-2 rounded border-2 border-neutral-300 bg-white text-gray-500 text-sm placeholder:text-[#0b0a0a33] outline-none"
                type="text"
                name="temp_token"
                value={token}
                placeholder="Enter Copied Token"
                onChange={handleTokenChange}
                required
              />
              {error.token && (
                <p className="text-[#f2645c] text-sm mt-1">{error.token}</p>
              )}
              {error.temp_token && (
                <p className="text-[#f2645c] text-sm mt-1">
                  {error.temp_token}
                </p>
              )}
            </div>
            <div></div>
            <div></div>
          </div>
        </div>

        {/* ─── Mobile/Tablet-only ─── */}
        <div className="block lg:hidden px-8 py-3">
          <div className="text-[#01427a] font-bold text-xl mb-4 mt-6">
            <h1>Verified Token</h1>
          </div>
          <div className="grid grid-cols-1 gap-4 w-full">
            <div>
              <label
                className="text-gray-500 font-bold text-sm block mb-1"
                htmlFor="Token"
              >
                Token
              </label>
              <input
                className="w-full px-5 py-2 rounded border-2 border-neutral-300 bg-white text-gray-500 text-sm placeholder:text-[#0b0a0a33] outline-none"
                type="text"
                name="temp_token"
                value={token}
                placeholder="Enter Copied Token"
                onChange={handleTokenChange}
                required
              />
              {error.token && (
                <p className="text-[#f2645c] text-sm mt-1">{error.token}</p>
              )}
              {error.temp_token && (
                <p className="text-[#f2645c] text-sm mt-1">
                  {error.temp_token}
                </p>
              )}
            </div>
          </div>
        </div>
        <hr className="border-[#0000001a] -mx-8 my-0" />

        {/*Personal Info Component*/}
        <div className="w-full mb-5 px-8 py-2.5 ]">
          <div className="font-bold text-blue-900 mb-4 text-xl mt-6 RegFormTitle">
            <h1>Personal Information</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor={"first_name"}
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                First Name
              </label>
              <input
                name={"first_name"}
                type="text"
                value={formData.first_name}
                placeholder="Enter First Name"
                required
                onChange={handleInputChange}
                className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              />
              {error.first_name && (
                <p className="text-[#f2645c] text-sm mt-1">
                  {error.first_name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={"middle_name"}
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                Middle Name
              </label>
              <input
                name={"middle_name"}
                type="text"
                value={formData.middle_name}
                placeholder="Enter Middle Name"
                required
                onChange={handleInputChange}
                className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              />
              {error.middle_name && (
                <p className="text-[#f2645c] text-sm mt-1">
                  {error.middle_name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={"last_name"}
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                Last Name
              </label>
              <input
                name={"last_name"}
                type="text"
                value={formData.last_name}
                placeholder="Enter Last Name"
                required
                onChange={handleInputChange}
                className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              />
              {error.last_name && (
                <p className="text-[#f2645c] text-sm mt-1">{error.last_name}</p>
              )}
            </div>
            <div className="lg:grid lg:grid-cols-2 lg:gap-6 flex flex-col gap-3">
              <div>
                <label
                  htmlFor={"date_of_birth"}
                  className="font-bold text-gray-500 text-sm block mb-1"
                >
                  DOB
                </label>
                <input
                  name={"date_of_birth"}
                  type="date"
                  value={formData.date_of_birth}
                  required
                  onChange={handleInputChange}
                  className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
                />
                {error.date_of_birth && (
                  <p className="text-[#f2645c] text-sm mt-1">
                    {error.date_of_birth}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={"gender"}
                  className="font-bold text-gray-500 text-sm block mb-1"
                >
                  Gender
                </label>

                <RegDropdown
                  label={formData.gender || "Select Gender"}
                  items={genderOptions}
                  onSelect={(value) =>
                    setFormData((prev) => ({ ...prev, gender: value }))
                  }
                />
                {error?.gender && (
                  <p className="text-[#f2645c] text-sm mt-1">{error.gender}</p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="country"
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                Address
              </label>
              <div className="lg:grid lg:grid-cols-2  lg:gap-2 flex flex-col gap-3">
                <RegDropdown
                  label={selectedCountry?.name || "Select Country"}
                  items={countries.map((country) => ({
                    label: country.name,
                    value: country,
                  }))}
                  onSelect={(value) => handleCountryChange(value)}
                />
                <RegDropdown
                  label={selectedState?.name || "Select State"}
                  items={states.map((state) => ({
                    label: state.name,
                    value: state,
                  }))}
                  onSelect={(value) => handleStateChange(value)}
                />
                {(error?.country || error?.state) && (
                  <p className="text-[#f2645c] text-sm mt-1">
                    {error.country || error.state}
                  </p>
                )}
              </div>
            </div>
            <div className="lg:grid lg:grid-cols-2 gap-2 lg:mt-6">
              <RegDropdown
                label={selectedCity?.name || "Select City"}
                items={cities.map((city) => ({
                  label: city.name,
                  value: city,
                }))}
                onSelect={(value) => handleCityChange(value)}
              />
              <div></div>
            </div>
            <div>
              <label
                htmlFor={"last_name"}
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                Qualification
              </label>
              <input
                name={"qualification"}
                type="text"
                value={formData.qualification}
                placeholder="Enter Qualification"
                required
                onChange={handleInputChange}
                className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              />
              {error.qualification && (
                <p className="text-[#f2645c] text-sm mt-1">
                  {error.qualification}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={"last_name"}
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                Specialization
              </label>
              <input
                name={"specialization"}
                type="text"
                value={formData.specialization}
                placeholder="Enter specialization"
                required
                onChange={handleInputChange}
                className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              />
              {error.specialization && (
                <p className="text-[#f2645c] text-sm mt-1">
                  {error.specialization}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={"date_hire"}
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                Hired Date
              </label>
              <input
                name={"date_hire"}
                type="date"
                value={formData.date_hire}
                required
                onChange={handleInputChange}
                className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              />
              {error.date_hire && (
                <p className="text-[#f2645c] text-sm mt-1">{error.date_hire}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="Status"
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                Status
              </label>

              <button
                name="status"
                className={`${
                  formData.status ? "bg-[#1BB66E]" : "bg-red-500"
                } px-14 py-2.5 font-bold text-xl text-white border-none outline-none rounded-md mb-2`}
              >
                {formData.status ? "Active" : "On Leave"}
              </button>
            </div>
            <div></div>
            <div></div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="text-gray-500 hover:opacity-80 transition-opacity duration-300 font-bold cursor-pointer"
              >
                Upload CV
              </button>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                ref={fileInputRef}
                onChange={handleCVUpload}
                style={{ display: "none" }}
              />

              {cvFileName && (
                <p className="mt-2 text-sm text-blue-900">{cvFileName}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end pr-4 pb-3 mt-20">
        <button
          type="submit"
          className="bg-[#01427a] text-white text-base rounded px-8 py-4 cursor-pointer hover:bg-[#01427a]/90 transition-colors"
        >
          Next Page
        </button>
      </div>
    </form>
  );
};

export default TeacherForm;
