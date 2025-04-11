"use client";
import React, { useState, useEffect, useCallback } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { BiChevronDown } from "react-icons/bi";
import { Country, State, City } from "country-state-city";
import { LuUpload } from "react-icons/lu";
import DashboardHeader from "../DashboardHeader";
import { createSchoolAdmin } from "@/app/Service/schoolAdminService";
import { getSchools } from "@/app/Service/schoolService";
import { getAllRoles } from "@/app/Service/RoleService";
const AddSchoolAdminItem = () => {
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");
  const router = useRouter();

  const [formData, setFormData] = useState({
    user: {
      username: "",
      password: "",
      email: "",
    },
    user_role: "", // Assuming this is a static ID for 'School Admin' role
    school: "",
    surname: "",
    first_name: "",
    email: "",
    phone_number: "",
    address: "default address",
    city: "",
    state: "",
    region: "southwest",
    country: "",
    designation: "",
    school_logo: "/icons.png",
  });

  const [schoolsData, setSchoolsData] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [errorSchools, setErrorSchools] = useState(null);
  const [schoolAdminRoleId, setSchoolAdminRoleId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [schoolLogo, setSchoolLogo] = useState("/icons.png");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSchools = useCallback(async () => {
    setLoadingSchools(true);
    setErrorSchools(null);
    try {
      const response = await getSchools();
      if (response?.status === 200) {
        setSchoolsData(response.data.results || response.data);
      } else {
        setErrorSchools("Failed to fetch schools.");
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
      setErrorSchools("Error fetching schools.");
    } finally {
      setLoadingSchools(false);
    }
  }, []);

  const fetchSchoolAdminRoleId = useCallback(async () => {
    try {
      const response = await getAllRoles();
      if (response?.status === 200 && response.data) {
        const schoolAdminRole = response.data.find(
          (role) => role.name === "School Admin"
        );
        if (schoolAdminRole) {
          setFormData((prevData) => ({
            ...prevData,
            user_role: schoolAdminRole.role_id,
          }));
          setSchoolAdminRoleId(schoolAdminRole.role_id);
        } else {
          console.error("School Admin role not found.");
          setApiError("School Admin role not found.");
        }
      } else {
        console.error("Failed to fetch roles:", response?.data);
        setApiError("Failed to fetch roles.");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      setApiError("Error fetching roles.");
    }
  }, []);

  useEffect(() => {
    fetchSchools();
    fetchSchoolAdminRoleId();
  }, [fetchSchools, fetchSchoolAdminRoleId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (name.startsWith("user.")) {
        return {
          ...prevData,
          user: {
            ...prevData.user,
            [name.split(".")[1]]: value,
          },
        };
      } else {
        return { ...prevData, [name]: value };
      }
    });
  };
  const handleSchoolChange = (e) => {
    setFormData({ ...formData, school_name: e.target.value });
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadingLogo(true);
      setLogoError(null);
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSchoolLogo(reader.result);
          setFormData({ ...formData, school_logo: reader.result });
          setUploadingLogo(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error uploading logo:", error);
        setLogoError("Failed to upload logo.");
        setUploadingLogo(false);
      }
    }
  };

  const countries = Country.getAllCountries();
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode)
    : [];
  const cities = selectedState
    ? City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode)
    : [];

  const handleCountryChange = (event) => {
    const countryCode = event.target.value;
    const country = countries.find((c) => c.isoCode === countryCode);
    setSelectedCountry(country);
    setSelectedState(null);
    setSelectedCity(null);
    setFormData({ ...formData, country: country?.name, state: "", city: "" });
  };

  const handleStateChange = (event) => {
    const stateCode = event.target.value;
    const state = states.find((s) => s.isoCode === stateCode);
    setSelectedState(state);
    setSelectedCity(null);
    setFormData({ ...formData, state: state?.name, city: "" });
  };

  const handleCityChange = (event) => {
    const city = cities.find((c) => c.name === event.target.value);
    setSelectedCity(city);
    setFormData({ ...formData, city: city?.name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setApiSuccess(false);

    const payload = {
      user: formData.user,
      user_role: formData.user_role,
      school: formData.school,
      surname: formData.surname,
      first_name: formData.first_name,
      email: formData.user.email,
      phone_number: formData.phone_number,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      region: formData.region,
      country: formData.country,
      designation: formData.designation,
    };

    try {
      const response = await createSchoolAdmin(payload);
      if (response?.status === 201) {
        console.log("School Admin created successfully:", response.data);
        setApiSuccess(true);
        setFormData({
          user: {
            username: "",
            password: "",
            email: "",
          },
          user_role: "",
          school: "",
          surname: "",
          first_name: "",
          email: "",
          phone_number: "",
          city: "",
          state: "",
          country: "",
          designation: "",
          school_logo: "/icons.png",
        });
        setSelectedCountry(null);
        setSelectedState(null);
        setSelectedCity(null);
        setSchoolLogo("/icons.png");
        setTimeout(() => {
          router.push(`/Super-Admin/Manage-School-Admin?adminId=${adminId}`);
        }, 2000);
      } else {
        console.error("Failed to create school admin:", response?.data);
        setApiError(
          response?.data?.message || "Failed to create school admin."
        );
      }
    } catch (error) {
      console.error("Error creating school admin:", error);
      setApiError(error.message || "An unexpected error occurred.");
    }
  };

  if (loadingSchools) {
    return <div>Loading schools...</div>;
  }

  if (errorSchools) {
    return <div>Error loading schools: {errorSchools}</div>;
  }

  return (
    <SuperAdminLayout>
      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0  z-10 shadow-md  flex justify-between items-center ">
        <DashboardHeader />
        <Link href={`/Super-Admin/Manage-School-Admin?adminId=${adminId}`}>
          <button className="bg-[#07508F] text-white p-2 rounded-lg cursor-pointer ">
            View All Admin
          </button>
        </Link>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-[#D4D4D4] h-screen  p-4 sm:overflow-auto lg:overflow-hidden "
      >
        <div className="sm:flex sm:flex-col h-screen sm:gap-2 lg:grid lg:grid-cols-[2.5fr_1fr] overflow-auto  gap-3 lg:h-screen ">
          <div className="bg-[#ffffff] rounded-lg flex flex-col lg:overflow-y-auto lg:max-h-[calc(100vh-95px)] lg:overflow-auto no-scrollbar">
            {apiSuccess && (
              <div className="mt-4 pl-6 text-green-500">
                School Admin created successfully!
              </div>
            )}
            {apiError && (
              <div className="mt-4 pl-6 text-red-500">Error: {apiError}</div>
            )}
            <div>
              <p className="font-bold text-xl p-6">
                Administrative Information
              </p>
              <hr className="w-full border-t border-[#978F8F]" />
            </div>
            <div className="flex-grow flex flex-col  ">
              <div className="grid grid-cols-2 mt-6 pl-6 pr-6 gap-3 pb-0 ">
                <div className="flex flex-col gap-1 mb-2">
                  <label
                    className="text-[#808080] font-semibold"
                    htmlFor="first_name"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className="text-base text-[#808080] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4] placeholder:text-[#d4d4d4] "
                    placeholder="Enter First Name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2 ">
                  <label
                    className="text-[#808080] font-semibold"
                    htmlFor="middle_name"
                  >
                    Middle Name
                  </label>
                  <input
                    type="text"
                    id="middle_name"
                    name="middle_name"
                    className="text-base text-[#808080] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4] placeholder:text-[#d4d4d4] "
                    placeholder="Enter Middle Name"
                    // value={formData.middle_name}
                    // onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label
                    className="text-[#808080] font-semibold"
                    htmlFor="surname"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="surname"
                    name="surname"
                    className="text-base text-[#808080] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4] placeholder:text-[#d4d4d4] "
                    placeholder="Enter Last Name"
                    value={formData.surname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label
                    className="text-[#808080] font-semibold"
                    htmlFor="phone_number"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    className="text-base text-[#808080] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4] placeholder:text-[#d4d4d4] "
                    placeholder="Enter Phone Number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label
                    className="text-[#808080] font-semibold"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="user.email"
                    className="text-base text-[#808080] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4] placeholder:text-[#d4d4d4] "
                    placeholder="Enter Email"
                    value={formData.user.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label
                    className="text-[#808080] font-semibold"
                    htmlFor="designation"
                  >
                    Designation
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    className="text-base text-[#808080] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4] placeholder:text-[#d4d4d4] "
                    placeholder="Enter Designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label
                    className="text-[#808080] font-semibold"
                    htmlFor="username"
                  >
                    Create Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="user.username"
                    className="text-base text-[#808080] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4] placeholder:text-[#d4d4d4] "
                    placeholder="Enter Username"
                    value={formData.user.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label
                    className="text-[#808080] font-semibold"
                    htmlFor="password"
                  >
                    Create Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="user.password"
                    className="text-base text-[#808080] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4] placeholder:text-[#d4d4d4] "
                    placeholder="Enter Password"
                    value={formData.user.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2">
                  <label
                    className="text-[#808080] font-semibold"
                    htmlFor="school_name"
                  >
                    School Name
                  </label>
                  <div className="grid grid-cols-1 ">
                    <select
                      name="school"
                      id="school_name"
                      className=" w-full bg-white col-start-1 row-start-1 appearance-none text-base text-[#808080] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4] placeholder:text-[#d4d4d4] "
                      value={formData.school}
                      onChange={handleSchoolChange}
                      required
                    >
                      <option value="" disabled>
                        Select School
                      </option>
                      {schoolsData.map((school) => (
                        <option key={school.id} value={school.school_name}>
                          {school.school_name}
                        </option>
                      ))}
                    </select>
                    <BiChevronDown className="text-[#d4d4d4] col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label
                    className="text-[#808080] font-semibold"
                    htmlFor="role"
                  >
                    User Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={
                      schoolsData.find((role) => role.id === formData.user_role)
                        ?.name || "School Admin"
                    }
                    readOnly
                    className="text-base text-[#07508F] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#d4d4d4] font-bold "
                  />
                </div>
              </div>
              <div className="pt-4 pl-6 pr-6 pb-0">
                <label className="text-[#808080] font-semibold" htmlFor="">
                  Address
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
            </div>
          </div>
          <div className="flex flex-col gap-2 h-screen  ">
            <div className="bg-[#ffffff] rounded-lg drop-shadow-lg p-4  flex flex-col">
              <p className="font-bold sm:text-lg xl:text-xl xl:mb-2 sm:mb-4 ">
                LOGO
              </p>
              <div className="flex flex-col items-center justify-center mt-2">
                <div className="mb-4 bg-[#E4E4E4] border-dashed border-[1.5px] border-[#333333] flex items-center relative  justify-center w-48 h-35">
                  <div className="w-12 h-12">
                    <img
                      className="w-full h-full"
                      src={schoolLogo}
                      alt="icon"
                    />
                    <input
                      type="file"
                      id="logo-upload"
                      className="hidden"
                      onChange={handleLogoUpload}
                      accept="image/*"
                    />
                  </div>
                </div>
                <div>
                  <button
                    onClick={() =>
                      document.getElementById("logo-upload").click()
                    }
                    className="text-[#07508F]  border-[1.5px] rounded-lg cursor-pointer  border-dashed  w-48 p-2 flex items-center justify-between"
                  >
                    Upload School LOGO
                    <span>
                      <LuUpload size={20} />
                    </span>
                  </button>
                  {logoError && (
                    <p className="text-red-500 text-xs mt-1">{logoError}</p>
                  )}
                </div>
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
            </div>
          </div>
        </div>
      </form>
    </SuperAdminLayout>
  );
};

export default AddSchoolAdminItem;
