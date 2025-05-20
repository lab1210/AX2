"use client";
import React, { useState } from "react";
import SchoolAdminLayout from "../SchoolAdminLayout";
import RightSide from "../RightSide";
import DepartmentSettings from "../DepartmentSettings";
import SubjectSettings from "../SubjectSettings";

const SubjectDepartment = () => {
  const [activeTab, setActiveTab] = useState("Department");

  return (
    <SchoolAdminLayout>
      <div className="lg:grid lg:grid-cols-[1fr_270px] flex flex-col sm:gap-6 lg:gap-0 bg-[#EEEEEE] lg:h-full pt-3 pl-2 pr-1 lg:pb-0 pb-3 overflow-y-auto">
        <div className="bg-white h-full mr-2 overflow-y-auto no-scrollbar sm:pb-3 lg:pb-0 ">
          <div className="pt-3 text-sm flex items-center gap-28 pl-20 ">
            {["Department", "Subject"].map((tab) => (
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
                  <span className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-16 h-0.5 bg-[#96B1CB] rounded-full"></span>
                )}
              </button>
            ))}
          </div>
          <hr className="mt-1.5" />
          {activeTab === "Department" && <DepartmentSettings />}
          {activeTab === "Subject" && <SubjectSettings />}
        </div>
        <div className="h-full overflow-hidden">
          <RightSide />
        </div>
      </div>
    </SchoolAdminLayout>
  );
};

export default SubjectDepartment;
