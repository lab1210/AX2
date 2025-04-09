"use client";
import { UserProvider } from "@/app/Components/StudentDashBoard/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import ResultItem from "@/app/Components/StudentDashBoard/Pages/ResultItem";


const ResultPage = () => {
  return (
    <UserProvider>
      <Suspense fallback={<div className={styles.loadingContainer}>
        {" "}
        <div className={styles.spinner}></div> {/* New: Spinner element */}
      </div>}>
      <ResultItem />
      </Suspense>
    </UserProvider>
  );
};

export default ResultPage;
