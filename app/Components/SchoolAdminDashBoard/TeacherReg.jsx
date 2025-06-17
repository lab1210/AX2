"use client";
import React, { useEffect, useState } from "react";
import Dropdown from "./DropDownwithlightborder";
import { Country, State, City } from "country-state-city";
import { LuUpload } from "react-icons/lu";
const TeacherReg = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [Teacher, setTeacher] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    user: {
      username: "",
      email: "",
      password: "",
    },
    firstName: "",
    lastName: "",
    middleName: "",
    date_of_birth: "",
    gender: "",
    date_of_hire: "",
    country: "",
    state: "",
    city: "",
    Status: true,
    cv: null,
  });

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (formData.countryCode) {
      const fetchedStates = State.getStatesOfCountry(formData.countryCode);
      setStates(fetchedStates);
      setFormData((prev) => ({ ...prev, state: "", stateCode: "", city: "" }));
    }
  }, [formData.countryCode]);

  useEffect(() => {
    if (formData.countryCode && formData.stateCode) {
      const fetchedCities = City.getCitiesOfState(
        formData.countryCode,
        formData.stateCode
      );
      setCities(fetchedCities);
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  }, [formData.stateCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTeacher([...Teacher, formData]);
    console.log(Teacher);
    setMessage("Teacher registered successfully");
    setMessageType("success");
  };
  return (
    <div>
      {message && (
        <div
          className={`mx-6 mb-3 text-sm px-4 py-2 rounded-sm font-semibold ${
            messageType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex-shrink-0">
        <div className=" pt-5 pl-6 pr-6 mb-2 ">
          <p className="font-bold text-[#07508F]">Personal Information</p>
        </div>
        <div className="pl-6 pr-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">
                First Name:
              </label>
              <input
                type="text"
                placeholder="Enter First Name"
                value={formData.firstName || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    firstName: value,
                  }));
                }}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                  formData.firstName !== ""
                    ? "border-2 border-[#0071E3]"
                    : "border border-[#B6B6B6]"
                }`}
                required
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Middle Name:
              </label>
              <input
                type="text"
                placeholder="Enter Middle Name"
                value={formData.middleName || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    middleName: value,
                  }));
                }}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                  formData.middleName !== ""
                    ? "border-2 border-[#0071E3]"
                    : "border border-[#B6B6B6]"
                }`}
                required
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Last Name:
              </label>
              <input
                type="text"
                placeholder="Enter Last Name"
                value={formData.lastName || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    lastName: value,
                  }));
                }}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                  formData.lastName !== ""
                    ? "border-2 border-[#0071E3]"
                    : "border border-[#B6B6B6]"
                }`}
                required
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">Username:</label>
              <input
                type="text"
                placeholder="Enter Username"
                value={formData.user.username || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    user: {
                      ...prev.user,
                      username: value,
                    },
                  }));
                }}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                  formData.user.username !== ""
                    ? "border-2 border-[#0071E3]"
                    : "border border-[#B6B6B6]"
                }`}
                required
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">Email:</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={formData.user.email || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    user: {
                      ...prev.user,
                      email: value,
                    },
                  }));
                }}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                  formData.user.email !== ""
                    ? "border-2 border-[#0071E3]"
                    : "border border-[#B6B6B6]"
                }`}
                required
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">Password:</label>
              <input
                type="password"
                placeholder="Create Password"
                value={formData.user.password || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    user: {
                      ...prev.user,
                      password: value,
                    },
                  }));
                }}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                  formData.user.password !== ""
                    ? "border-2 border-[#0071E3]"
                    : "border border-[#B6B6B6]"
                }`}
                required
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">DOB:</label>
              <input
                type="date"
                value={formData.date_of_birth || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    date_of_birth: value,
                  }));
                }}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                  formData.date_of_birth !== ""
                    ? "border-2 border-[#0071E3]"
                    : "border border-[#B6B6B6]"
                }`}
                required
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">Gender:</label>
              <Dropdown
                label={formData.gender || "Select Gender"}
                items={[
                  {
                    label: "Male",
                    onClick: () =>
                      setFormData({ ...formData, gender: "Male" } || ""),
                  },
                  {
                    label: "Female",
                    onClick: () =>
                      setFormData({ ...formData, gender: "Female" } || ""),
                  },
                ]}
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Hired Date:
              </label>
              <input
                type="date"
                value={formData.date_of_hire || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    date_of_hire: value,
                  }));
                }}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                  formData.date_of_hire !== ""
                    ? "border-2 border-[#0071E3]"
                    : "border border-[#B6B6B6]"
                }`}
                required
              />
            </div>

            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">Address:</label>
              <Dropdown
                label={formData.country || "Select Country"}
                items={countries.map((country) => ({
                  label: country.name,
                  onClick: () =>
                    setFormData((prev) => ({
                      ...prev,
                      country: country.name,
                      countryCode: country.isoCode,
                    })),
                }))}
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#FFFFFF]">Address</label>
              <Dropdown
                label={formData.state || "Select State"}
                items={states.map((state) => ({
                  label: state.name,
                  onClick: () =>
                    setFormData((prev) => ({
                      ...prev,
                      state: state.name,
                      stateCode: state.isoCode,
                    })),
                }))}
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#FFFFFF]">Address</label>
              <Dropdown
                label={formData.city || "Select City"}
                items={cities.map((city) => ({
                  label: city.name,
                  onClick: () =>
                    setFormData((prev) => ({
                      ...prev,
                      city: city.name,
                    })),
                }))}
              />
            </div>
            <div className="flex flex-col gap-x-1 mb-5">
              <label className="text-[0.88rem] text-[#5E6A72]">Status:</label>
              <div
                className={`${
                  formData.Status ? "bg-[#1BB66E]" : "bg-red-500"
                } text-white font-bold max-w-36 text-sm rounded py-2 cursor-pointer flex justify-center`}
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    Status: !formData.Status,
                  }));
                }}
              >
                {formData.Status ? "Active" : "In-active"}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-x-1 mb-8">
            <label className="text-[0.88rem] text-[#5E6A72] font-bold mb-3">
              Upload CV
            </label>
            <div className="bg-[#F5F7FA] border-[1.5px] flex flex-col gap-1 justify-center items-center cursor-pointer border-dashed border-[#7B9CBA] min-h-60">
              <div className="text-[#01427A]">
                <LuUpload size={25} />
              </div>
              <div>
                <p className="text-sm font-medium">Upload CV as a PDF File</p>
              </div>
              <div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  id="cv-upload"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFormData((prev) => ({ ...prev, cv: file }));
                  }}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="cv-upload"
                  className="bg-[#01427A] text-sm text-white font-bold py-1.5 cursor-pointer hover:opacity-80 px-3 rounded-sm"
                >
                  Browse File
                </label>
              </div>
              {formData.cv && (
                <p className="text-sm text-[#5E6A72] mt-1">
                  <span className="font-medium">{formData.cv.name}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end mb-3">
            <button className="bg-[#01427A] text-sm text-white font-bold py-1.5 cursor-pointer hover:opacity-80 px-5 rounded-sm">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TeacherReg;
