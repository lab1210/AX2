"use client";

import React, { useState } from "react";
import SchoolAdminLayout from "../SchoolAdminLayout";
import RightSide from "../RightSide";
import MainClassSettings from "../MainClassSettings";
import ClassArm from "../ClassArm";
import ClassMgt from "../ClassMgt";

const ClassSettings = () => {
  const [activeTab, setActiveTab] = useState("Class Management");

  return (
    <SchoolAdminLayout>
      <div className="grid grid-cols-[1fr_270px] bg-[#EEEEEE] h-full pt-3 pl-2 pr-1 overflow-hidden">
        <div className="bg-white h-full mr-2 overflow-y-auto no-scrollbar">
          <div className="pt-3 text-sm flex gap-14 pl-6 pr-2">
            {["Class Management", "Class Arm", "Classroom Management"].map(
              (tab) => (
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
              )
            )}
          </div>
          <hr className="mt-1.5" />
          {activeTab === "Class Management" && <MainClassSettings />}
          {activeTab === "Class Arm" && <ClassArm />}
          {activeTab === "Classroom Management" && <ClassMgt />}
        </div>
        <div className="h-full overflow-hidden">
          <RightSide />
        </div>
      </div>
    </SchoolAdminLayout>
  );
};

export default ClassSettings;
