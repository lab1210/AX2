import { UserProvider } from "@/app/Components/StudentDashBoard/context/UserProvider";
import ManageCompItem from "@/app/Components/SuperAdminDashboard/Pages/ManageCompItem";
import React, { Suspense } from "react";
import styles from "../../css/spinner.module.css";

const ManageDocUpload = () => {
  return (
    <UserProvider>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        }
      >
        <ManageCompItem />
      </Suspense>
    </UserProvider>
  );
};

export default ManageDocUpload;
