"use client";
import React, { useState } from "react";
import SchoolAdminLayout from "../SchoolAdminLayout";
import RightSide from "../RightSide";
import NotificationPage from "../NotificationPage";

const Notification = () => {
  return (
    <SchoolAdminLayout>
      <div className="lg:grid lg:grid-cols-[1fr_270px] flex flex-col sm:gap-6 lg:gap-0 bg-[#F9FAFE] lg:h-full  pt-3 pl-2 pr-1 lg:pb-0 pb-3 overflow-y-auto">
        <div className="bg-white sm:pb-3 lg:pb-0 h-full mr-2 overflow-y-auto no-scrollbar">
          <NotificationPage />
        </div>
        <div className="h-full overflow-hidden">
          <RightSide />
        </div>
      </div>
    </SchoolAdminLayout>
  );
};

export default Notification;
