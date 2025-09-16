"use client";
import toast from "react-hot-toast";
import { Country, State, City } from "country-state-city";
import React, { useEffect, useState } from "react";
import { SchoolAdminRegisterStudent } from "@/Service/StudentRegService";
import DropDownLight from "./DropDownwithlightborder";
import { getClass, getClassArm } from "@/Service/schoolConfig";

const StudentReg = () => {
  const [Student, setStudent] = useState([]);
  const [filteredClassArms, setFilteredClassArms] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classYears, setClassYears] = useState([]);
  const [classArms, setClassArms] = useState([]);
  const nigeria = Country.getAllCountries().find(
    (country) => country.name === "Nigeria"
  );
  const [formData, setFormData] = useState({
    user: {
      username: "",
      email: "",
      password: "",
    },
    first_name: "",
    last_name: "",
    middle_name: "",
    date_of_birth: "",
    gender: "",
    country: nigeria ? "Nigeria" : "",
    countryCode: nigeria ? nigeria.isoCode : "",
    state: "",
    city: "",
    region: "default",
    admission_number: "",
    admission_date: "",
    status: "Active",
    parent_first_name: "",
    parent_last_name: "",
    parent_middle_name: "",
    parent_occupation: "",
    parent_email: "default",
    parent_emergency_contact: "",
    address: "default",
    parent_contact_info: "",
    parent_relationship: "",
    class_year: "",
    class_arm: "",
  });

  useEffect(() => {
    const fetchClassArms = async () => {
      const { data, error } = await getClassArm();
      if (data) {
        setClassArms(data);
        setFilteredClassArms(data); // Initialize with all class arms
      } else toast.error(error || "Failed to load class arms");
    };
    const fetchClasses = async () => {
      const { data, error } = await getClass();
      if (data) setClassYears(data);
      else toast.error(error || "Failed to load classes");
    };
    fetchClasses();
    fetchClassArms();
  }, []);

  useEffect(() => {
    if (formData.class_year) {
      const filtered = classArms.filter(
        (arm) => arm.class_year === formData.class_year
      );
      setFilteredClassArms(filtered);
      // Reset class arm if it's not available for the selected year
      if (!filtered.some((arm) => arm.class_id === formData.class_arm)) {
        setFormData((prev) => ({ ...prev, class_arm: "" }));
      }
    } else {
      setFilteredClassArms(classArms);
    }
  }, [formData.class_year, classArms]);

  //Setting countries
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  //Student country
  useEffect(() => {
    if (formData.countryCode) {
      const fetchedStates = State.getStatesOfCountry(formData.countryCode);
      setStates(fetchedStates);
      setFormData((prev) => ({ ...prev, state: "", stateCode: "", city: "" }));
    }
  }, [formData.countryCode]);

  //student cities
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await SchoolAdminRegisterStudent(formData);
      if (response?.status === 201) {
        toast.success("Student registered successfully");
        setStudent([...Student, formData]);
      } else {
        if (response?.data?.error) {
          toast.error(response.data.error);
        } else {
          toast.error("Student Registration failed");
        }
      }
    } catch (error) {
      console.error("Error while registering student", error);

      if (error.response && error.response.data) {
        const errors = error.response.data;

        // Handle the specific error message from network response
        if (typeof errors === "object" && errors.error) {
          toast.error(errors.error); // This will show "Student creation failed: ClassDepartment matching query does not exist."
          return;
        }

        const flatErrors = [];
        for (const key in errors) {
          if (Array.isArray(errors[key])) {
            flatErrors.push(...errors[key]);
          } else if (typeof errors[key] === "object") {
            for (const subKey in errors[key]) {
              if (Array.isArray(errors[key][subKey])) {
                flatErrors.push(...errors[key][subKey]);
              } else {
                flatErrors.push(errors[key][subKey]);
              }
            }
          } else {
            flatErrors.push(errors[key]);
          }
        }
        const finalMessage = flatErrors.join(" ");
        toast.error(finalMessage);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex-shrink-0">
        <div className=" pt-5 pl-6 pr-6 mb-2 ">
          <p className="font-bold text-[#07508F]">Personal Information</p>
        </div>
        <div className="pl-6 pr-6">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">
                First Name:
              </label>
              <input
                type="text"
                placeholder="Enter First Name"
                value={formData.first_name || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    first_name: value,
                  }));
                }}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                  formData.first_name !== ""
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
                value={formData.middle_name || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    middle_name: value,
                  }));
                }}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                  formData.middle_name !== ""
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
                value={formData.last_name || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    last_name: value,
                  }));
                }}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                  formData.last_name !== ""
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
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-3">
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
              <DropDownLight
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
          </div>
          <div className="grid grid-cols-3 gap-x-6 gap-y-3 mt-3">
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">Address:</label>
              <DropDownLight
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
              <DropDownLight
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
              <DropDownLight
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
          </div>
        </div>
        <div className=" pt-8 pl-6 pr-6 mb-2 ">
          <p className="font-bold text-[#07508F]">Admission Information</p>
        </div>
        <div className="grid grid-cols-2 pl-6 pr-6 gap-x-3 gap-y-0">
          <div className="flex flex-col gap-x-1">
            <label className="text-[0.88rem] text-[#5E6A72]">
              Admission Number:
            </label>
            <input
              type="text"
              placeholder="Enter Admission Number"
              value={formData.admission_number || ""}
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  admission_number: value,
                }));
              }}
              className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                formData.admission_number !== ""
                  ? "border-2 border-[#0071E3]"
                  : "border border-[#B6B6B6]"
              }`}
              required
            />
          </div>
          <div className="flex flex-col gap-x-1">
            <label className="text-[0.88rem] text-[#5E6A72]">
              Admission Date:
            </label>
            <input
              type="date"
              value={formData.admission_date || ""}
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  admission_date: value,
                }));
              }}
              className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                formData.admission_date !== ""
                  ? "border-2 border-[#0071E3]"
                  : "border border-[#B6B6B6]"
              }`}
              required
            />
          </div>
          <div className="flex flex-col gap-x-1">
            <label className="text-[0.88rem] text-[#FFFFFF]">Class Year</label>
            <DropDownLight
              label={
                classYears.find((y) => y.class_year_id === formData.class_year)
                  ?.class_name || "Select Class Year"
              }
              items={classYears.map((year) => ({
                label: year.class_name,
                onClick: () =>
                  setFormData((prev) => ({
                    ...prev,
                    class_year: year.class_year_id,
                  })),
              }))}
            />
          </div>
          <div className="flex flex-col gap-x-1">
            <label className="text-[0.88rem] text-[#FFFFFF]">Class Arm</label>
            <DropDownLight
              label={formData.class_arm || "Select Class Arm"}
              items={filteredClassArms.map((arm) => ({
                label: arm.arm_name,
                onClick: () =>
                  setFormData((prev) => ({
                    ...prev,
                    class_arm: arm.class_id,
                  })),
              }))}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 pl-6 pr-6 gap-y-3 mt-3">
          <div className="flex flex-col gap-x-1">
            <label className="text-[0.88rem] text-[#5E6A72]">Status:</label>
            <div
              className={`${
                formData.status === "Active" ? "bg-[#1BB66E]" : "bg-red-500"
              } text-white font-bold max-w-36 text-sm rounded py-2 cursor-pointer flex justify-center`}
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  status: formData.status === "Active" ? "In-active" : "Active",
                }));
              }}
            >
              {formData.status}
            </div>
          </div>
        </div>
        <div className=" pt-8 pl-6 pr-6 mb-2 ">
          <p className="font-bold text-[#07508F]">Parents Information</p>
        </div>
        <div className="pl-6 pr-6">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Parent's First Name:
              </label>
              <input
                type="text"
                placeholder="Enter First Name"
                value={formData.parent_first_name || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    parent_first_name: value,
                  }));
                }}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                  formData.parent_first_name !== ""
                    ? "border-2 border-[#0071E3]"
                    : "border border-[#B6B6B6]"
                }`}
                required
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Parent's Middle Name:
              </label>
              <input
                type="text"
                placeholder="Enter Middle Name"
                value={formData.parent_middle_name || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    parent_middle_name: value,
                  }));
                }}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                  formData.parent_middle_name !== ""
                    ? "border-2 border-[#0071E3]"
                    : "border border-[#B6B6B6]"
                }`}
                required
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Parent's Last Name:
              </label>
              <input
                type="text"
                placeholder="Enter Last Name"
                value={formData.parent_last_name || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    parent_last_name: value,
                  }));
                }}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                  formData.parent_last_name !== ""
                    ? "border-2 border-[#0071E3]"
                    : "border border-[#B6B6B6]"
                }`}
                required
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Parent's Occupation:
              </label>
              <input
                type="text"
                placeholder="Enter Occupation"
                value={formData.parent_occupation || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    parent_occupation: value,
                  }));
                }}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                  formData.parent_occupation !== ""
                    ? "border-2 border-[#0071E3]"
                    : "border border-[#B6B6B6]"
                }`}
                required
              />
            </div>

            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Parent's Phone Number:
              </label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter Phone Number"
                value={formData.parent_contact_info || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                  setFormData((prev) => ({
                    ...prev,
                    parent_contact_info: value,
                  }));
                }}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                  formData.parent_contact_info !== ""
                    ? "border-2 border-[#0071E3]"
                    : "border border-[#B6B6B6]"
                }`}
                required
              />
            </div>
            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Emergency Contact:
              </label>
              <input
                type="tel"
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="Enter Emergency"
                value={formData.parent_emergency_contact || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                  setFormData((prev) => ({
                    ...prev,
                    parent_emergency_contact: value,
                  }));
                }}
                className={`focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6]  p-1.5 text-sm rounded-sm  ${
                  formData.parent_emergency_contact !== ""
                    ? "border-2 border-[#0071E3]"
                    : "border border-[#B6B6B6]"
                }`}
                required
              />
            </div>

            <div className="flex flex-col gap-x-1">
              <label className="text-[0.88rem] text-[#5E6A72]">
                Relationship:
              </label>
              <DropDownLight
                label={formData.parent_relationship || "Select Relationship"}
                items={[
                  {
                    label: "Father",
                    onClick: () =>
                      setFormData(
                        { ...formData, parent_relationship: "Father" } || ""
                      ),
                  },
                  {
                    label: "Mother",
                    onClick: () =>
                      setFormData(
                        { ...formData, parent_relationship: "Mother" } || ""
                      ),
                  },
                  {
                    label: "Guardian",
                    onClick: () =>
                      setFormData(
                        { ...formData, parent_relationship: "Guardian" } || ""
                      ),
                  },
                ]}
              />
            </div>
          </div>

          <div className="flex justify-end mb-5 mt-10">
            <button className="bg-[#01427A] text-sm text-white font-bold py-1.5 cursor-pointer hover:opacity-80 px-5 rounded-sm">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentReg;
