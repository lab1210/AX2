"use client";
import React, { useState, useEffect } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardHeader from "../DashboardHeader";
import Link from "next/link";
import { BiChevronDown } from "react-icons/bi";
import { Country, State, City } from "country-state-city";
import { LuUpload } from "react-icons/lu";
import BlueDropdown from "../../../Components/BlueDropDown";
import {
  getSchoolById,
  getSchoolSubscriptions,
  updateSchool,
  updateSchoolSubscription,
} from "../../../Service/schoolService";
import toast from "react-hot-toast";

const EditSchoolItem = () => {
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");
  const schoolIdFromParams = searchParams.get("schoolId");
  const router = useRouter();
  const [allSubscriptions, setAllSubscriptions] = useState([]);
  const [schoolId, setSchoolId] = useState(schoolIdFromParams);
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

  const countries = Country.getAllCountries();
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode)
    : [];
  const cities = selectedState
    ? City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode)
    : [];

  useEffect(() => {
    const fetchSchoolandSubscriptionsDetails = async () => {
      if (schoolId) {
        setLoading(true);
        try {
          const schoolResponse = await getSchoolById(schoolId);
          if (schoolResponse?.status === 200 && schoolResponse.data) {
            const schoolData = schoolResponse.data;
            console.log("Fetched school data:", schoolData);

            // Set basic school fields
            setSchoolName(schoolData.school_name || "");
            setShortName(schoolData.short_name || "");
            setSchoolType(schoolData.school_type || "");
            setEducationLevel(schoolData.education_level || "");
            setPhoneNumber(schoolData.phone_number || "");
            setEmail(schoolData.email || "");

            // Handle country
            if (schoolData.country) {
              const allCountries = Country.getAllCountries();
              const country = allCountries.find(
                (c) => c.name === schoolData.country || c.isoCode === "NG" // Nigeria
              );
              console.log("Found country:", country);
              setSelectedCountry(country || null);

              // Handle state (after country is set)
              if (country && schoolData.state) {
                const statesOfCountry = State.getStatesOfCountry(
                  country.isoCode
                );
                const state = statesOfCountry.find(
                  (s) => s.name === schoolData.state
                );
                console.log("Found state:", state);
                setSelectedState(state || null);

                // Handle city (after state is set)
                if (state && schoolData.city) {
                  const citiesOfState = City.getCitiesOfState(
                    state.countryCode,
                    state.isoCode
                  );
                  const city = citiesOfState.find(
                    (c) => c.name === schoolData.city
                  );
                  console.log("Found city:", city);
                  setSelectedCity(city || null);
                } else {
                  setSelectedCity(null); // Clear city if no matching city found
                }
              } else {
                setSelectedState(null); // Clear state and city if no matching state found
                setSelectedCity(null);
              }
            } else {
              setSelectedCountry(null); // Clear country, state, and city if no matching country found
              setSelectedState(null);
              setSelectedCity(null);
            }

            // Handle logo
            if (schoolData.logo) {
              setLogoPreview(schoolData.logo);
            } else {
              setLogoPreview("/icons.png");
            }
          } else {
            toast.error("Failed to fetch school details.");
          }
        } catch (err) {
          console.error("Error fetching details:", err);
          toast.error("Error fetching school and/or subscriptions.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSchoolandSubscriptionsDetails();
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
      toast.error("Please fill in all required  information.");
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
    formData.append("region", "South West");
    if (schoolLogo) {
      formData.append("logo", schoolLogo);
    }

    try {
      const schoolUpdateResponse = await updateSchool(schoolId, formData);

      if (schoolUpdateResponse?.status === 200) {
        toast.success("School details updated successfully!");
        router.push("/Super-Admin/Manage-Existing-Schools");
      } else {
        toast.error(
          `Failed to update school details: ${
            schoolUpdateResponse?.data?.message || "Something went wrong"
          }`
        );
      }
    } catch (err) {
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
      <form
        onSubmit={handleSubmit}
        className="bg-[#D4D4D4] h-screen p-4 sm:overflow-auto lg:overflow-hidden"
      >
        <div className="sm:flex h-screen sm:flex-col sm:gap-2 lg:grid lg:grid-cols-[2.5fr_1fr] overflow-auto gap-3 lg:h-screen">
          <div className="bg-[#ffffff] rounded-lg flex flex-col lg:overflow-y-auto lg:max-h-[calc(100vh-95px)] lg:overflow-auto no-scrollbar">
            <div>
              <p className="font-bold text-xl p-6">
                General School Information
              </p>
              <hr className="w-full border-t border-[#978F8F]" />
            </div>
            <div className="flex-grow flex flex-col">
              <div className="grid grid-cols-2 mt-6 pl-6 pr-6 gap-3 pb-0">
                <div className="flex flex-col gap-1 mb-2">
                  <label
                    className="text-[#808080] font-semibold text-sm "
                    htmlFor="schoolName"
                  >
                    School Name
                  </label>
                  <input
                    type="text"
                    id="schoolName"
                    className={`text-base  ${
                      schoolName !== ""
                        ? "border-[#01427A]  border-2 text-[#01427A]"
                        : "border-[#AEAEAE] border-[1.5px]"
                    }   rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm  p-2  placeholder:text-[#d4d4d4] placeholder:font-normal font-bold `}
                    placeholder="Enter School Name"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label
                    className="text-[#808080] font-semibold text-sm "
                    htmlFor="shortName"
                  >
                    School Short Name
                  </label>
                  <input
                    type="text"
                    id="shortName"
                    className={`text-base  ${
                      shortName !== ""
                        ? "border-[#01427A]  border-2 text-[#01427A]"
                        : "border-[#AEAEAE] border-[1.5px]"
                    }   rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm  p-2  placeholder:text-[#d4d4d4] placeholder:font-normal font-bold `}
                    placeholder="Enter School Short Name"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label
                    className="text-[#808080] font-semibold text-sm "
                    htmlFor="schoolType"
                  >
                    School Type
                  </label>
                  <div className="grid grid-cols-1">
                    <BlueDropdown
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
                    className="text-[#808080] font-semibold text-sm "
                    htmlFor="educationLevel"
                  >
                    Education Level
                  </label>
                  <div className="grid grid-cols-1">
                    <BlueDropdown
                      label={educationLevel || "Select Education Level"}
                      items={[
                        {
                          label: "Primary",
                          onClick: () => setEducationLevel("Primary"),
                        },
                        {
                          label: "Secondary",
                          onClick: () => setEducationLevel("Secondary"),
                        },
                        {
                          label: "Primary & Secondary",
                          onClick: () =>
                            setEducationLevel("Primary & Secondary"),
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
                    className="text-[#808080] font-semibold text-sm "
                    htmlFor="phoneNumber"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    className={`text-base  ${
                      phoneNumber !== ""
                        ? "border-[#01427A]  border-2 text-[#01427A]"
                        : "border-[#AEAEAE] border-[1.5px]"
                    }   rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm  p-2  placeholder:text-[#d4d4d4] placeholder:font-normal font-bold `}
                    s
                    placeholder="Enter Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                  <label
                    className="text-[#808080] font-semibold text-sm "
                    htmlFor="email"
                  >
                    School Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`text-base  ${
                      email !== ""
                        ? "border-[#01427A]  border-2 text-[#01427A]"
                        : "border-[#AEAEAE] border-[1.5px]"
                    }   rounded-sm focus:border-[#01427A] focus:border-2 outline-none sm:text-sm  p-2  placeholder:text-[#d4d4d4] placeholder:font-normal font-bold `}
                    placeholder="Enter School Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="pt-4 pl-6 pr-6 pb-10">
                <label
                  className="text-[#808080] font-semibold text-sm "
                  htmlFor=""
                >
                  School Address
                </label>
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
              <div className="flex justify-end px-4 pb-2">
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
                  <div className="w-full h-full flex items-center justify-center object-cover">
                    <img
                      className="w-full h-full "
                      src={logoPreview}
                      alt="school-logo-preview"
                      onError={(e) => {
                        e.target.src = "/icons.png";
                      }}
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

            {/* <div className="bg-[#ffffff] xl:gap-0 lg:gap-2 h-auto rounded-lg pt-5 pl-5 pr-5 xl:pb-2 pb-8 drop-shadow-lg flex flex-col">
              <p className="font-bold sm:text-lg xl:text-xl mb-4">
                SUBSCRIPTION PLAN
              </p>
              <div>
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-xs text-[#9C9B9B]">
                    Amount Per Student:
                  </p>
                  <div className="w-24">
                    <input
                      type="number"
                      id="amountPerStudent"
                      className="w-full focus:outline-black text-right text-sm text-[#333] rounded-md  border-[1px] border-[#d4d4d4]"
                      value={amountPerStudent}
                      onChange={(e) => setAmountPerStudent(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <p className="font-semibold text-xs">No of Students:</p>
                  <p className="font-semibold text-xs">{numberOfStudents}</p>
                </div>

                <div className="flex justify-between">
                  <p className="font-semibold text-xs">
                    Amount Expected to be paid:
                  </p>
                  <p className="font-semibold text-xs">
                    ₦{expectedAmountPaid.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-center pt-4">
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

export default EditSchoolItem;
