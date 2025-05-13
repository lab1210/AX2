import { UserProvider } from "@/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import ManageUser from "@/Components/SchoolAdminDashBoard/Pages/ManageUser";

const UserPage = () => {
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
        <ManageUser />
      </Suspense>
    </UserProvider>
  );
};

export default UserPage;
