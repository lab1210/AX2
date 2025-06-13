"use client";
import React, { useEffect, useState, useRef } from "react";
import Layout from "../../Studentlayout";
import { getUserDetails } from "../../../Service/AuthService";
import { MdOutlineCameraAlt } from "react-icons/md";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local URL for the selected image
      const imageUrl = URL.createObjectURL(file);

      // Update the user state with the new image URL
      setUser((prev) => ({
        ...prev,
        student: {
          ...prev.student,
          profile_picture_path: imageUrl,
        },
      }));
    }
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
  useEffect(() => {
    const userData = getUserDetails();
    setUser(userData);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-full z-[1000]">
        <div className="border-4 border-[rgba(0,64,128,1)] border-t-[rgba(249,65,68,1)] rounded-full w-[50px] h-[50px] animate-spin"></div>
      </div>
    );
  }

  return (
    <Layout>
      {/* Desktop View */}
      <div className="hidden lg:block xl:fixed xl:w-[64%]">
        <div className="min-h-screen bg-[#D9D9D9] rounded-lg p-4 md:p-8 flex flex-col space-y-6">
          <div className="bg-white flex items-center rounded-lg p-6 ">
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-22 h-19 rounded-full overflow-hidden relative cursor-pointer"
                onClick={handleImageClick}
              >
                <img
                  src={
                    user.student.profile_picture_path === null
                      ? "/female.png"
                      : user.student.profile_picture_path
                  }
                  alt="Avatar"
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 bg-black/50 w-full">
                  <MdOutlineCameraAlt className="ml-9 mb-1 mt-1" size={18} />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <h2 className="max-w-50 text-xl md:text-2xl font-bold text-gray-800">
                {user?.student?.first_name + " " + user?.student?.last_name}
              </h2>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-lg shadow p-6 pt-4 pb-4">
            <h3 className="font-semibold text-[#808080] mb-2">Details</h3>
            <div className="grid grid-row gap-2 text-md text-gray-700">
              <p>
                <span className="font-bold">Class: </span>
              </p>
              <p>
                <span className="font-bold">Student ID:</span> {user.id}
              </p>
              <p>
                <span className="font-bold">Gender:</span>
              </p>
              <p>
                <span className="font-bold">Class teacher:</span>{" "}
              </p>
              <p>
                <span className="font-bold">Status:</span>
              </p>
            </div>
          </div>

          {/* Registered Subjects Card */}
          <div className="bg-white rounded-lg shadow p-6 pt-4 pb-6">
            <p className=" text-[#808080] mb-2 font-semibold max-w-90">
              {registeredSubjects.length} Registered Subjects for 1st Term
              2023/2024 Session
            </p>
            <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-800 max-w-90 pl-5">
              {registeredSubjects.map((subj, idx) => (
                <p key={idx}>{subj}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden bg-[#D9D9D9] p-2">
        <div className="bg-white rounded-md p-4 flex flex-col items-center mb-4">
          <div
            className="w-24 h-24 rounded-full overflow-hidden mb-2 relative cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              src={
                user.student.profile_picture_path === null
                  ? "/female.png"
                  : user.student.profile_picture_path
              }
              alt="Avatar"
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 bg-black/50 w-full">
              <MdOutlineCameraAlt className="text-white mx-auto mb-1 mt-1" size={18} />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-1 text-center">
            {user?.student?.first_name + " " + user?.student?.last_name}
          </h2>
          <p className="text-sm text-gray-600 text-center"></p>
        </div>

        {/* Details */}
        <div className="bg-white rounded-md shadow p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Details</h3>
          <div className="flex flex-col gap-2 text-md text-gray-700">
            <p>
              <span className="font-bold">Student ID:</span> {user.id}
            </p>
            <p>
              <span className="font-bold">Gender:</span>
            </p>
            <p>
              <span className="font-bold">Class teacher:</span>{" "}
            </p>
            <p>
              <span className="font-bold">Status:</span>
            </p>
          </div>
        </div>

        {/* Registered Subjects Card */}
        <div className="bg-white rounded-md shadow p-4">
          <p className="text-sm text-gray-400 mb-2 font-medium">
            {registeredSubjects.length} Registered Subjects
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-800">
            {registeredSubjects.map((subj, idx) => (
              <p key={idx}>{subj}</p>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
