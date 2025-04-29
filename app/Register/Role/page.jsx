"use client";
import React from "react";
import { useRouter } from "next/navigation";
import LeftAuth from "../../Components/LeftAuth";
import { IoChevronBackSharp } from "react-icons/io5";

const RegisterRole = () => {
  const router = useRouter();

  const handleRoleSelection = (role) => {
    const formattedRole = role.toLowerCase();
    router.push(`/Register/${formattedRole}/Registration-Form`);
  };
  

  return (
    <>
      <div className="hidden lg:flex w-full h-auto bg-[rgba(217,217,217,0.4)]">
        <LeftAuth />
        <div className="flex flex-col items-center justify-center w-full md:w-[55%] lg:w-1/2 bg-white">
          <div className="shadow-[0px_4px_10px_4px_rgba(0,0,0,0.15)] rounded-lg px-8 py-16 md:px-12 md:py-20 lg:px-16 lg:py-24">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Register As
              </h1>
              <p className="text-sm md:text-base text-black/50 font-bold">
                Select your role to continue the registration process
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleRoleSelection("Teacher")}
                className="bg-[#01427a] text-white rounded px-4 py-3 text-sm md:text-base font-bold hover:bg-[#01427a]/80 transition-colors"
              >
                Teacher
              </button>
              <button
                onClick={() => handleRoleSelection("Student")}
                className="bg-white text-[#01427a] border border-[#01427a] rounded px-4 py-3 text-sm md:text-base font-bold hover:text-white hover:bg-[#01427a] transition-colors"
              >
                Student
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── mobile & tablet view ───────*/}
      <div className="bg-[#f2f2f2] w-full flex flex-col items-center justify-center lg:hidden">
        <div className="flex items-center justify-center bg-[#01427A] rounded-b-[45%] h-96 p-3">
          <button onClick={() => router.back()} className="self-start mb-4">
            <IoChevronBackSharp className="w-6 h-6 text-white " />
          </button>
          <div className="items-center justify-center">
            <img
              src="/loginimage.svg"
              alt="Logo"
              className="z-10 flex items-center"
            />
          </div>
        </div>
        <div className="w-full p-5">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Register As
            </h1>
            <p className="text-sm text-gray-500 font-bold">
              Select your role to continue the registration process
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => handleRoleSelection("Teacher")}
              className="bg-[#01427a] text-white rounded py-3 text-sm font-bold hover:bg-[#01427a]/80 transition-colors"
            >
              Teacher
            </button>
            <button
              onClick={() => handleRoleSelection("Student")}
              className="bg-white text-[#01427a] border border-[#01427a] rounded py-3 text-sm font-bold hover:text-white hover:bg-[#01427a] transition-colors"
            >
              Student
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default RegisterRole;
