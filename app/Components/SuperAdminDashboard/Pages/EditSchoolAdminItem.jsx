"use client";
import React, { useCallback, useEffect, useState } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Country, State, City } from "country-state-city";
import DashboardHeader from "../DashboardHeader";
import schoolAdminService from "@/Service/schoolAdminService";
import schoolService from "@/Service/schoolService";
import BlueDropdown from "@/Components/BlueDropDown";
import toast from "react-hot-toast";

const EditSchoolAdminItem = () => {
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");
  const schoolAdminFromParams = searchParams.get("schoolAdminId");
  const router = useRouter();

  const [schoolAdminId, setSchoolAdminId] = useState(schoolAdminFromParams);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstName: "",
    middleName: "",
    surname: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    designation: "",
    schoolId: "",
  });
  const [schoolsData, setSchoolsData] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [errorSchools, setErrorSchools] = useState(null);
  const [schoolLogo, setSchoolLogo] = useState("/icons.png");
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const fetchSchoolAdminDetails = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await schoolAdminService.getSchoolAdminById(id);
      console.log("Fetched Admin Data:", response);
      
      if (response.success && response.data) {
        const adminData = response.data;
        setFormData({
          email: adminData.email || "",
          username: adminData.username || "",
          firstName: adminData.firstName || "",
          middleName: adminData.middleName || "",
          surname: adminData.surname || "",
          phoneNumber: adminData.phoneNumber || "",
          address: adminData.address || "",
          city: adminData.city || "",
          state: adminData.state || "",
          country: adminData.country || "",
          designation: adminData.designation || "",
          schoolId: adminData.schoolId || "",
        });
        
        if (adminData.logo) {
          setSchoolLogo(adminData.logo);
        }
        
        // Parse address for dropdowns
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
        toast.error(response.message || "Failed to fetch school admin details.");
      }
    } catch (error) {
      console.error("Error fetching school admin details:", error);
      toast.error("Error fetching school admin details.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSchools = useCallback(async () => {
    setLoadingSchools(true);
    setErrorSchools(null);
    try {
      const response = await schoolService.getAllSchools();
      console.log("Schools response:", response);
      
      if (response.success) {
        setSchoolsData(response.data || []);
      } else {
        setErrorSchools(response.message || "Failed to fetch schools.");
        toast.error(response.message || "Failed to fetch schools.");
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
      setErrorSchools("Error fetching schools.");
      toast.error("Error fetching schools.");
    } finally {
      setLoadingSchools(false);
    }
  }, []);

  useEffect(() => {
    if (schoolAdminId) {
      fetchSchoolAdminDetails(schoolAdminId);
    }
    fetchSchools();
  }, [schoolAdminId, fetchSchoolAdminDetails, fetchSchools]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSchoolChange = (selectedSchool) => {
    setFormData({ ...formData, schoolId: selectedSchool?.value });
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
    setFormData({ ...formData, country: selected?.name || "", state: "", city: "" });
  };

  const handleStateChange = (selected) => {
    setSelectedState(selected);
    setSelectedCity(null);
    setFormData({ ...formData, state: selected?.name || "", city: "" });
  };

  const handleCityChange = (selected) => {
    setSelectedCity(selected);
    setFormData({ ...formData, city: selected?.name || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare payload matching UpdateSchoolAdminDto
    const payload = {
      email: formData.email || null,
      username: formData.username || null,
      firstName: formData.firstName || null,
      middleName: formData.middleName || null,
      surname: formData.surname || null,
      phoneNumber: formData.phoneNumber || null,
      address: formData.address || null,
      city: formData.city || null,
      state: formData.state || null,
      country: formData.country || null,
      designation: formData.designation || null,
    };

    console.log("Updating school admin with payload:", payload);

    try {
      const response = await schoolAdminService.updateSchoolAdmin(schoolAdminId, payload);
      console.log("Update response:", response);
      
      if (response.success) {
        toast.success("School Admin updated successfully!");
        setTimeout(() => {
          router.push(`/Super-Admin/Manage-School-Admin?adminId=${adminId}`);
        }, 2000);
      } else {
        toast.error(response.message || "Failed to update school admin.");
      }
    } catch (error) {
      console.error("Error updating school admin:", error);
      toast.error(error.message || "An unexpected error occurred.");
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

  if (errorSchools && schoolsData.length === 0) {
    return (
      <SuperAdminLayout>
        <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
          <DashboardHeader />
        </div>
        <div className="bg-[#D4D4D4] overflow-auto flex-1 p-4">
          <div className="text-center bg-red-200 border border-red-500 text-red-700 px-4 py-2 rounded-md">
            {errorSchools}
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <DashboardHeader />
        <Link href={`/Super-Admin/Manage-School-Admin?adminId=${adminId}`}>
          <button className="bg-[#07508F] text-white p-2 rounded-lg cursor-pointer">
            View All Admin
          </button>
        </Link>
      </div>
      <div className="bg-[#D4D4D4] p-4 sm:overflow-auto lg:overflow-hidden">
        <div className="sm:flex sm:flex-col sm:gap-2 lg:grid lg:grid-cols-[2.5fr_1fr] overflow-auto gap-3 lg:h-screen">
          <div className="bg-[#ffffff] rounded-lg flex flex-col lg:overflow-y-auto lg:max-h-[calc(100vh-95px)] lg:overflow-auto no-scrollbar">
            <div>
              <p className="font-bold text-xl p-6">Administrative Information</p>
              <hr className="w-full border-t border-[#978F8F]" />
            </div>
            <form id="edit-admin" onSubmit={handleSubmit} className="flex-grow flex flex-col">
              <div className="grid grid-cols-2 mt-6 pl-6 pr-6 gap-3 pb-0">
                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[#808080] font-semibold text-sm">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`text-base ${
                      formData.email !== ""
                        ? "border-[#01427A] border-2 text-[#01427A]"
                        : "border-[#AEAEAE] border-[1.5px]"
                    } rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm p-2 placeholder:text-[#d4d4d4] placeholder:font-normal font-bold`}
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[#808080] font-semibold text-sm">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className={`text-base ${
                      formData.username !== ""
                        ? "border-[#01427A] border-2 text-[#01427A]"
                        : "border-[#AEAEAE] border-[1.5px]"
                    } rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm p-2 placeholder:text-[#d4d4d4] placeholder:font-normal font-bold`}
                    placeholder="Enter Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[#808080] font-semibold text-sm">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className={`text-base ${
                      formData.firstName !== ""
                        ? "border-[#01427A] border-2 text-[#01427A]"
                        : "border-[#AEAEAE] border-[1.5px]"
                    } rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm p-2 placeholder:text-[#d4d4d4] placeholder:font-normal font-bold`}
                    placeholder="Enter First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[#808080] font-semibold text-sm">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    className={`text-base ${
                      formData.middleName !== ""
                        ? "border-[#01427A] border-2 text-[#01427A]"
                        : "border-[#AEAEAE] border-[1.5px]"
                    } rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm p-2 placeholder:text-[#d4d4d4] placeholder:font-normal font-bold`}
                    placeholder="Enter Middle Name"
                    value={formData.middleName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[#808080] font-semibold text-sm">
                    Surname
                  </label>
                  <input
                    type="text"
                    id="surname"
                    name="surname"
                    className={`text-base ${
                      formData.surname !== ""
                        ? "border-[#01427A] border-2 text-[#01427A]"
                        : "border-[#AEAEAE] border-[1.5px]"
                    } rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm p-2 placeholder:text-[#d4d4d4] placeholder:font-normal font-bold`}
                    placeholder="Enter Surname"
                    value={formData.surname}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[#808080] font-semibold text-sm">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    className={`text-base ${
                      formData.phoneNumber !== ""
                        ? "border-[#01427A] border-2 text-[#01427A]"
                        : "border-[#AEAEAE] border-[1.5px]"
                    } rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm p-2 placeholder:text-[#d4d4d4] placeholder:font-normal font-bold`}
                    placeholder="Enter Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[#808080] font-semibold text-sm">
                    Designation
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    className={`text-base ${
                      formData.designation !== ""
                        ? "border-[#01427A] border-2 text-[#01427A]"
                        : "border-[#AEAEAE] border-[1.5px]"
                    } rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm p-2 placeholder:text-[#d4d4d4] placeholder:font-normal font-bold`}
                    placeholder="Enter Designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[#808080] font-semibold text-sm">
                    School Name <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1">
                    <BlueDropdown
                      label={
                        schoolsData.find((school) => school.id === formData.schoolId)?.schoolName || "Select School"
                      }
                      items={schoolsData.map((school) => ({
                        label: school.schoolName,
                        value: school.id,
                        onClick: () =>
                          handleSchoolChange({
                            label: school.schoolName,
                            value: school.id,
                          }),
                      }))}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[#808080] font-semibold text-sm">
                    User Role
                  </label>
                  <input
                    type="text"
                    value="School Admin"
                    readOnly
                    className="text-base text-[#07508F] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 pl-6 pr-6 pb-10">
                <label className="text-[#808080] font-semibold text-sm">Address</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div className="grid grid-cols-1 mb-2">
                    <BlueDropdown
                      label={selectedCountry?.name || "Select Country"}
                      items={countries.map((country) => ({
                        label: country.name,
                        onClick: () => handleCountryChange(country),
                      }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 mb-2">
                    <BlueDropdown
                      label={selectedState?.name || "Select State"}
                      items={states.map((state) => ({
                        label: state.name,
                        onClick: () => handleStateChange(state),
                      }))}
                    />
                  </div>
                  <div className="grid grid-cols-1">
                    <BlueDropdown
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
                  form="edit-admin"
                  disabled={loading}
                  className={`bg-[#4084B1] text-white pt-2 pb-2 pl-12 pr-12 text-sm rounded-lg cursor-pointer ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-2 h-screen">
            <div className="bg-[#ffffff] rounded-lg drop-shadow-lg p-4 flex flex-col">
              <p className="font-bold sm:text-lg xl:text-xl xl:mb-2 sm:mb-4">LOGO</p>
              <div className="flex flex-col items-center justify-center mt-2">
                <div className="mb-4 bg-[#E4E4E4] border-dashed border-[1.5px] p-1 border-[#333333] flex items-center relative justify-center w-48 h-45">
                  <div className="w-full h-full">
                    <img className="w-full h-full object-contain" src={schoolLogo} alt="school logo" />
                    <input type="file" id="logo-upload" className="hidden" accept="image/*" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Logo will be displayed from selected school
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default EditSchoolAdminItem;