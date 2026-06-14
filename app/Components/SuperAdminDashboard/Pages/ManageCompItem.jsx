"use client";
import React, { useEffect, useState } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import DashboardHeader from "../DashboardHeader";
import { IoClose, IoFilterOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import complianceService from "@/Service/complianceDocService";
import toast from "react-hot-toast";

const itemsPerPage = 10;

const ManageCompItem = () => {
  const [complianceData, setComplianceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Stats
  const [pendingTaxCount, setPendingTaxCount] = useState(0);
  const [pendingCertCount, setPendingCertCount] = useState(0);
  const [pendingProofCount, setPendingProofCount] = useState(0);

  useEffect(() => {
    const fetchComplianceData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await complianceService.getAllCompliance();
        console.log("Compliance response:", response);
        
        if (response.success) {
          setComplianceData(response.data);
          setFilteredData(response.data);
          
          // Calculate stats
          const pendingTax = response.data.filter(item => !item.taxIdentificationNumber).length;
          const pendingCert = response.data.filter(item => !item.accreditationCertificates).length;
          const pendingProof = response.data.filter(item => !item.proofOfRegistration).length;
          
          setPendingTaxCount(pendingTax);
          setPendingCertCount(pendingCert);
          setPendingProofCount(pendingProof);
        } else {
          setError(response.message || "Failed to fetch compliance documents");
          toast.error(response.message || "Failed to fetch compliance documents");
        }
      } catch (error) {
        setError(error.message || "Failed to fetch compliance documents");
        toast.error(error.message || "Failed to fetch compliance documents");
      } finally {
        setLoading(false);
      }
    };
    fetchComplianceData();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (event) => {
    const searchTermLower = event.target.value.toLowerCase();
    setSearchTerm(searchTermLower);
    setCurrentPage(1);
    const filtered = complianceData.filter((item) => {
      return (
        (item.schoolName && item.schoolName.toLowerCase().includes(searchTermLower)) ||
        (item.taxIdentificationNumber && item.taxIdentificationNumber.toLowerCase().includes(searchTermLower)) ||
        (item.accreditationCertificates && item.accreditationCertificates.toLowerCase().includes(searchTermLower)) ||
        (item.proofOfRegistration && item.proofOfRegistration.toLowerCase().includes(searchTermLower)) ||
        (item.status && item.status.toLowerCase().includes(searchTermLower))
      );
    });
    setFilteredData(filtered);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <SuperAdminLayout>
        <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
          <DashboardHeader />
        </div>
        <div className="bg-[#D4D4D4] overflow-auto flex-1 p-4">
          <div className="text-center bg-red-200 border border-red-500 text-red-700 px-4 py-2 rounded-md">
            {error}
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 sm:pr-4 lg:pr-9 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <DashboardHeader />

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-4xl border lg:min-w-[350px] border-[#D0D0D0]">
            <input
              type="text"
              placeholder="Search Compliance Documents..."
              className="w-full outline-none bg-transparent text-[#AEAEAE] text-sm p-2 pl-5"
              value={searchTerm}
              onChange={handleSearch}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 192.904 192.904"
              width="16px"
              className="fill-[#B09A9A] stroke-[#D9D9D9] mr-4"
            >
              <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
            </svg>
          </div>
          <div>
            <IoFilterOutline size={20} />
          </div>
        </div>
      </div>
      
      <div className="bg-[#D4D4D4] overflow-auto flex-1 p-4">
        <div className="sm:flex sm:flex-col sm:gap-2 lg:grid lg:grid-cols-[3fr_1fr] overflow-auto gap-3 lg:h-screen">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse bg-[#ffffff]">
              <thead className="bg-[#E6EFF5] lg:text-sm sm:text-xs">
                <tr className="border-b-[#D0D0D0] border-b">
                  <th className="p-3 pl-10 text-left font-bold px-5 text-[#333333]">
                    School Name
                  </th>
                  <th className="p-3 text-center font-bold px-5 text-[#333333]">
                    Tax Compliance
                  </th>
                  <th className="p-3 text-center font-bold px-5 text-[#333333]">
                    Accreditation Doc
                  </th>
                  <th className="p-3 text-center font-bold px-5 text-[#333333]">
                    Proof of Reg.
                  </th>
                  <th className="p-3 text-center pr-10 font-bold px-5 text-[#333333]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className="border-b-[#D0D0D0] border-b font-semibold text-xs"
                    >
                      <td className="p-3 px-5 pl-10 text-left text-[#333333]">
                        {item.schoolName}
                      </td>

                      <td className="p-3 px-5 font-normal text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className={`${
                              item.taxIdentificationNumber
                                ? "text-[#1BB66E]"
                                : "text-[#F94144]"
                            }`}
                          >
                            {item.taxIdentificationNumber ? "Uploaded" : "Not Uploaded"}
                          </span>
                          <span
                            className={`${
                              item.taxIdentificationNumber ? "bg-[#1BB66E]" : "bg-[#F94144]"
                            } text-white text-center rounded-xs inline-flex items-center justify-center w-5 h-5`}
                          >
                            {item.taxIdentificationNumber ? <FaCheck size={12} /> : <IoClose size={12} />}
                          </span>
                        </div>
                       </td>

                      <td className="p-3 px-5 text-center font-normal">
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className={`${
                              item.accreditationCertificates
                                ? "text-[#1BB66E]"
                                : "text-[#F94144]"
                            }`}
                          >
                            {item.accreditationCertificates ? "Uploaded" : "Not Uploaded"}
                          </span>
                          <span
                            className={`${
                              item.accreditationCertificates ? "bg-[#1BB66E]" : "bg-[#F94144]"
                            } text-white text-center rounded-xs inline-flex items-center justify-center w-5 h-5`}
                          >
                            {item.accreditationCertificates ? <FaCheck size={12} /> : <IoClose size={12} />}
                          </span>
                        </div>
                      </td>

                      <td className="p-3 px-5 text-center font-normal">
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className={`${
                              item.proofOfRegistration
                                ? "text-[#1BB66E]"
                                : "text-[#F94144]"
                            }`}
                          >
                            {item.proofOfRegistration ? "Uploaded" : "Not Uploaded"}
                          </span>
                          <span
                            className={`${
                              item.proofOfRegistration ? "bg-[#1BB66E]" : "bg-[#F94144]"
                            } text-white text-center rounded-xs inline-flex items-center justify-center w-5 h-5`}
                          >
                            {item.proofOfRegistration ? <FaCheck size={12} /> : <IoClose size={12} />}
                          </span>
                        </div>
                      </td>

                      <td className="p-3 px-5 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : item.status === "Pending Approval"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No Compliance Documents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {filteredData.length > itemsPerPage && (
              <div className="flex justify-center mt-4 pb-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`mx-1 px-3 py-1 rounded-md ${
                        currentPage === number
                          ? "bg-[#4084B1] text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          <div className="grid grid-rows-3 gap-3">
            <div className="bg-[#ffffff] flex flex-col gap-9 pt-3 pb-3 pl-5 pr-5 overflow-x-auto">
              <p className="xl:text-base sm:text-sm font-bold">
                Tax Identification Number
              </p>
              <div className="text-7xl font-bold text-[#01427A]">
                {pendingTaxCount}
                <span className="text-sm ml-2 text-[#F94144]">Pending</span>
              </div>
            </div>
            <div className="bg-[#ffffff] flex flex-col gap-9 pt-3 pb-3 pl-5 pr-5 overflow-x-auto">
              <p className="xl:text-base sm:text-sm font-bold">
                Accreditation Certificate
              </p>
              <div className="text-7xl font-bold text-[#410096]">
                {pendingCertCount}
                <span className="text-sm ml-2 text-[#F94144]">Pending</span>
              </div>
            </div>
            <div className="bg-[#ffffff] flex flex-col gap-9 pt-3 pb-3 pl-5 pr-5 overflow-x-auto">
              <p className="xl:text-base sm:text-sm font-bold">
                Proof of Registration
              </p>
              <div className="text-7xl font-bold text-[#F94144]">
                {pendingProofCount}
                <span className="text-sm ml-2 text-[#F94144]">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default ManageCompItem;