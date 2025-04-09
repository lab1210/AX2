"use client";
import { UserProvider } from "@/app/Components/StudentDashBoard/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../../css/layout.module.css";
import SubjectRegistration from "@/app/Components/StudentDashBoard/Pages/SubjectRegistrationItem";


const SubjectRegistrationItem = () => {
  return (
    <UserProvider>
      <Suspense fallback={<div className={styles.loadingContainer}>
        {" "}
        <div className={styles.spinner}></div> {/* New: Spinner element */}
      </div>}>
      <SubjectRegistration />
      </Suspense>
    </UserProvider>
  );
};

export default SubjectRegistrationItem;
