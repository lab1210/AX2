import React from "react";
import RegDropdown from "../Regdropdown";

const Parent = ({
  parentInfo,
  setParentInfo,
  handleInputChange,
  errors,
  handleCountryChange,
  handleStateChange,
  countries,
  states,
  cities,
}) => {
  const genderItems = [
    {
      label: "Male",
      onClick: () => setParentInfo({ ...parentInfo, gender: "male" }),
    },
    {
      label: "Female",
      onClick: () => setParentInfo({ ...parentInfo, gender: "female" }),
    },
  ];

  const relationshipItems = [
    {
      label: "Father",
      onClick: () =>
        setParentInfo({ ...parentInfo, parent_relationship: "Father" }),
    },
    {
      label: "Mother",
      onClick: () =>
        setParentInfo({ ...parentInfo, parent_relationship: "Mother" }),
    },
    {
      label: "Guardian",
      onClick: () =>
        setParentInfo({ ...parentInfo, parent_relationship: "Guardian" }),
    },
  ];

  const countryItems = countries.map((c) => ({
    label: c.name,
    onClick: () => {
      const e = { target: { value: c.isoCode } };
      setParentInfo({ ...parentInfo, country: c.isoCode });
      handleCountryChange(e);
    },
  }));

  const stateItems = states.map((s) => ({
    label: s.name,
    onClick: () => {
      const e = { target: { value: s.isoCode } };
      setParentInfo({ ...parentInfo, state: s.isoCode });
      handleStateChange(e);
    },
  }));

  const cityItems = cities.map((c) => ({
    label: c.name,
    onClick: () => setParentInfo({ ...parentInfo, city: c.name }),
  }));

  const currentCountry =
    countries.find((c) => c.isoCode === parentInfo.country)?.name ||
    "Select Country";
  const currentState =
    states.find((s) => s.isoCode === parentInfo.state)?.name || "Select State";
  const currentCity = parentInfo.city || "Select City";

  const currentGender =
    parentInfo.gender === "male"
      ? "Male"
      : parentInfo.gender === "female"
      ? "Female"
      : "Select Gender";

  const currentRelationship =
    parentInfo.parent_relationship === "Father"
      ? "Father"
      : parentInfo.parent_relationship === "Mother"
      ? "Mother"
      : parentInfo.parent_relationship === "Guardian"
      ? "Guardian"
      : "Select Relationship";

  return (
    <div className="w-full mb-5 px-8 py-2.5 sectionlast">
      <div className="font-bold text-blue-900 mb-4 mt-6 RegFormTitle">
        <h1>Parent's Information</h1>
      </div>
      <div className="w-full grid grid-cols-1 gap-3 lg:grid lg:grid-cols-3 lg:gap-4 row-gap-10 personalInfoGrid">
        <div className="personalInfoItem">
          <label
            htmlFor="ParentfirstName"
            className="font-bold text-gray-500 text-base block mb-1"
          >
            Parent's First Name
          </label>
          <input
            type="text"
            name="ParentfirstName"
            value={parentInfo.parent_first_name}
            placeholder="Enter First Name"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
            className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
          />
          {errors?.ParentfirstName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.ParentfirstName}
            </p>
          )}
        </div>

        <div className="personalInfoItem">
          <label
            htmlFor="ParentmiddleName"
            className="font-bold text-gray-500 text-base block mb-1"
          >
            Parent's Middle Name
          </label>
          <input
            type="text"
            name="ParentmiddleName"
            value={parentInfo.parent_middle_name}
            placeholder="Enter Middle Name"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
            className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
          />
          {errors?.ParentmiddleName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.ParentmiddleName}
            </p>
          )}
        </div>
        <div className="personalInfoItem">
          <label
            htmlFor="ParentlastName"
            className="font-bold text-gray-500 text-base block mb-1"
          >
            Parent's Last Name
          </label>
          <input
            type="text"
            name="ParentlastName"
            value={parentInfo.parent_last_name}
            placeholder="Enter Last Name"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
            className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
          />
          {errors?.ParentlastName && (
            <p className="text-red-500 text-xs mt-1">{errors.ParentlastName}</p>
          )}
        </div>
        <div className="personalInfoItem">
          <label
            htmlFor="Occupation"
            className="font-bold text-gray-500 text-base block mb-1"
          >
            Parent's Occupation
          </label>
          <input
            type="text"
            name="Occupation"
            value={parentInfo.parent_occupation}
            placeholder="Enter  Occupation"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
            className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
          />
          {errors?.Occupation && (
            <p className="text-red-500 text-xs mt-1">{errors.Occupation}</p>
          )}
        </div>
        <div className="personalInfoItem">
          <label
            htmlFor="PhoneNumber"
            className="font-bold text-gray-500 text-base block mb-1"
          >
            Parent's Phone Number
          </label>
          <input
            type="text"
            name="PhoneNumber"
            value={parentInfo.parent_contact_info}
            placeholder="Enter Phone No"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
            className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
          />
          {errors?.PhoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.PhoneNumber}</p>
          )}
        </div>
        <div className="personalInfoItem">
          <label
            htmlFor="Email"
            className="font-bold text-gray-500 text-base block mb-1"
          >
            Parent's E-mail
          </label>
          <input
            type="text"
            name="Email"
            value={parentInfo.Email}
            placeholder="Enter E-mail"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
            className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
          />
          {errors?.Email && (
            <p className="text-red-500 text-xs mt-1">{errors.Email}</p>
          )}
        </div>
        <div className="personalInfoItem">
          <label
            htmlFor="EmergencyContact"
            className="font-bold text-gray-500 text-base block mb-1"
          >
            Emergency Contact
          </label>
          <input
            type="text"
            name="EmergencyContact"
            value={parentInfo.parent_emergency_contact}
            placeholder="Enter Emergency Contact"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
            className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
          />
          {errors?.EmergencyContact && (
            <p className="text-red-500 text-xs mt-1">
              {errors.EmergencyContact}
            </p>
          )}
        </div>
        <div className="personalInfoItem">
          <label
            htmlFor="Address"
            className="font-bold text-gray-500 text-base block mb-1"
          >
            Address
          </label>
          <div className="grid gap-4 grid-cols-2 grouppersonalInfoItem">
            <div>
              <RegDropdown label={currentCountry} items={countryItems} />
              {errors?.country && (
                <p className="text-red-500 text-xs mt-1">{errors.country}</p>
              )}
            </div>
            <div>
              <RegDropdown label={currentState} items={stateItems} />
              {errors?.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-end personalInfoItemcity">
          <div></div>
          <div className="grid gap-4 grid-cols-2 grouppersonalInfoItem">
            <div>
              <RegDropdown label={currentCity} items={cityItems} />
              {errors?.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
            <div></div>
          </div>
        </div>
        <div className="personalInfoItem">
          <label
            htmlFor="ParentGender"
            className="font-bold text-gray-500 text-base block mb-1"
          >
            {" "}
            Gender
          </label>
          <div>
            <RegDropdown label={currentGender} items={genderItems} />
            {errors?.ParentGender && (
              <p className="text-red-500 text-xs mt-1">{errors.ParentGender}</p>
            )}
          </div>
        </div>
        <div className="personalInfoItem">
          <label
            htmlFor="Relationship"
            className="font-bold text-gray-500 text-base block mb-1"
          >
            Relationship
          </label>
          <div className="Form_input">
            <div>
              <RegDropdown
                label={currentRelationship}
                items={relationshipItems}
              />
              {errors?.Relationship && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.Relationship}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parent;
