import { UserProvider } from "@/app/Components/StudentDashBoard/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/spinner.module.css";
import EditSchoolAdminItem from "@/app/Components/SuperAdminDashboard/Pages/EditSchoolAdminItem";

const EditSchoolAdmin = () => {
  return (
    <UserProvider>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        }
      >
        <EditSchoolAdminItem />
      </Suspense>
    </UserProvider>
  );
};

export default EditSchoolAdmin;
