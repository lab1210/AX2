"use client";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import { UserProvider } from "../../context/UserProvider";
import Attendance from "../../Components/TeacherDashBoard/Pages/Attendance";

const AttendancePage = () => {
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
        <Attendance />
      </Suspense>
    </UserProvider>
  );
};

export default AttendancePage;
