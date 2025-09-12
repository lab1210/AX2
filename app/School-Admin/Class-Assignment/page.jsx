import { UserProvider } from "@/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import ClassDepartment from "@/Components/SchoolAdminDashBoard/Pages/ClassDepartment";

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
        <ClassDepartment />
      </Suspense>
    </UserProvider>
  );
};

export default SubjectAssignmentPage;
