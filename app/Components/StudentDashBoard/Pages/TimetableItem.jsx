"use client";
import React, { useState, useEffect } from "react";
import Layout from "../../../Components/Studentlayout";
import { useSearchParams } from "next/navigation";
import { getClassTimetable } from "../../../Service/TimetableService";
import { getUserDetails } from "../../../Service/AuthService";
import { getAcademicYears, getTerms } from "../../../Service/schoolConfig";
import toast from "react-hot-toast";
import lunchImg from "../../../../public/LunchImg.png";

export default function TimetablePage() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timetableData, setTimetableData] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [terms, setTerms] = useState([]);
  const [currentAcademicYear, setCurrentAcademicYear] = useState(null);
  const [currentTerm, setCurrentTerm] = useState(null);
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [activeIndex, setActiveIndex] = useState(0);

  // API integration for fetching timetable data
  useEffect(() => {
    const initializeTimetableData = async () => {
      try {
        setIsLoading(true);
        
        // Get user details from auth
        const userData = getUserDetails();
        setUser(userData);

        // Fetch academic years and terms for header
        try {
          const [academicYearsResult, termsResult] = await Promise.all([
            getAcademicYears(),
            getTerms()
          ]);

          if (academicYearsResult?.data) {
            setAcademicYears(academicYearsResult.data);
            // Find current/active academic year
            const activeYear = academicYearsResult.data.find(year => year.status === true) || academicYearsResult.data[0];
            setCurrentAcademicYear(activeYear);
          }

          if (termsResult?.data) {
            setTerms(termsResult.data);
            // Find current/active term
            const activeTerm = termsResult.data.find(term => term.status === true) || termsResult.data[0];
            setCurrentTerm(activeTerm);
          }
        } catch (err) {
          console.error("Error fetching academic data:", err);
        }

        // Fetch student timetable
        try {
          console.log("Fetching class timetable");
          const timetableResult = await getClassTimetable();
          
          if (timetableResult?.data) {
            const transformedData = transformTimetableData(timetableResult.data);
            setTimetableData(transformedData);
            console.log("Timetable data loaded:", transformedData);
            toast.success("Timetable loaded successfully");
          } else if (timetableResult?.error) {
            console.error("Failed to fetch timetable:", timetableResult.error);
            toast.error("Failed to load timetable from server");
            setTimetableData(null);
          } else {
            // No data returned
            console.log("No timetable data available");
            toast.info("No timetable data available");
            setTimetableData(null);
          }
        } catch (timetableErr) {
          console.error("Error fetching timetable:", timetableErr);
          toast.error("Failed to load timetable data");
          setTimetableData(null);
        }

      } catch (error) {
        console.error("Error initializing timetable:", error);
        toast.error("Failed to load timetable data");
        setTimetableData(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTimetableData();
  }, [studentId]);

  // Helper function to transform API data to expected format
  const transformTimetableData = (apiData) => {
    if (!apiData) return null;
    
    const transformedData = {
      schedule: {},
      teachers: {},
      locations: {},
      periods: apiData.periods || []
    };

    // Handle different API response formats
    if (apiData.weekly_schedule) {
      // Format 1: weekly_schedule object
      days.forEach(day => {
        const dayData = apiData.weekly_schedule[day.toLowerCase()] || [];
        transformedData.schedule[day] = dayData.map(entry => entry.subject || entry.name || '');
        transformedData.teachers[day] = dayData.map(entry => entry.teacher || entry.instructor || '');
        transformedData.locations[day] = dayData.map(entry => entry.location || entry.room || '');
      });
    } else if (apiData.timetable_entries) {
      // Format 2: timetable_entries array
      days.forEach(day => {
        const dayEntries = apiData.timetable_entries.filter(entry => 
          entry.day_of_week?.toLowerCase() === day.toLowerCase()
        ).sort((a, b) => (a.period_number || 0) - (b.period_number || 0));
        
        transformedData.schedule[day] = dayEntries.map(entry => entry.subject?.name || entry.subject || '');
        transformedData.teachers[day] = dayEntries.map(entry => entry.teacher?.name || entry.teacher || '');
        transformedData.locations[day] = dayEntries.map(entry => entry.classroom?.name || entry.location || '');
      });
    } else if (apiData.results) {
      // Format 3: paginated results
      const entries = apiData.results;
      days.forEach(day => {
        const dayEntries = entries.filter(entry => 
          entry.day_of_week?.toLowerCase() === day.toLowerCase()
        ).sort((a, b) => (a.period_number || 0) - (b.period_number || 0));
        
        transformedData.schedule[day] = dayEntries.map(entry => entry.subject?.name || entry.subject || '');
        transformedData.teachers[day] = dayEntries.map(entry => entry.teacher?.name || entry.teacher || '');
        transformedData.locations[day] = dayEntries.map(entry => entry.classroom?.name || entry.location || '');
      });
    } else {
      // Format 4: Direct format (already in expected structure)
      transformedData.schedule = apiData.schedule || {};
      transformedData.teachers = apiData.teachers || {};
      transformedData.locations = apiData.locations || {};
    }

    return transformedData;
  };

  // Get the current schedule data - only from API
  const times = timetableData?.periods?.map(p => p.start_time) || periods?.map(p => p.start_time) || [];
  const schedule = timetableData?.schedule || {};
  const teachers = timetableData?.teachers || {};
  const locations = timetableData?.locations || {};

  // Helper function to format header title
  const getHeaderTitle = () => {
    if (currentAcademicYear && currentTerm) {
      return `${currentAcademicYear.name} ${currentTerm.name} Timetable`;
    } else if (currentAcademicYear) {
      return `${currentAcademicYear.name} Timetable`;
    }
    return "Timetable";
  };

  const hasScheduleData = timetableData && Object.keys(schedule).length > 0 && 
    days.some(day => schedule[day] && schedule[day].length > 0);

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-full z-[1000]">
        <div className="border-4 border-[rgba(0,64,128,1)] border-t-[rgba(249,65,68,1)] rounded-full w-[50px] h-[50px] animate-spin"></div>
      </div>
    );
  }

  // Render empty state if no data
  if (!hasScheduleData) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-100 p-4 pr-10 pl-6 flex-col rounded-lg">
          <div className="bg-white rounded-lg p-6 pt-3 pb-3 mb-6 shadow xl:w-fit min-w-full">
            <div className="flex justify-between items-center">
              <h1 className="text-lg md:text-xl font-bold text-gray-800">
                {getHeaderTitle()}
              </h1>
            </div>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-lg p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Timetable Available</h3>
            <p className="text-gray-500">
              No timetable data has been configured for your account yet. Please contact your administrator.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="hidden lg:block min-h-screen bg-gray-100 p-4 pr-10 pl-6 flex-col rounded-lg">
        {/* Header Card */}
        <div className=" bg-white rounded-lg p-6 pt-3 pb-3 mb-6 shadow xl:w-fit min-w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-lg  md:text-xl font-bold text-gray-800">
              {getHeaderTitle()}
            </h1>
          </div>
        </div>

        <div className="w-full no-scrollbar">
          <table className="w-full table-fixed text-gray-800">
            <thead>
              <tr>
                <th className="py-1 px-1 bg-[#69577d] text-white font-semibold"></th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="py-1 px-1  bg-[#69577d] text-white font-semibold"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="py-1 px-4 text-white bg-[#69577d] font-bold items-center text-center ">
                    {time}
                  </td>
                  {days.map((day) => {
                    const content = schedule[day]?.[rowIndex] || "";
                    const isNoContent = !content || content.trim() === "";
                    const cellClassName = `py-1 px-1  text-center text-xs font-semibold  ${
                      isNoContent
                        ? "bg-[#69577d] border-0"
                        : "bg-white border-[1.3px] border-black/80 border-l"
                    }`;
                    return (
                      <td key={`${day}-${rowIndex}`} className={cellClassName}>
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── mobile/tablet only ─── */}
      <div className="block lg:hidden p-4 bg-white rounded-lg">
        {/* Mobile Header */}
        <div className="mb-4">
          <h1 className="text-lg font-bold text-gray-800 mb-2">
            {getHeaderTitle()}
          </h1>
        </div>

        <div className="relative mb-4 h-10 rounded-full overflow-hidden border border-black">
          <div
            className="absolute top-0 left-0 h-full w-1/5 bg-[#4169E1] rounded-full transition-transform duration-300"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
          <div className="relative z-10 flex h-full">
            {days.map((d, idx) => (
              <button
                key={d}
                onClick={() => setActiveIndex(idx)}
                className={`
                  flex-1 
                  text-xs 
                  md:text-sm
                  font-semibold 
                  transition-colors 
                  ${activeIndex === idx ? "text-white" : "text-gray-700"}
                 `}
              >
                {d.slice(0, 3).toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {schedule[days[activeIndex]]?.map((subject, i) => {
            const start = times[i];
            const end = times[i + 1] || "";

            const isLunch = subject.toLowerCase().includes("lunch");
            const status = isLunch
              ? ""
              : i === 0
              ? "ongoing"
              : Math.random() < 0.1
              ? "cancelled"
              : "";

            let baseClasses = "rounded-lg p-4 flex justify-between items-start";
            if (status === "cancelled") baseClasses += " ring-1 ring-red-400";
            else if (status === "ongoing")
              baseClasses += " bg-[#004080] text-white";
            else baseClasses += " bg-[#F9F9F9] border border-[#EBEBEB]";

            return (
              <div key={i} className={baseClasses}>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3
                      className={`font-bold ${
                        status === "ongoing" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {subject}
                    </h3>
                    <div className="flex flex-col items-end">
                      {!isLunch && (
                        <p className="text-gray-400 text-xs md:text-sm font-semibold">
                          {locations[days[activeIndex]]?.[i] || ""}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* time and status side-by-side */}
                  <div className="flex justify-between items-center mt-1">
                    <span
                      className={`${
                        status === "ongoing" ? "text-white" : "text-black"
                      } text-xs md:text-sm`}
                    >
                      {start} - {end}
                    </span>
                    {status && (
                      <span
                        className={`text-xs md:text-sm font-semibold ${
                          status === "cancelled"
                            ? "text-red-500"
                            : "text-blue-200"
                        }`}
                      >
                        {status}
                      </span>
                    )}
                  </div>

                  {/* full-width border-top section for teacher & period */}
                  {!isLunch && (
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-gray-400 text-xs md:text-sm">
                        Teacher: {teachers[days[activeIndex]]?.[i] || "N/A"}
                      </span>
                      <span className="text-gray-400 text-xs md:text-sm">
                        Period {i + 1}
                      </span>
                    </div>
                  )}
                  {/* RIGHT: location or lunch image */}
                  <div className="flex flex-col items-end">
                    {isLunch && (
                      <img
                        src={lunchImg.src}
                        alt="Lunch"
                        className="w-20 h-20 object-contain"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          }) || (
            <div className="text-center text-gray-500 py-8">
              No schedule available for {days[activeIndex]}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
