"use client";
import React, { useEffect, useState } from "react";

const Token = ({ token, setToken, error, setErrors }) => {
  const [expectedToken, setExpectedToken] = useState(null);

  // Retrieve the token from localStorage when the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem("verificationToken");
    console.log("Stored Token:", storedToken);
    if (storedToken) {
      setExpectedToken(storedToken);
    }
  }, []);

  const handleTokenChange = (e) => {
    const enteredToken = e.target.value;
    setToken(enteredToken);
    console.log("Entered Token:", enteredToken);

    // Validate the token
    if (enteredToken.trim() === expectedToken) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        token: "", // Clear any token-related error
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        token: "Token does not match.", // Set the error if token doesn't match
      }));
    }
  };

  return (
    <>
      {/* ─── Desktop-only ─── */}
      <div className="hidden lg:block px-8 py-3">
        <div className="text-[#01427a] font-bold mb-4 mt-6">
          <h1>Verified Token</h1>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full">
          <div>
            <label
              className="text-gray-500 font-bold text-base block mb-1"
              htmlFor="Token"
            >
              Token
            </label>
            <input
              className="w-full p-2 rounded border-2 border-neutral-300 bg-white text-gray-500 text-sm placeholder:text-[#0b0a0a33] outline-none"
              type="text"
              value={token}
              placeholder="Enter Copied Token"
              onChange={handleTokenChange}
              required
            />
            {error && <p className="text-[#f2645c] text-sm mt-1">{error}</p>}
          </div>
          <div></div>
          <div></div>
        </div>
      </div>

      {/* ─── Mobile/Tablet-only ─── */}
      <div className="block lg:hidden px-8 py-3">
        <div className="text-[#01427a] font-bold mb-4 mt-6">
          <h1>Verified Token</h1>
        </div>
        <div className="grid grid-cols-1 gap-4 w-full">
          <div>
            <label
              className="text-gray-500 font-bold text-base block mb-1"
              htmlFor="Token"
            >
              Token
            </label>
            <input
              className="w-full p-4 rounded border-2 border-neutral-300 bg-white text-gray-500 text-sm placeholder:text-[#0b0a0a33] outline-none"
              type="text"
              value={token}
              placeholder="Enter Copied Token"
              onChange={handleTokenChange}
              required
            />
            {error && <p className="text-[#f2645c] text-sm mt-1">{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Token;
