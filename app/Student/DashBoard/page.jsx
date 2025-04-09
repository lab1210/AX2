"use client";
import { UserProvider } from "@/app/Components/StudentDashBoard/context/UserProvider";
import Studentdashboard from "@/app/Components/StudentDashBoard/Pages/Studentdashboard";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";


const Dashboard = () => {
  return (
    <UserProvider>
      <Suspense fallback={<div className={styles.loadingContainer}>
        {" "}
        <div className={styles.spinner}></div> {/* New: Spinner element */}
      </div>}>
      <Studentdashboard />
      </Suspense>
    </UserProvider>
  );
};

export default Dashboard;
