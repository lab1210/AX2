// PersonalInfoForm.jsx
import React from "react";
import RegDropdown from "../../Components/Regdropdown";

// Reusable Input Field Component
const InputField = ({
  id,
  label,
  name,
  value,
  placeholder,
  onChange,
  error,
  required,
}) => (
  <div className="personalInfoItem">
    <label
      htmlFor={id}
      className="font-bold text-gray-500 text-base block mb-1"
    >
      {label}
    </label>
    <input
      id={id}
      name={name}
      type="text"
      value={value}
      placeholder={placeholder}
      required={required}
      onChange={onChange}
      className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
    />
    {error && <p className="text-[#f2645c] text-sm mt-1">{error}</p>}
  </div>
);

const PersonalInfoForm = ({
  personalInfo,
  setPersonalInfo,
  errors,
  handleInputChange,
  handleCountryChange,
  handleStateChange,
  countries,
  states,
  cities,
}) => {
  const genderItems = [
    {
      label: "Male",
      onClick: () => setPersonalInfo((prev) => ({ ...prev, gender: "male" })),
    },
    {
      label: "Female",
      onClick: () => setPersonalInfo((prev) => ({ ...prev, gender: "female" })),
    },
  ];

  const countryItems = countries.map((c) => ({
    label: c.name,
    onClick: () => {
      const e = { target: { value: c.isoCode } };
      setPersonalInfo((prev) => ({ ...prev, country: c.isoCode }));
      handleCountryChange(e);
    },
  }));

  const stateItems = states.map((s) => ({
    label: s.name,
    onClick: () => {
      const e = { target: { value: s.isoCode } };
      setPersonalInfo((prev) => ({ ...prev, state: s.isoCode }));
      handleStateChange(e);
    },
  }));

  const cityItems = cities.map((c) => ({
    label: c.name,
    onClick: () => setPersonalInfo((prev) => ({ ...prev, city: c.name })),
  }));

  const currentGender =
    personalInfo.gender === "male"
      ? "Male"
      : personalInfo.gender === "female"
      ? "Female"
      : "Select Gender";
  const currentCountry =
    countries.find((c) => c.isoCode === personalInfo.country)?.name ||
    "Select Country";
  const currentState =
    states.find((s) => s.isoCode === personalInfo.state)?.name ||
    "Select State";
  const currentCity = personalInfo.city || "Select City";

  return (
    <div className="w-full mb-5 px-8 py-2.5 section">
      <div className="font-bold text-blue-900 mb-4 mt-6 RegFormTitle">
        <h1>Personal Information</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <InputField
          id="firstName"
          name="first_name"
          label="First Name"
          value={personalInfo.first_name}
          placeholder="Enter First Name"
          onChange={(e) => handleInputChange(e, "personalInfo", "first_name")}
          error={errors?.first_name}
          required
        />
        <InputField
          id="middleName"
          name="middle_name"
          label="Middle Name"
          value={personalInfo.middle_name}
          placeholder="Enter Middle Name"
          onChange={(e) => handleInputChange(e, setPersonalInfo)}
          error={errors?.middle_name}
        />
        <InputField
          id="lastName"
          name="last_name"
          label="Last Name"
          value={personalInfo.last_name}
          placeholder="Enter Last Name"
          onChange={(e) => handleInputChange(e, setPersonalInfo)}
          error={errors?.last_name}
          required
        />

        {/* DOB */}
        <div className="personalInfoItem">
          <label
            htmlFor="DOB"
            className="font-bold text-gray-500 text-base block mb-1"
          >
            DOB
          </label>
          <input
            type="date"
            id="DOB"
            name="date_of_birth"
            value={personalInfo.date_of_birth}
            onChange={(e) => handleInputChange(e, setPersonalInfo)}
            required
            className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
          />
          {errors?.date_of_birth && (
            <p className="text-[#f2645c] text-sm mt-1">
              {errors.date_of_birth}
            </p>
          )}
        </div>

        {/* Gender */}
        <div className="personalInfoItem">
          <label
            htmlFor="gender"
            className="font-bold text-gray-500 text-base block mb-1"
          >
            Gender
          </label>
          <RegDropdown label={currentGender} items={genderItems} />
          {errors?.gender && (
            <p className="text-[#f2645c] text-sm mt-1">{errors.gender}</p>
          )}
        </div>

        {/* Country & State */}
        <div className="personalInfoItem">
          <label
            htmlFor="country"
            className="font-bold text-gray-500 text-base block mb-1"
          >
            Address
          </label>
          <div className="grid grid-cols-2 gap-2">
            <RegDropdown label={currentCountry} items={countryItems} />
            <RegDropdown label={currentState} items={stateItems} />
          </div>
          {(errors?.country || errors?.state) && (
            <p className="text-[#f2645c] text-sm mt-1">
              {errors.country || errors.state}
            </p>
          )}
        </div>

        {/* City */}
        <div className="personalInfoItem">
          <label
            htmlFor="city"
            className="font-bold text-gray-500 text-base block mb-1"
          >
            City
          </label>
          <RegDropdown label={currentCity} items={cityItems} />
          {errors?.city && (
            <p className="text-[#f2645c] text-sm mt-1">{errors.city}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
