"use client";
import React, { useMemo, useState } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import DashboardHeader from "../DashboardHeader";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Country, State, City } from "country-state-city";
import { LuUpload } from "react-icons/lu";
import schoolService from "@/Service/SchoolService"; // Updated import
import Dropdown2 from "../../../Components/SchoolAdminDashBoard/DropdownwithonChange";
import Dropdown from "../../../Components/SchoolAdminDashBoard/DropDown2";
import toast from "react-hot-toast";

const AddSchoolItem = () => {
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");

  const [schoolName, setSchoolName] = useState("");
  const [shortName, setShortName] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const countries = useMemo(() => Country.getAllCountries(), []);
  const nigeria = useMemo(
    () => countries.find((c) => c.isoCode === "NG"),
    [countries]
  );

  const [selectedCountry, setSelectedCountry] = useState(nigeria || null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [schoolLogo, setSchoolLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("/icons.png");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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

  // Helper to convert school type string to enum value
  const getSchoolTypeValue = (type) => {
    return type === "Private" ? 1 : 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

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
      toast.error("Please fill in all required information.");
      setLoading(false);
      return;
    }

    // Prepare data matching CreateSchoolDTO
    const schoolData = {
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

    console.log("Sending school data:", schoolData);

    try {
      const response = await schoolService.createSchool(schoolData);
      console.log("School creation response:", response);

      if (response.success) {
        toast.success("School created successfully!");
        router.push(`/Super-Admin/Manage-Existing-Schools?adminId=${adminId}`);
      } else {
        toast.error(response.message || "Failed to create school");
      }
    } catch (error) {
      console.error("Error creating school:", error);
      toast.error(`An unexpected error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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
      <form
        onSubmit={handleSubmit}
        className="bg-[#D4D4D4] h-screen p-4 sm:overflow-auto lg:overflow-hidden gap-3 lg:h-screen"
      >
        <div className="sm:flex sm:flex-col h-screen sm:gap-2 lg:grid lg:grid-cols-[2.5fr_1fr] overflow-auto">
          <div className="bg-[#ffffff] rounded-lg flex flex-col lg:overflow-y-auto lg:max-h-[calc(100vh-95px)] lg:overflow-auto no-scrollbar pb-2">
            <div>
              <p className="font-bold text-xl p-6">General School Information</p>
              <hr className="w-full border-t border-[#978F8F]" />
            </div>
            <div className="flex-grow flex flex-col">
              <div className="grid grid-cols-2 mt-6 pl-6 pr-6 gap-3 pb-0">
                <div className="flex flex-col gap-1 mb-2">
                  <label
                    className="text-[#808080] font-semibold text-sm"
                    htmlFor="schoolName"
                  >
                    School Name
                  </label>
                  <input
                    type="text"
                    id="schoolName"
                    className={`text-base ${
                      schoolName !== ""
                        ? "border-[#0071E3] border-2"
                        : "border-[#AEAEAE] border-[1.5px]"
                    } rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2 placeholder:text-[#d4d4d4] placeholder:font-normal font-bold`}
                    placeholder="Enter School Name"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label
                    className="text-[#808080] font-semibold text-sm"
                    htmlFor="shortName"
                  >
                    School Short Name
                  </label>
                  <input
                    type="text"
                    id="shortName"
                    className={`text-base ${
                      shortName !== ""
                        ? "border-[#0071E3] border-2"
                        : "border-[#AEAEAE] border-[1.5px]"
                    } rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2 placeholder:text-[#d4d4d4] placeholder:font-normal font-bold`}
                    placeholder="Enter School Short Name"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label
                    className="text-[#808080] font-semibold text-sm"
                    htmlFor="schoolType"
                  >
                    School Type
                  </label>
                  <div className="grid grid-cols-1">
                    <Dropdown
                      label={schoolType || "Select School Type"}
                      items={[
                        {
                          label: "Private",
                          onClick: () => setSchoolType("Private"),
                        },
                        {
                          label: "Public",
                          onClick: () => setSchoolType("Public"),
                        },
                      ]}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label
                    className="text-[#808080] font-semibold text-sm"
                    htmlFor="educationLevel"
                  >
                    Education Level
                  </label>
                  <div className="grid grid-cols-1">
                    <Dropdown
                      label={educationLevel || "Select Education Level"}
                      items={[
                        {
                          label: "Nursery",
                          onClick: () => setEducationLevel("Nursery"),
                        },
                        {
                          label: "Primary",
                          onClick: () => setEducationLevel("Primary"),
                        },
                        {
                          label: "Nursery & Primary",
                          onClick: () => setEducationLevel("Nursery & Primary"),
                        },
                        {
                          label: "Nursery, Primary & Secondary",
                          onClick: () => setEducationLevel("Nursery, Primary & Secondary"),
                        },
                        {
                          label: "Secondary",
                          onClick: () => setEducationLevel("Secondary"),
                        },
                        {
                          label: "Primary & Secondary",
                          onClick: () => setEducationLevel("Primary & Secondary"),
                        },
                        {
                          label: "Tertiary",
                          onClick: () => setEducationLevel("Tertiary"),
                        },
                      ]}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label
                    className="text-[#808080] font-semibold text-sm"
                    htmlFor="phoneNumber"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    className={`text-base ${
                      phoneNumber !== ""
                        ? "border-[#0071E3] border-2"
                        : "border-[#AEAEAE] border-[1.5px]"
                    } rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2 placeholder:text-[#d4d4d4] placeholder:font-normal font-bold`}
                    placeholder="Enter Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label
                    className="text-[#808080] font-semibold text-sm"
                    htmlFor="email"
                  >
                    School Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`text-base ${
                      email !== ""
                        ? "border-[#0071E3] border-2"
                        : "border-[#AEAEAE] border-[1.5px]"
                    } rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2 placeholder:text-[#d4d4d4] placeholder:font-normal font-bold`}
                    placeholder="Enter School Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-4 pl-6 pr-6 pb-0">
                <label
                  className="text-[#808080] font-semibold text-sm"
                  htmlFor="schoolAddress"
                >
                  School Address
                </label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div className="grid grid-cols-1 mb-2">
                    <Dropdown2
                      label="Select Country"
                      value={selectedCountry?.name}
                      onChange={(item) => handleCountryChange(item)}
                      items={countries.map((c) => ({
                        label: c.name,
                        onClick: () => handleCountryChange(c),
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

              <div className="flex justify-end px-4 py-4">
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

          <div className="flex flex-col gap-2 h-screen">
            <div className="bg-[#ffffff] rounded-lg drop-shadow-lg p-4 flex flex-col">
              <p className="font-bold sm:text-lg xl:text-xl xl:mb-2 sm:mb-4">
                LOGO
              </p>
              <div className="flex flex-col items-center justify-center mt-2">
                <div className="mb-4 bg-[#E4E4E4] border-dashed border-[1.5px] border-[#333333] flex items-center relative justify-center w-48 h-35">
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
                <div
                  onClick={() => document.getElementById("logo-upload").click()}
                  className="text-[#07508F] border-[#07508F] border-[1.5px] rounded-lg cursor-pointer border-dashed w-48 p-2 flex items-center justify-between"
                >
                  Upload School LOGO
                  <span>
                    <LuUpload size={20} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </SuperAdminLayout>
  );
};

export default AddSchoolItem;