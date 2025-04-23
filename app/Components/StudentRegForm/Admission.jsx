import React from "react";

const Admission = ({
  admissionInfo,
  setadmissionInfo,
  error,
  handleInputChange,
  handleDateChange,
}) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i); 
  return (
    <div className="w-full mb-5 px-8 py-2.5 section">
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
            value={admissionInfo.admissionNumber}
            placeholder="Enter Admission Number"
            onChange={(e) => handleInputChange(e, setadmissionInfo)}
            required
            className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
          />
          {error?.admissionNumber && (
            <p className="text-red-500 text-xs mt-1">{error.admissionNumber}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="admissionDate"
            className="font-bold text-gray-500 text-base block mb-1"
          >
            Admission Date
          </label>
          <div className="w-full grid grid-cols-3 gap-4 personalInfoItemgrid">
            <div className="contents personalInfoGridadmissionitem">
              <select
                name="DD"
                value={admissionInfo.admissionDate.DD}
                onChange={handleDateChange}
                required
                className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              >
                <option value="">DD</option> 
                {days.map((day) => (
                  <option key={day} value={day.toString().padStart(2, "0")}>
                    {day.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
              {error?.admissionDate?.DD && (
                <p className="text-red-500 text-xs mt-1">
                  {error.admissionDate.DD}
                </p>
              )}
            </div>
            <div className="contents personalInfoGridadmissionitem">
              <select
                name="MM"
                value={admissionInfo.admissionDate.MM}
                onChange={handleDateChange}
                required
                className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              >
                <option value="">MM</option>
                {months.map((month, index) => (
                  <option
                    key={index}
                    value={(index + 1).toString().padStart(2, "0")}
                  >
                    {month}
                  </option>
                ))}
              </select>
              {error?.admissionDate?.MM && (
                <p className="text-red-500 text-xs mt-1">
                  {error.admissionDate.MM}
                </p>
              )}
            </div>
            <div className="contents personalInfoGridadmissionitem">
              <select
                name="YY"
                value={admissionInfo.admissionDate.YY}
                onChange={handleDateChange}
                required
                className="px-5 py-4 rounded-md border-2 border-gray-300 text-gray-500 outline-none text-sm bg-white w-full"
              >
                <option value="">YYYY</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {error?.admissionDate?.YY && (
                <p className="text-red-500 text-xs mt-1">
                  {error.admissionDate.YY}
                </p>
              )}
            </div>
          </div>
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
  );
};

export default Admission;
