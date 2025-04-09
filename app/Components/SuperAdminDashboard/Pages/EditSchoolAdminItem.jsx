"use client";
import React, { useState } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BiChevronDown } from "react-icons/bi";
import { Country, State, City } from "country-state-city";
import { LuUpload } from "react-icons/lu";
import DashboardHeader from "../DashboardHeader";
import schools from "../../school";

const EditSchoolAdminItem = () => {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get("schoolid");
  const userId = searchParams.get("userid");

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [schoolLogo, setSchoolLogo] = useState("/icons.png");

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSchoolLogo(e.target.result);
      };
      reader.readAsDataURL(file);
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

  return (
    <SuperAdminLayout>
      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0  z-10 shadow-md  flex justify-between items-center ">
        <DashboardHeader />
        <Link
          href={`/Super-Admin/Manage-School-Admin?schoolid=${schoolId}&userid=${userId}`}
        >
          <button className="bg-[#07508F] text-white p-2 rounded-lg cursor-pointer ">
            View All Admin
          </button>
        </Link>
      </div>
      <div className="bg-[#D4D4D4]  p-4 sm:overflow-auto lg:overflow-hidden ">
        <div className="sm:flex sm:flex-col sm:gap-2 lg:grid lg:grid-cols-[2.5fr_1fr] overflow-auto  gap-3 lg:h-screen ">
          <div className="bg-[#ffffff] rounded-lg flex flex-col lg:overflow-y-auto lg:max-h-[calc(100vh-95px)] lg:overflow-auto no-scrollbar">
            <div>
              <p className="font-bold text-xl p-6">
                Administrative Information
              </p>
              <hr className="w-full border-t border-[#978F8F]" />
            </div>
            <form className="flex-grow flex flex-col  ">
              <div className="grid grid-cols-2 mt-6 pl-6 pr-6 gap-3 pb-0 ">
                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[#808080] font-semibold" htmlFor="">
                    First Name
                  </label>

                  <input
                    type="text"
                    className="text-base font-bold text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
                    placeholder="Enter First Name"
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
                  <label className="text-[#808080] font-semibold" htmlFor="">
                    Last Name
                  </label>

                  <input
                    type="text"
                    className="text-base font-bold text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
                    placeholder="Enter Last Name"
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label className="text-[#808080] font-semibold" htmlFor="">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    className="text-base font-bold text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
                    placeholder="Enter Phone Number"
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label className="text-[#808080] font-semibold" htmlFor="">
                    Email
                  </label>

                  <input
                    type="email"
                    className="text-base font-bold text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
                    placeholder="Enter Email"
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label className="text-[#808080] font-semibold" htmlFor="">
                    Designation
                  </label>

                  <input
                    type="text"
                    className="text-base font-bold text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
                    placeholder="Enter Designation"
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label className="text-[#808080] font-semibold" htmlFor="">
                    Create Username
                  </label>

                  <input
                    type="text"
                    className="text-base font-bold text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
                    placeholder="Enter Username"
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2 ">
                  <label className="text-[#808080] font-semibold" htmlFor="">
                    Create Password
                  </label>

                  <input
                    type="text"
                    className="text-base font-bold text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
                    placeholder="Enter Password"
                  />
                </div>
                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[#808080] font-semibold" htmlFor="">
                    School Name
                  </label>

                  <div className="grid grid-cols-1 ">
                    <select
                      name=""
                      id=""
                      className=" font-bold w-full bg-white col-start-1 row-start-1 appearance-none text-base text-[#01427A] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] "
                    >
                      <option value="" disabled selected>
                        Select School
                      </option>
                      {schools.map((item, index) => {
                        return (
                          <option key={index} value={item}>
                            {item.SchoolName}
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
                    defaultValue="School Admin"
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
                    >
                      <option value="" disabled selected>
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
                    >
                      <option value="" disabled selected>
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
              <div className="flex justify-end pr-6 pb-2  mt-auto ">
                <button className="bg-[#07508F]  text-white pt-2 pb-2 pl-12 pr-12 text-sm rounded-lg cursor-pointer ">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
          <div className="flex flex-col gap-2 h-screen  ">
            <div className="bg-[#ffffff] rounded-lg drop-shadow-lg p-4  flex flex-col">
              <p className="font-bold sm:tex-lg xl:text-xl xl:mb-2 sm:mb-4 ">
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
