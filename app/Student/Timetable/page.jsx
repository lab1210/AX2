"use client";
import { UserProvider } from "@/app/Components/StudentDashBoard/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import TimetableItem from "@/app/Components/StudentDashBoard/Pages/TimetableItem";


const Timetable = () => {
  return (
    <UserProvider>
      <Suspense fallback={<div className={styles.loadingContainer}>
        {" "}
        <div className={styles.spinner}></div> {/* New: Spinner element */}
      </div>}>
      <TimetableItem />
      </Suspense>
    </UserProvider>
  );
};

export default Timetable;
