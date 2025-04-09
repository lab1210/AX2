"use client";
import React, { useState } from "react";
import { Country, State, City } from "country-state-city";
import { BiChevronDown } from "react-icons/bi";

const EditUser = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

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
    <form>
      <div className="grid grid-cols-3 mt-7 gap-6 pl-6 pr-6">
        <div className="flex flex-col gap-1">
          <label className="text-[#808080] text-sm font-semibold" htmlFor="">
            First Name
          </label>

          <input
            type="text"
            className=" font-bold text-base text-[#07508F] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#07508F] placeholder:text-[#07508F] "
            placeholder="Enter First Name"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[#808080] text-sm font-semibold" htmlFor="">
            Surname
          </label>

          <input
            type="text"
            className=" font-bold text-base text-[#07508F] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#07508F] placeholder:text-[#07508F] "
            placeholder="Enter Surname"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[#808080] text-sm font-semibold" htmlFor="">
            Phone Number
          </label>

          <input
            type="text"
            className="font-bold text-base text-[#07508F] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#07508F] placeholder:text-[#07508F] "
            placeholder="Enter Phone No"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[#808080] text-sm font-semibold" htmlFor="">
            Email
          </label>

          <input
            type="email"
            className="font-bold text-base text-[#07508F] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#07508F] placeholder:text-[#07508F] "
            placeholder="Enter Email"
          />
        </div>

        <div className="flex flex-col gap-1 mb-2">
          <label className="text-[#808080] text-sm font-semibold" htmlFor="">
            Create Password
          </label>

          <input
            type="text"
            className="font-bold text-base text-[#07508F] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#07508F] placeholder:text-[#07508F] "
            placeholder="Enter Password"
          />
        </div>

        <div className="flex flex-col gap-1 mb-2">
          <label className="text-[#808080] text-sm font-semibold" htmlFor="">
            Create Username
          </label>

          <input
            type="text"
            className="font-bold text-base text-[#07508F] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#07508F] placeholder:text-[#07508F] "
            placeholder="Enter Username"
          />
        </div>
      </div>

      <div className="pt-4 pl-6 pr-6 pb-0">
        <label className="text-[#808080] font-semibold" htmlFor="">
          Address
        </label>
        <div className="grid grid-cols-3 gap-3 mt-1 ">
          <div className="grid grid-cols-1 mb-2">
            <select
              className="font-bold w-full bg-white col-start-1 row-start-1 appearance-none text-base text-[#07508F] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#07508F]"
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
            <BiChevronDown className="text-[#07508F] col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end pointer-events-none" />
          </div>
          <div className="grid grid-cols-1 mb-2">
            <select
              className="font-bold w-full bg-white col-start-1 row-start-1 appearance-none text-base text-[#07508F] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#07508F]"
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
            <BiChevronDown className="text-[#07508F] col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end pointer-events-none" />
          </div>

          <div className="grid grid-cols-1 mb-2">
            <select
              className="font-bold w-full bg-white col-start-1 row-start-1 appearance-none text-base text-[#07508F] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#07508F]"
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
            <BiChevronDown className="text-[#07508F] col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 mt-5 gap-6 pl-6 pr-6">
        <div className="flex flex-col gap-1">
          <label className="text-[#808080] text-sm font-semibold" htmlFor="">
            User Role
          </label>

          <input
            type="text"
            defaultValue="Super Admin"
            readOnly
            className="text-base text-[#07508F] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#07508F] font-bold "
          />
        </div>
      </div>
      <div className="pt-8 pl-6 pr-6  ">
        <button className="bg-[#07508F] rounded-md w-full pt-2 pb-2 text-white font-bold cursor-pointer">
          Save
        </button>
      </div>
    </form>
  );
};

export default EditUser;
