import SubjectSettings from "../../Components/SchoolAdminDashBoard/Pages/SubjectDepartment";
import { UserProvider } from "@/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";

const ConfigureSubjectPage = () => {
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
        <SubjectSettings />
      </Suspense>
    </UserProvider>
  );
};

export default ConfigureSubjectPage;
