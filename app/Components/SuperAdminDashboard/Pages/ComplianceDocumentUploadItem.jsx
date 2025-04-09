"use client";
import React, { useEffect, useState } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import DashboardHeader from "../DashboardHeader";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LuUpload } from "react-icons/lu";
import UploadProgress from "./UploadProgress";

const ComplianceDocumentUploadItem = () => {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get("schoolid");
  const userId = searchParams.get("userid");
  const [certificate, setCertificate] = useState("/note.svg");
  const [proof, setProof] = useState("/note.svg");
  const [saved, setSaved] = useState(false);

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCertificate(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProofUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProof(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      console.log("saved:", saved);
    }, 0);
  };
  console.log("rendering, saved:", saved);
  return (
    <SuperAdminLayout>
      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <DashboardHeader />
        <Link
          href={`/Super-Admin/Compliance-Document-Upload/Compliance-Document-Upload?schoolid=${schoolId}&userid=${userId}`}
        >
          <button className="bg-[#07508F] text-white p-2 rounded-lg cursor-pointer">
            View all uploaded documents
          </button>
        </Link>
      </div>

      {saved ? (
        <UploadProgress setSaved={setSaved} />
      ) : (
        <div className="bg-[#D4D4D4] overflow-auto h-screen  p-4 ">
          <div className="sm:flex sm:flex-col sm:gap-2 lg:grid lg:grid-cols-[1.5fr_1fr] overflow-auto  lg:gap-4 lg:h-screen ">
            <div className="bg-[#ffffff] rounded-md no-scrollbar p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-1.5 mb-2 ">
                <label className="text-[#808080] font-semibold" htmlFor="">
                  Tax Identification Number
                </label>

                <input
                  type="text"
                  className="text-base text-[#808080]  focus:outline-none sm:text-sm border-2 p-2 border-[#07508F] placeholder:text-[#d4d4d4] "
                  placeholder="Enter Identification Number"
                />
              </div>
              <div className="flex flex-col gap-1.5 mb-2 flex-grow  ">
                <p className="font-bold text-xl">Accreditation Certificates</p>

                <div className="mt-2  bg-[#E4E4E4] flex-grow border-dashed border-[1.5px] border-[#333333] flex items-center flex-col justify-center ">
                  <div className="w-12 h-12 mb-2">
                    <img
                      className="w-full h-full"
                      src={certificate}
                      alt="icon"
                    />
                    <input
                      type="file"
                      id="certificate-upload"
                      className="hidden"
                      onChange={handleLogoUpload}
                      accept="image/*"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      Upload Accreditation Certificate as an Image
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      document.getElementById("certificate-upload").click()
                    }
                    className="text-[#07508F] border-[1.5px] rounded-lg cursor-pointer mt-5  border-dashed  p-2 flex items-center justify-center gap-2"
                  >
                    Upload Image
                    <span>
                      <LuUpload size={20} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-[#ffffff] rounded-md no-scrollbar p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-1.5 mb-2  flex-grow">
                <div className="flex flex-col gap-1.5 mb-2 flex-grow  ">
                  <p className="font-bold text-xl">Proof of Registration</p>

                  <div className="mt-6  bg-[#E4E4E4] flex-grow border-dashed border-[1.5px] border-[#333333] flex items-center flex-col justify-center ">
                    <div className="w-12 h-12 mb-2">
                      <img className="w-full h-full" src={proof} alt="icon" />
                      <input
                        type="file"
                        id="proof-upload2"
                        className="hidden"
                        onChange={handleProofUpload}
                        accept="image/*"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-center">
                        Upload Proof of Registration Doc as an Image
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        document.getElementById("proof-upload2").click()
                      }
                      className="text-[#07508F] border-[1.5px] rounded-lg cursor-pointer mt-5  border-dashed  p-2 flex items-center justify-center gap-2"
                    >
                      Upload Image
                      <span>
                        <LuUpload size={20} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="bg-[#80A0BC] text-white p-2 pl-8 pr-8 rounded-lg cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default ComplianceDocumentUploadItem;
