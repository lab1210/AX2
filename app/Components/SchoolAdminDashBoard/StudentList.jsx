"use client";
import React, { useEffect, useState } from "react";
import { getStudents } from "../../Service/studentService";
const StudentList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [teachers, setTeachers] = useState([]);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTeachers = async () => {
      const response = await getStudents();
      setTeachers(response);
    };
    fetchTeachers();
  }, []);

  const paginatedData = teachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(teachers.length / itemsPerPage);
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div>
      <div className="overflow-y-auto no-scrollbar h-full ">
        <div className="px-0 mt-10 overflow-y-auto h-full">
          <div>
            <table className="min-w-full table-auto">
              {paginatedData.length > 0 && (
                <thead className="bg-[#EDF0F3] text-center  lg:text-sm text-xs">
                  <tr>
                    <th className="p-2 bg-[#EDF0F3]">S/N</th>
                    <th className="p-2 bg-[#EDF0F3]">Name</th>
                    <th className="p-2 bg-[#EDF0F3]">Qualification</th>
                    <th className="p-2 bg-[#EDF0F3]">Specialization</th>
                    <th className="p-2 bg-[#EDF0F3]">Status</th>
                  </tr>
                </thead>
              )}
              <tbody className="xl:text-sm text-xs text-[#333333] font-medium">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-5  text-center border text-gray-500"
                    >
                      No Data Available
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => {
                    return (
                      <tr className="border-b-[#D0D0D0]  border-b" key={index}>
                        <td className="p-2 text-center ">{index + 1}</td>
                        <td className="p-2 text-center ">{`${item.last_name} ${item.first_name} `}</td>
                        <td className="p-2 text-center ">
                          {item.qualification}
                        </td>
                        <td className="p-2 text-center ">
                          {item.specialization}
                        </td>

                        <td className="p-2 text-center ">
                          <div
                            className={`${
                              item.status === "Active"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-800"
                            } rounded-lg font-bold`}
                          >
                            {item.status}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
