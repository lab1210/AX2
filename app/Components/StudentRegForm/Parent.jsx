import React from "react";

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
  RelationshipData,
}) => {
  return (
    <div className="w-full mb-5 px-8 py-2.5 sectionlast">
      <div className="font-bold text-blue-900 mb-4 mt-6 RegFormTitle">
        <h1>Parent's Information</h1>
      </div>
      <div className="w-full grid grid-cols-3 gap-4 row-gap-10 personalInfoGrid">
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
            value={parentInfo.ParentfirstName}
            placeholder="Enter First Name"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
            className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
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
            value={parentInfo.ParentmiddleName}
            placeholder="Enter Middle Name"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
            className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
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
            value={parentInfo.ParentlastName}
            placeholder="Enter Last Name"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
            className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
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
            value={parentInfo.Occupation}
            placeholder="Enter  Occupation"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
            className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
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
            value={parentInfo.PhoneNumber}
            placeholder="Enter Phone No"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
            className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
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
            className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
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
            value={parentInfo.EmergencyContact}
            placeholder="Enter Emergency Contact"
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
            className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
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
              <select
                name="country"
                value={parentInfo.country}
                onChange={handleCountryChange}
                required
                className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              >
                <option value="" disabled>
                  Select Country
                </option>
                {countries.length > 0 &&
                  countries.map((country) => {
                    return (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    );
                  })}
              </select>
              {errors?.country && (
                <p className="text-red-500 text-xs mt-1">{errors.country}</p>
              )}
            </div>
            <div>
              <select
                name="state"
                value={parentInfo.state}
                onChange={handleStateChange}
                required
                className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              >
                <option value="" disabled>
                  Select State
                </option>
                {states.length > 0 &&
                  states.map((state) => {
                    return (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    );
                  })}
              </select>
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
              <select
                name="city"
                value={parentInfo.city}
                onChange={(e) => handleInputChange(e, setParentInfo)}
                required
                className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              >
                <option value="" disabled>
                  Select City
                </option>
                {cities.length > 0 &&
                  cities.map((city) => {
                    return (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    );
                  })}
              </select>
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
          <select
            name="ParentGender"
            value={parentInfo.ParentGender}
            onChange={(e) => handleInputChange(e, setParentInfo)}
            required
            className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors?.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
        </div>
        <div className="personalInfoItem">
          <label
            htmlFor="Relationship"
            className="font-bold text-gray-500 text-base block mb-1"
          >
            Relationship
          </label>
          <div className="Form_input">
            <select
              name="Relationship"
              value={parentInfo.Relationship}
              onChange={(e) => handleInputChange(e, setParentInfo)}
              required
              className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
            >
              <option value="" disabled>
                Select Relationship Shared
              </option>
              {RelationshipData.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
            {errors?.Relationship && (
              <p className="text-red-500 text-xs mt-1">
                {errors?.parentInfo.Relationship}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parent;
