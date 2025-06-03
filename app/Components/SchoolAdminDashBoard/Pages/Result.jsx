"use client";
import React, { useState } from "react";
import SchoolAdminLayout from "../SchoolAdminLayout";
import RightSide from "../RightSide";
import ResultSettings from "../Result-Settings";
import GradingandScore from "../GradingandScore";
import ViewStudentResult from "../ViewStudentResult";
import Broadsheet from "../BroadSheet";

const Results = () => {
  const [activeTab, setActiveTab] = useState("Result Setting");

  return (
    <SchoolAdminLayout>
      <div className="w-full h-full flex flex-col bg-[#EEEEEE] pt-3 pl-2 pr-1 pb-3 overflow-hidden">
        {/* Tabs section – fixed, no scroll */}
        <div className="bg-white mr-2 pb-2">
          <div className="pt-3 xl:text-sm text-xs flex xl:gap-10 gap-5 pl-6 whitespace-nowrap overflow-hidden">
            {[
              "Result Setting",
              "Grading & Score Computation",
              "View Student's Result",
              "Broadsheet",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative pb-1 text-center cursor-pointer"
              >
                <span
                  className={`${
                    activeTab === tab ? "text-[#000000]" : "text-[#A6A6A6]"
                  }`}
                >
                  {tab}
                </span>
                {activeTab === tab && (
                  <span className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-16 h-0.5 bg-[#96B1CB] rounded-full mb-1.5" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content section – scrollable vertically */}
        <div className="mt-2 flex-1 overflow-y-auto min-h-0">
          {activeTab === "Result Setting" && <ResultSettings />}
          {activeTab === "Grading & Score Computation" && <GradingandScore />}
          {activeTab === "View Student's Result" && <ViewStudentResult />}
          {activeTab === "Broadsheet" && <Broadsheet />}
        </div>
      </div>
    </SchoolAdminLayout>
  );
};

export default Results;
