import { UserProvider } from "../../context/UserProvider";
import React, { Suspense } from "react";
import styles from "../css/spinner.module.css";
import ManageUserItem from "../../Components/SuperAdminDashboard/Pages/ManageUserItem";

const ManageUsers = () => {
  return (
    <UserProvider>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        }
      >
        <ManageUserItem />
      </Suspense>
    </UserProvider>
  );
};

export default ManageUsers;
