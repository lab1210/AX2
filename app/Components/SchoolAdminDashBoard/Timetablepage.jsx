"use client";
import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import TeacherUnavailability from "../SchoolAdminDashBoard/TeacherUnavailablity";
import GlobalConstraint from "../SchoolAdminDashBoard/GlobalConstraint";
import ClassConstraint from "../SchoolAdminDashBoard/ClassConstraint";
const Timetablepage = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [activeTab, setActiveTab] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedDelete, setselectedDelete] = useState(null);

  //Form for adding new period
  const [periodFormData, setPeriodFormData] = useState({
    start_time: "",
    end_time: "",
  });

  const period = [
    {
      period: "1st",
      start_time: "08:00",
      end_time: "09:30",
    },
    {
      period: "2nd",
      start_time: "09:30",
      end_time: "11:00",
    },
    {
      period: "3rd",
      start_time: "11:00",
      end_time: "12:30",
    },
    {
      period: "4th",
      start_time: "12:30",
      end_time: "14:00",
    },
    {
      period: "5th",
      start_time: "14:00",
      end_time: "15:30",
    },
    {
      period: "6th",
      start_time: "15:30",
      end_time: "17:00",
    },
    {
      period: "7th",
      start_time: "17:00",
      end_time: "18:30",
    },
    {
      period: "8th",
      start_time: "18:30",
      end_time: "20:00",
    },
  ];

  //TOGGLE FOR DAYS
  const handleDayToggle = (day) => {
    setSelectedDays(
      (prev) =>
        prev.includes(day)
          ? prev.filter((d) => d !== day) // Remove if already selected
          : [...prev, day] // Add if not selected
    );
  };
  const itemsPerPage = 10;

  //PAGINATION FOR PERIODS
  const periodpaginatedData = period.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(period.length / itemsPerPage);
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const openDeleteModal = (school) => {
    setselectedDelete(school);
    setDeleteModalVisible(true);
  };

  // Function to close delete modal
  const closeDeleteModal = () => {
    setselectedDelete(null);
    setDeleteModalVisible(false);
  };

  return (
    <div className="pr-1 w-full h-full overflow-y-auto no-scrollbar">
      {message && (
        <div
          className={`mx-6 mb-3 text-sm px-4 py-2 rounded-sm font-semibold ${
            messageType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {deleteModalVisible && selectedDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeDeleteModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg min-w-75 z-50 p-8">
            <p className="font-bold text-center text-lg">Delete Period</p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete the
                <span className="text-base font-bold ml-1 mr-1 text-[#858383]">
                  {selectedDelete.period}
                </span>
                period?
              </p>
            </div>
            <div className="font-bold text-md items-center justify-center pt-3 flex gap-5 ">
              <button className="cursor-pointer text-white bg-[#F94144] rounded-md pl-4 pr-4">
                Yes, Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="cursor-pointer text-[#333333] bg-[#EBEBEB] rounded-md pl-4 pr-4"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="pt-3 px-6  ">
          <div className="mb-5 mt-3">
            <p className="font-bold text-[#07508F]">Weekdays Selection</p>
          </div>
          <div className="grid xl:grid-cols-7 grid-cols-4 gap-y-4 gap-1 font-medium ">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="hidden peer"
                onChange={() => handleDayToggle("Sunday")}
                checked={selectedDays.includes("Sunday")}
              />
              <div className="w-6 h-6  border-2 border-gray-500 cursor-pointer rounded bg-white peer-checked:bg-[#6BB56B] peer-checked:after:content-['✔'] peer-checked:after:text-white peer-checked:after:font-bold peer-checked:after:text-sm peer-checked:after:flex peer-checked:after:justify-center peer-checked:after:items-center"></div>

              <span className="text-[0.83rem]">Sunday</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="hidden peer"
                onChange={() => handleDayToggle("Monday")}
                checked={selectedDays.includes("Monday")}
              />
              <div className="w-6 h-6  border-2 border-gray-500 cursor-pointer rounded bg-white peer-checked:bg-[#6BB56B] peer-checked:after:content-['✔'] peer-checked:after:text-white peer-checked:after:font-bold peer-checked:after:text-sm peer-checked:after:flex peer-checked:after:justify-center peer-checked:after:items-center"></div>

              <span className="text-[0.83rem]">Monday</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="hidden peer"
                onChange={() => handleDayToggle("Tuesday")}
                checked={selectedDays.includes("Tuesday")}
              />
              <div className="w-6 h-6  border-2 border-gray-500 cursor-pointer rounded bg-white peer-checked:bg-[#6BB56B] peer-checked:after:content-['✔'] peer-checked:after:text-white peer-checked:after:font-bold peer-checked:after:text-sm peer-checked:after:flex peer-checked:after:justify-center peer-checked:after:items-center"></div>

              <span className="text-[0.83rem]">Tuesday</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="hidden peer"
                onChange={() => handleDayToggle("Wednesday")}
                checked={selectedDays.includes("Wednesday")}
              />
              <div className="w-6 h-6  border-2 border-gray-500 cursor-pointer rounded bg-white peer-checked:bg-[#6BB56B] peer-checked:after:content-['✔'] peer-checked:after:text-white peer-checked:after:font-bold peer-checked:after:text-sm peer-checked:after:flex peer-checked:after:justify-center peer-checked:after:items-center"></div>

              <span className="text-[0.83rem]">Wednesday</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="hidden peer"
                onChange={() => handleDayToggle("Thursday")}
                checked={selectedDays.includes("Thursday")}
              />
              <div className="w-6 h-6  border-2 border-gray-500 cursor-pointer rounded bg-white peer-checked:bg-[#6BB56B] peer-checked:after:content-['✔'] peer-checked:after:text-white peer-checked:after:font-bold peer-checked:after:text-sm peer-checked:after:flex peer-checked:after:justify-center peer-checked:after:items-center"></div>

              <span className="text-[0.83rem]">Thursday</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="hidden peer"
                onChange={() => handleDayToggle("Friday")}
                checked={selectedDays.includes("Friday")}
              />
              <div className="w-6 h-6  border-2 border-gray-500 cursor-pointer rounded bg-white peer-checked:bg-[#6BB56B] peer-checked:after:content-['✔'] peer-checked:after:text-white peer-checked:after:font-bold peer-checked:after:text-sm peer-checked:after:flex peer-checked:after:justify-center peer-checked:after:items-center"></div>

              <span className="text-[0.83rem]">Friday</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="hidden peer"
                onChange={() => handleDayToggle("Saturday")}
                checked={selectedDays.includes("Saturday")}
              />
              <div className="w-6 h-6  border-2 border-gray-500 cursor-pointer rounded bg-white peer-checked:bg-[#6BB56B] peer-checked:after:content-['✔'] peer-checked:after:text-white peer-checked:after:font-bold peer-checked:after:text-sm peer-checked:after:flex peer-checked:after:justify-center peer-checked:after:items-center"></div>

              <span className="text-[0.83rem]">Saturday</span>
            </label>
          </div>
        </div>
        <hr className="mt-15 mb-10 text-[#A7B9CC]/50" />

        <form className="mb-3 flex-shrink-0">
          <div className="flex pt-3 pl-6 pr-6  justify-between mb-2 ">
            <p className="font-bold text-[#07508F]">Set Period Per Day</p>
            <button
              type="submit"
              className="bg-[#07508F] text-white font-bold text-sm p-5 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
            >
              Add Period
            </button>
          </div>

          <div className="pt-1 text-sm flex gap-10 pl-6 pr-2">
            {selectedDays.map((day) => (
              <div
                key={day}
                className="relative pb-1 text-center cursor-pointer "
                onClick={() => setActiveTab(day)}
              >
                <span
                  className={`${
                    activeTab === day ? "text-[#000000]" : "text-[#9C9C9C]"
                  }`}
                >
                  {day}
                </span>
                {activeTab === day && (
                  <span className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-16 h-0.5 bg-[#96B1CB] rounded-full"></span>
                )}
              </div>
            ))}
          </div>
          {selectedDays.length > 0 && <hr className="mt-0.5" />}

          <div className="pl-6 pr-6 mt-6 grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2 ">
              <label className="text-[0.9rem] text-[#5E6A72]">
                Start Time:
              </label>
              <input
                type="text"
                placeholder="HHMM"
                onChange={(e) =>
                  setPeriodFormData({
                    ...periodFormData,
                    start_time: e.target.value,
                  })
                }
                value={periodFormData.start_time}
                className={`${
                  periodFormData.start_time === ""
                    ? "border-[#B6B6B6]"
                    : "border-[#0071E3]"
                } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-2 p-1.5 text-sm rounded-sm `}
                required
              />
            </div>
            <div className="flex flex-col gap-2 ">
              <label className="text-[0.9rem] text-[#5E6A72]">End Time:</label>
              <input
                type="text"
                placeholder="HHMM"
                onChange={(e) =>
                  setPeriodFormData({
                    ...periodFormData,
                    end_time: e.target.value,
                  })
                }
                value={periodFormData.end_time}
                className={`${
                  periodFormData.end_time === ""
                    ? "border-[#B6B6B6]"
                    : "border-[#0071E3]"
                } focus:outline-[#0071E3] placeholder:text-sm placeholder:text-[#B6B6B6] border-2 p-1.5 text-sm rounded-sm `}
                required
              />
            </div>
          </div>
        </form>
        <hr className="mt-5  text-[#A7B9CC]/50" />
        <div className="flex-shrink-0">
          <p className="font-semibold flex justify-center p-3 text-[#333333]">
            Existing Periods
          </p>
        </div>
        <div className="px-0">
          <div className="overflow-y-auto  no-scrollbar">
            <table className="min-w-full table-auto">
              {periodpaginatedData.length > 0 && (
                <thead className="bg-[#EDF0F3] text-center sticky top-0 z-10 lg:text-base text-xs">
                  <tr>
                    <th className="p-2 bg-[#EDF0F3]">Period</th>
                    <th className="p-2 bg-[#EDF0F3]">Start Time</th>
                    <th className="p-2 bg-[#EDF0F3]">End Time</th>
                    <th className="p-2 bg-[#EDF0F3]">Actions</th>
                  </tr>
                </thead>
              )}
              <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
                {periodpaginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-5  text-center border text-gray-500"
                    >
                      No Data Available
                    </td>
                  </tr>
                ) : (
                  periodpaginatedData.map((item, index) => (
                    <tr className="border-b-[#D0D0D0]  border-b" key={index}>
                      <td className="p-2 text-center ">{item.period}</td>
                      <td className="p-2 text-center ">{item.start_time}</td>
                      <td className="p-2 text-center ">{item.end_time}</td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center">
                          <FiTrash2
                            onClick={() => openDeleteModal(item)}
                            className="text-[#F94144] cursor-pointer"
                            size={15}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Pagination controls */}
            <div className="flex justify-self-end pr-6 items-center gap-2 mt-3 text-sm text-[#01427A] font-semibold">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-2 py-1  bg-[#E6ECF2] border ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#EDF0F3]"
                }`}
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-2 py-1   text-xs ${
                    currentPage === index + 1
                      ? "bg-[#07508F] text-white"
                      : "hover:bg-[#EDF0F3] bg-[#FAFAFA]"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-2 py-1  border bg-[#E6ECF2] ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#EDF0F3]"
                }`}
              >
                &gt;
              </button>
            </div>
            <hr className="mt-10 mb-10 text-[#A7B9CC]/50" />

            {/* //FORM FOR ADDING TEACHER UNAVAILABILITY */}

            <TeacherUnavailability itemsperpage={itemsPerPage} />
            <hr className="mt-10 mb-10 text-[#A7B9CC]/50" />
            {/* Form for global constraint */}
            <GlobalConstraint itemsperpage={itemsPerPage} />
            <hr className="mt-10 mb-10 text-[#A7B9CC]/50" />
            <ClassConstraint itemsperpage={itemsPerPage} />
            <div className="grid grid-cols-2 gap-5 w-full mt-10 mb-5 justify-between">
              <button className="bg-[#ffffff] w-full text-[#07508F] border border-[#07508F] font-bold text-sm p-8 py-3 rounded-sm cursor-pointer hover:bg-[#07508F] hover:text-white transition duration-300 ease-in-out">
                Reset
              </button>
              <button className="bg-[#07508F] w-full text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer  border border-[#07508F] hover:bg-white hover:text-[#07508F] transition duration-300 ease-in-out">
                Generate Timetable
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetablepage;
