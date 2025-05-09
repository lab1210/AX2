import React from "react";
import RegDropdown from "../Regdropdown";

const Admission = ({
  admissionInfo,
  setadmissionInfo,
  error,
  handleInputChange,
}) => {
  return (
    <>
      <div className=" lg:w-full mb-5 px-8 py-2.5 section">
        <div className="font-bold text-blue-900 mb-4 mt-6 RegFormTitle">
          <h1>Admission Information</h1>
        </div>
        <div className="w-full grid grid-cols-2 gap-4 row-gap-10 personalInfoGridadmission">
          <div className="personalInfoItem">
            <label
              htmlFor="admissionNumber"
              className="font-bold text-gray-500 text-base block mb-1"
            >
              Admission Number
            </label>
            <input
              type="text"
              name="admissionNumber"
              value={admissionInfo.admission_number}
              placeholder="Enter Admission Number"
              onChange={(e) => handleInputChange(e, setadmissionInfo)}
              required
              className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
            />
            {error?.admissionNumber && (
              <p className="text-red-500 text-xs mt-1">
                {error.admissionNumber}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="admission_date"
              className="font-bold text-gray-500 text-base block mb-1"
            >
              Admission Date
            </label>
            <input
              type="date"
              name="admissionDate"
              value={admissionInfo.admission_date}
              placeholder="Enter Admission date"
              onChange={(e) => handleInputChange(e, setadmissionInfo)}
              required
              className="px-5 py-2 rounded border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
            />
            {error?.admissionDate && (
              <p className="text-red-500 text-xs mt-1">{error.admissionDate}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="classYear"
              className="font-bold text-gray-500 text-base block mb-1"
            >
              Class Year
            </label>
            <RegDropdown
              label={admissionInfo.class_year || "Class Year"}
              items={[
                {
                  label: "2021",
                  onClick: () =>
                    setadmissionInfo((prev) => ({
                      ...prev,
                      class_year: "2021",
                    })),
                },
                {
                  label: "2022",
                  onClick: () =>
                    setadmissionInfo((prev) => ({
                      ...prev,
                      class_year: "2022",
                    })),
                },
                {
                  label: "2023",
                  onClick: () =>
                    setadmissionInfo((prev) => ({
                      ...prev,
                      class_year: "2023",
                    })),
                },
              ]}
            />
            {error?.classYear && (
              <p className="text-red-500 text-xs mt-1">{error.classYear}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="classArm"
              className="font-bold text-gray-500 text-base block mb-1"
            >
              Class Arm
            </label>
            <RegDropdown
              label={admissionInfo.class_arm || "Class Arm"}
              items={[
                {
                  label: "A",
                  onClick: () =>
                    setadmissionInfo((prev) => ({ ...prev, class_arm: "A" })),
                },
                {
                  label: "B",
                  onClick: () =>
                    setadmissionInfo((prev) => ({ ...prev, class_arm: "B" })),
                },
                {
                  label: "C",
                  onClick: () =>
                    setadmissionInfo((prev) => ({ ...prev, class_arm: "C" })),
                },
              ]}
            />
            {error?.classArm && (
              <p className="text-red-500 text-xs mt-1">{error.classArm}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="Status"
              className="font-bold text-gray-500 text-base block mb-1"
            >
              Status
            </label>

            <button
              className={`${
                admissionInfo.Status ? "bg-green-500" : "bg-red-500"
              } px-14 py-2.5 font-bold text-xl text-white border-none outline-none rounded-md mb-5`}
            >
              {admissionInfo.Status ? " Active" : "Deactivated"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet View */}
      <div className="w-full mb-5 px-4 py-2.5 section lg:hidden">
        <div className="font-bold text-blue-900 mb-4 mt-6 RegFormTitle">
          <h1>Admission Information</h1>
        </div>
        <div className="w-full flex flex-col gap-6 personalInfoGridadmission">
          <div className="personalInfoItem">
            <label
              htmlFor="admissionNumber"
              className="font-bold text-gray-500 text-base block mb-1"
            >
              Admission Number
            </label>
            <input
              type="text"
              name="admissionNumber"
              value={admissionInfo.admissionNumber}
              placeholder="Enter Admission Number"
              onChange={(e) => handleInputChange(e, setadmissionInfo)}
              required
              className="px-5 py-3 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
            />
            {error?.admissionNumber && (
              <p className="text-red-500 text-xs mt-1">
                {error.admissionNumber}
              </p>
            )}
          </div>
          <div className="personalInfoItem">
            <label
              htmlFor="admissionDate"
              className="font-bold text-gray-500 text-base block mb-1"
            >
              Admission Date
            </label>
            <input
              type="date"
              name="admissionDate"
              value={admissionInfo.admission_date}
              placeholder="Enter Admission date"
              onChange={(e) => handleInputChange(e, setadmissionInfo)}
              required
              className="px-5 py-3 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
            />
            {error?.admissionDate && (
              <p className="text-red-500 text-xs mt-1">{error.admissionDate}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="Status"
              className="font-bold text-gray-500 text-base block mb-1"
            >
              Status
            </label>

            <button
              className={`${
                admissionInfo.Status ? "bg-green-500" : "bg-red-500"
              } px-8 py-2 font-bold text-lg text-white border-none outline-none rounded-md mb-5`}
            >
              {admissionInfo.Status ? " Active" : "Deactivated"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admission;
