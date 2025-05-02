import React from "react";

const SchoolAdminLeft = () => {
  return (
    <div className="h-full w-full grid grid-rows-[100px_1fr_auto] pt-8">
      <div className="flex flex-col items-center gap-2 w-full h-full  ">
        <div className="object-contain max-w-[50px] max-h-[50px]">
          <img className="w-full h-full" src={"/logo.svg"} alt="logo" />
        </div>
        <div className="text-white ">
          <p className="font-bold">Foursquare</p>
          <p className="font-bold">Student Portal</p>
        </div>
      </div>
      <div>stuff</div>
      <div className="flex justify-center">
        <div className="object-contain  max-w-[100px] max-h-[65px] pb-2">
          <img src="/whitelogo.png" alt="" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminLeft;
