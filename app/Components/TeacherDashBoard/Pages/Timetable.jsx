import React from "react";
import RightSidebar from "../RightSideBar";
import Layout from "../Teacherlayout";
import { Bell } from "lucide-react";

const Timetable = () => {
  const timetableData = [
    {
      time: "9:00am",
      class: "SS1",
      monday: "Psychology",
      tuesday: "Psychology",
      wednesday: "Psychology",
      thursday: "Psychology",
      friday: "Psychology ",
    },
    {
      time: "11:00am",
      class: "SS1",
      monday: "Psychology ",
      tuesday: "Psychology ",
      wednesday: "Psychology ",
      thursday: "Psychology ",
      friday: "Psychology ",
    },
    {
      time: "12:00pm",
      monday: "LUNCH BREAK",
      tuesday: "LUNCH BREAK",
      wednesday: "LUNCH BREAK",
      thursday: "LUNCH BREAK",
      friday: "LUNCH BREAK",
    },
    {
      time: "1:00pm",
      class: "SS1",
      monday: "Psychology ",
      tuesday: "Psychology ",
      wednesday: "Psychology ",
      thursday: "Psychology ",
      friday: "Psychology ",
    },
    {
      time: "2:00pm",
      class: "SS1",
      monday: "Psychology ",
      tuesday: "Psychology ",
      wednesday: "Psychology ",
      thursday: "Psychology ",
      friday: "Psychology ",
    },
    {
      time: "2:30pm",
      class: "SS1",
      monday: "Psychology ",
      tuesday: "Psychology ",
      wednesday: "Psychology ",
      thursday: "Psychology ",
      friday: "Psychology ",
    },
    {
      time: "3:00pm",
      class: "",
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
    },
    {
      time: "3:30pm",
      class: "",
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
    },
  ];

  return (
    <Layout>
      <div className="flex min-h-screen bg-[#F7F8FA] w-full">
        <div className="flex flex-col w-full">
          <div className="fixed top-0 z-30 flex items-center justify-between bg-white px-6 py-4 w-[85%]">
            <h1 className="text-3xl font-bold">Timetable</h1>
            <div className="flex items-center">
              <button className="relative mr-4">
                <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full" />
                <Bell />
              </button>
              <div className="flex items-center space-x-2">
                <img
                  src="/female2.png"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-medium">Joshua Daniel</p>
                  <p className="text-xs text-gray-500">Teacher</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-row pt-21 w-full">
            <div className="w-full flex flex-col p-6 mx-auto">
              <div className="bg-white rounded-lg shadow p-12 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f6faff]">
                      <th className="border border-gray-300 px-4 py-2 text-left"></th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Monday
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Tuesday
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Wednesday
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Thursday
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Friday
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetableData.map((row, index) => {
                      if (row.monday === "LUNCH BREAK") {
                        return (
                          <tr
                            key={index}
                            className="border-r border-l font-bold text-center"
                          >
                            <td className="border border-gray-300 bg-[#f6faff] px-4 py-2">
                              {row.time}
                            </td>
                            <td colSpan="6" className="py-4">
                              {row.monday}
                            </td>
                          </tr>
                        );
                      }
                      return (
                        <tr key={index}>
                          <td className="border border-gray-300 bg-[#f6faff] px-4 py-2">
                            {row.time}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <p className="font-semibold">{row.monday}</p>
                            <p className="text-[#0B71B5] px-5">{row.class}</p>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <p className="font-semibold">{row.tuesday}</p>
                            <p className="text-[#0B71B5] px-5">{row.class}</p>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <p className="font-semibold">{row.wednesday}</p>
                            <p className="text-[#0B71B5] px-5">{row.class}</p>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <p className="font-semibold">{row.thursday}</p>
                            <p className="text-[#0B71B5] px-5">{row.class}</p>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <p className="font-semibold">{row.friday}</p>
                            <p className="text-[#0B71B5] px-5">{row.class}</p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Timetable;
