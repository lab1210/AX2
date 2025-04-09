"use client";
import React, { useState } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import DashboardHeader from "../DashboardHeader";
import { RiEqualizerLine } from "react-icons/ri";
import Subscribe from "../../Subscribtion";
import { FiEdit3 } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
const MonitorSubscribtionItem = () => {
  // State to track selected school
  const [selectedSchoolSubscribe, setSelectedSchoolSubscribe] = useState(null);

  const [modalTransform, setModalTransform] = useState("translateX(-100%)");
  const [modalOpacity, setModalOpacity] = useState(0);

  // Function to open modal
  const openModal = (school) => {
    setSelectedSchoolSubscribe(school);
    setTimeout(() => {
      setModalTransform("translateX(0)");
      setModalOpacity(1);
    }, 0);
  };

  // Function to close modal
  const closeModal = () => {
    setModalTransform("translateX(-100%)");
    setModalOpacity(0);
    setTimeout(() => {
      setSelectedSchoolSubscribe(null);
    }, 300);
  };
  return (
    <SuperAdminLayout>
      {selectedSchoolSubscribe && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeModal}
          ></div>
          <div
            className="relative bg-white  rounded-md shadow-lg  z-50 transition-transform min-w-110 duration-600 ease-in-out"
            style={{ transform: modalTransform, opacity: modalOpacity }}
          >
            <div className="flex justify-end pt-5 pr-5">
              <span onClick={closeModal} className="cursor-pointer">
                <IoClose size={20} />
              </span>
            </div>
            <div className="text-center font-bold text-gray-400]">
              <p>SUBSCRIPTION PLAN</p>
            </div>
            <form className="flex flex-col  mt-5 pl-10 pr-10 gap-2">
              <div className="flex justify-between  font-semibold text-[#AEAEAE]">
                <p>Amount Per Student:</p>
                <input
                  type="text"
                  className=" text-sm  text-center pl-2 pr-2  focus:outline-none  border-[2px]  border-[#d4d4d4]  "
                  defaultValue={selectedSchoolSubscribe.AmountPerStudent}
                />
              </div>
              <div className="flex justify-between  font-semibold ">
                <p className="text-[#01427A]">Amount Paid:</p>
                <input
                  type="text"
                  className="text-[#AEAEAE] text-sm  text-center pl-2 pr-2  focus:outline-none  border-[2px]  border-[#d4d4d4]  "
                  defaultValue={selectedSchoolSubscribe.AmountPaid}
                />
              </div>

              <div className="flex justify-between  font-semibold ">
                <p className="text-[#01427A]">Expired Date:</p>
                <input
                  type="text"
                  className="text-[#AEAEAE] text-sm  text-center pl-2 pr-2  focus:outline-none  border-[2px]  border-[#d4d4d4]  "
                  defaultValue={selectedSchoolSubscribe.Expire}
                />
              </div>
              <div className="pb-10 pt-5">
                <button className="text-white rounded-md pt-1 cursor-pointer pb-1 bg-[#4084B1] w-full">
                  {" "}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
            <RiEqualizerLine size={20} />
          </div>
        </div>
      </div>
      <div className="bg-[#D4D4D4] overflow-auto flex-1 p-4">
        <div className="bg-[#ffffff] rounded-lg overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-[#E6EFF5] lg:text-sm sm:text-xs">
              <tr className="border-b-[#978F8F] border-b">
                <th className="pt-3 pb-3 pl-12 text-left font-bold text-[#333333]">
                  School Name
                </th>
                <th className="pt-3 pb-3  text-left font-bold text-[#333333]">
                  No of Students
                </th>
                <th className="pt-3 pb-3  text-left font-bold text-[#333333]">
                  Amount per Student
                </th>
                <th className="pt-3 pb-3  text-left font-bold text-[#333333]">
                  Amount Expected
                </th>
                <th className="pt-3 pb-3  text-left font-bold text-[#333333]">
                  Amount Paid
                </th>
                <th className="pt-3 pb-3  text-left font-bold text-[#333333]">
                  Start Date
                </th>
                <th className="pt-3 pb-3  text-left font-bold text-[#333333]">
                  Expiring Date
                </th>
                <th className="pt-3 pb-3  text-left font-bold text-[#333333]">
                  Status
                </th>
                <th className="pt-3 pb-3  text-left font-bold text-[#333333]">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody>
              {Subscribe.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className="border-b-[#978F8F] border-b font-semibold text-xs cursor-pointer "
                  >
                    <td className="pt-2 pb-2 pl-12 text-[#333333]">
                      {item.SchoolName}
                    </td>
                    <td className="pt-2 pb-2 text-[#333333]">
                      {item.NoOfStudents}
                    </td>
                    <td className="pt-2 pb-2 text-[#333333]">
                      {"N" + item.AmountPerStudent}
                    </td>
                    <td className="pt-2 pb-2 text-[#333333]">
                      {"N" + item.AmountExpected}
                    </td>
                    <td className="pt-2 pb-2 text-[#333333]">
                      {"N" + item.AmountPaid}
                    </td>
                    <td className="pt-2 pb-2 text-[#333333]">
                      {item.StartDate}
                    </td>
                    <td className="pt-2 pb-2 text-[#333333]">{item.Expire}</td>

                    <td className="pt-2 pb-2 flex items-center  gap-2">
                      <span
                        className={`${
                          item.Status === "Active"
                            ? " text-[#1BB66E] "
                            : " text-[#F94144] "
                        } font-bold `}
                      >
                        {item.Status}
                      </span>
                      <span
                        className={`${
                          item.Status === "Active"
                            ? " bg-[#1BB66E]"
                            : " bg-[#F94144]"
                        } font-bold text-white text-center rounded-xs`}
                      >
                        {item.Status === "Active" ? <FaCheck /> : <IoClose />}
                      </span>
                    </td>
                    <td className="pt-2 pb-2 pr-8 pl-5 text-[#333333]">
                      <div className="flex gap-4">
                        <FiEdit3
                          className="text-[#80ADCB] cursor-pointer"
                          size={15}
                          onClick={() => openModal(item)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default MonitorSubscribtionItem;
