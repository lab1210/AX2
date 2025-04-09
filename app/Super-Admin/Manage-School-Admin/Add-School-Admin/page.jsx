import { UserProvider } from "@/app/Components/StudentDashBoard/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/spinner.module.css";
import AddSchoolAdminItem from "@/app/Components/SuperAdminDashboard/Pages/AddSchoolAdminItem";

const AddSchoolAdmin = () => {
  return (
    <UserProvider>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        }
      >
        <AddSchoolAdminItem />
      </Suspense>
    </UserProvider>
  );
};

export default AddSchoolAdmin;
