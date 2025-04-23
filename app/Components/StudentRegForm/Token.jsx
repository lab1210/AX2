import React from "react";

const Token = ({ token, setToken, error }) => {
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
              className="w-full p-4 rounded border-2 border-neutral-300 bg-white text-gray-500 text-sm placeholder:text-[#0b0a0a33] outline-none"
              type="text"
              value={token}
              placeholder="Enter Copied Token"
              onChange={(e) => setToken(e.target.value)}
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
              onChange={(e) => setToken(e.target.value)}
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
