"use client";
import React, { useEffect, useState } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import DashboardHeader from "../DashboardHeader";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LuUpload } from "react-icons/lu";
import UploadProgress from "./UploadProgress";
import complianceService from "@/Service/complianceDocService";
import schoolService from "@/Service/schoolService";
import Dropdown2 from "@/Components/SchoolAdminDashBoard/DropDown2";
import toast from "react-hot-toast";

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
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [loadingSchools, setLoadingSchools] = useState(false);

  // Fetch schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoadingSchools(true);
        const response = await schoolService.getAllSchools();
        console.log("Schools response:", response);
        
        if (response.success && response.data) {
          const formattedSchools = response.data.map((school) => ({
            id: school.id,
            label: school.schoolName,
            value: school.id,
          }));
          setSchools(formattedSchools);
        } else {
          toast.error("Failed to load schools");
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
        toast.error("Failed to load schools");
      } finally {
        setLoadingSchools(false);
      }
    };

    fetchSchools();
  }, []);

  const handleCertificateUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCertificateFile(file);
      setCertificatePreview(URL.createObjectURL(file));
    } else {
      setCertificateFile(null);
      setCertificatePreview("/note.svg");
    }
  };

  const handleProofUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    } else {
      setProofFile(null);
      setProofPreview("/note.svg");
    }
  };

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
  };

  const handleSave = async () => {
    if (!taxIdNumber || !certificateFile || !proofFile || !selectedSchool) {
      toast.error("Please fill all required fields including school selection");
      return;
    }
    setUploading(true);

    // Upload files to some storage service first (if needed)
    // For now, we'll send URLs or base64 strings
    // This assumes your backend expects URLs or base64 strings
    const certificateUrl = certificatePreview;
    const proofUrl = proofPreview;

    const complianceData = {
      schoolId: selectedSchool.id,
      taxIdentificationNumber: taxIdNumber,
      accreditationCertificates: certificateUrl,
      proofOfRegistration: proofUrl,
    };

    console.log("Sending compliance data:", complianceData);

    try {
      const response = await complianceService.createCompliance(complianceData);
      console.log("Compliance upload response:", response);
      
      if (response.success) {
        setSaved(true);
        toast.success("Compliance document uploaded successfully");
      } else {
        toast.error(response.message || "Failed to upload compliance document");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to upload compliance document";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

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

      {saved ? (
        <UploadProgress setSaved={setSaved} />
      ) : (
        <div className="bg-[#D4D4D4] overflow-auto h-screen p-4">
          <div className="sm:flex sm:flex-col sm:gap-2 lg:grid lg:grid-cols-[1.5fr_1fr] overflow-auto lg:gap-4 lg:h-screen">
            <div className="bg-[#ffffff] rounded-md no-scrollbar p-6 flex flex-col gap-6">
              {/* School Dropdown */}
              <div className="flex flex-col gap-1.5 mb-2">
                <label className="text-[#808080] font-semibold" htmlFor="school">
                  School <span className="text-red-500">*</span>
                </label>
                <Dropdown2
                  label={loadingSchools ? "Loading schools..." : (selectedSchool?.label || "Select School")}
                  items={schools.map((school) => ({
                    label: school.label,
                    onClick: () => handleSchoolSelect(school),
                  }))}
                />
              </div>

              <div className="flex flex-col gap-1.5 mb-2">
                <label className="text-[#808080] font-semibold" htmlFor="taxId">
                  Tax Identification Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={taxIdNumber}
                  onChange={(e) => setTaxIdNumber(e.target.value)}
                  className="text-base text-[#808080] focus:outline-none sm:text-sm border-2 p-2 border-[#07508F] placeholder:text-[#d4d4d4]"
                  placeholder="Enter Identification Number"
                />
              </div>

              <div className="flex flex-col gap-1.5 mb-2 flex-grow">
                <p className="font-bold text-xl">Accreditation Certificates</p>
                <div className="mt-2 bg-[#E4E4E4] flex-grow border-dashed border-[1.5px] border-[#333333] flex items-center flex-col justify-center">
                  <div className="w-12 h-12 mb-2">
                    <img className="w-full h-full" src={certificatePreview} alt="icon" />
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
                      Upload Accreditation Certificate as an Image or PDF
                    </p>
                  </div>
                  <button
                    onClick={() => document.getElementById("certificate-upload").click()}
                    className="text-[#07508F] border-[1.5px] rounded-lg cursor-pointer mt-5 border-[#07508F] border-dashed p-2 flex items-center justify-center gap-2"
                  >
                    Upload File
                    <span>
                      <LuUpload size={20} />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#ffffff] rounded-md no-scrollbar p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-1.5 mb-2 flex-grow">
                <p className="font-bold text-xl">Proof of Registration</p>
                <div className="mt-6 bg-[#E4E4E4] flex-grow border-dashed border-[1.5px] border-[#333333] flex items-center flex-col justify-center">
                  <div className="w-12 h-12 mb-2">
                    <img className="w-full h-full" src={proofPreview} alt="icon" />
                    <input
                      type="file"
                      id="proof-upload2"
                      className="hidden"
                      onChange={handleProofUpload}
                      accept="image/*, application/pdf"
                    />
                  </div>
                  <div>
                    <p className="xl:text-sm text-xs font-semibold text-center">
                      Upload Proof of Registration Doc as an Image or PDF
                    </p>
                  </div>
                  <button
                    onClick={() => document.getElementById("proof-upload2").click()}
                    className="text-[#07508F] border-[1.5px] rounded-lg cursor-pointer mt-5 border-[#07508F] border-dashed p-2 flex items-center justify-center gap-2"
                  >
                    Upload File
                    <span>
                      <LuUpload size={20} />
                    </span>
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="bg-[#80A0BC] text-white p-2 pl-8 pr-8 rounded-lg cursor-pointer hover:bg-[#07508F] transition-colors"
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