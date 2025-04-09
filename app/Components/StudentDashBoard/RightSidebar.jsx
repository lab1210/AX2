"use client";
import React, { useState } from "react";
import {
  IoChevronDownOutline,
  IoNotificationsOutline,
  IoChevronBackSharp,
  IoChevronForward,
  IoLogOutOutline,
} from "react-icons/io5";
import {
  format,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
  parseISO,
  isSameDay,
} from "date-fns";
import Link from "next/link";

const RightSidebar = ({ user }) => {
  const dummyevents = [
    {
      date: "2025-02-27",
      title: "Upcoming Fees Payment for the 2023/2024 Session",
      description: "Updates on school fees for all junior and senior students",
    },
    {
      date: "2025-02-01",
      title: "Parents and Teachers Meeting on Zoom",
      description:
        "Conference call with all parents having a child in JSS1 and 2 in preparation for the upcoming session",
    },
  ];

  const dummyNotifications = [
    {
      title: "Inter-House Sports",
      description:
        "The 2nd term Inter-House sports has been rescheduled for  Thur 15th - Fri 16th October 2023",
    },
    {
      title: "Mid-term Tests",
      description: "Mid term tests will start on Monday 25th October, 2023",
    },
    {
      title: "Boarders Meeting",
      description:
        " All JSS1-SS3 boarding school students will be having a meeting by 3pm on Friday 29th October, 2023",
    },
  ];

  const [clickedEventIndex, setClickedEventIndex] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isnotification, setIsnotification] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleItemClick = (index) => {
    setClickedEventIndex(index);
  };

  const handleMonthChange = (direction) => {
    if (direction === "next") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const start = startOfWeek(currentDate, { weekStartsOn: 0 });
  const end = endOfWeek(currentDate, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="h-screen bg-white rounded-lg">
      <div className="flex gap-4 items-center py-4">
        <div className="relative">
          <IoNotificationsOutline
            className="text-gray-800 w-8 h-8 cursor-pointer transition-colors hover:text-gray-400"
            onClick={() => setIsnotification(!isnotification)}
          />
          {isnotification && (
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F94144]"></div>
          )}
        </div>

        <div className="relative flex items-center gap-2">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={toggleDropdown}
          >
            <div className="rounded-full overflow-hidden w-12 h-12 md:w-10 md:h-10 xl:w-12 xl:h-12">
              {user?.profilePic && (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="hidden xl:flex items-center gap-1">
              <p className="font-bold text-sm">{user?.username}</p>
              <IoChevronDownOutline className="w-3 h-3" />
            </div>
          </div>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-3 z-50">
              <div className="mb-2 text-gray-800 cursor-pointer hover:text-[#F94144] p-2 rounded active:text-[#F94144]">
                <Link a href="/Student/Profile"> Profile </Link>
              </div>
              <div className="mb-2 text-gray-800 cursor-pointer hover:text-[#F94144] p-2 rounded active:text-[#F94144]">
              <Link a href=""> Settings </Link>
              </div>
              <div className="flex items-center gap-2 text-gray-800 cursor-pointer hover:text-[#F94144] p-2 rounded active:text-[#F94144]">
                <IoLogOutOutline className="w-4 h-4" />
                <span>
                Logout
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* Events Section */}
        <div className="bg-[#004080] text-white rounded-xl p-2 shadow-lg">
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold">Events</h2>
            <div className="h-[50%]">
              <p className="text-xs text-gray-300">Date</p>
              <div className="flex justify-between items-center">
                <p className="text-xs">{format(currentDate, "MMM yyy")}</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleMonthChange("prev")}
                    className="bg-white text-black rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <IoChevronBackSharp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleMonthChange("next")}
                    className="bg-white text-black rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <IoChevronForward className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="h-[40%]">
              <div className="flex justify-between text-gray-300 text-xs">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <span key={day}>{day}</span>
                  )
                )}
              </div>
              <div className="flex justify-between text-xs">
                {days.map((day) => (
                  <div key={day.toISOString()} className="relative">
                    {format(day, "d")}
                    {dummyevents
                      .filter((event) => {
                        const eventDate = parseISO(event.date);
                        return (
                          isSameDay(eventDate, day) &&
                          isSameMonth(eventDate, day)
                        );
                      })
                      .map((_, i) => (
                        <div
                          key={i}
                          className="absolute bottom-0 left-1/2 w-1 h-1 bg-[#F94144] rounded-full"
                        ></div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Event List */}
          <ul className="mt-4 space-y-2">
            <hr className="border-t border-gray-300" />
            {dummyevents.map((event, index) => (
              <li
                key={index}
                className={`rounded-lg p-1 transition-colors ${
                  clickedEventIndex === index ? "bg-blue-700" : ""
                }`}
              >
                <div className="grid grid-cols-[48px_1fr] gap-2">
                  <div
                    className={`rounded-lg p-1 text-center ${
                      clickedEventIndex === index
                        ? "bg-transparent text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    <div className="text-xs font-light">
                      {format(parseISO(event.date), "EEE")}
                    </div>
                    <div className="text-2xl">
                      {format(parseISO(event.date), "dd")}
                    </div>
                  </div>
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => handleItemClick(index)}
                  >
                    <div>
                      <h5 className="text-xs font-bold text-white">
                        {event.title}
                      </h5>
                      <p
                        className={`text-[8px] ${
                          clickedEventIndex === index
                            ? "text-blue-200"
                            : "text-black"
                        }`}
                      >
                        {event.description}
                      </p>
                    </div>
                    <div className="bg-white rounded-full w-4 h-4 flex items-center justify-center">
                      <IoChevronForward className="w-3 h-3 text-black" />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Notifications Section */}
        <div className="bg-[#F94144] text-white rounded-xl p-4 shadow-lg">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">Notification</h2>
            <hr className="my-2 border-white" />
          </div>
          <ul className="space-y-2">
            {dummyNotifications.map((item, index) => (
              <li
                key={index}
                className="bg-white rounded p-2 flex justify-between items-center"
              >
                <div className="text-black">
                  <div className="text-xs font-bold">{item.title}</div>
                  <div className="text-[10px]">{item.description}</div>
                </div>
                <div className="bg-[#F94144] rounded-full w-5 h-5 flex items-center justify-center">
                  <IoChevronForward className="w-3 h-3 text-white" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;