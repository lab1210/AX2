import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";

const RegControlModal = ({
  onClose,
  onSubmit,
  initialStartDate,
  initialEndDate,
}) => {
  const [formData, setFormData] = useState({
    startDate: initialStartDate || "",
    endDate: initialEndDate || "",
  });

  useEffect(() => {
    if (initialStartDate) {
      setFormData({
        startDate: initialStartDate,
        endDate: initialEndDate || ""
      });
    }
  }, [initialStartDate, initialEndDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();

    const { startDate, endDate } = formData;

    if (!startDate || !endDate) {
      toast.error("Please fill in both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      toast.error("End date must be after start date.");
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white min-w-100 rounded-lg p-3">
        <div className="flex justify-end text-[#333333] cursor-pointer">
          <IoClose size={25} onClick={onClose} />
        </div>
        <div className="flex justify-center font-bold text-xl mb-5">
          <p>SET REGISTRATION PERIOD</p>
        </div>
        <form className="flex flex-col px-5" onSubmit={handleModalSubmit}>
          <div className="flex flex-col gap-1 mb-5">
            <label className="text-sm font-semibold text-[#808080]">
              Start Date:
            </label>
            <input
              name="startDate"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={formData.startDate}
              onChange={handleChange}
              required
              className="focus:outline-[#0071E3] sm:placeholder:text-xs sm:text-xs lg:placeholder:text-sm placeholder:text-[#B6B6B6] border-2 p-3 lg:text-sm rounded-sm border-[#B6B6B6]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-[#808080]">
              End Date:
            </label>
            <input
              type="date"
              name="endDate"
              min={formData.startDate || new Date().toISOString().split("T")[0]}
              value={formData.endDate}
              onChange={handleChange}
              required
              className="focus:outline-[#0071E3] sm:placeholder:text-xs sm:text-xs lg:placeholder:text-sm placeholder:text-[#B6B6B6] border-2 p-3 lg:text-sm rounded-sm border-[#B6B6B6]"
            />
          </div>
          <div className="w-full mt-10">
            <button className="bg-[#07508F] hover:opacity-90 cursor-pointer w-full py-2 rounded-sm font-bold mb-5 text-white">
              Enable Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegControlModal;