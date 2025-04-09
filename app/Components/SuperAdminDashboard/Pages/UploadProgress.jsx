"use client";
import React from "react";
import { IoClose } from "react-icons/io5";
import { CgNotes } from "react-icons/cg";
const UploadProgress = ({ setSaved }) => {
  console.log("upload progress rendered");
  return (
    <div className="bg-[#D4D4D4] h-screen p-4 lg:overflow-hidden sm:overflow-auto  ">
      <div className="bg-[#ffffff] h-screen lg:overflow-hidden sm:overflow-auto p-10 flex flex-col">
        <div className="grid lg:grid-cols-[300px_1fr] sm:grid-rows-2 gap-5">
          <div className="flex flex-col gap-10">
            <p className="font-bold text-xl">Compliance Document Upload</p>
            <div className="pt-8 pb-6 gap-8 mb-4 rounded-md bg-[#E4E4E4] border-dashed border-[1.5px] border-[#333333] flex flex-col items-center relative  justify-center">
              <div className="w-35 h-48">
                <img
                  className="w-full h-full"
                  src={"/doclogo.png"}
                  alt="icon"
                />
              </div>

              <button className="bg-[#07508F] font-bold text-white text-sm p-1 pl-6 pr-6 rounded-lg cursor-pointer">
                Edit
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-5 ">
            <div className="bg-[#F5F6F8] p-3 ">
              <div className="grid grid-cols-[55px_1fr] pr-5">
                <div className="w-10 h-10 object-contain"></div>
                <div className="flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm">
                      Tax Identification Number
                    </p>
                    <IoClose className="text-[#7B7B7C]" />
                  </div>
                  <div className="w-full bg-[#E4E4E4] rounded-full h-2.5">
                    <div
                      className="bg-[#004080] h-2.5 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#F5F6F8] p-3 ">
              <div className="grid grid-cols-[55px_1fr] pr-5">
                <div className="w-10 h-10 object-contain">
                  <CgNotes className="w-full h-full text-black/80" />
                </div>
                <div className="flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm">
                      Accreditation Certificate Upload
                    </p>
                    <IoClose className="text-[#7B7B7C]" />
                  </div>
                  <div className="w-full bg-[#E4E4E4] rounded-full h-2.5">
                    <div
                      className="bg-[#004080] h-2.5 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#F5F6F8] p-3 mb-4   ">
              <div className="grid grid-cols-[55px_1fr] pr-5 ">
                <div className="w-10 h-10 object-contain">
                  <CgNotes className="w-full h-full text-black/80 " />
                </div>
                <div className="flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm">
                      Proof of Registration Upload
                    </p>
                    <IoClose className="text-[#7B7B7C]" />
                  </div>
                  <div className="w-full bg-[#E4E4E4] rounded-full h-2.5">
                    <div
                      className="bg-[#004080] h-2.5 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-5 justify-evenly ">
              <div>
                <button className="bg-[#004080] font-bold text-white text-sm p-2 pl-6 w-50 pr-6 rounded-lg cursor-pointer">
                  Confirm Upload
                </button>
              </div>
              <div>
                <button
                  onClick={() => setSaved(false)}
                  className="bg-[#E4E4E4] font-bold text-sm p-2 pl-6 w-50 pr-6 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadProgress;
