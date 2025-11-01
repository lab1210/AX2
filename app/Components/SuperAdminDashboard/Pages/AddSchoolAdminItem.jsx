"use client";
import React, { useState, useEffect, useCallback } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { BiChevronDown } from "react-icons/bi";
import { Country, State, City } from "country-state-city";
import DashboardHeader from "../DashboardHeader";
import { createSchoolAdmin } from "../../../Service/schoolAdminService";
import { getSchools } from "../../../Service/schoolService";
import { getAllRoles } from "../../../Service/RoleService";
import Dropdown from "../../../Components/SchoolAdminDashBoard/DropDown2";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

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
    user_role: "", // Will be populated with the School Admin role ID
    school: "", // Will hold the school ID
    surname: "",
    first_name: "",
    email: "", // School Admin's personal email
    phone_number: "",
    address: "default address",
    city: "",
    state: "",
    region: "southwest",
    country: "",
    designation: "",
  });

  const [schoolsData, setSchoolsData] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [errorSchools, setErrorSchools] = useState(null);
  const [schoolAdminRoleId, setSchoolAdminRoleId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [schoolLogo, setSchoolLogo] = useState("/icons.png");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
            user_role: schoolAdminRole.id,
          }));
          setSchoolAdminRoleId(schoolAdminRole.id);
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

  const handleSchoolChange = (selectedSchool) => {
    setFormData({ ...formData, school: selectedSchool?.value });
    const selectedSchoolData = schoolsData.find(
      (school) => school.id === selectedSchool?.value
    );
    if (selectedSchoolData && selectedSchoolData.logo) {
      setSchoolLogo(selectedSchoolData.logo);
    } else {
      setSchoolLogo("/icons.png");
    }
  };

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
    setFormData({ ...formData, country: selected?.name, state: "", city: "" });
  };

  const handleStateChange = (selected) => {
    setSelectedState(selected);
    setSelectedCity(null);
    setFormData({ ...formData, state: selected?.name, city: "" });
  };

  const handleCityChange = (selected) => {
    setSelectedCity(selected);
    setFormData({ ...formData, city: selected?.name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      user: formData.user,
      user_role: formData.user_role,
      school: formData.school,
      surname: formData.surname,
      first_name: formData.first_name,
      email: formData.email, // Using the school admin's personal email
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
        toast.success("School Admin created successfully");
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
        });
        setSelectedCountry(null);
        setSelectedState(null);
        setSelectedCity(null);
        setTimeout(() => {
          router.push(`/Super-Admin/Manage-School-Admin?adminId=${adminId}`);
        }, 2000);
      } else {
        console.error("Failed to create school admin:", response?.data);
        toast.error(
          response?.data?.message || "Failed to create school admin."
        );
      }
    } catch (error) {
      console.error("Error creating school admin:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingSchools) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (errorSchools) {
    return (
      <div className="text-center bg-red-200 border border-red-500 text-red-700 px-4 py-2 rounded-md z-50">
        {errorSchools}
      </div>
    );
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
        className="bg-[#D4D4D4] h-screen  p-4 sm:overflow-auto lg:overflow-hidden  gap-3 lg:h-screen "
      >
        <div className="sm:flex sm:flex-col h-screen sm:gap-2 lg:grid lg:grid-cols-[2.5fr_1fr] overflow-auto  gap-3 lg:h-screen ">
          <div className="bg-[#ffffff] rounded-lg flex flex-col lg:overflow-y-auto lg:max-h-[calc(100vh-95px)] lg:overflow-auto no-scrollbar">
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
                    className="text-[#808080] font-semibold text-sm "
                    htmlFor="first_name"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className={`text-base  ${
                      formData.first_name !== ""
                        ? "border-[#01427A]  border-2"
                        : "border-[#AEAEAE] border-[1.5px]"
                    }   rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm  p-2  placeholder:text-[#d4d4d4] placeholder:font-normal font-bold `}
                    placeholder="Enter First Name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2 ">
                  <label
                    className="text-[#808080] font-semibold text-sm "
                    htmlFor="surname"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="surname"
                    name="surname"
                    className={`text-base  ${
                      formData.surname !== ""
                        ? "border-[#01427A]  border-2"
                        : "border-[#AEAEAE] border-[1.5px]"
                    }   rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm  p-2  placeholder:text-[#d4d4d4] placeholder:font-normal font-bold `}
                    placeholder="Enter Last Name"
                    value={formData.surname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label
                    className="text-[#808080] font-semibold text-sm "
                    htmlFor="phone_number"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    className={`text-base  ${
                      formData.phone_number !== ""
                        ? "border-[#01427A]  border-2"
                        : "border-[#AEAEAE] border-[1.5px]"
                    }   rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm  p-2  placeholder:text-[#d4d4d4] placeholder:font-normal font-bold `}
                    placeholder="Enter Phone Number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label
                    className="text-[#808080] font-semibold text-sm "
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`text-base  ${
                      formData.email !== ""
                        ? "border-[#01427A]  border-2"
                        : "border-[#AEAEAE] border-[1.5px]"
                    }   rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm  p-2  placeholder:text-[#d4d4d4] placeholder:font-normal font-bold `}
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label
                    className="text-[#808080] font-semibold text-sm "
                    htmlFor="designation"
                  >
                    Designation
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    className={`text-base  ${
                      formData.designation !== ""
                        ? "border-[#01427A]  border-2"
                        : "border-[#AEAEAE] border-[1.5px]"
                    }   rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm  p-2  placeholder:text-[#d4d4d4] placeholder:font-normal font-bold `}
                    placeholder="Enter Designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label
                    className="text-[#808080] font-semibold text-sm "
                    htmlFor="username"
                  >
                    Create Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="user.username"
                    className={`text-base  ${
                      formData.user.username !== ""
                        ? "border-[#01427A]  border-2"
                        : "border-[#AEAEAE] border-[1.5px]"
                    }   rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm  p-2  placeholder:text-[#d4d4d4] placeholder:font-normal font-bold `}
                    placeholder="Enter Username"
                    value={formData.user.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2">
                  <label
                    className="text-[#808080] font-semibold text-sm"
                    htmlFor="password"
                  >
                    Create Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="user.password"
                      autoComplete="new-password"
                      spellCheck={false}
                      className={`h-10 w-full text-base pr-10
        ${
          formData.user.password
            ? "border-[#01427A] border-2"
            : "border-[#AEAEAE] border-[1.5px]"
        }
        rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm p-2
        placeholder:text-[#d4d4d4] placeholder:font-normal font-bold`}
                      placeholder="Enter Password"
                      value={formData.user.password}
                      onChange={handleInputChange}
                      required
                    />

                    {/* Icon button INSIDE the input */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-0 flex items-center justify-center px-2
                 text-[#808080] hover:text-[#01427A] focus:outline-none"
                      tabIndex={0}
                    >
                      {showPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label
                    className="text-[#808080] font-semibold text-sm "
                    htmlFor="school_name"
                  >
                    School Name
                  </label>
                  <div className="grid grid-cols-1 ">
                    <Dropdown
                      label={
                        schoolsData.find(
                          (school) => school.id === formData.school
                        )?.school_name || "Select School"
                      }
                      items={schoolsData.map((school) => ({
                        label: school.school_name,
                        value: school.id,
                        onClick: () =>
                          handleSchoolChange({
                            label: school.school_name,
                            value: school.id,
                          }),
                      }))}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label
                    className="text-[#808080] font-semibold text-sm "
                    htmlFor="role"
                  >
                    User Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value="School Admin"
                    readOnly
                    className="text-base text-[#07508F] rounded-sm focus:outline-none sm:text-sm border-2 p-2 border-[#01427A] font-bold "
                  />
                </div>
              </div>
              <div className="pt-4 pl-6 pr-6 pb-10">
                <label
                  className="text-[#808080] font-semibold text-sm "
                  htmlFor=""
                >
                  Address
                </label>
                <div className="grid grid-cols-2 gap-3 mt-1 ">
                  <div className="grid grid-cols-1 mb-2">
                    <Dropdown
                      label={selectedCountry?.name || "Select Country"}
                      items={countries.map((country) => ({
                        label: country.name,
                        onClick: () => handleCountryChange(country),
                      }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 mb-2">
                    <Dropdown
                      label={selectedState?.name || "Select State"}
                      items={states.map((state) => ({
                        label: state.name,
                        onClick: () => handleStateChange(state),
                      }))}
                    />
                  </div>

                  <div className="grid grid-cols-1">
                    <Dropdown
                      label={selectedCity?.name || "Select City"}
                      items={cities.map((city) => ({
                        label: city.name,
                        onClick: () => handleCityChange(city),
                      }))}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end p-4">
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
          <div className="flex flex-col gap-2 h-screen  ">
            <div className="bg-[#ffffff] rounded-lg drop-shadow-lg p-4  flex flex-col">
              <p className="font-bold sm:text-lg xl:text-xl xl:mb-2 sm:mb-4 ">
                LOGO
              </p>
              <div className="flex flex-col items-center justify-center mt-2">
                <div className="mb-4 bg-[#E4E4E4] border-dashed border-[1.5px] border-[#333333] flex items-center relative  justify-center w-48 h-45">
                  <div className="w-28 h-28">
                    <img
                      className="w-full h-full"
                      src={schoolLogo}
                      alt="icon"
                    />
                    <input
                      type="file"
                      id="logo-upload"
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="bg-[#ffffff] xl:gap-0 lg:gap-2 h-auto rounded-lg pt-5 pl-5 pr-5 xl:pb-2 pb-8 drop-shadow-lg flex flex-col">
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
            </div> */}
          </div>
        </div>
      </form>
    </SuperAdminLayout>
  );
};

export default AddSchoolAdminItem;
