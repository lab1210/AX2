import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import { UserProvider } from "@/context/UserProvider";
import SchoolAdminDashBoard from "@/Components/SchoolAdminDashBoard/Pages/SchoolAdminDashBoard";

const SuperAdminDashBoard = () => {
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
        <SchoolAdminDashBoard />
      </Suspense>
    </UserProvider>
  );
};

export default SuperAdminDashBoard;
