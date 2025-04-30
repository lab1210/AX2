"use client";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import { UserProvider } from "../../context/UserProvider";
import AttendancePage from "../../Components/StudentDashBoard/Pages/AttendanceItem";

const AttendanceItem = () => {
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
        <AttendancePage />
      </Suspense>
    </UserProvider>
  );
};

export default AttendanceItem;
