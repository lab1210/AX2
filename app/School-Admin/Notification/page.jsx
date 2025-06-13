import { UserProvider } from "@/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import Notification from "@/Components/SchoolAdminDashBoard/Pages/Notification";

const NotificationMain = () => {
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
        <Notification />
      </Suspense>
    </UserProvider>
  );
};

export default NotificationMain;
