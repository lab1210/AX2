import { UserProvider } from "../../../context/UserProvider";
import EditSchoolItem from "../../../Components/SuperAdminDashboard/Pages/EditSchoolItem";
import React, { Suspense } from "react";
import styles from "../../css/spinner.module.css";

const EditSchool = () => {
  return (
    <UserProvider>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        }
      >
        <EditSchoolItem />
      </Suspense>
    </UserProvider>
  );
};

export default EditSchool;
