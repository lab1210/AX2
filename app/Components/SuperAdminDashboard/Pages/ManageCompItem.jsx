import React from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import DashboardHeader from "../DashboardHeader";
import { IoClose, IoFilterOutline } from "react-icons/io5";
import compliance from "../../compliance";
import { FaCheck } from "react-icons/fa6";
const ManageCompItem = () => {
  return (
    <SuperAdminLayout>
      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 sm:pr-4 lg:pr-9 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <DashboardHeader />

        <div className="flex items-center gap-4 ">
          <div className="flex items-center rounded-4xl border lg:min-w-[350px]  border-[#978F8F] ">
            <input
              type="text"
              placeholder="Search School"
              className="w-full outline-none bg-transparent text-[#AEAEAE] text-sm p-2 pl-5"
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
          <div className="bg-[#ffffff] overflow-x-auto ">
            <table className="min-w-full table-auto">
              <thead className="bg-[#E6EFF5] lg:text-sm sm:text-xs">
                <tr className="border-b-[#978F8F] border-b">
                  <th className="p-3 text-left font-bold text-[#333333]">
                    School Name
                  </th>
                  <th className="p-3 text-left font-bold text-[#333333]">
                    Tax Compliance
                  </th>
                  <th className="p-3 text-left font-bold text-[#333333]">
                    Accredition Doc
                  </th>
                  <th className="p-3 text-left font-bold text-[#333333]">
                    Proof of Reg.
                  </th>
                  <th className="p-3 text-left font-bold text-[#333333]">
                    Uploaded on
                  </th>
                </tr>
              </thead>
              <tbody>
                {compliance.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="border-b-[#978F8F] border-b font-semibold text-xs cursor-pointer "
                    >
                      <td className="p-3 text-[#333333]">{item.SchoolName}</td>

                      <td className="xl:p-3 sm:p-8 ">
                        <div className="flex items-center gap-2">
                          <span
                            className={`${
                              item.TaxCompliance === "Uploaded"
                                ? " text-[#1BB66E] "
                                : " text-[#F94144] "
                            } font-bold `}
                          >
                            {item.TaxCompliance}
                          </span>
                          <span
                            className={`${
                              item.TaxCompliance === "Uploaded"
                                ? " bg-[#1BB66E]"
                                : " bg-[#F94144]"
                            } font-bold text-white text-center rounded-xs`}
                          >
                            {item.TaxCompliance === "Uploaded" ? (
                              <FaCheck />
                            ) : (
                              <IoClose />
                            )}
                          </span>
                        </div>
                      </td>

                      <td className="xl:p-3 sm:p-8 ">
                        <div className="flex items-center gap-2">
                          <span
                            className={`${
                              item.AccreditionDoc === "Uploaded"
                                ? " text-[#1BB66E] "
                                : " text-[#F94144] "
                            } font-bold `}
                          >
                            {item.AccreditionDoc}
                          </span>
                          <span
                            className={`${
                              item.AccreditionDoc === "Uploaded"
                                ? " bg-[#1BB66E]"
                                : " bg-[#F94144]"
                            } font-bold text-white text-center rounded-xs`}
                          >
                            {item.AccreditionDoc === "Uploaded" ? (
                              <FaCheck />
                            ) : (
                              <IoClose />
                            )}
                          </span>
                        </div>
                      </td>

                      <td className="xl:p-3 sm:p-8 flex items-center gap-2">
                        <span
                          className={`${
                            item.ProofOfReg === "Uploaded"
                              ? " text-[#1BB66E] "
                              : " text-[#F94144] "
                          } font-bold `}
                        >
                          {item.ProofOfReg}
                        </span>
                        <span
                          className={`${
                            item.ProofOfReg === "Uploaded"
                              ? " bg-[#1BB66E]"
                              : " bg-[#F94144]"
                          } font-bold text-white text-center rounded-xs`}
                        >
                          {item.ProofOfReg === "Uploaded" ? (
                            <FaCheck />
                          ) : (
                            <IoClose />
                          )}
                        </span>
                      </td>

                      <td className="p-3 text-[#333333]">{item.UploadedOn}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
