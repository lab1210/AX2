"use client";
import React from "react";
import Layout from "../../Studentlayout";
import { useUser } from "../context/UserProvider";

export default function ProfilePage() {
    const {isLoading } = useUser();
    
  // Example user data
  const user = {
    avatar: "/female.png", 
    name: "Ife Babalola Adesina",
    className: "SSS 1B",
    studentId: "001",
    gender: "Female",
    classTeacher: "Mr Damilola Adesuwa",
    status: "Art Student",
  };

  // Example subjects
  const registeredSubjects = [
    "Data Processing",
    "Mathematics",
    "English Language",
    "Basic Science",
    "Creative Arts",
    "Business Studies",
    "Agricultural Science",
    "Civic Education",
  ];

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-full z-[1000]">
        <div className="border-4 border-[rgba(0,64,128,1)] border-t-[rgba(249,65,68,1)] rounded-full w-[50px] h-[50px] animate-spin"></div>
      </div>
    );
  }

  return (
    <Layout>
    <div className="min-h-screen bg-[#D9D9D9] p-4 md:p-8 flex flex-col space-y-6">
      <div className="bg-white flex items-center rounded-md p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src={user.avatar}
              alt="Avatar"
              className="object-cover w-full h-full"
            />
          </div>
          <h2 className="max-w-50 text-xl md:text-2xl font-bold text-gray-800">
            {user.name}
          </h2>
        </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-md shadow p-6 md:p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Details</h3>
        <div className="grid grid-row gap-2 text-md text-gray-700 mb-4">
          <p>
            <span className="font-bold">Class:</span> {user.className}
          </p>
          <p>
            <span className="font-bold">Student ID:</span> {user.studentId}
          </p>
          <p>
            <span className="font-bold">Gender:</span> {user.gender}
          </p>
          <p>
            <span className="font-bold">Class teacher:</span> {user.classTeacher}
          </p>
          <p>
            <span className="font-bold">Status:</span> {user.status}
          </p>
        </div>
        </div>

      {/* Registered Subjects Card */}
      <div className="bg-white rounded-md shadow p-6 md:p-8">
        <p className="text-sm text-gray-400 mb-2 font-medium">
          {registeredSubjects.length} Registered Subjects for 1st Term 2023/2024 Session
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-800">
          {registeredSubjects.map((subj, idx) => (
            <p key={idx}>{subj}</p>
          ))}
        </div>
      </div>
    </div>
    </Layout>
  );
}
