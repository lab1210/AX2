"use client";
import React, { useEffect, useState } from "react";
import { getTeachers } from "../../Service/teacherService";
import Dropdown from "../SchoolAdminDashBoard/DropDown";
import { FiTrash2 } from "react-icons/fi";

const TeacherUnavailablity = ({ itemsperpage }) => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [currentPageforTeacher, setCurrentPageforTeacher] = useState(1);
  const [teacher, setTeacher] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedDelete, setselectedDelete] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data, error } = await getTeachers();
      if (data) {
        setTeacher(data);
      } else {
        setMessage(error || "Something went wrong");
      }
    };

    fetchTeachers();
  }, []);

  const dayOptions = [
    { label: "Sunday", value: "Sunday" },
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
  ];
  //Get teacher name
  const getTeacherName = (teacherID) => {
    const t = teacher.find((item) => item.teacher_id === teacherID);
    if (!t) return null; // explicitly return null if not found
    return `${t.last_name} ${t.first_name}`;
  };

  //Form for setting teacher unavailable
  const [teacherUnavailabilityFormData, setTeacherUnavailabilityFormData] =
    useState({
      teacher: "",
      days: "",
      unavailable_time: "",
    });

  const teacherUnavailability = [
    {
      teacher: "Teacher 1",
      days: "Monday",
      unavailable_time: "08:00 - 10:00",
    },
    {
      teacher: "Teacher 2",
      days: "Tuesday",
      unavailable_time: "08:00 - 10:00",
    },
    {
      teacher: "Teacher 3",
      days: "Wednesday",
      unavailable_time: "08:00 - 10:00",
    },
    {
      teacher: "Teacher 4",
      days: "Thursday",
      unavailable_time: "08:00 - 10:00",
    },
    {
      teacher: "Teacher 5",
      days: "Friday",
      unavailable_time: "08:00 - 10:00",
    },
  ];

  //PAGINATION FOR TEACHER UNAVAILABILITY
  const teacherunavailabilitypaginatedData = teacherUnavailability.slice(
    (currentPageforTeacher - 1) * itemsperpage,
    currentPageforTeacher * itemsperpage
  );

  const totalPagesforTeacher = Math.ceil(
    teacherUnavailability.length / itemsperpage
  );
  const handlePreviousforteacher = () => {
    setCurrentPageforTeacher((prev) => Math.max(prev - 1, 1));
  };

  const handleNextforteacher = () => {
    setCurrentPageforTeacher((prev) => Math.min(prev + 1, totalPages));
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
    <div>
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
            <p className="font-bold text-center text-lg">
              Delete Teacher Unavailability
            </p>
            <div className="text-center pt-3">
              <p className="text-base text-[#858383]">
                Are you sure want to delete
                <span className="text-base font-bold ml-1 mr-1 text-[#858383]">
                  ({selectedDelete.unavailable_time})
                </span>
                for
                <span className="text-base font-bold ml-1 mr-1 text-[#858383]">
                  {selectedDelete.teacher}
                </span>
                ?
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

      <form className="mb-3 flex-shrink-0">
        <div className="flex pt-3 pl-6 pr-6  justify-between mb-2 ">
          <p className="font-bold text-[#07508F]">
            Set Teacher's Unavailability
          </p>
          <button
            type="submit"
            className="bg-[#07508F] text-white font-bold text-sm p-8 pt-1 pb-1 rounded-sm cursor-pointer hover:opacity-90"
          >
            Set
          </button>
        </div>
        <div className="pl-6 pr-6 mt-6 grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-2 mb-2">
            <label className="text-[0.88rem] text-[#5E6A72]">Teacher:</label>
            <Dropdown
              label={
                getTeacherName(teacherUnavailabilityFormData.teacher) ||
                "Select Teacher"
              }
              items={teacher.map((t) => ({
                label: t.last_name + " " + t?.first_name,
                onClick: () =>
                  setTeacherUnavailabilityFormData({
                    ...teacherUnavailabilityFormData,
                    teacher: t.teacher_id,
                  }),
              }))}
            />
          </div>

          <div className="flex flex-col gap-2 mb-2">
            <label className="text-[0.88rem] text-[#5E6A72]">Days:</label>
            <Dropdown
              label={teacherUnavailabilityFormData.days || "Select Day"}
              items={dayOptions.map((item) => ({
                label: item.label,
                onClick: () =>
                  setTeacherUnavailabilityFormData({
                    ...teacherUnavailabilityFormData,
                    days: item.value,
                  }),
              }))}
            />
          </div>
          <div className="flex flex-col gap-2 ">
            <label className="text-[0.9rem] text-[#5E6A72]">
              Unavailable Time:
            </label>
            <input
              type="text"
              placeholder="Select Unavailable Time"
              onChange={(e) =>
                setTeacherUnavailabilityFormData({
                  ...teacherUnavailabilityFormData,
                  unavailable_time: e.target.value,
                })
              }
              value={teacherUnavailabilityFormData.unavailable_time}
              className={`${
                teacherUnavailabilityFormData.unavailable_time === ""
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
        <p className="font-semibold flex justify-center mb-5 p-3 text-[#333333]">
          Existing Unavailable Teachers
        </p>
      </div>
      <div className="px-0">
        <div className="overflow-y-auto  no-scrollbar">
          <table className="min-w-full table-auto">
            {teacherunavailabilitypaginatedData.length > 0 && (
              <thead className="bg-[#EDF0F3] text-center sticky top-0 z-10 lg:text-base text-xs">
                <tr>
                  <th className="p-2 bg-[#EDF0F3]">Teachers</th>
                  <th className="p-2 bg-[#EDF0F3]">Day(s)</th>
                  <th className="p-2 bg-[#EDF0F3]">Unavailable Time</th>
                  <th className="p-2 bg-[#EDF0F3]">Actions</th>
                </tr>
              </thead>
            )}
            <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
              {teacherunavailabilitypaginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-5  text-center border text-gray-500"
                  >
                    No Data Available
                  </td>
                </tr>
              ) : (
                teacherunavailabilitypaginatedData.map((item, index) => (
                  <tr className="border-b-[#D0D0D0]  border-b" key={index}>
                    <td className="p-2 text-center ">{item.teacher}</td>
                    <td className="p-2 text-center ">{item.days}</td>
                    <td className="p-2 text-center ">
                      {item.unavailable_time}
                    </td>
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
              onClick={handlePreviousforteacher}
              disabled={currentPageforTeacher === 1}
              className={`px-2 py-1  bg-[#E6ECF2] border ${
                currentPageforTeacher === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#EDF0F3]"
              }`}
            >
              &lt;
            </button>

            {Array.from({ length: totalPagesforTeacher }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPageforTeacher(index + 1)}
                className={`px-2 py-1   text-xs ${
                  currentPageforTeacher === index + 1
                    ? "bg-[#07508F] text-white"
                    : "hover:bg-[#EDF0F3] bg-[#FAFAFA]"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={handleNextforteacher}
              disabled={currentPageforTeacher === totalPagesforTeacher}
              className={`px-2 py-1  border bg-[#E6ECF2] ${
                currentPageforTeacher === totalPagesforTeacher
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#EDF0F3]"
              }`}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherUnavailablity;
