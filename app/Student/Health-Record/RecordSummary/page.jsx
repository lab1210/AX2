"use client";
import { UserProvider } from "@/app/Components/StudentDashBoard/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../../css/layout.module.css";
import HealthRecordSummary from "@/app/Components/StudentDashBoard/Pages/HealthRecordSummary";


const RecordSummary = () => {
  return (
    <UserProvider>
      <Suspense fallback={<div className={styles.loadingContainer}>
        {" "}
        <div className={styles.spinner}></div> {/* New: Spinner element */}
      </div>}>
      <HealthRecordSummary />
      </Suspense>
    </UserProvider>
  );
};

export default RecordSummary;
