"use client";
import { UserProvider } from "@/app/Components/StudentDashBoard/context/UserProvider";
import TeacherDashBoard from "@/app/Components/TeacherDashBoard/Pages/TeacherDashBoard";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";


const Dashboard = () => {
  return (
    <UserProvider>
      <Suspense fallback={<div className={styles.loadingContainer}>
        {" "}
        <div className={styles.spinner}></div> {/* New: Spinner element */}
      </div>}>
      <TeacherDashBoard />
      </Suspense>
    </UserProvider>
  );
};

export default Dashboard;
