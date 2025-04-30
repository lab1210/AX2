"use client";
import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { BiChevronDown } from "react-icons/bi";
import { getAllRoles } from "../../../Service/RoleService";
import { createSuperAdmin } from "../../../Service/userService";
import Dropdown from "@/Components/Dropdown";

const AddUser = ({ onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    surname: "",
    first_name: "",
    phone_number: "",
    address: "",
    user_role: "", // To store the selected role ID (programmatically)
  });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [roles, setRoles] = useState([]);
  const [superAdminRoleId, setSuperAdminRoleId] = useState(""); // State to hold the Super Admin role ID

  const countries = Country.getAllCountries();
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode)
    : [];
  const cities = selectedState
    ? City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode)
    : [];

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getAllRoles();
        if (response?.status === 200) {
          setRoles(response.data);
          // Find the Super Admin role based on its name (adjust the name if needed)
          const superAdminRole = response.data.find((role) =>
            role.name.toLowerCase().includes("super admin")
          );
          if (superAdminRole) {
            setSuperAdminRoleId(superAdminRole.id);
            setFormData((prevFormData) => ({
              ...prevFormData,
              user_role: superAdminRole.id,
            }));
          } else {
            console.warn("Super Admin role not found in the fetched roles.");
            setErrorMessage(
              "Could not find the Super Admin role. Please contact an administrator."
            );
          }
        } else {
          setErrorMessage(
            `Failed to fetch roles: ${
              response?.data?.message || "Unknown error"
            }`
          );
        }
      } catch (error) {
        setErrorMessage(`Error fetching roles: ${error.message}`);
      }
    };

    fetchRoles();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCountryChange = (selected) => {
    setSelectedCountry(selected);
    setSelectedState(null);
    setSelectedCity(null);
    setFormData({ ...formData, address: selected?.name || "" });
  };

  const handleStateChange = (selected) => {
    setSelectedState(selected);
    setSelectedCity(null);
    setFormData({
      ...formData,
      address: `${selectedCountry?.name || ""}, ${selected?.name || ""}`,
    });
  };

  const handleCityChange = (selected) => {
    setSelectedCity(selected);
    setFormData({
      ...formData,
      address: `${selectedCountry?.name || ""}, ${selectedState?.name || ""}, ${
        selected?.name || ""
      }`,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!superAdminRoleId) {
      setErrorMessage(
        "Super Admin role ID is not available. Cannot create user."
      );
      setLoading(false);
      return;
    }

    const superAdminData = {
      user: {
        username: formData.username,
        password: formData.password,
        email: formData.email,
      },
      user_role: superAdminRoleId, // Use the fetched Super Admin role ID
      surname: formData.surname,
      first_name: formData.first_name,
      phone_number: formData.phone_number,
      address: formData.address,
    };

    try {
      const response = await createSuperAdmin(superAdminData);
      if (response?.status === 201) {
        setSuccessMessage("Super Admin created successfully!");
        setFormData({
          username: "",
          password: "",
          email: "",
          surname: "",
          first_name: "",
          phone_number: "",
          address: "",
          user_role: superAdminRoleId, // Keep the role ID for potential future use
        });
        setSelectedCountry(null);
        setSelectedState(null);
        setSelectedCity(null);
        if (onUserAdded) {
          onUserAdded();
        }
        setTimeout(onClose, 1500);
      } else {
        setErrorMessage(
          `Failed to create Super Admin: ${
            response?.data?.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error creating Super Admin:", error);
      if (error.response?.data?.user?.username) {
        setErrorMessage("A user with that username already exists.");
      } else if (error.response?.data?.user?.email) {
        setErrorMessage("A user with that email already exists.");
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message); // Fallback to a general message from the backend
      } else {
        setErrorMessage("Failed to create Super Admin. Please try again."); // Generic error
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-3 mt-7 gap-6 pl-6 pr-6">
        {/* ... (rest of the form inputs) ... */}
        <div className="flex flex-col gap-1">
          <label
            className="text-[#808080] font-semibold text-sm "
            htmlFor="first_name"
          >
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            className="text-base text-[#808080] rounded-sm focus:outline-none sm:text-sm border-[2px] p-2 border-[#AEAEAE] placeholder:text-[#d4d4d4] "
            placeholder="Enter First Name"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            className="text-[#808080] font-semibold text-sm "
            htmlFor="surname"
          >
            Surname
          </label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleInputChange}
            className="text-base text-[#808080] rounded-sm focus:outline-none sm:text-sm border-[2px] p-2 border-[#AEAEAE] placeholder:text-[#d4d4d4] "
            placeholder="Enter Surname"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            className="text-[#808080] font-semibold text-sm "
            htmlFor="phone_number"
          >
            Phone Number
          </label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            className="text-base text-[#808080] rounded-sm focus:outline-none sm:text-sm border-[2px] p-2 border-[#AEAEAE] placeholder:text-[#d4d4d4] "
            placeholder="Enter Phone No"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            className="text-[#808080] font-semibold text-sm "
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="text-base text-[#808080] rounded-sm focus:outline-none sm:text-sm border-[2px] p-2 border-[#AEAEAE] placeholder:text-[#d4d4d4] "
            placeholder="Enter Email"
            required
          />
        </div>

        <div className="flex flex-col gap-1 mb-2">
          <label
            className="text-[#808080] font-semibold text-sm "
            htmlFor="password"
          >
            Create Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="text-base text-[#808080] rounded-sm focus:outline-none sm:text-sm border-[2px] p-2 border-[#AEAEAE] placeholder:text-[#d4d4d4] "
            placeholder="Enter Password"
            required
          />
        </div>

        <div className="flex flex-col gap-1 mb-2">
          <label
            className="text-[#808080] font-semibold text-sm "
            htmlFor="username"
          >
            Create Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="text-base text-[#808080] rounded-sm focus:outline-none sm:text-sm border-[2px] p-2 border-[#AEAEAE] placeholder:text-[#d4d4d4] "
            placeholder="Enter Username"
            required
          />
        </div>
      </div>

      {/* ... (address selection) ... */}
      <div className="pt-4 pl-6 pr-6 pb-0">
        <label className="text-[#808080] font-semibold" htmlFor="address">
          Address
        </label>
        <div className="grid grid-cols-3 gap-3 mt-1 ">
          <div className="grid grid-cols-1 mb-2">
            <Dropdown
              label={selectedCountry?.name || "Select Country"}
              items={countries.map((country) => ({
                label: country.name,
                onClick: () => handleCountryChange(country),
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

          <div className="grid grid-cols-1 mb-2">
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
      <div className="grid grid-cols-3 mt-5 gap-6 pl-6 pr-6">
        <div className="flex flex-col gap-1">
          <label className="text-[#808080] font-semibold text-sm " htmlFor="">
            User Role
          </label>
          <input
            type="text"
            defaultValue="Super Admin"
            readOnly
            className="text-base text-[#07508F] rounded-sm focus:outline-none sm:text-sm border-[2px] p-2 border-[#07508F] font-bold "
          />
        </div>
      </div>
      <div className="pt-8 pl-6 pr-6  ">
        <button
          type="submit"
          disabled={loading || !superAdminRoleId}
          className={`bg-[#07508F] rounded-md w-full pt-2 pb-2 text-white font-bold cursor-pointer ${
            loading || !superAdminRoleId ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Adding..." : "Add"}
        </button>
        {successMessage && (
          <p className="mt-2 text-green-500">{successMessage}</p>
        )}
        {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}
      </div>
    </form>
  );
};

export default AddUser;
