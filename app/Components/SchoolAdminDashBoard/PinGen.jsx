"use client";
import { generateOtp, getPins } from "@/Service/RegisterService";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuCopy } from "react-icons/lu";

const formatCreatedAt = (dateString) => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Just now" : date.toLocaleString();
  } catch {
    return "Just now";
  }
};
const PinGen = () => {
  const [otpList, setOtpList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    num_pins: "",
  });

  useEffect(() => {
    const fetchOTP = async () => {
      const { data, error } = await getPins();
      if (data) {
        // Sort by creation date (newest first) when initially loading
        const sortedData = [...data].sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        setOtpList(sortedData);
      } else toast.error(error || "Failed to load OTP");
    };
    fetchOTP();
  }, []);

  const sortedOtpList = [...otpList].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at); // Newest first
  });

  const paginatedData = sortedOtpList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedOtpList.length / itemsPerPage);
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numPins = Number(formData.num_pins);
    if (!numPins || isNaN(numPins) || numPins < 1) {
      toast.error("Please enter a valid number of pins.");
      return;
    }

    try {
      const newPins = await generateOtp(numPins);
      if (newPins && Array.isArray(newPins)) {
        // Ensure each new pin has a valid created_at date
        const pinsWithDates = newPins.map((pin) => ({
          ...pin,
          created_at: pin.created_at || new Date().toISOString(),
        }));

        const sortedNewPins = [...pinsWithDates].sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setOtpList((prev) => [...sortedNewPins, ...prev]);
        toast.success("OTP(s) generated successfully.");
        setCurrentPage(1);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error || err.message || "Failed to generate."
      );
    }
    setFormData({ num_pins: "" });
  };
  const handleCopyOtp = (otp, schoolId) => {
    const textToCopy = `OTP: ${otp}\nSchool ID: ${schoolId}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => toast.success("OTP and School ID copied to clipboard!"))
      .catch(() => toast.error("Failed to copy to clipboard"));
  };

  // Get the school ID (all should be the same)
  const schoolId = otpList.length > 0 ? otpList[0].school : "";

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-3 flex-shrink-0">
        <div className="flex pt-3 pl-6 pr-6 justify-between mb-2 ">
          <p className="font-bold text-[#07508F]">Generate OTP</p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            Generate
          </button>
        </div>
        <div className="pl-6 pr-6">
          <div className="flex flex-col gap-2">
            <label className="text-[0.88rem] text-[#5E6A72]">
              Number of Pins to Generate:
            </label>
            <input
              type="number"
              placeholder="Number of Pins"
              value={formData.num_pins}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  num_pins: e.target.value,
                }));
              }}
              min={1}
              className="focus:outline-[#0071E3] sm:placeholder:text-xs sm:text-xs lg:placeholder:text-sm placeholder:text-[#B6B6B6] border-2 p-1.5 lg:text-sm rounded-sm border-[#B6B6B6]"
              required
            />
          </div>
        </div>
      </form>
      <hr />
      <div className="flex-shrink-0">
        <p className="font-semibold flex justify-center p-3 text-[#333333]">
          Generated OTPs for{" "}
          <span className="text-[#07508F] font-bold ml-2">{schoolId}</span>
        </p>
      </div>
      <div className="px-0">
        <div className="overflow-y-auto max-h-[200px] no-scrollbar">
          <table className="min-w-full table-auto">
            {paginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-center sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2  bg-[#EDF0F3]">OTP</th>
                  <th className="p-2 bg-[#EDF0F3]">Created At</th>
                  <th className="p-2 bg-[#EDF0F3]">Actions</th>
                </tr>
              </thead>
            )}
            <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-5 text-center border text-gray-500"
                  >
                    No OTP Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0] border-b" key={index}>
                    <td className="p-2 text-center">{item.otp}</td>
                    <td className="p-2 text-center">
                      {formatCreatedAt(item.created_at)}
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex items-center justify-center">
                        <LuCopy
                          className="text-[#80ADCB] hover:text-[#0071E3] cursor-pointer"
                          size={15}
                          onClick={() => handleCopyOtp(item.otp, item.school)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-self-end pr-6 items-center gap-2 mt-3 text-sm text-[#01427A] font-semibold">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-2 py-1 bg-[#E6ECF2] border ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#EDF0F3]"
            }`}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-2 py-1 text-xs ${
                currentPage === index + 1
                  ? "bg-[#07508F] text-white"
                  : "hover:bg-[#EDF0F3] bg-[#FAFAFA]"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 border bg-[#E6ECF2] ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#EDF0F3]"
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinGen;
