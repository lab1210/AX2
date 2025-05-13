import { UserProvider } from "@/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import SubjectAssignment from "@/Components/SchoolAdminDashBoard/Pages/SubjectAssignment";

const SubjectAssignmentPage = () => {
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
        <SubjectAssignment />
      </Suspense>
    </UserProvider>
  );
};

export default SubjectAssignmentPage;
