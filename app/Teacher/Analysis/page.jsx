"use client";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import { UserProvider } from "../../context/UserProvider";
import Analysis from "../../Components/TeacherDashBoard/Pages/PerformanceAnalysis";

const AnalysisPage = () => {
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
        <Analysis />
      </Suspense>
    </UserProvider>
  );
};

export default AnalysisPage;
