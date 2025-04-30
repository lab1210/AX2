import { UserProvider } from "../../context/UserProvider";
import React, { Suspense } from "react";
import styles from "../css/spinner.module.css";
import SuperAdminDashboardItem from "../../Components/SuperAdminDashboard/Pages/SuperAdminDashboard";
const SuperAdminDashboard = () => {
  return (
    <UserProvider>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        }
      >
        <SuperAdminDashboardItem />
      </Suspense>
    </UserProvider>
  );
};

export default SuperAdminDashboard;
