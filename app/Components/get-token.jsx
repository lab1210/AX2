"use client";
import React, { useState } from "react";
import { LuCopy } from "react-icons/lu";
import Link from "next/link";

const GetToken = ({ token }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-transparent">
      {copied && (
        <p className="fixed top-[20px] left-1/2 transform -translate-x-1/2 bg-[rgba(27,182,110,1)] text-white py-2 px-5 rounded shadow font-bold z-50 transition-opacity duration-300 ease-in-out">
          Token copied to clipboard!
        </p>
      )}
      <div className="shadow-[0_4px_10px_4px_rgba(0,0,0,0.15)] rounded-[15px] bg-white font-bold p-5 md:py-[100px] md:px-[50px] w-[450px]">
        <div className="text-center">
          <h2 className="text-[30px] mb-8">Verification Successful</h2>
        </div>
        <div>
          <p className="text-[rgba(242,100,92,1)] mb-2.5">
            Copy Token to Proceed
          </p>
          <div className="flex justify-between text-base text-[rgba(0,0,0,0.5)]">
            <p>{token}</p>
            <LuCopy size={20} onClick={handleCopyToken} className="cursor-pointer" />
          </div>
        </div>
        <Link href="/Register/Role">
          <button className="w-full bg-[rgba(27,182,110,1)] rounded border-0 text-white font-bold py-2.5 px-4 mt-10 text-[18px] hover:bg-[rgba(27,182,110,0.8)] hover:text-[rgba(255,255,255,0.9)] hover:scale-105 transition-all duration-300 ease-in-out">
            Next
          </button>
        </Link>
      </div>
    </div>
  );
};

export default GetToken;
