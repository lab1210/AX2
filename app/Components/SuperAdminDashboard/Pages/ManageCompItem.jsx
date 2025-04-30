"use client";
import React, { useEffect, useState } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import DashboardHeader from "../DashboardHeader";
import { IoClose, IoFilterOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { getComplianceDocs } from "../../../Service/complianceDocService";

const itemsPerPage = 7; // You can adjust this value

const ManageCompItem = () => {
  const [complianceData, setComplianceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchComplianceData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getComplianceDocs();
        setComplianceData(data);
        setFilteredData(data);
      } catch (error) {
        setError(error.message || "Failed to fetch compliance documents");
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
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    setCurrentPage(1);
    const filtered = complianceData.filter((item) => {
      return (
        item.school_name.toLowerCase().includes(searchTerm) ||
        item.tax_identification_number.toLowerCase().includes(searchTerm) ||
        item.accreditation_certificates.toLowerCase().includes(searchTerm) ||
        item.proof_of_registration.toLowerCase().includes(searchTerm) ||
        (item.uploaded_on &&
          item.uploaded_on.toLowerCase().includes(searchTerm)) // Check if uploaded_on exists before toLowerCase()
      );
    });
    setFilteredData(filtered);
  };

  if (loading) {
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="w-12 h-12 border-4 border-blue-900 border-t-red-500 rounded-full animate-spin"></div>
    </div>;
  }
  if (error) {
    return (
      <div className="text-center bg-red-200 border border-red-500 text-red-700 px-4 py-2 rounded-md z-50">
        {error}
      </div>
    );
  }
  return (
    <SuperAdminLayout>
      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 sm:pr-4 lg:pr-9 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <DashboardHeader />

        <div className="flex items-center gap-4 ">
          <div className="flex items-center rounded-4xl border lg:min-w-[350px]  border-[#D0D0D0] ">
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
        <div className="sm:flex sm:flex-col sm:gap-2 lg:grid lg:grid-cols-[3fr_1fr] overflow-auto  gap-3 lg:h-screen ">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse bg-[#ffffff]">
              <thead className="bg-[#E6EFF5] lg:text-sm sm:text-xs">
                <tr className="border-b-[#D0D0D0] border-b">
                  <th className="p-3 text-left font-bold px-5 text-[#333333]">
                    School Name
                  </th>
                  <th className="p-3 text-left font-bold px-5 text-[#333333]">
                    Tax Compliance
                  </th>
                  <th className="p-3 text-left font-bold px-5 text-[#333333]">
                    Accredition Doc
                  </th>
                  <th className="p-3 text-left font-bold px-5 text-[#333333]">
                    Proof of Reg.
                  </th>
                  <th className="p-3 text-left font-bold px-5 text-[#333333]">
                    Uploaded on
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b-[#D0D0D0] border-b font-semibold text-xs cursor-pointer "
                    >
                      <td className="p-3 px-5 text-[#333333]">
                        {item.school_name}
                      </td>

                      <td className="p-3 px-5 font-normal ">
                        <div className="flex items-center gap-2">
                          <span
                            className={`${
                              item.tax_identification_number !== ""
                                ? " text-[#1BB66E] "
                                : " text-[#F94144] "
                            }  `}
                          >
                            {item.tax_identification_number !== ""
                              ? " Uploaded"
                              : "Unuploaded"}
                          </span>
                          <span
                            className={`${
                              item.tax_identification_number !== ""
                                ? " bg-[#1BB66E]"
                                : " bg-[#F94144]"
                            }  text-white text-center rounded-xs`}
                          >
                            {item.tax_identification_number !== "" ? (
                              <FaCheck />
                            ) : (
                              <IoClose />
                            )}
                          </span>
                        </div>
                      </td>

                      <td className="p-3  px-5  font-normal">
                        <div className="flex items-center gap-2">
                          <span
                            className={`${
                              item.accreditation_certificates !== ""
                                ? " text-[#1BB66E] "
                                : " text-[#F94144] "
                            }  `}
                          >
                            {item.accreditation_certificates !== ""
                              ? "Uploaded"
                              : "Unuploaded"}
                          </span>
                          <span
                            className={`${
                              item.accreditation_certificates !== ""
                                ? " bg-[#1BB66E]"
                                : " bg-[#F94144]"
                            } text-white text-center rounded-xs`}
                          >
                            {item.accreditation_certificates !== "" ? (
                              <FaCheck />
                            ) : (
                              <IoClose />
                            )}
                          </span>
                        </div>
                      </td>

                      <td className="font-normal p-3 px-5  flex items-center gap-2">
                        <span
                          className={`${
                            item.proof_of_registration !== ""
                              ? " text-[#1BB66E] "
                              : " text-[#F94144] "
                          }  `}
                        >
                          {item.proof_of_registration !== ""
                            ? "Uploaded"
                            : "Unuploaded"}
                        </span>
                        <span
                          className={`${
                            item.proof_of_registration !== ""
                              ? " bg-[#1BB66E]"
                              : " bg-[#F94144]"
                          }  text-white text-center rounded-xs`}
                        >
                          {item.proof_of_registration !== "" ? (
                            <FaCheck />
                          ) : (
                            <IoClose />
                          )}
                        </span>
                      </td>

                      <td className="p-3 px-5 text-[#333333]">
                        {!item.uploaded_on ? "N/A" : item.uploaded_on}
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
            <div className="bg-[#ffffff] flex flex-col gap-9   pt-3 pb-3 pl-5 pr-5 overflow-x-auto">
              <p className="xl:text-base sm:text-sm font-bold">
                Tax Identification Number
              </p>
              <div className=" text-7xl font-bold text-[#01427A] ">
                24
                <span className="text-sm ml-2 text-[#F94144]">Pending</span>
              </div>
            </div>
            <div className="bg-[#ffffff] flex flex-col gap-9  pt-3 pb-3 pl-5 pr-5 overflow-x-auto">
              <p className="xl:text-base sm:text-sm font-bold">
                Accreditation Certificate
              </p>
              <div className=" text-7xl font-bold text-[#410096] ">
                0<span className="text-sm ml-2 text-[#F94144]">Pending</span>
              </div>
            </div>
            <div className="bg-[#ffffff] flex flex-col gap-9  pt-3 pb-3 pl-5 pr-5 overflow-x-auto">
              <p className="xl:text-base sm:text-sm font-bold">
                Proof of Registration
              </p>
              <div className=" text-7xl font-bold text-[#F94144] ">
                24<span className="text-sm ml-2 text-[#F94144]">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default ManageCompItem;
