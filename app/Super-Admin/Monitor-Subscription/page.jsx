import { UserProvider } from "@/app/Components/StudentDashBoard/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../css/spinner.module.css";
import MonitorSubscribtionItem from "@/app/Components/SuperAdminDashboard/Pages/MonitorSubscribtionItem";

const page = () => {
  return (
    <UserProvider>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        }
      >
        <MonitorSubscribtionItem />
      </Suspense>
    </UserProvider>
  );
};

export default page;
