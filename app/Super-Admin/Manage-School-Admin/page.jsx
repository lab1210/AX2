import { UserProvider } from "@/app/Components/StudentDashBoard/context/UserProvider";
import ManageSchoolAdminItem from "@/app/Components/SuperAdminDashboard/Pages/ManageSchoolAdminItem";
import React, { Suspense } from "react";
import styles from "../css/spinner.module.css";

const ManageSchoolAdmin = () => {
  return (
    <UserProvider>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        }
      >
        <ManageSchoolAdminItem />
      </Suspense>
    </UserProvider>
  );
};

export default ManageSchoolAdmin;
