import React from "react";

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
  qualification,
  setQualification,
  headDate,
  setHeadDate,
  teacherInfo,
  setTeacherInfo,
}) => {
  const handleTeacherInfoChange = (field, value) => {
    setTeacherInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  // Initialize teacherInfo.Status if it's undefined
  const safeTeacherInfo = teacherInfo || { Status: true };

  return (
    <>
      <div className="hidden lg:block w-full mb-5 px-8 py-2.5 section">
        <div className="font-bold text-blue-900 mb-4 mt-6 RegFormTitle">
          <h1>Personal Information</h1>
        </div>
        <div className="w-full grid grid-cols-3 gap-4 row-gap-10 personalInfoGrid">
          {/* First Name */}
          <div className="personalInfoItem">
            <label
              htmlFor="firstName"
              className="font-bold text-gray-500 text-base block mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={personalInfo.firstName}
              placeholder="Enter First Name"
              onChange={(e) =>
                handleInputChange(e, "personalInfo", "firstName")
              }
              required
              className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
            />
            {errors?.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Middle Name */}
          <div className="personalInfoItem">
            <label
              htmlFor="middleName"
              className="font-bold text-gray-500 text-base block mb-1"
            >
              Middle Name
            </label>
            <input
              type="text"
              name="middleName"
              value={personalInfo.middleName}
              placeholder="Enter Middle Name"
              onChange={(e) =>
                handleInputChange(e, "personalInfo", "middleName")
              }
              className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
            />
            {errors?.middleName && (
              <p className="text-red-500 text-xs mt-1">{errors.middleName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="personalInfoItem">
            <label
              htmlFor="lastName"
              className="font-bold text-gray-500 text-base block mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={personalInfo.lastName}
              placeholder="Enter Last Name"
              onChange={(e) => handleInputChange(e, "personalInfo", "lastName")}
              required
              className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
            />
            {errors?.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* DOB & Gender in one row */}
          <div className="grid gap-4 grid-cols-2 grouppersonalInfoItem">
            <div>
              <label
                htmlFor="DOB"
                className="font-bold text-gray-500 text-base block mb-1"
              >
                DOB
              </label>
              <input
                type="date"
                name="DOB"
                value={personalInfo.DOB}
                onChange={(e) => handleInputChange(e, "personalInfo", "DOB")}
                required
                className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              />
              {errors?.DOB && (
                <p className="text-red-500 text-xs mt-1">{errors.DOB}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="gender"
                className="font-bold text-gray-500 text-base block mb-1"
              >
                Gender
              </label>
              <select
                name="gender"
                value={personalInfo.gender}
                onChange={(e) => handleInputChange(e, "personalInfo", "gender")}
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
          </div>

          {/* Address */}
          <div className="personalInfoItem">
            <label
              htmlFor="Address"
              className="font-bold text-gray-500 text-base block mb-1"
            >
              Address
            </label>
            <div className="grid gap-4 grid-cols-3 grouppersonalInfoItem">
              <div>
                <select
                  name="country"
                  value={personalInfo.country}
                  onChange={(e) => handleCountryChange(e, "personalInfo")}
                  required
                  className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  {countries.map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors?.country && (
                  <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                )}
              </div>
              <div>
                <select
                  name="state"
                  value={personalInfo.state}
                  onChange={(e) => handleStateChange(e, "personalInfo")}
                  required
                  className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
                >
                  <option value="" disabled>
                    Select State
                  </option>
                  {states.map((s) => (
                    <option key={s.isoCode} value={s.isoCode}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors?.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
              </div>
              {/* City (Spans two columns on larger screens) */}
              <div className="flex flex-col justify-end personalInfoItemcity">
                <select
                  name="city"
                  placeholder="Select City"
                  value={personalInfo.city}
                  onChange={(e) => handleInputChange(e, "personalInfo", "city")}
                  required
                  className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
                >
                  <option value="" disabled>
                    Select City
                  </option>
                  {cities.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors?.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>
            </div>
          </div>

          {/* Qualification */}
          <div className="personalInfoItem">
            <label
              htmlFor="qualification"
              className="font-bold text-gray-500 text-base block mb-1"
            >
              Qualification
            </label>
            <input
              type="text"
              name="qualification"
              value={qualification}
              placeholder="Enter Qualification"
              onChange={(e) => setQualification(e.target.value)}
              className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
            />
            {errors?.qualification && (
              <p className="text-red-500 text-xs mt-1">
                {errors.qualification}
              </p>
            )}
          </div>

          {/* Head Date */}
          <div className="personalInfoItem">
            <label
              htmlFor="headDate"
              className="font-bold text-gray-500 text-base block mb-1"
            >
              Head Date
            </label>
            <input
              type="date"
              name="headDate"
              value={headDate}
              onChange={(e) => setHeadDate(e.target.value)}
              className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
            />
            {errors?.headDate && (
              <p className="text-red-500 text-xs mt-1">{errors.headDate}</p>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="Status"
            className="font-bold text-gray-500 text-base block mb-1"
          >
            Status
          </label>

          <button
            className={`${
              safeTeacherInfo.Status ? "bg-green-500" : "bg-red-500"
            } px-14 py-2.5 font-bold text-xl text-white border-none outline-none rounded-md mb-5`}
          >
            {safeTeacherInfo.Status ? " Active" : "OnLeave"}
          </button>
        </div>
      </div>

      {/* ─── Mobile/tablet-only (below lg) ─── */}
      <div className="block lg:hidden w-full mb-5 px-8 py-2.5 section">
        <div className="font-bold text-blue-900 mb-4 mt-6 RegFormTitle">
          <h1>Personal Information</h1>
        </div>

        <div className="w-full grid grid-cols-1 gap-6">
          {/* First Name */}
          <div className="personalInfoItem">
            <label
              htmlFor="firstName"
              className="font-bold text-gray-500 text-base block mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={personalInfo.firstName}
              placeholder="Enter First Name"
              onChange={(e) =>
                handleInputChange(e, "personalInfo", "firstName")
              }
              required
              className="w-full px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white"
            />
            {errors?.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Middle Name */}
          <div className="personalInfoItem">
            <label
              htmlFor="middleName"
              className="font-bold text-gray-500 text-base block mb-1"
            >
              Middle Name
            </label>
            <input
              type="text"
              name="middleName"
              value={personalInfo.middleName}
              placeholder="Enter Middle Name"
              onChange={(e) =>
                handleInputChange(e, "personalInfo", "middleName")
              }
              className="w-full px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white"
            />
            {errors?.middleName && (
              <p className="text-red-500 text-xs mt-1">{errors.middleName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="personalInfoItem">
            <label
              htmlFor="lastName"
              className="font-bold text-gray-500 text-base block mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={personalInfo.lastName}
              placeholder="Enter Last Name"
              onChange={(e) => handleInputChange(e, "personalInfo", "lastName")}
              required
              className="w-full px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white"
            />
            {errors?.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* DOB */}
          <div className="personalInfoItem">
            <label
              htmlFor="DOB"
              className="font-bold text-gray-500 text-base block mb-1"
            >
              Date of Birth
            </label>
            <input
              type="date"
              name="DOB"
              value={personalInfo.DOB}
              onChange={(e) => handleInputChange(e, "personalInfo", "DOB")}
              required
              className="w-full px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white"
            />
            {errors?.DOB && (
              <p className="text-red-500 text-xs mt-1">{errors.DOB}</p>
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
            <select
              name="gender"
              value={personalInfo.gender}
              onChange={(e) => handleInputChange(e, "personalInfo", "gender")}
              required
              className="w-full px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white"
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

          {/* Country */}
          <div className="personalInfoItem">
            <label className="font-bold text-gray-500 text-base block mb-2">
              Country
            </label>
            <select
              name="country"
              value={personalInfo.country}
              onChange={(e) => handleCountryChange(e, "personalInfo")}
              required
              className="w-full px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white"
            >
              <option value="" disabled>
                Select Country
              </option>
              {countries.map((c) => (
                <option key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors?.country && (
              <p className="text-red-500 text-xs mt-1">{errors.country}</p>
            )}
          </div>

          {/* State */}
          <div className="personalInfoItem">
            <label className="font-bold text-gray-500 text-base block mb-2">
              State
            </label>
            <select
              name="state"
              value={personalInfo.state}
              onChange={(e) => handleStateChange(e, "personalInfo")}
              required
              className="w-full px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white"
            >
              <option value="" disabled>
                Select State
              </option>
              {states.map((s) => (
                <option key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors?.state && (
              <p className="text-red-500 text-xs mt-1">{errors.state}</p>
            )}
          </div>

          {/* City */}
          <div className="personalInfoItem">
            <label className="font-bold text-gray-500 text-base block mb-2">
              City
            </label>
            <select
              name="city"
              value={personalInfo.city}
              onChange={(e) => handleInputChange(e, "personalInfo", "city")}
              required
              className="w-full px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white"
            >
              <option value="" disabled>
                Select City
              </option>
              {cities.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors?.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          {/* Qualification */}
          <div className="personalInfoItem">
            <label
              htmlFor="qualificationMob" // Added a specific ID for mobile
              className="font-bold text-gray-500 text-base block mb-1"
            >
              Qualification
            </label>
            <input
              type="text"
              name="qualification"
              value={qualification}
              placeholder="Enter Qualification"
              onChange={(e) => setQualification(e.target.value)}
              className="w-full px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white"
            />
            {errors?.qualification && (
              <p className="text-red-500 text-xs mt-1">
                {errors.qualification}
              </p>
            )}
          </div>

          {/* Head Date */}
          <div className="personalInfoItem">
            <label
              htmlFor="headDateMob" // Added a specific ID for mobile
              className="font-bold text-gray-500 text-base block mb-1"
            >
              Head Date
            </label>
            <input
              type="date"
              name="headDate"
              value={headDate}
              onChange={(e) => setHeadDate(e.target.value)}
              className="w-full px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white"
            />
            {errors?.headDate && (
              <p className="text-red-500 text-xs mt-1">{errors.headDate}</p>
            )}
          </div>
          <div>
          <label
            htmlFor="Status"
            className="font-bold text-gray-500 text-base block mb-1"
          >
            Status
          </label>

          <button
            className={`${
              safeTeacherInfo.Status ? "bg-green-500" : "bg-red-500"
            } px-14 py-2.5 font-bold text-xl text-white border-none outline-none rounded-md mb-5`}
          >
            {safeTeacherInfo.Status ? " Active" : "OnLeave"}
          </button>
        </div>
        </div>
      </div>
    </>
  );
};

export default PersonalInfoForm;

