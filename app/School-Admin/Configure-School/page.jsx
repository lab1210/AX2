import SchoolSettings from "@/Components/SchoolAdminDashBoard/Pages/SchoolSettings";
import { UserProvider } from "@/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";

const ConfigureSchoolPage = () => {
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
        <SchoolSettings />
      </Suspense>
    </UserProvider>
  );
};

export default ConfigureSchoolPage;
