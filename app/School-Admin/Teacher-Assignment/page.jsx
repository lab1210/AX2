import { UserProvider } from "@/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import TeacherAssignment from "@/Components/SchoolAdminDashBoard/Pages/TeacherAssignment";

const ClassAssignmentPage = () => {
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
        <TeacherAssignment />
      </Suspense>
    </UserProvider>
  );
};

export default ClassAssignmentPage;
