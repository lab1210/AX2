import { UserProvider } from "@/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import Timetable from "@/Components/SchoolAdminDashBoard/Pages/Timetable";

const TimeTableContainer = () => {
  return (
    <UserProvider>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            {" "}
            <div className={styles.spinner}></div> {/* New: Spinner element */}
          </div>
        }
      >
        <Timetable />
      </Suspense>
    </UserProvider>
  );
};

export default TimeTableContainer;
