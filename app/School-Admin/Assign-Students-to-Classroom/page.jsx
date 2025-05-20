import { UserProvider } from "@/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import StudentAssignment from "@/Components/SchoolAdminDashBoard/Pages/StudentAssignment";

const AssignStudents = () => {
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
        <StudentAssignment />
      </Suspense>
    </UserProvider>
  );
};

export default AssignStudents;
