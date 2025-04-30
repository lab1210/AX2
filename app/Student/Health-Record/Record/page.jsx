"use client";
import { UserProvider } from "../../../context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../../css/layout.module.css";
import HealthRecordItem from "../../Components/StudentDashBoard/Pages/HealthRecordItem";

const HealthRecordForm = () => {
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
        <HealthRecordItem />
      </Suspense>
    </UserProvider>
  );
};

export default HealthRecordForm;
