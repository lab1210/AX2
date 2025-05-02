"use client";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import { UserProvider } from "../../context/UserProvider";
import Timetable from "../../Components/TeacherDashBoard/Pages/Timetable";

const Dashboard = () => {
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

export default Dashboard;
