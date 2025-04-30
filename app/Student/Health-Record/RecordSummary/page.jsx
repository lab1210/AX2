"use client";
import { UserProvider } from "../../../context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../../css/layout.module.css";
import HealthRecordSummary from "../../../Components/StudentDashBoard/Pages/HealthRecordSummary";

const RecordSummary = () => {
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
        <HealthRecordSummary />
      </Suspense>
    </UserProvider>
  );
};

export default RecordSummary;
