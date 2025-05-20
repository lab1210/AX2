import { UserProvider } from "@/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import Registration from "@/Components/SchoolAdminDashBoard/Pages/Registration";

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
        <Registration />
      </Suspense>
    </UserProvider>
  );
};

export default UserPage;
