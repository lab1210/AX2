"use client";
import { UserProvider } from "@/app/Components/StudentDashBoard/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import Attendance from "@/app/Components/StudentDashBoard/Pages/AttendanceItem";


const AttendanceItem = () => {
  return (
    <UserProvider>
      <Suspense fallback={<div className={styles.loadingContainer}>
        {" "}
        <div className={styles.spinner}></div> {/* New: Spinner element */}
      </div>}>
      <Attendance />
      </Suspense>
    </UserProvider>
  );
};

export default AttendanceItem;
