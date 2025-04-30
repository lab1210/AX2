"use client";
import React, { useCallback, useEffect, useState } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BiChevronDown } from "react-icons/bi";
import { Country, State, City } from "country-state-city";
import DashboardHeader from "../DashboardHeader";
import { useRouter } from "next/navigation";
import {
  getSchoolAdminById,
  updateSchoolAdmin,
} from "../../../Service/schoolAdminService";
import { getAllRoles } from "../../../Service/RoleService";
import { getSchools } from "../../../Service/schoolService";

const EditSchoolAdminItem = () => {
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");
  const schoolAdminfromparams = searchParams.get("schoolAdminId");
  const router = useRouter();

  const [schoolAdminId, setSchoolAdminId] = useState(schoolAdminfromparams);

  const [formData, setFormData] = useState({
    user: {
      username: "",
      password: "",
      email: "",
      id: null,
    },
    user_role: "",
    school: "",
    surname: "",
    first_name: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
    region: "southwest",
    country: "",
    designation: "",
  });
  const [schoolsData, setSchoolsData] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [errorSchools, setErrorSchools] = useState(null);
  const [schoolAdminRole, setSchoolAdminRole] = useState(null);
  const [schoolLogo, setSchoolLogo] = useState("/icons.png");
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const fetchSchoolAdminDetails = useCallback(
    async (id) => {
      setLoading(true);
      setApiError(null);
      try {
        const response = await getSchoolAdminById(id);
        if (response?.status === 200 && response.data) {
          const adminData = response.data;
          console.log("Fetched Admin Data:", adminData);
          setFormData({
            user: {
              username: adminData.user?.username || "",
              password: "", // Do not populate password for security
              email: adminData.user?.email || "",
              id: adminData.user || null, // Store the user ID
            },
            user_role: adminData.user_role || "",
            school: adminData.school?.id || "",
            surname: adminData.surname || "",
            first_name: adminData.first_name || "",
            email: adminData.email || "",
            phone_number: adminData.phone_number || "",
            address: adminData.address || "",
            city: adminData.city || "",
            state: adminData.state || "",
            region: adminData.region || "southwest",
            country: adminData.country || "",
            designation: adminData.designation || "",
          });
          if (adminData.country) {
            const country = Country.getAllCountries().find(
              (c) => c.name === adminData.country
            );
            setSelectedCountry(country);
            if (adminData.state && country) {
              const state = State.getStatesOfCountry(country.isoCode).find(
                (s) => s.name === adminData.state
              );
              setSelectedState(state);
              if (adminData.city && state) {
                const city = City.getCitiesOfState(
                  state.countryCode,
                  state.isoCode
                ).find((c) => c.name === adminData.city);
                setSelectedCity(city);
              }
            }
          }
        } else {
          setApiError("Failed to fetch school admin details.");
        }
      } catch (error) {
        console.error("Error fetching school admin details:", error);
        setApiError("Error fetching school admin details.");
      } finally {
        setLoading(false);
      }
    },
    [schoolAdminId]
  );
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

  const fetchSchoolAdminRole = useCallback(async () => {
    try {
      const response = await getAllRoles();
      if (response?.status === 200 && response.data) {
        const role = response.data.find((r) => r.name === "School Admin");
        setSchoolAdminRole(role);
        setFormData((prevData) => ({ ...prevData, user_role: role?.id || "" }));
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
    if (schoolAdminId) {
      fetchSchoolAdminDetails(schoolAdminId);
    }
    fetchSchools();
    fetchSchoolAdminRole();
  }, [
    schoolAdminId,
    fetchSchoolAdminDetails,
    fetchSchools,
    fetchSchoolAdminRole,
  ]);

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
    const selectedSchoolId = e.target.value;
    setFormData({ ...formData, school: selectedSchoolId });
    const selectedSchool = schoolsData.find(
      (school) => school.id === selectedSchoolId
    );
    if (selectedSchool && selectedSchool.logo) {
      setSchoolLogo(selectedSchool.logo);
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
    setLoading(true);

    const payload = {
      surname: formData.surname,
      first_name: formData.first_name,
      email: formData.email,
      phone_number: formData.phone_number,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      region: formData.region,
      country: formData.country,
      designation: formData.designation,
      user: formData.user?.id,
    };

    try {
      const response = await updateSchoolAdmin(schoolAdminId, payload);
      if (response?.status === 200) {
        console.log("School Admin updated successfully:", response.data);
        setApiSuccess(true);
        setTimeout(() => {
          router.push(`/Super-Admin/Manage-School-Admin?adminId=${adminId}`);
        }, 2000);
      } else {
        console.error("Failed to update school admin:", response?.data);
        setApiError(
          response?.data?.message || "Failed to update school admin."
        );
      }
    } catch (error) {
      console.error("Error updating school admin:", error);
      setApiError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || loadingSchools) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
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
      <div className="bg-[#D4D4D4]  p-4 sm:overflow-auto lg:overflow-hidden ">
        <div className="sm:flex sm:flex-col sm:gap-2 lg:grid lg:grid-cols-[2.5fr_1fr] overflow-auto  gap-3 lg:h-screen ">
          <div className="bg-[#ffffff] rounded-lg flex flex-col lg:overflow-y-auto lg:max-h-[calc(100vh-95px)] lg:overflow-auto no-scrollbar">
            {apiSuccess && (
              <div className="mt-4 pl-6 text-green-500">
                School Admin updated successfully!
              </div>
            )}
            {apiError && (
              <div className="mt-4 pl-6 font-bold text-red-500">
                Error: {apiError}
              </div>
            )}
            <div>
              <p className="font-bold text-xl p-6">
                Administrative Information
              </p>
              <hr className="w-full border-t border-[#978F8F]" />
            </div>
            <form onSubmit={handleSubmit} className="flex-grow flex flex-col  ">
              <div className="grid grid-cols-2 mt-6 pl-6 pr-6 gap-3 pb-0 ">
                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[#808080] font-semibold" htmlFor="">
                    First Name
                  </label>

                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className="text-base font-bold text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
                    placeholder="Enter First Name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2 ">
                  <label className="text-[#808080] font-semibold" htmlFor="">
                    Middle Name
                  </label>

                  <input
                    type="text"
                    className="text-base font-bold text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
                    placeholder="Enter Middle Name"
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
                    className="text-base font-bold text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
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
                    className="text-base font-bold text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
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
                    name="email"
                    className="text-base font-bold text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
                    placeholder="Enter Email"
                    value={formData.email}
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
                    className="text-base font-bold text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
                    placeholder="Enter Designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label
                    className="text-[#808080] font-semibold"
                    htmlFor="user.username"
                  >
                    Create Username
                  </label>

                  <input
                    type="text"
                    id="user.username"
                    name="user.username"
                    className="text-base font-bold text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
                    placeholder="Enter Username"
                    value={formData.user.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label className="text-[#808080] font-semibold" htmlFor="">
                    Create Password
                  </label>

                  <input
                    type="text"
                    id="user.password"
                    name="user.password"
                    className="text-base font-bold text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
                    placeholder="Enter Password"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2">
                  <label
                    className="text-[#808080] font-semibold"
                    htmlFor="school"
                  >
                    School Name
                  </label>

                  <div className="grid grid-cols-1 ">
                    <select
                      id="school"
                      name="school"
                      className=" font-bold w-full bg-white col-start-1 row-start-1 appearance-none text-base text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
                      value={formData.school}
                      onChange={handleSchoolChange}
                      required
                    >
                      <option value="" disabled selected>
                        Select School
                      </option>
                      {schoolsData.map((item) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.school_name}
                          </option>
                        );
                      })}
                    </select>
                    <BiChevronDown className="text-[#01427A] col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label className="text-[#808080] font-semibold" htmlFor="">
                    User Role
                  </label>

                  <input
                    type="text"
                    value="School Admin"
                    readOnly
                    className="text-base text-[#07508F] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] font-bold "
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
                      className=" font-bold w-full bg-white col-start-1 row-start-1 appearance-none text-base text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
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
                    <BiChevronDown className="text-[#01427A] col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end pointer-events-none" />
                  </div>
                  <div className="grid grid-cols-1 mb-2">
                    <select
                      className=" font-bold w-full bg-white col-start-1 row-start-1 appearance-none text-base text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
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
                    <BiChevronDown className="text-[#01427A] col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end pointer-events-none" />
                  </div>

                  <div className="grid grid-cols-1">
                    <select
                      className=" font-bold w-full bg-white col-start-1 row-start-1 appearance-none text-base text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
                      onChange={handleCityChange}
                      value={selectedCity ? selectedCity.name : ""}
                      disabled={!selectedState}
                      required
                    >
                      <option value="" disabled selected>
                        Select City
                      </option>
                      {cities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    <BiChevronDown className="text-[#01427A] col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end pointer-events-none" />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="flex flex-col gap-2 h-screen  ">
            <div className="bg-[#ffffff] rounded-lg drop-shadow-lg p-4  flex flex-col">
              <p className="font-bold sm:tex-lg xl:text-xl xl:mb-2 sm:mb-4 ">
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

export default EditSchoolAdminItem;
