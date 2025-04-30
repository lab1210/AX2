"use client";
import React, { useEffect, useState } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import DashboardHeader from "../DashboardHeader";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LuUpload } from "react-icons/lu";
import UploadProgress from "./UploadProgress";
import { createComplianceDoc } from "@/app/Service/complianceDocService";

const ComplianceDocumentUploadItem = () => {
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");
  const [taxIdNumber, setTaxIdNumber] = useState("");
  const [certificateFile, setCertificateFile] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState("/note.svg");
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState("/note.svg");
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleCertificateUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCertificateFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCertificateFile(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setCertificateFile(null);
      setCertificatePreview("/note.svg");
    }
  };

  const handleProofUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProofFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProofFile(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setProofFile(null);
      setProofPreview("/note.svg");
    }
  };

  const handleSave = async () => {
    if (!taxIdNumber || !certificateFile || !proofFile) {
      setUploadError("Please fill all required fields");
      return;
    }
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("tax_identification_number", taxIdNumber);
    formData.append("accreditation_certificates", certificateFile);
    formData.append("proof_of_registration", proofFile);

    try {
      const response = await createComplianceDoc(formData);
      console.log(response);
      setSaved(true);
    } catch (error) {
      setUploadError(error.message || "Failed to upload compliance document");
    } finally {
      setUploading(false);
    }
  };
  console.log("rendering, saved:", saved);
  return (
    <SuperAdminLayout>
      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <DashboardHeader />
        <Link
          href={`/Super-Admin/Compliance-Document-Upload/Compliance-Document-Upload?adminId=${adminId}`}
        >
          <button className="bg-[#07508F] text-white p-2 rounded-lg cursor-pointer">
            View all uploaded documents
          </button>
        </Link>
      </div>
      {uploading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="w-12 h-12 border-4 border-blue-900 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      )}

      {uploadError && (
        <div className="fixed top-4 left-4 bg-red-200 border border-red-500 text-red-700 px-4 py-2 rounded-md z-50">
          Error: {uploadError}
        </div>
      )}

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
                  value={taxIdNumber}
                  onChange={(e) => setTaxIdNumber(e.target.value)}
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
                      src={certificatePreview}
                      alt="icon"
                    />
                    <input
                      type="file"
                      id="certificate-upload"
                      className="hidden"
                      onChange={handleCertificateUpload}
                      accept="image/*, application/pdf"
                    />
                  </div>
                  <div>
                    <p className="xl:text-sm text-xs font-semibold">
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
                      <img
                        className="w-full h-full"
                        src={proofPreview}
                        alt="icon"
                      />
                      <input
                        type="file"
                        id="proof-upload2"
                        className="hidden"
                        onChange={handleProofUpload}
                        accept="image/* ,application/pdf"
                      />
                    </div>
                    <div>
                      <p className="xl:text-sm text-xs font-semibold text-center">
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
                  disabled={uploading}
                >
                  {uploading ? "Saving..." : "Save"}
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
