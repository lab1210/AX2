"use client";
import React, { useState } from "react";
import { FiDownload, FiEdit3 } from "react-icons/fi";
import { IoFilter, IoSearch } from "react-icons/io5";
import { RxLetterCaseCapitalize } from "react-icons/rx";

const StudentAssignPage = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("student");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const itemsPerPage = 10;
  const [editingIndex, setEditingIndex] = useState(null);

  const [formData, setFormData] = useState([
    {
      student: "",
      class: "",
      class_arm: "",
    },
  ]);

  const [dummyList, setDummyList] = useState([
    {
      student: "Babalola Ifeoluwa",
      class: "jss1",
      class_arm: "arm1",
    },
    {
      student: "Babalola Ifeoluwa",
      class: "jss1",
      class_arm: "arm1",
    },
    {
      student: "Babalola Ifeoluwa",
      class: "jss1",
      class_arm: "arm1",
    },
    {
      student: "Babalola Ifeoluwa",
      class: "jss1",
      class_arm: "arm1",
    },
    {
      student: "Babalola Ifeoluwa",
      class: "jss1",
      class_arm: "arm1",
    },
    {
      student: "Babalola Ifeoluwa",
      class: "jss1",
      class_arm: "arm1",
    },
    {
      student: "Babalola Ifeoluwa",
      class: "jss1",
      class_arm: "arm1",
    },
    {
      student: "Babalola Ifeoluwa",
      class: "jss1",
      class_arm: "arm1",
    },
    {
      student: "Babalola Ifeoluwa",
      class: "jss1",
      class_arm: "arm1",
    },
    {
      student: "Babalola Ifeoluwa",
      class: "jss1",
      class_arm: "arm1",
    },
    {
      student: "Babalola Ifeoluwa",
      class: "jss1",
      class_arm: "arm1",
    },
    {
      student: "Babalola Ifeoluwa",
      class: "jss1",
      class_arm: "arm1",
    },
    {
      student: "Babalola Ifeoluwa",
      class: "jss1",
      class_arm: "arm1",
    },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedList = [...dummyList];
    updatedList[index][field] = value;
    setDummyList(updatedList);
  };
  //filtering
  const filteredResults =
    searchText.trim() === ""
      ? dummyList
      : dummyList.filter((s) =>
          s[filterType]?.toLowerCase().includes(searchText.toLowerCase())
        );

  //Pagination
  const paginatedData = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div>
      <div className="overflow-y-auto no-scrollbar h-full ">
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
        <div className="flex justify-between items-center gap-5 pt-5 pl-6 pr-6 ">
          <div className="flex items-center gap-10  relative ">
            <div className="">
              <button
                onClick={() => {
                  setShowFilterDropdown(!showFilterDropdown);
                  console.log(showFilterDropdown);
                }}
                className="flex items-center text-[#01427A] hover:text-white hover:bg-[#01427A] cursor-pointer text-sm gap-2 border-[1.5px]
       rounded-sm border-[#01427A] py-1 px-2 w-full"
              >
                <span className="hidden xl:block">Filter by </span>
                <span>
                  <IoFilter size={18} />
                </span>
              </button>
              {showFilterDropdown && (
                <div className="absolute  mt-1 left-0 top-full bg-white border rounded shadow-lg z-[1000] w-40">
                  {["name", "class", "class_arm"].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(type);
                        setShowFilterDropdown(false);
                      }}
                      className="border-b flex items-center gap-3 px-4 py-2 text-sm hover:bg-[#01427A]/40 cursor-pointer w-full text-left"
                    >
                      <span>
                        <RxLetterCaseCapitalize />
                      </span>
                      {type.charAt(0).toUpperCase() +
                        type.slice(1).replace("_", " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="relative w-full">
                <IoSearch
                  className="text-[#AEAEAE] absolute right-7 top-2.5 ml-3 "
                  size={18}
                />
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  type="text"
                  className="placeholder:text-[#AEAEAE] xl:placeholder:text-sm placeholder:text-xs rounded-sm py-1 pl-5 pr-12 border-[1.5px] w-full "
                  placeholder={`Type here to filter by ${filterType}`}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="bg-[#07508F] cursor-pointer hover:opacity-90 transition-all ease-in-out duration-300 text-white flex items-center py-1.5 px-1 rounded-sm gap-2">
              Download List
              <FiDownload />
            </button>
          </div>
        </div>
        <div className="px-0 mt-10 overflow-y-auto h-full">
          <div>
            <table className="min-w-full table-auto">
              {paginatedData.length > 0 && (
                <thead className="bg-[#EDF0F3] text-center  lg:text-base text-xs">
                  <tr>
                    <th className="p-2 bg-[#EDF0F3]">Students Name</th>
                    <th className="p-2 bg-[#EDF0F3]">Classes</th>
                    <th className="p-2 bg-[#EDF0F3]">Class Arm</th>
                    <th className="p-2 bg-[#EDF0F3]">Actions</th>
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
                        <td className="p-2 text-center ">{item.student}</td>
                        <td className="p-2 text-center ">
                          {editingIndex === index ? (
                            <input
                              value={item.class}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "class",
                                  e.target.value
                                )
                              }
                              className="border text-center p-1 text-sm max-w-20"
                            />
                          ) : (
                            item.class
                          )}
                        </td>
                        <td className="p-2 text-center ">
                          {editingIndex === index ? (
                            <input
                              value={item.class_arm}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "class_arm",
                                  e.target.value
                                )
                              }
                              className="border p-1 text-center text-sm max-w-20"
                            />
                          ) : (
                            item.class_arm
                          )}
                        </td>

                        <td className="p-2 text-center ">
                          <span
                            className="flex items-center justify-center"
                            onClick={() =>
                              setEditingIndex(
                                editingIndex === index ? null : index
                              )
                            }
                          >
                            {editingIndex !== index ? (
                              <FiEdit3
                                className="text-[#80ADCB] cursor-pointer"
                                size={15}
                              />
                            ) : (
                              <button className="bg-[#07508F] cursor-pointer hover:opacity-90 transition-all ease-in-out duration-300 text-white flex items-center p-1 px-3.5 rounded-sm gap-2">
                                Set
                              </button>
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default StudentAssignPage;
