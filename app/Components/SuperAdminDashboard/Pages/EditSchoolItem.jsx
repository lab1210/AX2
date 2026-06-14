"use client";
import React, { useState, useEffect } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardHeader from "../DashboardHeader";
import Link from "next/link";
import { Country, State, City } from "country-state-city";
import { LuUpload } from "react-icons/lu";
import BlueDropdown from "../../../Components/BlueDropDown";
import schoolService from "@/Service/SchoolService";
import toast from "react-hot-toast";

const EditSchoolItem = () => {
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");
  const schoolIdFromParams = searchParams.get("schoolId");
  const router = useRouter();

  const [schoolId, setSchoolId] = useState(schoolIdFromParams);
  const [schoolName, setSchoolName] = useState("");
  const [shortName, setShortName] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [schoolLogo, setSchoolLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("/icons.png");
  const [loading, setLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  const countries = Country.getAllCountries();
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode)
    : [];
  const cities = selectedState
    ? City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode)
    : [];

  // Helper to convert education level string to enum value
  const getEducationLevelValue = (level) => {
    const levelMap = {
      "Nursery": 0,
      "Primary": 1,
      "Nursery & Primary": 2,
      "Nursery, Primary & Secondary": 3,
      "Secondary": 4,
      "Primary & Secondary": 5,
      "Tertiary": 6
    };
    return levelMap[level] ?? 1;
  };

  // Helper to convert education level enum to string
  const getEducationLevelString = (value) => {
    const levelMap = {
      0: "Nursery",
      1: "Primary",
      2: "Nursery & Primary",
      3: "Nursery, Primary & Secondary",
      4: "Secondary",
      5: "Primary & Secondary",
      6: "Tertiary"
    };
    return levelMap[value] ?? "Primary";
  };

  // Helper to convert school type enum to string
  const getSchoolTypeString = (value) => {
    return value === 1 ? "Private" : "Public";
  };

  // Helper to convert school type string to enum value
  const getSchoolTypeValue = (type) => {
    return type === "Private" ? 1 : 0;
  };

  // Fetch school details
  useEffect(() => {
    const fetchSchoolDetails = async () => {
      if (schoolId) {
        setLoading(true);
        try {
          const schoolResponse = await schoolService.getSchoolById(schoolId);
          console.log("Fetched school data:", schoolResponse);

          if (schoolResponse.success && schoolResponse.data) {
            const schoolData = schoolResponse.data;
            setSchoolName(schoolData.schoolName || "");
            setShortName(schoolData.shortName || "");
            setSchoolType(getSchoolTypeString(schoolData.schoolType));
            setEducationLevel(getEducationLevelString(schoolData.educationLevel));
            setPhoneNumber(schoolData.phoneNumber || "");
            setEmail(schoolData.email || "");
            setIsActive(schoolData.isActive || false);

            // Handle country
            if (schoolData.country) {
              const allCountries = Country.getAllCountries();
              const country = allCountries.find(c => c.name === schoolData.country);
              setSelectedCountry(country || null);
              if (country && schoolData.state) {
                const statesOfCountry = State.getStatesOfCountry(country.isoCode);
                const state = statesOfCountry.find(s => s.name === schoolData.state);
                setSelectedState(state || null);
                if (state && schoolData.city) {
                  const citiesOfState = City.getCitiesOfState(state.countryCode, state.isoCode);
                  const city = citiesOfState.find(c => c.name === schoolData.city);
                  setSelectedCity(city || null);
                }
              }
            }

            if (schoolData.logo) {
              setLogoPreview(schoolData.logo);
            }
          } else {
            toast.error(schoolResponse.message || "Failed to fetch school details.");
          }
        } catch (err) {
          console.error("Error fetching details:", err);
          toast.error("Error fetching school details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSchoolDetails();
  }, [schoolId]);

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSchoolLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSchoolLogo(null);
      setLogoPreview("/icons.png");
    }
  };

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

  // Toggle school status
  const handleToggleStatus = async () => {
    setToggleLoading(true);
    try {
      let response;
      if (isActive) {
        response = await schoolService.deactivateSchool(schoolId);
      } else {
        response = await schoolService.activateSchool(schoolId);
      }
      
      if (response.success) {
        setIsActive(!isActive);
        toast.success(response.message || `School ${isActive ? "deactivated" : "activated"} successfully!`);
      } else {
        toast.error(response.message || `Failed to ${isActive ? "deactivate" : "activate"} school`);
      }
    } catch (err) {
      console.error("Error toggling school status:", err);
      toast.error(`An unexpected error occurred: ${err.message}`);
    } finally {
      setToggleLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!schoolName || !shortName || !schoolType || !educationLevel || !phoneNumber || !email || !selectedCountry || !selectedState || !selectedCity) {
      toast.error("Please fill in all required information.");
      setLoading(false);
      return;
    }

    const updateData = {
      schoolName: schoolName,
      schoolAddress: `${selectedCity?.name || ""}, ${selectedState?.name || ""}, ${selectedCountry?.name || ""}`,
      city: selectedCity?.name || "",
      state: selectedState?.name || "",
      country: selectedCountry?.name || "",
      email: email,
      phoneNumber: phoneNumber,
      shortName: shortName,
      logo: logoPreview !== "/icons.png" ? logoPreview : null,
      schoolType: getSchoolTypeValue(schoolType),
      educationLevel: getEducationLevelValue(educationLevel),
    };

    try {
      const response = await schoolService.updateSchool(schoolId, updateData);
      if (response.success) {
        toast.success("School details updated successfully!");
        router.push(`/Super-Admin/Manage-Existing-Schools?adminId=${adminId}`);
      } else {
        toast.error(response.message || "Failed to update school details");
      }
    } catch (err) {
      console.error("Error updating school:", err);
      toast.error(`An unexpected error occurred: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <DashboardHeader />
        <Link href={`/Super-Admin/Manage-Existing-Schools?adminId=${adminId}`}>
          <button className="bg-[#07508F] text-white p-2 rounded-lg cursor-pointer">
            View Existing School
          </button>
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="bg-[#D4D4D4] h-screen p-4 sm:overflow-auto lg:overflow-hidden">
        <div className="sm:flex h-screen sm:flex-col sm:gap-2 lg:grid lg:grid-cols-[2.5fr_1fr] overflow-auto gap-3 lg:h-screen">
          {/* Left Column - School Information */}
          <div className="bg-[#ffffff] rounded-lg flex flex-col lg:overflow-y-auto lg:max-h-[calc(100vh-95px)] lg:overflow-auto no-scrollbar">
            <div>
              <p className="font-bold text-xl p-6">General School Information</p>
              <hr className="w-full border-t border-[#978F8F]" />
            </div>
            <div className="flex-grow flex flex-col">
              <div className="grid grid-cols-2 mt-6 pl-6 pr-6 gap-3 pb-0">
                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[#808080] font-semibold text-sm">School Name</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm p-2"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[#808080] font-semibold text-sm">School Short Name</label>
                  <input
                    type="text"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm p-2"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[#808080] font-semibold text-sm">School Type</label>
                  <BlueDropdown
                    label={schoolType || "Select School Type"}
                    items={[
                      { label: "Private", onClick: () => setSchoolType("Private") },
                      { label: "Public", onClick: () => setSchoolType("Public") }
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[#808080] font-semibold text-sm">Education Level</label>
                  <BlueDropdown
                    label={educationLevel || "Select Education Level"}
                    items={[
                      { label: "Primary", onClick: () => setEducationLevel("Primary") },
                      { label: "Secondary", onClick: () => setEducationLevel("Secondary") },
                      { label: "Primary & Secondary", onClick: () => setEducationLevel("Primary & Secondary") },
                      { label: "Tertiary", onClick: () => setEducationLevel("Tertiary") }
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[#808080] font-semibold text-sm">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm p-2"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[#808080] font-semibold text-sm">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-base border-[#AEAEAE] border-[1.5px] rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm p-2"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 pl-6 pr-6 pb-10">
                <label className="text-[#808080] font-semibold text-sm">School Address</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <BlueDropdown
                    label={selectedCountry?.name || "Select Country"}
                    items={countries.map((country) => ({
                      label: country.name,
                      onClick: () => handleCountryChange(country),
                    }))}
                  />
                  <BlueDropdown
                    label={selectedState?.name || "Select State"}
                    items={states.map((state) => ({
                      label: state.name,
                      onClick: () => handleStateChange(state),
                    }))}
                  />
                  <BlueDropdown
                    label={selectedCity?.name || "Select City"}
                    items={cities.map((city) => ({
                      label: city.name,
                      onClick: () => handleCityChange(city),
                    }))}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center px-4 pb-2">
                <button
                  type="button"
                  onClick={handleToggleStatus}
                  disabled={toggleLoading}
                  className={`pt-2 pb-2 pl-6 pr-6 text-sm rounded-lg cursor-pointer font-medium transition-colors ${
                    isActive ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {toggleLoading ? "Processing..." : isActive ? "Deactivate School" : "Activate School"}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#07508F] text-white pt-2 pb-2 pl-12 pr-12 text-sm rounded-lg cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Logo Only */}
          <div className="flex flex-col gap-2 h-screen">
            <div className="bg-[#ffffff] rounded-lg drop-shadow-lg p-4 flex flex-col">
              <p className="font-bold sm:text-lg xl:text-xl xl:mb-2 sm:mb-4">LOGO</p>
              <div className="flex flex-col items-center justify-center mt-2">
                <div className="mb-4 bg-[#E4E4E4] border-dashed border-[1.5px] border-[#333333] flex items-center relative justify-center w-48 h-35">
                  <img
                    className="w-full h-full object-contain"
                    src={logoPreview}
                    alt="school-logo-preview"
                    onError={(e) => { e.target.src = "/icons.png"; }}
                  />
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    onChange={handleLogoUpload}
                    accept="image/*"
                  />
                </div>
                <div
                  onClick={() => document.getElementById("logo-upload").click()}
                  className="text-[#07508F] border-[#07508F] border-[1.5px] rounded-lg cursor-pointer border-dashed w-48 p-2 flex items-center justify-between"
                >
                  Upload School LOGO <LuUpload size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </SuperAdminLayout>
  );
};

export default EditSchoolItem;