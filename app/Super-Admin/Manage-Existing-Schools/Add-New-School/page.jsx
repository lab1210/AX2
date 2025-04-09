import { UserProvider } from "@/app/Components/StudentDashBoard/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/spinner.module.css";
import AddSchoolItem from "@/app/Components/SuperAdminDashboard/Pages/AddSchoolItem";

const AddSchool = () => {
  return (
    <UserProvider>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        }
      >
        <AddSchoolItem />
      </Suspense>
    </UserProvider>
  );
};

export default AddSchool;
