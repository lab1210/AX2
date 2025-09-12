"use client";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import { UserProvider } from "../../context/UserProvider";
import SubjectRegistration from "../../Components/TeacherDashBoard/Pages/StudentSubjectReg";

const SubjectRegistrationItem = () => {
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
        <SubjectRegistration />
      </Suspense>
    </UserProvider>
  );
};

export default SubjectRegistrationItem;
