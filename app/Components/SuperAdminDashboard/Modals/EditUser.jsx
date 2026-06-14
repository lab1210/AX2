"use client";
import React, { useState, useEffect } from "react";

const EditUser = ({
  onClose,
  user,
  onUserUpdated,
  loading,
  error,
  success,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    surName: "",
    phoneNumber: "",
    address: "",
    email: "",
    username: "",
  });

  // Populate form when user data is available
  useEffect(() => {
    console.log("EditUser received user data:", user);
    
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        surName: user.surName || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        email: user.email || "",
        username: user.username || "",
      });
    }
  }, [user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const updateData = {
      email: formData.email || null,
      username: formData.username || null,
      firstName: formData.firstName || null,
      middleName: formData.middleName || null,
      surName: formData.surName || null,
      phoneNumber: formData.phoneNumber || null,
      address: formData.address || null,
    };
    console.log("Submitting update data:", updateData);
    onSave(updateData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-3 mt-7 gap-6 pl-6 pr-6">
        <div className="flex flex-col gap-1">
          <label className="text-[#808080] text-sm font-semibold" htmlFor="firstName">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="text-base focus:outline-none font-bold text-[#01427A] rounded-lg sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A]"
            placeholder="Enter First Name"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-[#808080] text-sm font-semibold" htmlFor="middleName">
            Middle Name
          </label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleInputChange}
            className="text-base focus:outline-none font-bold text-[#01427A] rounded-lg sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A]"
            placeholder="Enter Middle Name"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-[#808080] text-sm font-semibold" htmlFor="surName">
            Surname
          </label>
          <input
            type="text"
            name="surName"
            value={formData.surName}
            onChange={handleInputChange}
            className="text-base focus:outline-none font-bold text-[#01427A] rounded-lg sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A]"
            placeholder="Enter Surname"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-[#808080] text-sm font-semibold" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="font-bold text-base text-[#07508F] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#07508F] placeholder:text-[#07508F]"
            placeholder="Enter Phone No"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[#808080] text-sm font-semibold" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="text-base focus:outline-none font-bold text-[#01427A] rounded-lg sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A]"
            placeholder="Enter Email"
          />
        </div>

        <div className="flex flex-col gap-1 mb-2">
          <label className="text-[#808080] text-sm font-semibold" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="text-base focus:outline-none font-bold text-[#01427A] rounded-lg sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A]"
            placeholder="Enter Username"
          />
        </div>
      </div>

      {/* Address field - simple text input */}
      <div className="pt-4 pl-6 pr-6 pb-0">
        <label className="text-[#808080] font-semibold" htmlFor="address">
          Address
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          rows={3}
          className="w-full text-base focus:outline-none font-bold text-[#01427A] rounded-lg sm:text-sm border-[2px] p-2 border-[#01427A] placeholder:text-[#01427A] resize-none"
          placeholder="Enter full address"
        />
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
            className="text-base text-[#07508F] rounded-lg focus:outline-none sm:text-sm border-[2px] p-2 border-[#07508F] font-bold"
          />
        </div>
      </div>
      
      <div className="pt-8 pl-6 pr-6">
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">User updated successfully!</p>}
        <button
          type="submit"
          disabled={loading}
          className={`bg-[#07508F] rounded-md w-full pt-2 pb-2 text-white font-bold cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default EditUser;