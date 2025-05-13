import { UserProvider } from "@/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import ClassAssignment from "@/Components/SchoolAdminDashBoard/Pages/ClassAssignment";

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
        <ClassAssignment />
      </Suspense>
    </UserProvider>
  );
};

export default ClassAssignmentPage;
