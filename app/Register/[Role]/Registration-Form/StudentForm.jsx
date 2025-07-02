"use client";
import RegDropdown from "@/Components/Regdropdown";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Country, State, City } from "country-state-city";
import { usePathname, useRouter } from "next/navigation";
import { getClassArm, getClass } from "@/Service/schoolConfig";
import toast from "react-hot-toast";
const StudentForm = () => {
  const pathname = usePathname();
  const role = pathname.includes("/teacher")
    ? "teacher"
    : pathname.includes("/student")
    ? "student"
    : null;

  const registrationFormPath = `/Register/${role}/`;

  const [token, setToken] = useState("");
  const router = useRouter();
  const [error, setErrors] = useState({});
  const [expectedToken, setExpectedToken] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classYearOptions, setClassYearOptions] = useState([]);
  const [allClassArms, setAllClassArms] = useState([]); // Store all class arms from API
  const [filteredClassArms, setFilteredClassArms] = useState([]); // Store filtered class arms
  const [classArmOptions, setClassArmOptions] = useState([]);

  const [formData, setFormData] = useState({
    temp_token: "",
    admission_number: "",
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
    admission_date: "",
    // status: "",
    parent_first_name: "",
    parent_last_name: "",
    parent_middle_name: "",
    parent_occupation: "",
    parent_contact_info: "",
    parent_emergency_contact: "",
    parent_relationship: "",
    class_year: "",
    class_arm: "",
    status: true,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch class years
      const years = await getClass();
      if (years.data) {
        setClassYearOptions(
          years.data.map((year) => ({
            label: year.class_name,
            value: year.class_year_id, // Use class_id as value for filtering
          }))
        );
      }

      // Fetch all class arms
      const arms = await getClassArm();
      if (arms.data) {
        setAllClassArms(arms.data); // Store all class arms
        setFilteredClassArms(arms.data); // Initially show all arms
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (formData.class_year && allClassArms.length > 0) {
      const filtered = allClassArms.filter(
        (arm) => arm.class_year === formData.class_year
      );
      setFilteredClassArms(filtered);

      // Reset class_arm if it's no longer valid for the selected year
      if (
        filtered.length > 0 &&
        !filtered.some((arm) => arm.arm_name === formData.class_arm)
      ) {
        setFormData((prev) => ({ ...prev, class_arm: "" }));
      }
    } else {
      setFilteredClassArms(allClassArms); // Show all if no year selected
    }
  }, [formData.class_year, allClassArms]);

  useEffect(() => {
    setClassArmOptions(
      filteredClassArms.map((arm) => ({
        label: arm.arm_name,
        value: arm.arm_name,
      }))
    );
  }, [filteredClassArms]);

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
  // Retrieve the token from localStorage when the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem("verificationToken");
    console.log("Stored Token:", storedToken);
    if (storedToken) {
      setExpectedToken(storedToken);
    }
  }, []);

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];
  const RelationshipOptions = [
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (token.trim() !== expectedToken) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        token: "Token does not match.",
      }));
      return;
    }
    setIsSubmitting(true);

    // Prepare the data for API
    const studentData = {
      ...formData,
      country: selectedCountry?.isoCode || "",
      state: selectedState?.isoCode || "",
      city: selectedCity?.name || "",
      temp_token: token,
    };

    try {
      toast.success("Registration successful! Redirecting to Profile page...");
      localStorage.setItem("studentInfo", JSON.stringify(studentData));
      router.push(`${registrationFormPath}Profile`);
    } catch (err) {
      toast.error("An error occurred during registration.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white max-w-full  flex flex-col "
    >
      <div className="bg-[#01427a] w-full left-0 fixed top-0 z-[1000] text-white flex justify-between items-center px-8 py-5 font-bold">
        <h2 className="text-2xl">Student Registration</h2>
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
          </div>
        </div>
        <hr className="border-[#0000001a] -mx-8 my-0" />

        {/* Admission Info Component */}
        <div className=" lg:w-full mb-5 px-8 py-2.5 ">
          <div className="font-bold text-blue-900 mb-4 mt-6 text-xl">
            <h1>Admission Information</h1>
          </div>
          <div className="w-full mb-3 lg:grid lg:grid-cols-2 gap-4 flex flex-col row-gap-10 personalInfoGridadmission">
            <div>
              <label
                htmlFor="admissionNumber"
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                Admission Number
              </label>
              <input
                type="text"
                name="admission_number"
                value={formData.admission_number}
                placeholder="Enter Admission Number"
                onChange={handleInputChange}
                required
                className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              />
              {error?.admission_number && (
                <p className="text-red-500 text-xs mt-1">
                  {error.admission_number}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="admission_date"
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                Admission Date
              </label>
              <input
                type="date"
                name="admission_date"
                value={formData.admission_date}
                placeholder="Enter Admission date"
                onChange={handleInputChange}
                required
                className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              />
              {error?.admission_date && (
                <p className="text-red-500 text-xs mt-1">
                  {error.admission_date}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="classYear"
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                Class Year
              </label>

              <RegDropdown
                label={
                  classYearOptions.find((y) => y.value === formData.class_year)
                    ?.label || "Select Year"
                }
                items={classYearOptions}
                onSelect={(value) => {
                  setFormData((prev) => ({ ...prev, class_year: value }));
                }}
              />

              {error?.class_year && (
                <p className="text-red-500 text-xs mt-1">{error.class_year}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="classYear"
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                Class Arm
              </label>

              <RegDropdown
                label={formData.class_arm || "Select Arm"}
                items={classArmOptions}
                onSelect={(value) =>
                  setFormData((prev) => ({ ...prev, class_arm: value }))
                }
              />

              {error?.class_arm && (
                <p className="text-red-500 text-xs mt-1">{error.class_arm}</p>
              )}
            </div>
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
              {formData.status ? "Active" : "Deactivated"}
            </button>
          </div>
        </div>
        <hr className="border-[#0000001a] -mx-8 my-0" />

        <div className="w-full mb-5 px-8 py-2.5 ">
          <div className="font-bold text-xl text-blue-900 mb-4 mt-6 RegFormTitle">
            <h1>Parent's Information</h1>
          </div>
          <div className="w-full grid grid-cols-1 gap-3 lg:grid lg:grid-cols-3 lg:gap-4 row-gap-10 ">
            <div className="personalInfoItem">
              <label
                htmlFor="ParentfirstName"
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                Parent's First Name
              </label>
              <input
                type="text"
                name="parent_first_name"
                value={formData.parent_first_name}
                placeholder="Enter First Name"
                onChange={handleInputChange}
                required
                className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              />
              {error?.parent_first_name && (
                <p className="text-red-500 text-xs mt-1">
                  {error.parent_first_name}
                </p>
              )}
            </div>
            <div className="personalInfoItem">
              <label
                htmlFor="ParentmiddleName"
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                Parent's Middle Name
              </label>
              <input
                type="text"
                name="parent_middle_name"
                value={formData.parent_middle_name}
                placeholder="Enter Middle Name"
                onChange={handleInputChange}
                required
                className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              />
              {error?.parent_middle_name && (
                <p className="text-red-500 text-xs mt-1">
                  {error.parent_middle_name}
                </p>
              )}
            </div>
            <div className="personalInfoItem">
              <label
                htmlFor="ParentlastName"
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                Parent's Last Name
              </label>
              <input
                type="text"
                name="parent_last_name"
                value={formData.parent_last_name}
                placeholder="Enter Last Name"
                onChange={handleInputChange}
                required
                className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              />
              {error?.parent_last_name && (
                <p className="text-red-500 text-xs mt-1">
                  {error.parent_last_name}
                </p>
              )}
            </div>
            <div className="personalInfoItem">
              <label
                htmlFor="Occupation"
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                Parent's Occupation
              </label>
              <input
                type="text"
                name="parent_occupation"
                value={formData.parent_occupation}
                placeholder="Enter  Occupation"
                onChange={handleInputChange}
                required
                className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              />
              {error?.parent_occupation && (
                <p className="text-red-500 text-xs mt-1">
                  {error.parent_occupation}
                </p>
              )}
            </div>
            <div className="personalInfoItem">
              <label
                htmlFor="PhoneNumber"
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                Parent's Phone Number
              </label>
              <input
                type="tel"
                name="parent_contact_info"
                value={formData.parent_contact_info}
                placeholder="Enter Phone No"
                onChange={handleInputChange}
                required
                className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              />
              {error?.parent_contact_info && (
                <p className="text-red-500 text-xs mt-1">
                  {error.parent_contact_info}
                </p>
              )}
            </div>

            <div className="personalInfoItem">
              <label
                htmlFor="EmergencyContact"
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                Emergency Contact
              </label>
              <input
                type="tel"
                name="parent_emergency_contact"
                value={formData.parent_emergency_contact}
                placeholder="Enter Emergency Contact"
                onChange={handleInputChange}
                required
                className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              />
              {error?.parent_emergency_contact && (
                <p className="text-red-500 text-xs mt-1">
                  {error.parent_emergency_contact}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={"relationship"}
                className="font-bold text-gray-500 text-sm block mb-1"
              >
                Relationship
              </label>

              <RegDropdown
                label={formData.parent_relationship || "Select Relationship"}
                items={RelationshipOptions}
                onSelect={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    parent_relationship: value,
                  }))
                }
              />
              {error?.parent_relationship && (
                <p className="text-[#f2645c] text-sm mt-1">
                  {error.parent_relationship}
                </p>
              )}
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
          </div>
        </div>
      </div>
      <div className="flex justify-end pr-4 pb-3 mt-20">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-[#01427a] text-white text-base rounded px-8 py-4 cursor-pointer hover:bg-[#01427a]/90 transition-colors ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Processing..." : "Next Page"}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
