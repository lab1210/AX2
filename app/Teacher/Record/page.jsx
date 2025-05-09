"use client";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import { UserProvider } from "../../context/UserProvider";
import AcademicRecords from "../../Components/TeacherDashBoard/Pages/AcademicRecord";

const AcademicRecordsItem = () => {
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
        <AcademicRecords />
      </Suspense>
    </UserProvider>
  );
};

export default AcademicRecordsItem;
