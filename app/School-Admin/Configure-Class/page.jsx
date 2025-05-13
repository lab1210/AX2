import ClassSettings from "@/Components/SchoolAdminDashBoard/Pages/ClassSettings";
import { UserProvider } from "@/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";

const ConfigureClassPage = () => {
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
        <ClassSettings />
      </Suspense>
    </UserProvider>
  );
};

export default ConfigureClassPage;
