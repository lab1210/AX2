import React, { useState, useEffect } from "react";
import Layout from "../Teacherlayout";
import { Bell, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getTeacherTimetable } from "../../Service/TimetableService";
import { getUserDetails } from "../../Service/AuthService";
import { getAcademicYears, getTerms } from "../../Service/schoolConfig";
import toast from "react-hot-toast";

const Timetable = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timetableData, setTimetableData] = useState(null);
  const [currentAcademicYear, setCurrentAcademicYear] = useState(null);
  const [currentTerm, setCurrentTerm] = useState(null);

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

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
            getTerms(),
          ]);

          if (academicYearsResult?.data) {
            const activeYear =
              academicYearsResult.data.find((year) => year.status === true) ||
              academicYearsResult.data[0];
            setCurrentAcademicYear(activeYear);
          }

          if (termsResult?.data) {
            const activeTerm =
              termsResult.data.find((term) => term.status === true) ||
              termsResult.data[0];
            setCurrentTerm(activeTerm);
          }
        } catch (err) {
          console.error("Error fetching academic data:", err);
        }

        // Fetch teacher timetable
        try {
          console.log("Fetching teacher timetable");
          const timetableResult = await getTeacherTimetable();

          if (timetableResult?.data) {
            setTimetableData(timetableResult.data);
            console.log("Teacher timetable data loaded:", timetableResult.data);
            toast.success("Timetable loaded successfully");
          } else if (timetableResult?.error) {
            console.error(
              "Failed to fetch teacher timetable:",
              timetableResult.error
            );
            toast.error("Failed to load timetable from server");
            setTimetableData(null);
          } else {
            console.log("No teacher timetable data available");
            toast.info("No timetable data available");
            setTimetableData(null);
          }
        } catch (timetableErr) {
          console.error("Error fetching teacher timetable:", timetableErr);
          toast.error("Failed to load timetable data");
          setTimetableData(null);
        }
      } catch (error) {
        console.error("Error initializing teacher timetable:", error);
        toast.error("Failed to load timetable data");
        setTimetableData(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTimetableData();
  }, []);

  // Helper function to format header title
  const getHeaderTitle = () => {
    if (currentAcademicYear && currentTerm) {
      return `${currentAcademicYear.name} ${currentTerm.name} - Teacher Timetable`;
    } else if (currentAcademicYear) {
      return `${currentAcademicYear.name} - Teacher Timetable`;
    }
    return "Teacher Timetable";
  };

  // Check if there's any timetable data to display
  const hasScheduleData =
    timetableData && Array.isArray(timetableData) && timetableData.length > 0;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-screen bg-[#F7F8FA] w-full">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-full z-[1000]">
            <div className="border-4 border-[rgba(0,64,128,1)] border-t-[rgba(249,65,68,1)] rounded-full w-[50px] h-[50px] animate-spin"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!hasScheduleData) {
    return (
      <Layout>
        <div className="flex min-h-screen bg-[#F7F8FA] w-full">
          <div className="flex flex-col w-full">
            <div className="fixed top-0 z-30 flex items-center justify-between bg-white px-6 py-4 w-full lg:w-[81%] xl:w-[85%]">
              <div className="flex flex-row items-center justify-center">
                <button
                  onClick={() => {
                    router.back();
                  }}
                  className="lg:hidden text-xl flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
                >
                  <ChevronLeft />
                </button>
                <h1 className="text-lg lg:text-xl font-bold text-gray-800 ml-2">
                  {getHeaderTitle()}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Bell className="w-6 h-6 text-gray-600" />
              </div>
            </div>

            <div className="pt-20 px-6">
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">📅</div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No Timetable Available
                </h3>
                <p className="text-gray-500">
                  No timetable data has been configured for your account yet.
                  Please contact your administrator.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex min-h-screen bg-[#F7F8FA] w-full">
        <div className="flex flex-col w-full">
          <div className="fixed top-0 z-30 flex items-center justify-between bg-white px-6 py-4 w-full lg:w-[81%] xl:w-[85%]">
            <div className="flex flex-row items-center justify-center">
              <button
                onClick={() => {
                  router.back();
                }}
                className="lg:hidden text-xl flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft />
              </button>
              <h1 className="text-lg lg:text-xl font-bold text-gray-800 ml-2">
                {getHeaderTitle()}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="w-6 h-6 text-gray-600" />
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-row pt-20 w-full overflow-y-auto no-scrollbar">
            <div className="w-full flex flex-col p-3 lg:p-6 mx-auto">
              <div className="bg-white rounded-lg shadow p-6 lg:p-3 xl:p-12 overflow-x-auto no-scrollbar">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f6faff]">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Time
                      </th>
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
                      // Check if it's a lunch break row
                      const isLunchBreak =
                        row.monday === "LUNCH BREAK" ||
                        (row.monday &&
                          row.monday.toLowerCase().includes("lunch")) ||
                        (row.tuesday &&
                          row.tuesday.toLowerCase().includes("lunch"));

                      if (isLunchBreak) {
                        return (
                          <tr
                            key={index}
                            className="border-r border-l font-bold text-center"
                          >
                            <td className="border border-gray-300 bg-[#f6faff] px-4 py-2">
                              {row.time || ""}
                            </td>
                            <td colSpan="5" className="py-4">
                              {row.monday || "LUNCH BREAK"}
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr key={index}>
                          <td className="border border-gray-300 bg-[#f6faff] px-4 py-2">
                            {row.time || ""}
                          </td>
                          {days.map((day) => (
                            <td
                              key={day}
                              className="border border-gray-300 px-4 py-2"
                            >
                              <p className="font-semibold">{row[day] || ""}</p>
                              <p className="text-[#0B71B5] px-5 text-sm font-normal">
                                {row.class || ""}
                              </p>
                            </td>
                          ))}
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
