"use client";
import React, { useState } from "react";
import Layout from "../../../Components/Studentlayout";
import { useUser } from "../context/UserProvider";
import { useRouter } from "next/navigation";

export default function SubjectRegistrationPage() {
  const [classYear, setClassYear] = useState("");
  const [classArm, setClassArm] = useState("");
  const [department, setDepartment] = useState("");
  const { user, isLoading } = useUser();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!classYear || !classArm || !department) return;

    console.log("Class Year:", classYear, "Class Arm:", classArm, "Department:", department);
    router.push("/Student/Subject-Registration/Confirm");
  };

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-full z-[1000]">
        <div className="border-4 border-[rgba(0,64,128,1)] border-t-[rgba(249,65,68,1)] rounded-full w-[50px] h-[50px] animate-spin"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="h-screen flex justify-center bg-[#b4b4b4] p-6 rounded-xl">
        <div className="w-full max-w-4xl rounded-md p-6 md:p-10">
          <h1 className="text-lg lg:text-2xl font-bold text-black mb-5 bg-white p-4 rounded-lg">
            Register Class Year and Class Arm
          </h1>
          <div className="bg-white rounded-md shadow-lg p-6 md:p-8">
            <h2 className="text-md lg:text-lg font-semibold text-[#999999] mb-4 text-center">
              Select Class Year and Class Arm to Proceed to Subject Registration
            </h2>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-4">
              <div>
                <select
                  id="classYear"
                  value={classYear}
                  onChange={(e) => setClassYear(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 outline-none"
                  required
                >
                  <option value="">Select Class Year</option>
                  <option value="JSS1">JSS1</option>
                  <option value="JSS2">JSS2</option>
                  <option value="JSS3">JSS3</option>
                  <option value="SS1">SS1</option>
                  <option value="SS2">SS2</option>
                  <option value="SS3">SS3</option>
                </select>
              </div>

              {/* Class Arm */}
              <div>
                <select
                  id="classArm"
                  value={classArm}
                  onChange={(e) => setClassArm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 outline-none"
                  required
                >
                  <option value="">Select Class Arm</option>
                  <option value="A">Arm A</option>
                  <option value="B">Arm B</option>
                  <option value="C">Arm C</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 outline-none"
                  required
                >
                  <option value="">Department</option>
                  <option value="Science">Science</option>
                  <option value="Art">Art</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              {/* Proceed Button */}
              <button
                type="submit"
                className={`mt-4 font-semibold py-2 px-4 rounded transition-colors 
                ${classYear && classArm && department 
                  ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer" 
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
                disabled={!classYear || !classArm || !department} 
              >
                Proceed
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
