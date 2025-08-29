"use client";
import React, { useState, useEffect } from "react";
import { IoChevronDownOutline, IoLogOutOutline } from "react-icons/io5";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Link from "next/link";
import dayjs from "dayjs";
import { IoNotificationsOutline } from "react-icons/io5";
import { getNotifications } from "../../Service/NotificationService";
import toast from "react-hot-toast";

const RightSidebar = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotification, setIsNotification] = useState(true);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // const fallbackEvents = [
  //   {
  //     date: dayjs().date(12).format("D"),
  //     title: "Upcoming Fees Payment",
  //     subtitle: "Updates on school fees for all junior and senior students",
  //     time: "8 A.M",
  //     status: "upcoming",
  //   },
  //   {
  //     date: dayjs().date(13).format("D"),
  //     title: "Parents and Teachers Meeting on Zoom",
  //     subtitle:
  //       "Conference call with all parents having a child in JSS1 and 2 in preparation for the upcoming session",
  //     time: "10 A.M",
  //     status: "today",
  //   },
  //   {
  //     date: "25",
  //     title: "Inter-House Sports",
  //     subtitle:
  //       "The 2nd term Inter-House sports has been rescheduled for  Thur 15th - Fri 16th October 2023",
  //     time: "8 A.M",
  //     status: "upcoming",
  //   },
  //   {
  //     date: "29",
  //     title: "Mid-term Tests",
  //     subtitle: "Mid term tests will start on Monday 25th October, 2023",
  //     time: "10:00 A.M",
  //     status: "upcoming",
  //   },
  //   {
  //     date: "30",
  //     title: "Borders Meeting",
  //     subtitle:
  //       "All JSS1-SS3 boarding school students will be having a meeting by 3pm on Friday 29th October, 2023",
  //     time: "2:00 P.M",
  //     status: "due",
  //   },
  // ];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const { data: notificationData, error } = await getNotifications();
        
        if (notificationData && notificationData.length > 0) {
          const transformedEvents = notificationData.map((notification, index) => {
            const createdDate = new Date(notification.created_at);
            const today = new Date();
            const daysDiff = Math.floor((createdDate - today) / (1000 * 60 * 60 * 24));
            
            let status = "upcoming";
            if (daysDiff === 0) status = "today";
            else if (daysDiff < 0) status = "due";
            
            return {
              date: createdDate.getDate().toString(),
              title: notification.title || "Notification",
              subtitle: notification.content || "No description available",
              time: createdDate.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
              }),
              status: status,
              type: notification.notification_type?.toLowerCase() || 'general'
            };
          });
          
          setEvents(transformedEvents);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error("Error fetching notifications for events:", err);
        toast.error("Failed to load notifications");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const eventDateMap = events.reduce((acc, event) => {
    const dateKey = event.date.toString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event.status);
    return acc;
  }, {});

  const getDateColor = (date) => {
    const statuses = eventDateMap[date.toString()];
    if (!statuses) return null;

    if (statuses.includes("due")) return "#FF0004";
    if (statuses.includes("today")) return "#6191B0";
    if (statuses.includes("upcoming")) return "#F8961E";
    return null;
  };

  // const generateEventDateStyles = () => {
  //   const styles = {};
  //   Object.keys(eventDateMap).forEach((date) => {
  //     const color = getDateColor(parseInt(date));
  //     if (color) {
  //       styles[`& .MuiPickersDay-root[aria-label*="${date}"]`] = {
  //         backgroundColor: color,
  //         color: "white",
  //         fontWeight: "bold",
  //         "&:hover": {
  //           backgroundColor: color,
  //           opacity: 0.8,
  //         },
  //       };
  //     }
  //   });
  //   return styles;
  // };
  const generateEventDateStyles = () => {
    const styles = {};
    Object.keys(eventDateMap).forEach((date) => {
      const color = getDateColor(parseInt(date));
      if (color) {
        styles[`& .MuiPickersDay-root[data-date="${date}"]`] = {
          backgroundColor: color,
          color: "white",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: color,
            opacity: 0.8,
          },
          "&.Mui-selected": {
            backgroundColor: color,
          },
          "&:focus": {
            backgroundColor: color,
          },
        };
      }
    });
    return styles;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="w-full space-y-3 sticky top-6 overflow-y-auto h-screen no-scrollbar">
      {/* Header with Profile */}
      <div className="bg-white rounded-lg p-4">
        <div className="relative flex items-center gap-2 justify-end">
          {/* Notification Icon */}
          <div className="relative">
            <IoNotificationsOutline
              className="text-gray-800 w-8 h-8 cursor-pointer transition-colors hover:text-gray-400"
              onClick={() => setIsNotification(!isNotification)}
            />
            {isNotification && (
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F94144]"></div>
            )}
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            <div className="rounded-full overflow-hidden w-10 h-10">
              <img
                src={
                  user?.student?.profile_picture_path === null
                    ? "/female.png"
                    : user?.student?.profile_picture_path
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-1">
              <p className="font-bold text-sm">
                {user?.student?.first_name + " " + user?.student?.last_name}
              </p>
              <IoChevronDownOutline className="w-3 h-3" />
            </div>
          </div>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-[#004080] rounded-md shadow-lg p-3 z-50">
              <Link href="/Student/Profile" className="block mb-2">
                <div className="text-white cursor-pointer hover:bg-[#01427A] p-2 rounded transition-all duration-200 hover:scale-[1.02]">
                  Profile
                </div>
              </Link>
              <Link href="" className="block mb-2">
                <div className="text-white cursor-pointer hover:bg-[#01427A] p-2 rounded transition-all duration-200 hover:scale-[1.02]">
                  Settings
                </div>
              </Link>
              <div className="flex items-center gap-2 text-white cursor-pointer hover:bg-[#01427A] p-2 rounded transition-all duration-200 hover:scale-[1.02]">
                <IoLogOutOutline className="w-4 h-4 text-white" />
                <span className="text-white">Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#004080] rounded-lg">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            readOnly
            sx={{
              width: "100%",
              height: "auto",
              "& .MuiPickersCalendarHeader-root": {
                paddingLeft: "8px",
                paddingRight: "8px",
                color: "white",
              },
              "& .MuiPickersCalendarHeader-label": {
                color: "white",
                fontWeight: "bold",
              },
              "& .MuiPickersArrowSwitcher-button": {
                color: "white",
              },
              "& .MuiDayCalendar-weekDayLabel": {
                color: "white",
                fontWeight: "bold",
              },
              "& .MuiPickersDay-root": {
                color: "white",
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  color: "white",
                },
              },
              "& .MuiPickersDay-today": {
                border: "2px solid white",
                color: "white",
                fontWeight: "bold",
              },
              "& .MuiPickersDay-dayOutsideMonth": {
                color: "rgba(255, 255, 255, 0.5)",
              },
              ...generateEventDateStyles(),
            }}
          />
        </LocalizationProvider>
      </div>

      {/* Events Section */}
      <div className="bg-white rounded-lg shadow-lg h-[46vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Events</h3>
          <button className="text-sm text-blue-600">View All</button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <ul className="space-y-3">
            {events.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No events available</p>
              </div>
            ) : (
              events.map((e, idx) => {
            const bg = "border rounded-lg border-[#5E5D5D] shadow-md";

            const dateBgColor =
              e.status === "due"
                ? "bg-[#FF0004] text-white"
                : e.status === "today"
                ? "bg-[#6191B0] text-white"
                : e.status === "upcoming"
                ? "bg-[#F8961E] text-white"
                : "bg-gray-200 text-black";

            return (
              <li
                key={idx}
                className={`flex items-center p-3 rounded-lg ${bg}`}
              >
                <div
                  className={`w-9 h-10 flex items-center justify-center font-bold text-lg rounded-md ${dateBgColor}`}
                >
                  {e.date}
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-medium text-sm">{e.title}</p>
                  <p className="text-xs text-gray-500">{e.subtitle}</p>
                  <p className="text-sm text-black font-semibold">{e.time}</p>
                </div>
                {e.status === "due" && (
                  <div className="flex flex-col items-end">
                    <span className="w-2 h-2 bg-[#FF0004] rounded-full" />
                    <p className="text-sm font-semibold text-[#FF0004]">
                      Due Soon
                    </p>
                  </div>
                )}
                {e.status === "today" && (
                  <div className="flex flex-col items-end">
                    <span className="w-2 h-2 bg-[#80ADCB] rounded-full" />
                    <p className="text-sm font-semibold text-[#80ADCB]">
                      Today
                    </p>
                  </div>
                )}
                {e.status === "upcoming" && (
                  <div className="flex flex-col items-end">
                    <span className="w-2 h-2 bg-[#F8961E] rounded-full" />
                    <p className="text-sm font-semibold text-[#F8961E]">
                      Upcoming
                    </p>
                  </div>
                )}
              </li>
            );
          })
          )}
        </ul>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
("react");

// import { IoChevronDownOutline, IoLogOutOutline } from "react-icons/io5";
// import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
// import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import Link from "next/link";

// const RightSidebar = ({ user }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   // Events from Teacher's Dashboard with urgency-based styling
//   const events = [
//     {
//       date: 12,
//       title: "Send Mr Ayo class Schedule",
//       subtitle: "Send Document via email",
//       time: "8 A.M",
//       status: "today",
//     },
//     {
//       date: 12,
//       title: "Meet with Prefects",
//       subtitle: "Have a work flow",
//       time: "8 A.M",
//       status: "due",
//     },
//     {
//       date: 25,
//       title: "JSS1B Test",
//       subtitle: "Set Question",
//       time: "8 A.M",
//       status: "upcoming",
//     },
//     {
//       date: 30,
//       title: "Send a Doc to Admin",
//       subtitle: "Send Document via email",
//       time: "10:00 A.M",
//       status: "upcoming",
//     },
//     {
//       date: 31,
//       title: "Have a meeting with the Parents",
//       subtitle: "Regarding their wards",
//       time: "2:00 P.M",
//       status: "due",
//     },
//   ];

//   const toggleDropdown = () => {
//     setIsDropdownOpen((prev) => !prev);
//   };

//   return (
//     <div className="w-full space-y-3 sticky top-6 overflow-y-auto h-screen no-scrollbar">
//       {/* Header with Profile */}
//       <div className="bg-white rounded-lg p-4">
//         <div className="relative flex items-center gap-2 justify-end">
//           <div
//             className="flex items-center gap-2 cursor-pointer"
//             onClick={toggleDropdown}
//           >
//             <div className="rounded-full overflow-hidden w-10 h-10">
//               <img
//                 src={
//                   user?.student?.profile_picture_path === null
//                     ? "/female.png"
//                     : user?.student?.profile_picture_path
//                 }
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div className="flex items-center gap-1">
//               <p className="font-bold text-sm">
//                 {user?.student?.first_name + " " + user?.student?.last_name}
//               </p>
//               <IoChevronDownOutline className="w-3 h-3" />
//             </div>
//           </div>

//           {isDropdownOpen && (
//             <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-3 z-50">
//               <div className="mb-2 text-gray-800 cursor-pointer hover:text-[#F94144] p-2 rounded active:text-[#F94144]">
//                 <Link href="/Student/Profile">Profile</Link>
//               </div>
//               <div className="mb-2 text-gray-800 cursor-pointer hover:text-[#F94144] p-2 rounded active:text-[#F94144]">
//                 <Link href="">Settings</Link>
//               </div>
//               <div className="flex items-center gap-2 text-gray-800 cursor-pointer hover:text-[#F94144] p-2 rounded active:text-[#F94144]">
//                 <IoLogOutOutline className="w-4 h-4" />
//                 <span>Logout</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="bg-[#004080] rounded-lg shadow-lg h-[40vh]">
//         <div className=" rounded-lg h-full overflow-hidden">
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DemoContainer components={["DateCalendar"]}>
//               <DemoItem>
//                 <DateCalendar
//                   readOnly
//                   sx={{
//                     "& .MuiPickersCalendarHeader-root": {
//                       backgroundColor: "#004080",
//                       color: "white",
//                     },
//                     "& .MuiPickersArrowSwitcher-root": {
//                       color: "#FFFFFF",
//                     },
//                     "& .MuiPickersCalendarHeader-label": {
//                       color: "#FFFFFF",
//                     },
//                     "& .MuiDayCalendar-weekDayLabel": {
//                       color: "#FFFFFF",
//                       fontWeight: "bold",
//                     },
//                     // Style specific dates based on events
//                     [`& .MuiPickersDay-root[aria-label*="12"]`]: {
//                       backgroundColor: "#6191B0", // Today - blue
//                       color: "white",
//                       "&:hover": {
//                         backgroundColor: "#6191B0",
//                       },
//                     },
//                     [`& .MuiPickersDay-root[aria-label*="25"], & .MuiPickersDay-root[aria-label*="30"]`]:
//                       {
//                         backgroundColor: "#F8961E", // Upcoming - orange
//                         color: "white",
//                         "&:hover": {
//                           backgroundColor: "#F8961E",
//                         },
//                       },
//                     [`& .MuiPickersDay-root[aria-label*="31"]`]: {
//                       backgroundColor: "#FF0004", // Due - red
//                       color: "white",
//                       "&:hover": {
//                         backgroundColor: "#FF0004",
//                       },
//                     },
//                   }}
//                 />
//               </DemoItem>
//             </DemoContainer>
//           </LocalizationProvider>
//         </div>
//       </div>

//       {/* Events Section */}
//       <div className="bg-white rounded-lg shadow-lg h-[47vh] overflow-y-auto no-scrollbar">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold">Events</h3>
//           <button className="text-sm text-blue-600">View All</button>
//         </div>
//         <ul className="space-y-3">
//           {events.map((e, idx) => {
//             const bg = "border rounded-lg border-[#5E5D5D] shadow-md";

//             const dateBgColor =
//               e.status === "due"
//                 ? "bg-[#FF0004] text-white"
//                 : e.status === "today"
//                 ? "bg-[#6191B0] text-white"
//                 : e.status === "upcoming"
//                 ? "bg-[#F8961E] text-white"
//                 : "bg-gray-200 text-black";

//             return (
//               <li
//                 key={idx}
//                 className={`flex items-center p-3 rounded-lg ${bg}`}
//               >
//                 <div
//                   className={`w-9 h-10 flex items-center justify-center font-bold text-lg rounded-md ${dateBgColor}`}
//                 >
//                   {e.date}
//                 </div>
//                 <div className="ml-3 flex-1">
//                   <p className="font-medium text-sm">{e.title}</p>
//                   <p className="text-xs text-gray-500">{e.subtitle}</p>
//                   <p className="text-sm text-black font-semibold">{e.time}</p>
//                 </div>
//                 {e.status === "due" && (
//                   <div className="flex flex-col items-end">
//                     <span className="w-2 h-2 bg-[#FF0004] rounded-full" />
//                     <p className="text-sm font-semibold text-[#FF0004]">
//                       Due Soon
//                     </p>
//                   </div>
//                 )}
//                 {e.status === "today" && (
//                   <div className="flex flex-col items-end">
//                     <span className="w-2 h-2 bg-[#80ADCB] rounded-full" />
//                     <p className="text-sm font-semibold text-[#80ADCB]">
//                       Today
//                     </p>
//                   </div>
//                 )}
//                 {e.status === "upcoming" && (
//                   <div className="flex flex-col items-end">
//                     <span className="w-2 h-2 bg-[#F8961E] rounded-full" />
//                     <p className="text-sm font-semibold text-[#F8961E]">
//                       Upcoming
//                     </p>
//                   </div>
//                 )}
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default RightSidebar;

// "use client";
// import React, { useState } from "react";
// import {
//   IoChevronDownOutline,
//   IoNotificationsOutline,
//   IoChevronBackSharp,
//   IoChevronForward,
//   IoLogOutOutline,
// } from "react-icons/io5";
// import {
//   format,
//   startOfWeek,
//   endOfWeek,
//   addMonths,
//   subMonths,
//   eachDayOfInterval,
//   isSameMonth,
//   parseISO,
//   isSameDay,
// } from "date-fns";
// import Link from "next/link";

// const RightSidebar = ({ user }) => {
//   const dummyevents = [
//     {
//       date: "2025-02-27",
//       title: "Upcoming Fees Payment for the 2023/2024 Session",
//       description: "Updates on school fees for all junior and senior students",
//     },
//     {
//       date: "2025-02-01",
//       title: "Parents and Teachers Meeting on Zoom",
//       description:
//         "Conference call with all parents having a child in JSS1 and 2 in preparation for the upcoming session",
//     },
//   ];

//   const dummyNotifications = [
//     {
//       title: "Inter-House Sports",
//       description:
//         "The 2nd term Inter-House sports has been rescheduled for  Thur 15th - Fri 16th October 2023",
//     },
//     {
//       title: "Mid-term Tests",
//       description: "Mid term tests will start on Monday 25th October, 2023",
//     },
//     {
//       title: "Borders Meeting",
//       description: "All JSS1-SS3 boarding school students will be having a meeting by 3pm on Friday 29th October, 2023",
//     },
//   ];

//   const [clickedEventIndex, setClickedEventIndex] = useState(null);
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [isnotification, setIsnotification] = useState(true);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const handleItemClick = (index) => {
//     setClickedEventIndex(index);
//   };

//   const handleMonthChange = (direction) => {
//     if (direction === "next") {
//       setCurrentDate(addMonths(currentDate, 1));
//     } else {
//       setCurrentDate(subMonths(currentDate, 1));
//     }
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen((prev) => !prev);
//   };

//   const start = startOfWeek(currentDate, { weekStartsOn: 0 });
//   const end = endOfWeek(currentDate, { weekStartsOn: 0 });
//   const days = eachDayOfInterval({ start, end });

//   return (
//     <div className="h-screen bg-white rounded-lg">
//       <div className="flex gap-4 items-center py-4">
//         <div className="relative">
//           <IoNotificationsOutline
//             className="text-gray-800 w-8 h-8 cursor-pointer transition-colors hover:text-gray-400"
//             onClick={() => setIsnotification(!isnotification)}
//           />
//           {isnotification && (
//             <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F94144]"></div>
//           )}
//         </div>

//         <div className="relative flex items-center gap-2">
//           <div
//             className="flex items-center gap-2 cursor-pointer"
//             onClick={toggleDropdown}
//           >
//             <div className="rounded-full overflow-hidden w-12 h-12 md:w-10 md:h-10 xl:w-12 xl:h-12">
//               <img
//                 src={
//                   user.student.profile_picture_path === null
//                     ? "/female.png"
//                     : user.student.profile_picture_path
//                 }
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div className="hidden lg:flex items-center gap-1">
//               <p className="font-bold text-sm">
//                 {user?.student?.first_name + " " + user?.student?.last_name}
//               </p>
//               <IoChevronDownOutline className="w-3 h-3" />
//             </div>
//           </div>

//           {isDropdownOpen && (
//             <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-3 z-50">
//               <div className="mb-2 text-gray-800 cursor-pointer hover:text-[#F94144] p-2 rounded active:text-[#F94144]">
//                 <Link a href="/Student/Profile">
//                   {" "}
//                   Profile{" "}
//                 </Link>
//               </div>
//               <div className="mb-2 text-gray-800 cursor-pointer hover:text-[#F94144] p-2 rounded active:text-[#F94144]">
//                 <Link a href="">
//                   {" "}
//                   Settings{" "}
//                 </Link>
//               </div>
//               <div className="flex items-center gap-2 text-gray-800 cursor-pointer hover:text-[#F94144] p-2 rounded active:text-[#F94144]">
//                 <IoLogOutOutline className="w-4 h-4" />
//                 <span>Logout</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex flex-col justify-between space-y-5 min-h-screen">
//         {/* Events Section */}
//         <div className="bg-[#004080] text-white rounded-xl p-2 shadow-lg flex-1 h-[40vh]">
//           <div className="space-y-1.5">
//             <h2 className="text-xl font-bold">Events</h2>
//             <div className="h-[50%]">
//               <p className="text-xs text-gray-300">Date</p>
//               <div className="flex justify-between items-center">
//                 <p className="text-xs">{format(currentDate, "MMM yyy")}</p>
//                 <div className="flex gap-1">
//                   <button
//                     onClick={() => handleMonthChange("prev")}
//                     className="bg-white text-black rounded-full w-4 h-4 flex items-center justify-center"
//                   >
//                     <IoChevronBackSharp className="w-3 h-3" />
//                   </button>
//                   <button
//                     onClick={() => handleMonthChange("next")}
//                     className="bg-white text-black rounded-full w-4 h-4 flex items-center justify-center"
//                   >
//                     <IoChevronForward className="w-3 h-3" />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Calendar Grid */}
//             <div className="h-[40%]">
//               <div className="flex justify-between text-gray-300 text-xs">
//                 {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
//                   (day) => (
//                     <span key={day}>{day}</span>
//                   )
//                 )}
//               </div>
//               <div className="flex justify-between text-xs">
//                 {days.map((day) => (
//                   <div key={day.toISOString()} className="relative">
//                     {format(day, "d")}
//                     {dummyevents
//                       .filter((event) => {
//                         const eventDate = parseISO(event.date);
//                         return (
//                           isSameDay(eventDate, day) &&
//                           isSameMonth(eventDate, day)
//                         );
//                       })
//                       .map((_, i) => (
//                         <div
//                           key={i}
//                           className="absolute bottom-0 left-1/2 w-1 h-1 bg-[#F94144] rounded-full"
//                         ></div>
//                       ))}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Event List */}
//           <ul className="mt-4 space-y-2">
//             <hr className="border-t border-gray-300" />
//             {dummyevents.map((event, index) => (
//               <li
//                 key={index}
//                 className={`rounded-lg p-1 transition-colors ${
//                   clickedEventIndex === index ? "bg-blue-700" : ""
//                 }`}
//               >
//                 <div className="grid grid-cols-[48px_1fr] gap-2">
//                   <div
//                     className={`rounded-lg p-1 text-center ${
//                       clickedEventIndex === index
//                         ? "bg-transparent text-white"
//                         : "bg-white text-black"
//                     }`}
//                   >
//                     <div className="text-xs font-light">
//                       {format(parseISO(event.date), "EEE")}
//                     </div>
//                     <div className="text-2xl">
//                       {format(parseISO(event.date), "dd")}
//                     </div>
//                   </div>
//                   <div
//                     className="flex justify-between items-center cursor-pointer"
//                     onClick={() => handleItemClick(index)}
//                   >
//                     <div>
//                       <h5 className="text-xs font-bold text-white">
//                         {event.title}
//                       </h5>
//                       <p
//                         className={`text-[8px] ${
//                           clickedEventIndex === index
//                             ? "text-blue-200"
//                             : "text-black"
//                         }`}
//                       >
//                         {event.description}
//                       </p>
//                     </div>
//                     <div className="bg-white rounded-full w-4 h-4 flex items-center justify-center">
//                       <IoChevronForward className="w-3 h-3 text-black" />
//                     </div>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Notifications Section */}
//         <div className="bg-[#F94144] text-white rounded-xl p-4 shadow-lg flex-1">
//           <div className="text-center mb-4">
//             <h2 className="text-xl font-bold">Notification</h2>
//             <hr className="my-2 border-white" />
//           </div>
//           <ul className="space-y-2">
//             {dummyNotifications.map((item, index) => (
//               <li
//                 key={index}
//                 className="bg-white rounded p-2 flex justify-between items-center"
//               >
//                 <div className="text-black">
//                   <div className="text-xs font-bold">{item.title}</div>
//                   <div className="text-[10px]">{item.description}</div>
//                 </div>
//                 <div className="bg-[#F94144] rounded-full w-5 h-5 flex items-center justify-center">
//                   <IoChevronForward className="w-3 h-3 text-white" />
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RightSidebar;
