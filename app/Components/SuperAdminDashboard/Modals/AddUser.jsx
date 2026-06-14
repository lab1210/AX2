"use client";
import React, { useState } from "react";
import superAdminMetricsService from "@/Service/SuperAdminService";
import toast from "react-hot-toast";

const AddUser = ({ onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstName: "",
    middleName: "",
    surName: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    // Prepare data matching CreateSuperAdminDto EXACTLY
    const superAdminData = {
      email: formData.email,
      username: formData.username,
      firstName: formData.firstName,
      middleName: formData.middleName || "",
      surName: formData.surName,
      phoneNumber: formData.phoneNumber || null,
      address: formData.address || null,
    };

    console.log("Sending SuperAdmin data:", superAdminData);

    try {
      const response = await superAdminMetricsService.createSuperAdmin(superAdminData);
      console.log("Create response:", response);
      
      if (response.success) {
        toast.success("Super Admin created successfully! An email has been sent with login instructions.");
        setSuccessMessage("Super Admin created successfully! An email has been sent.");
        setFormData({
          email: "",
          username: "",
          firstName: "",
          middleName: "",
          surName: "",
          phoneNumber: "",
          address: "",
        });
        if (onUserAdded) {
          onUserAdded();
        }
        setTimeout(onClose, 2000);
      } else {
        setErrorMessage(response.message || "Failed to create Super Admin");
        toast.error(response.message || "Failed to create Super Admin");
      }
    } catch (error) {
      console.error("Error creating Super Admin:", error);
      
      if (error.message?.includes("username") || error.message?.includes("already taken")) {
        setErrorMessage("A user with that username already exists.");
        toast.error("A user with that username already exists.");
      } else if (error.message?.includes("email") || error.message?.includes("already registered")) {
        setErrorMessage("A user with that email already exists.");
        toast.error("A user with that email already exists.");
      } else {
        setErrorMessage(error.message || "Failed to create Super Admin. Please try again.");
        toast.error(error.message || "Failed to create Super Admin. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-3 mt-7 gap-6 pl-6 pr-6">
        <div className="flex flex-col gap-1">
          <label className="text-[#808080] font-semibold text-sm" htmlFor="firstName">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`text-base ${
              formData.firstName !== ""
                ? "border-[#0071E3] border-2"
                : "border-[#AEAEAE] border-[1.5px]"
            } rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2 placeholder:text-[#d4d4d4] placeholder:font-normal font-bold`}
            placeholder="Enter First Name"
            required
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-[#808080] font-semibold text-sm" htmlFor="middleName">
            Middle Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleInputChange}
            className={`text-base ${
              formData.middleName !== ""
                ? "border-[#0071E3] border-2"
                : "border-[#AEAEAE] border-[1.5px]"
            } rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2 placeholder:text-[#d4d4d4] placeholder:font-normal font-bold`}
            placeholder="Enter Middle Name"
            required
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-[#808080] font-semibold text-sm" htmlFor="surName">
            Surname <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="surName"
            value={formData.surName}
            onChange={handleInputChange}
            className={`text-base ${
              formData.surName !== ""
                ? "border-[#0071E3] border-2"
                : "border-[#AEAEAE] border-[1.5px]"
            } rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2 placeholder:text-[#d4d4d4] placeholder:font-normal font-bold`}
            placeholder="Enter Surname"
            required
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-[#808080] font-semibold text-sm" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className={`text-base ${
              formData.phoneNumber !== ""
                ? "border-[#0071E3] border-2"
                : "border-[#AEAEAE] border-[1.5px]"
            } rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2 placeholder:text-[#d4d4d4] placeholder:font-normal font-bold`}
            placeholder="Enter Phone No"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[#808080] font-semibold text-sm" htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`text-base ${
              formData.email !== ""
                ? "border-[#0071E3] border-2"
                : "border-[#AEAEAE] border-[1.5px]"
            } rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2 placeholder:text-[#d4d4d4] placeholder:font-normal font-bold`}
            placeholder="Enter Email"
            required
          />
        </div>

        <div className="flex flex-col gap-1 mb-2">
          <label className="text-[#808080] font-semibold text-sm" htmlFor="username">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={`text-base ${
              formData.username !== ""
                ? "border-[#0071E3] border-2"
                : "border-[#AEAEAE] border-[1.5px]"
            } rounded-sm focus:border-[#0071E3] focus:border-2 outline-none sm:text-sm p-2 placeholder:text-[#d4d4d4] placeholder:font-normal font-bold`}
            placeholder="Enter Username"
            required
          />
        </div>
      </div>

      {/* Address field - simple textarea */}
      <div className="pt-4 pl-6 pr-6 pb-0">
        <label className="text-[#808080] font-semibold" htmlFor="address">
          Address
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          rows={3}
          className={`w-full text-base focus:outline-none font-bold  ${
              formData.address !== ""
                ? "border-[#0071E3] border-2"
                : "border-[#AEAEAE] border-[1.5px]"
            } rounded-lg sm:text-sm  p-2   resize-none`}
          placeholder="Enter full address"
        />
      </div>
      
      <div className="grid grid-cols-3 mt-5 gap-6 pl-6 pr-6">
        <div className="flex flex-col gap-1">
          <label className="text-[#808080] font-semibold text-sm" htmlFor="">
            User Role
          </label>
          <input
            type="text"
            value="Super Admin"
            readOnly
            className="text-base text-[#07508F] rounded-sm focus:outline-none sm:text-sm border-[1.5px] p-2 border-[#07508F] font-bold"
          />
        </div>
      </div>
      
      <div className="pt-8 pl-6 pr-6">
        <p className="text-xs text-gray-500 mb-2 text-center">
          A temporary password will be sent to the user's email address.
        </p>
        <button
          type="submit"
          disabled={loading}
          className={`bg-[#07508F] rounded-md w-full pt-2 pb-2 text-white font-bold cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Creating..." : "Create Super Admin"}
        </button>
        {successMessage && (
          <p className="mt-2 text-green-500 text-sm">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="mt-2 text-red-500 text-sm">{errorMessage}</p>
        )}
      </div>
    </form>
  );
};

export default AddUser;