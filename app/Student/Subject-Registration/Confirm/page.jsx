"use client";
import { UserProvider } from "@/app/Components/StudentDashBoard/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../../css/layout.module.css";
import SubjectConfirmationItem from "@/app/Components/StudentDashBoard/Pages/SubjectConfirmation";


const SubjectConfirmation = () => {
  return (
    <UserProvider>
      <Suspense fallback={<div className={styles.loadingContainer}>
        {" "}
        <div className={styles.spinner}></div> {/* New: Spinner element */}
      </div>}>
      <SubjectConfirmationItem />
      </Suspense>
    </UserProvider>
  );
};

export default SubjectConfirmation;
