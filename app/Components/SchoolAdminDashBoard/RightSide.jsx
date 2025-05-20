import React from "react";
import { IoInformationCircle } from "react-icons/io5";
import BasicPie from "./Piechart";
const RightSide = () => {
  return (
    <div className="flex lg:flex-col h-full gap-2">
      <div className="flex-1  bg-white rounded-lg shadow shadow-gray-500 w-full p-3 pt-7">
        <p className="font-bold text-[#F94144] text-lg ">Notice</p>
        <ul className="list-disc pl-4 ">
          <li className="marker:text-[#F94144] marker:text-lg text-sm xl:text-[0.8rem]">
            Attendance for 06/10/23 has not been uploaded and is past the due
            date
          </li>
          <li className="marker:text-[#F94144] marker:text-lg text-sm xl:text-[0.8rem]">
            JSS 1A students offering English Language might not be eligible for
            exams
          </li>
          <li className="marker:text-[#F94144] marker:text-lg text-sm xl:text-[0.8rem]">
            JSS 2B students offering Literature in English might not be eligible
            for exams
          </li>
        </ul>
      </div>
      <div className="flex-1 bg-white rounded-lg pt-5  shadow shadow-gray-500 w-full mb-2 text-center p-3">
        <p className=" font-bold flex items-center justify-center gap-3">
          Attendance Statistics{" "}
          <span className="text-[#BDBDBD]">
            <IoInformationCircle size={20} />
          </span>
        </p>
        <hr className="border border-[#F0F0F0] mt-4 mx-auto max-w-40" />
        <BasicPie />
      </div>
    </div>
  );
};

export default RightSide;
